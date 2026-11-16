import type { Todo, TodoRow } from '../types/todo.types';

export function toTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}
