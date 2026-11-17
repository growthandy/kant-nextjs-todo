# 회원 전용 Todo — Next.js + Supabase

- 배포: https://kant-todo-nextjs.vercel.app/
- 이전 과제(JavaScript Todo)를 Next.js App Router 로 옮기고 회원가입·로그인을 붙였습니다.

## 기술 스택
Next.js 16 (App Router · Server Actions) · React 19 · TypeScript · Tailwind CSS · Supabase (Auth · Postgres · RLS) · Vercel

## 기능
| 기능 | 경로 |
|---|---|
| 회원가입 / 로그인 / 로그아웃 | `/sign_up` · `/sign_in` · 헤더 |
| 할 일 목록 (상태별 3구역) · 제목 검색 · 상태 변경 | `/` |
| 등록 | `/todo/new` |
| 상세 · 삭제 | `/todo/[id]/view` |
| 수정 | `/todo/[id]/edit` |

## 화면
| 비로그인 접근 → 로그인 이동 | 회원가입 | 빈 목록 |
|---|---|---|
| ![리다이렉트](docs/images/01-redirect-sign-in.png) | ![회원가입](docs/images/02-sign-up.png) | ![빈 목록](docs/images/03-empty.png) |

| 목록 (등록 3개) | 상태 변경 (새로고침 후 유지) | 검색 중 |
|---|---|---|
| ![목록](docs/images/04-list.png) | ![상태](docs/images/05-status.png) | ![검색 중](docs/images/06-search-loading.png) |

| 검색 결과 | 검색 결과 없음 | 상세 (`/todo/[id]/view`) |
|---|---|---|
| ![검색](docs/images/07-search.png) | ![검색 없음](docs/images/08-search-empty.png) | ![상세](docs/images/09-detail.png) |

| 수정 후 | 삭제 후 | 없는 할 일 (404 화면) |
|---|---|---|
| ![수정](docs/images/10-edited.png) | ![삭제](docs/images/11-after-delete.png) | ![404](docs/images/12-not-found.png) |

| 다른 사용자 목록 (RLS) | 다른 사용자의 상세 URL 직접 접근 | 로그인 · 모바일 |
|---|---|---|
| ![RLS](docs/images/13-rls-user-b.png) | ![RLS URL](docs/images/13b-rls-direct-url.png) | ![로그인](docs/images/14-sign-in.png) ![모바일](docs/images/15-mobile.png) |

## 설계
### 서버 / 클라이언트 컴포넌트
- 목록·상세·헤더는 **서버 컴포넌트**: 쿠키로 사용자를 확인하고 Supabase 를 서버에서 조회해 완성된 HTML 을 보냅니다. 첫 화면에 로딩 깜빡임이 없고 JS 번들이 줄어듭니다.
- 상태 변경·검색·폼은 **클라이언트 컴포넌트**: 입력에 즉시 반응해야 하기 때문입니다.
  - 상태 변경: `useOptimistic` + `useTransition` 으로 먼저 그리고, 실패하면 자동 롤백
  - 검색: `useEffect` 에서 300ms 디바운스 후 브라우저 Supabase 로 조회, cleanup 에서 `clearTimeout` + `AbortController.abort()` 로 이전 요청 취소

### 인증 · 권한
- `middleware.ts` 가 모든 요청에서 세션을 갱신하고, 비로그인 사용자를 `/sign_in?redirectUrl=…` 로 보냅니다.
- DB 는 RLS 로 `auth.uid() = user_id` 인 행만 읽고 쓸 수 있습니다 (`supabase/schema.sql`).

### 상태별 UI
`loading.tsx` (로딩) · `error.tsx` (오류) · 빈 목록 문구 · `not-found.tsx` (없는 할 일)

## 로컬 실행
```bash
cp .env.example .env.local   # Supabase Project URL · Publishable key
# Supabase SQL Editor 에서 supabase/schema.sql 실행, Authentication → Confirm email OFF
npm install
npm run dev
```
````


## 검증 기록
브라우저 E2E 결과와 절차는 [docs/verification.md](docs/verification.md).
