'use server';

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TODO_STATUSES, type TodoStatus } from '../types/todo.types';
import { validateTodoInput } from '../utils/todoValidation';

function readTodoInput(formData: FormData) {
  return {
    title: String(formData.get('title') ?? ''),
    content: String(formData.get('content') ?? ''),
  };
}

export async function addTodoAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: '로그인이 필요합니다.' };

  const input = readTodoInput(formData);
  const errors = validateTodoInput(input);
  if (Object.keys(errors).length > 0) return { success: false, errors };

  const supabase = createServerClient();
  const { error } = await supabase
    .from('todos')
    .insert({ title: input.title.trim(), content: input.content.trim() });

  if (error) return { success: false, message: `등록에 실패했습니다: ${error.message}` };

  revalidatePath('/');
  return { success: true, message: '등록되었습니다.' };
}

export async function updateTodoAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: '로그인이 필요합니다.' };

  const input = readTodoInput(formData);
  const errors = validateTodoInput(input);
  const status = String(formData.get('status') ?? '') as TodoStatus;
  if (!TODO_STATUSES.includes(status)) errors.status = '상태 값이 올바르지 않습니다.';
  if (Object.keys(errors).length > 0) return { success: false, errors };

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('todos')
    .update({ title: input.title.trim(), content: input.content.trim(), status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .select('id');

  if (error) return { success: false, message: `수정에 실패했습니다: ${error.message}` };
  if (!data?.length) return { success: false, message: '할 일을 찾을 수 없습니다.' };

  revalidatePath('/');
  revalidatePath(`/todo/${id}/view`);
  return { success: true, message: '수정되었습니다.' };
}

export async function deleteTodoAction(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect('/sign_in');

  const supabase = createServerClient();
  const { error } = await supabase
    .from('todos')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(`삭제에 실패했습니다: ${error.message}`);

  revalidatePath('/');
  redirect('/');
}

export async function changeTodoStatus(id: string, status: TodoStatus): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('인증되지 않은 사용자입니다.');
  if (!TODO_STATUSES.includes(status)) throw new Error('잘못된 상태 값입니다.');

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('todos')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .select('id');
  if (error || !data?.length) throw new Error(error?.message ?? '할 일을 찾을 수 없습니다.');

  revalidatePath('/');
}
