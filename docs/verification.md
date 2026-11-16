# 검증 기록 — 2026-11-16

로컬 Supabase 스택(`supabase start`, CLI 2.109.1)과 프로덕션 빌드(`next start`)를 대상으로, 실제 Chrome(puppeteer-core)으로 화면을 조작했습니다.

## 빌드

| 명령 | 결과 |
|---|---|
| `npx tsc --noEmit` | 오류 0 |
| `npm run lint` | 경고·오류 0 |
| `npm run build` | 통과 (Next.js 16.4.6). `/` · `/sign_in` · `/sign_up` · `/todo/[id]/view` · `/todo/[id]/edit` · `/todo/new` 동적 렌더, `middleware` → `proxy` 이름 변경 권고 경고만 있음 |

## 브라우저 E2E (전부 통과)

| # | 시나리오 | 확인 내용 | 캡처 |
|---|---|---|---|
| 1 | 비로그인으로 `/` | `/sign_in?redirectUrl=%2F` 로 이동 (미들웨어) | `01` |
| 2 | 회원가입 | 메인으로 이동, 헤더에 "영민님", 상태 3구역 모두 빈 상태 문구 | `02` `03` |
| 3 | 할 일 3개 등록 | 목록에 즉시 반영 | `04` |
| 4 | 상태 변경 → 새로고침 | 진행중 구역으로 이동, 새로고침 후에도 유지 (DB 반영) | `05` |
| 5 | 검색 | "검색 중..." → 결과 1건 / 없는 단어 → `"없는단어" 검색 결과가 없습니다.` | `06` `07` `08` |
| 6 | 상세 `/todo/[id]/view` | 메모까지 표시 | `09` |
| 7 | 수정 | 제목·상태(완료) 수정 후 상세로 복귀, 반영 | `10` |
| 8 | 삭제 (confirm 수락) | 목록에서 사라짐 (soft delete, DB 에는 `deleted_at` 기록) | `11` |
| 9 | 잘못된 id · 삭제된 id | `not-found.tsx` 화면 | `12` |
| 10 | 로그아웃 → `/` | 다시 로그인 화면으로 | — |
| 11 | 두 번째 사용자 가입 | 첫 사용자의 할 일이 목록에 없음, 첫 사용자의 상세 URL 을 직접 열어도 404 화면 | `13` `13b` |
| 12 | 첫 사용자 재로그인 | 할 일 복원 · 모바일 폭(390px) 렌더 | `14` `15` |

## API 수준 RLS 확인 (curl, Publishable 키)

| 요청자 | `GET /rest/v1/todos` |
|---|---|
| 비로그인(anon) | `42501 permission denied for table todos` |
| 사용자 A | A 의 3건만 (삭제한 1건은 `deleted_at` 이 채워져 있고 앱 쿼리가 거른다) |
| 사용자 B | `[]` |

## 설계 문서 대비 수정 · 발견

1. **`supabase/schema.sql` 에 GRANT 2줄 추가** — 최신 Supabase 는 `public` 의 새 테이블에 `authenticated` 의 SELECT/INSERT/UPDATE 권한을 자동으로 주지 않는다. 없으면 RLS 를 보기 전에 `permission denied` (42501).
2. **`next.config.ts` 에서 `cacheComponents` 를 지움** — create-next-app 16.4.6 의 기본 설정이 `cacheComponents: true` 라서 `/` 프리렌더가 "uncached data accessed outside of `<Suspense>`" 로 빌드 실패했다. 문서 결정 ⑤(끈다)를 그대로 따랐다. `partialPrefetching` 도 함께 지웠다.
3. **404 의 HTTP 상태는 200** — `(todo)/loading.tsx` 가 Suspense 경계를 만들어 응답 스트리밍이 먼저 시작되므로 `notFound()` 는 404 **화면**을 그리지만 상태 코드는 이미 200 이다 (Next.js 스트리밍의 문서화된 동작, `noindex` 메타가 붙는다). 화면 기준으로 검증했다.

## 확인하지 못한 것

- `error.tsx` 화면 — 코드와 빌드는 확인. 실제 오류를 일으키려면 Supabase 연결을 끊어야 하는데, 그러면 미들웨어가 먼저 로그인 화면으로 보내 오류 경계까지 가지 않는다.
- `loading.tsx` 화면 캡처 — 로컬 DB 가 빨라 로딩 문구가 캡처 전에 사라졌다 (E2E 중 한 번 화면에 나타난 것은 확인).
- Vercel 배포 · 클라우드 Supabase.
