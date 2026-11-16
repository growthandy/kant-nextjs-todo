'use client';

import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { addTodoAction } from '../actions/todo.actions';

export default function TodoForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(addTodoAction, INITIAL_ACTION_STATE);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    if (state.success) {
      router.replace('/');
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} noValidate className="space-y-3">
      {state.message && !state.success && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
      <div>
        <label htmlFor="title" className="block text-sm font-medium">할 일</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          maxLength={100}
          className="w-full rounded border px-3 py-2"
          placeholder="할 일을 입력하세요"
        />
        {state.errors?.title && <p className="text-sm text-red-600">{state.errors.title}</p>}
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium">메모 (선택)</label>
        <textarea
          id="content"
          name="content"
          rows={4}
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <button type="submit" disabled={isPending} className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50">
        {isPending ? '등록 중...' : '등록'}
      </button>
    </form>
  );
}
