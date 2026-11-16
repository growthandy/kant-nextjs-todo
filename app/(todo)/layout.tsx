import Header from '@/shared/components/Header';

export default function TodoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <Header />
      <main>{children}</main>
    </div>
  );
}
