import { logoutAction } from '@/domains/auth/actions/logout.action';
import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import Link from 'next/link';

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="mb-6 flex items-center justify-between border-b py-3">
      <Link href="/" className="text-lg font-bold">My Todo</Link>
      <nav className="flex items-center gap-2 text-sm">
        {user ? (
          <>
            <span>{user.name}님</span>
            <form action={logoutAction}>
              <button type="submit" className="rounded border px-3 py-1">로그아웃</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/sign_in" className="rounded border px-3 py-1">로그인</Link>
            <Link href="/sign_up" className="rounded bg-indigo-600 px-3 py-1 text-white">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}
