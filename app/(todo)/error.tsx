'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TodoError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-700">할 일을 불러오지 못했습니다.</p>
      <button type="button" onClick={reset} className="rounded bg-red-600 px-4 py-2 text-white">다시 시도</button>
    </div>
  );
}
