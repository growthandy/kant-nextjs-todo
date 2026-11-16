import Link from 'next/link';
import { deleteTodoAction } from '../actions/todo.actions';
import { TODO_STATUS_MAP, type Todo } from '../types/todo.types';
import DeleteTodoButton from './DeleteTodoButton';

interface TodoDetailsProps {
  todo: Todo;
}

export default function TodoDetails({ todo }: TodoDetailsProps) {
  const created = new Date(todo.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  return (
    <article className="space-y-4">
      <header>
        <p className="text-sm text-gray-500">[{TODO_STATUS_MAP[todo.status]}] · {created}</p>
        <h1 className="text-xl font-bold">{todo.title}</h1>
      </header>
      <p className="whitespace-pre-wrap">{todo.content || '메모 없음'}</p>
      <nav className="flex gap-2">
        <Link href="/" className="rounded border px-3 py-2">목록</Link>
        <Link href={`/todo/${todo.id}/edit`} className="rounded border px-3 py-2">수정</Link>
        <DeleteTodoButton action={deleteTodoAction.bind(null, todo.id)} />
      </nav>
    </article>
  );
}
