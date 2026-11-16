'use client';

import { createBrowserSupabase } from '@/shared/lib/supabase';
import Link from 'next/link';
import { useEffect, useOptimistic, useState, useTransition } from 'react';
import { changeTodoStatus } from '../actions/todo.actions';
import { TODO_STATUSES, TODO_STATUS_MAP, type Todo, type TodoRow, type TodoStatus } from '../types/todo.types';
import { toTodo } from '../utils/todoConverter';
import TodoList from './TodoList';

interface TodoDashBoardProps {
  initialItems: Todo[];
}

type SearchState = 'idle' | 'loading' | 'error' | 'done';

export default function TodoDashBoard({ initialItems }: TodoDashBoardProps) {
  const [items, setItems] = useState<Todo[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, applyOptimistic] = useOptimistic(
    items,
    (current, next: { id: string; status: TodoStatus }) =>
      current.map((t) => (t.id === next.id ? { ...t, status: next.status } : t)),
  );

  const onChangeStatus = (id: string, status: TodoStatus) => {
    startTransition(async () => {
      applyOptimistic({ id, status });
      try {
        await changeTodoStatus(id, status);
        setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      } catch {
        alert('상태 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    });
  };

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Todo[]>([]);
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const query = keyword.trim();

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setSearchState('loading');
      const { data, error } = await createBrowserSupabase()
        .from('todos')
        .select('*')
        .is('deleted_at', null)
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal);

      if (controller.signal.aborted) return;
      if (error) {
        setSearchState('error');
        return;
      }
      setResults((data as TodoRow[]).map(toTodo));
      setSearchState('done');
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2 border-b pb-3">
        <label htmlFor="search" className="sr-only">제목 검색</label>
        <input
          id="search"
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="제목으로 검색"
          className="w-full max-w-xs rounded border px-3 py-2"
        />
        <Link href="/todo/new" className="shrink-0 rounded bg-indigo-600 px-3 py-2 text-white">할 일 등록</Link>
      </div>

      {isPending && <p className="animate-pulse text-sm text-gray-500" aria-live="polite">서버와 동기화 중...</p>}

      {query ? (
        <div aria-live="polite">
          {searchState === 'loading' && <p className="text-sm text-gray-500">검색 중...</p>}
          {searchState === 'error' && <p role="alert" className="text-sm text-red-600">검색에 실패했습니다.</p>}
          {searchState === 'done' && (
            <TodoList items={results} emptyMessage={`"${query}" 검색 결과가 없습니다.`} />
          )}
        </div>
      ) : (
        TODO_STATUSES.map((s) => (
          <div key={s} className="rounded-xl border p-4">
            <h2 className="mb-3 font-semibold">{TODO_STATUS_MAP[s]}</h2>
            <TodoList
              items={optimisticItems.filter((t) => t.status === s)}
              emptyMessage={`${TODO_STATUS_MAP[s]} 상태의 할 일이 없습니다.`}
              onChangeStatus={onChangeStatus}
            />
          </div>
        ))
      )}
    </section>
  );
}
