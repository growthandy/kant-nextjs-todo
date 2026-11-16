'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logoutAction(): Promise<void> {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/sign_in');
}
