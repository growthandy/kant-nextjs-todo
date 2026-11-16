import SignInForm from '@/domains/auth/components/SignInForm';

interface SignInPageProps {
  searchParams: Promise<{ redirectUrl?: string }>;
}

function safePath(url?: string): string {
  return url && url.startsWith('/') && !url.startsWith('//') ? url : '/';
}

export const metadata = { title: '로그인' };

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirectUrl } = await searchParams;
  return (
    <section className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-bold">로그인</h1>
      <SignInForm redirectUrl={safePath(redirectUrl)} />
    </section>
  );
}
