import type { TodoInput } from '../types/todo.types';

export function validateTodoInput(input: TodoInput): Record<string, string> {
  const errors: Record<string, string> = {};
  const title = input.title.trim();
  if (!title) errors.title = '할 일을 입력해 주세요.';
  else if (title.length > 100) errors.title = '할 일은 100자 이하로 입력해 주세요.';
  return errors;
}
