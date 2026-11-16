import TodoEditForm from '@/domains/todo/components/TodoEditForm';
import { getTodoById } from '@/domains/todo/queries/getTodoById.query';
import { notFound } from 'next/navigation';

interface TodoEditPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: '할 일 수정' };

export default async function TodoEditPage({ params }: TodoEditPageProps) {
  const { id } = await params;
  const todo = await getTodoById(id);
  if (!todo) notFound();
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold">할 일 수정</h1>
      <TodoEditForm todo={todo} />
    </section>
  );
}
