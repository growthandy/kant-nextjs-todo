import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { createServerClient } from '@/shared/lib/supabase';
import type { Todo, TodoRow } from '../types/todo.types';
import { toTodo } from '../utils/todoConverter';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getTodoById(id: string): Promise<Todo | null> {
  if (!UUID_REGEX.test(id)) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw new Error(`할 일을 불러오지 못했습니다: ${error.message}`);
  return data ? toTodo(data as TodoRow) : null;
}
