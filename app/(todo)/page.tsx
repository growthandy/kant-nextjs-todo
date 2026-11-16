import TodoDashBoard from '@/domains/todo/components/TodoDashBoard';
import { getTodos } from '@/domains/todo/queries/getTodos.query';

export default async function TodoPage() {
  const initialItems = await getTodos();
  return <TodoDashBoard initialItems={initialItems} />;
}
