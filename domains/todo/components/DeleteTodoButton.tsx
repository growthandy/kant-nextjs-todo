'use client';

import { useFormStatus } from 'react-dom';

interface DeleteTodoButtonProps {
  action: () => Promise<void>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => { if (!confirm('정말 삭제할까요?')) e.preventDefault(); }}
      className="rounded border border-red-300 px-3 py-2 text-red-600 disabled:opacity-50"
    >
      {pending ? '삭제 중...' : '삭제'}
    </button>
  );
}

export default function DeleteTodoButton({ action }: DeleteTodoButtonProps) {
  return (
    <form action={action}>
      <SubmitButton />
    </form>
  );
}
