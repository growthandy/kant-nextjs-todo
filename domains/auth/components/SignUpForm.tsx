'use client';

import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { signUpAction } from '../actions/signup.action';

const FIELDS = [
  { name: 'name', label: '이름', type: 'text', autoComplete: 'nickname' },
  { name: 'email', label: '이메일', type: 'email', autoComplete: 'email' },
  { name: 'password', label: '비밀번호 (8자 이상)', type: 'password', autoComplete: 'new-password' },
  { name: 'passwordConfirm', label: '비밀번호 확인', type: 'password', autoComplete: 'new-password' },
] as const;

type FieldName = (typeof FIELDS)[number]['name'];

export default function SignUpForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signUpAction, INITIAL_ACTION_STATE);

  const [form, setForm] = useState<Record<FieldName, string>>({
    name: '', email: '', password: '', passwordConfirm: '',
  });

  useEffect(() => {
    if (!state.success) return;
    const needsConfirm = (state.data as { needsConfirm?: boolean } | undefined)?.needsConfirm;
    router.replace(needsConfirm ? '/sign_in' : '/');
    router.refresh();
  }, [state.success, state.data, router]);

  return (
    <form action={formAction} noValidate className="space-y-3">
      {state.message && (
        <p role="alert" className={state.success ? 'text-green-700' : 'rounded-lg bg-red-50 p-3 text-sm text-red-600'}>
          {state.message}
        </p>
      )}
      {FIELDS.map((f) => (
        <div key={f.name }>
          <label htmlFor={f.name} className="block text-sm font-medium">{f.label}</label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            value={form[f.name]}
            onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
            className="w-full rounded border px-3 py-2"
          />
          {state.errors?.[f.name] && <p className="text-sm text-red-600">{state.errors[f.name]}</p>}
        </div>
      ))}
      <button type="submit" disabled={isPending} className="w-full rounded bg-indigo-600 py-2 text-white disabled:opacity-50">
        {isPending ? '가입 중...' : '회원가입'}
      </button>
      <p className="text-center text-sm">
        이미 계정이 있나요? <Link href="/sign_in" className="text-indigo-600 underline">로그인</Link>
      </p>
    </form>
  );
}
