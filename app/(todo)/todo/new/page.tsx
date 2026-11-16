import TodoForm from '@/domains/todo/components/TodoForm';

export const metadata = { title: '할 일 등록' };

export default function NewTodoPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold">할 일 등록</h1>
      <TodoForm />
    </section>
  );
}
