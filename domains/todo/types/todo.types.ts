export type TodoStatus = 'READY' | 'PROGRESS' | 'DONE';

export const TODO_STATUS_MAP: Record<TodoStatus, string> = {
  READY: '준비중',
  PROGRESS: '진행중',
  DONE: '완료',
};
export const TODO_STATUSES = Object.keys(TODO_STATUS_MAP) as TodoStatus[];

export interface Todo {
  id: string;
  title: string;
  content: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface TodoRow {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: TodoStatus;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface TodoInput {
  title: string;
  content: string;
}
