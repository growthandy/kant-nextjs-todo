import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { createServerClient } from '@/shared/lib/supabase';
import type { Todo, TodoRow } from '../types/todo.types';
import { toTodo } from '../utils/todoConverter';

export async function getTodos(): Promise<Todo[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`할 일 목록을 불러오지 못했습니다: ${error.message}`);
  return (data as TodoRow[]).map(toTodo);
}
