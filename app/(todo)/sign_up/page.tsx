import SignUpForm from '@/domains/auth/components/SignUpForm';

export const metadata = { title: '회원가입' };

export default function SignUpPage() {
  return (
    <section className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-bold">회원가입</h1>
      <SignUpForm />
    </section>
  );
}
