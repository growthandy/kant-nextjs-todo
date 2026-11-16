'use server';

import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { validateSignInInput } from '../utils/authValidation';

export async function signInAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const errors = validateSignInInput({ email, password });
  if (Object.keys(errors).length > 0) return { success: false, errors };

  const supabase = createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

  if (error || !data.user) {
    return { success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('deleted_at')
    .eq('id', data.user.id)
    .maybeSingle();
  if (!profile || profile.deleted_at) {
    await supabase.auth.signOut();
    return { success: false, message: '사용할 수 없는 계정입니다.' };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
