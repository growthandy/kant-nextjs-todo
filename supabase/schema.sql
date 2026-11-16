create table public.profiles (
  id          uuid primary key
              references auth.users (id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz,
  deleted_at  timestamptz
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.todos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 100),
  content     text not null default '',
  status      text not null default 'READY'
              check (status in ('READY', 'PROGRESS', 'DONE')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz,
  deleted_at  timestamptz
);

create index todos_user_id_created_at_idx on public.todos (user_id, created_at desc);

alter table public.todos enable row level security;

create policy "todos_select_own" on public.todos
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "todos_insert_own" on public.todos
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "todos_update_own" on public.todos
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 신규 Supabase 프로젝트는 public 테이블에 기본 권한을 주지 않는다 → 필요한 작업만 명시
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.todos to authenticated;
