import TodoDetails from '@/domains/todo/components/TodoDetails';
import { getTodoById } from '@/domains/todo/queries/getTodoById.query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface TodoViewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TodoViewPageProps): Promise<Metadata> {
  const { id } = await params;
  const todo = await getTodoById(id);
  return { title: todo ? todo.title : '할 일을 찾을 수 없음' };
}

export default async function TodoViewPage({ params }: TodoViewPageProps) {
  const { id } = await params;
  const todo = await getTodoById(id);
  if (!todo) notFound();
  return <TodoDetails todo={todo} />;
}
