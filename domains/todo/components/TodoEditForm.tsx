'use client';

import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { updateTodoAction } from '../actions/todo.actions';
import { TODO_STATUSES, TODO_STATUS_MAP, type Todo, type TodoStatus } from '../types/todo.types';

interface TodoEditFormProps {
  todo: Todo;
}

export default function TodoEditForm({ todo }: TodoEditFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateTodoAction.bind(null, todo.id),
    INITIAL_ACTION_STATE,
  );
  const [form, setForm] = useState<{ title: string; content: string; status: TodoStatus }>({
    title: todo.title,
    content: todo.content,
    status: todo.status,
  });

  useEffect(() => {
    if (state.success) {
      router.replace(`/todo/${todo.id}/view`);
      router.refresh();
    }
  }, [state.success, router, todo.id]);

  return (
    <form action={formAction} noValidate className="space-y-3">
      {state.message && !state.success && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
      <div>
        <label htmlFor="title" className="block text-sm font-medium">할 일</label>
        <input id="title" name="title" value={form.title} maxLength={100}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="w-full rounded border px-3 py-2" />
        {state.errors?.title && <p className="text-sm text-red-600">{state.errors.title}</p>}
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium">상태</label>
        <select id="status" name="status" value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as TodoStatus }))}
          className="rounded border px-3 py-2">
          {TODO_STATUSES.map((s) => <option key={s} value={s}>{TODO_STATUS_MAP[s]}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium">메모</label>
        <textarea id="content" name="content" rows={4} value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          className="w-full rounded border px-3 py-2" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50">
          {isPending ? '저장 중...' : '저장'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded border px-4 py-2">취소</button>
      </div>
    </form>
  );
}
