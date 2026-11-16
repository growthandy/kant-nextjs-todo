'use client';

import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { signInAction } from '../actions/login.action';

interface SignInFormProps {
  redirectUrl: string;
}

export default function SignInForm({ redirectUrl }: SignInFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signInAction, INITIAL_ACTION_STATE);

  useEffect(() => {
    if (state.success) {
      router.replace(redirectUrl);
      router.refresh();
    }
  }, [state.success, redirectUrl, router]);

  return (
    <form action={formAction} noValidate className="space-y-3">
      {state.message && !state.success && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.message}</p>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium">이메일</label>
        <input id="email" name="email" type="email" autoComplete="email" className="w-full rounded border px-3 py-2" />
        {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">비밀번호</label>
        <input id="password" name="password" type="password" autoComplete="current-password" className="w-full rounded border px-3 py-2" />
        {state.errors?.password && <p className="text-sm text-red-600">{state.errors.password}</p>}
      </div>

      <button type="submit" disabled={isPending} className="w-full rounded bg-indigo-600 py-2 text-white disabled:opacity-50">
        {isPending ? '로그인 중...' : '로그인'}
      </button>
      <p className="text-center text-sm">
        계정이 없나요? <Link href="/sign_up" className="text-indigo-600 underline">회원가입</Link>
      </p>
    </form>
  );
}
