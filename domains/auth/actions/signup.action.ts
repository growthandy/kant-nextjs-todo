'use server';

import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { validateSignUpInput } from '../utils/authValidation';

export async function signUpAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const input = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    passwordConfirm: String(formData.get('passwordConfirm') ?? ''),
  };

  const errors = validateSignUpInput(input);
  if (Object.keys(errors).length > 0) return { success: false, errors };

  const supabase = createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: { data: { name: input.name.trim() } },
  });

  if (error) {
    const duplicated = /already (registered|exists)/i.test(error.message);
    return {
      success: false,
      message: duplicated ? '이미 가입된 이메일입니다.' : `회원가입에 실패했습니다: ${error.message}`,
    };
  }

  if (!data.session) {
    return { success: true, message: '확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인하세요.', data: { needsConfirm: true } };
  }
  return { success: true, message: '회원가입이 완료되었습니다.' };
}
