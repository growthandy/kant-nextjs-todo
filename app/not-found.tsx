import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-sm space-y-3 py-20 text-center">
      <h1 className="text-xl font-bold">찾을 수 없는 페이지입니다</h1>
      <Link href="/" className="text-indigo-600 underline">목록으로</Link>
    </div>
  );
}
