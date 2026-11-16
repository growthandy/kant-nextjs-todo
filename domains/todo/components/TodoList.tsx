import type { Todo, TodoStatus } from '../types/todo.types';
import TodoItem from './TodoItem';

interface TodoListProps {
  items: Todo[];
  emptyMessage: string;
  onChangeStatus?: (id: string, status: TodoStatus) => void;
}

export default function TodoList({ items, emptyMessage, onChangeStatus }: TodoListProps) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-400">{emptyMessage}</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <TodoItem key={item.id} item={item} onChangeStatus={onChangeStatus} />
      ))}
    </ul>
  );
}
