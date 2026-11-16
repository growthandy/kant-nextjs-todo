import Link from 'next/link';
import { TODO_STATUSES, TODO_STATUS_MAP, type Todo, type TodoStatus } from '../types/todo.types';

interface TodoItemProps {
  item: Todo;
  onChangeStatus?: (id: string, status: TodoStatus) => void;
}

export default function TodoItem({ item, onChangeStatus }: TodoItemProps) {
  return (
    <li className="rounded-xl border p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm text-gray-500">[{TODO_STATUS_MAP[item.status]}]</span>
        <Link href={`/todo/${item.id}/view`} className="truncate font-medium hover:underline">
          {item.title}
        </Link>
      </div>

      {onChangeStatus && (
        <div className="flex gap-2" role="group" aria-label="상태 변경">
          {TODO_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={s === item.status}
              aria-pressed={s === item.status}
              onClick={() => onChangeStatus(item.id, s)}
              className="rounded border px-2 py-1 text-sm disabled:bg-indigo-600 disabled:text-white"
            >
              {TODO_STATUS_MAP[s]}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
