# AGENTS.md

Guidance for AI agents (and new contributors) working on this codebase.

## Clarifying questions first

**Ask clarifying questions before implementing when a request is ambiguous or has multiple plausible interpretations — do not assume and start coding.** Use judgement: obvious, unambiguous requests should not generate questions. When in doubt, ask; when the intent is clear, proceed.

## Code is the authority

**Production code and config are the source of truth. When a test disagrees with the code, the test is wrong — rewrite the test to pin the code's actual behavior, unless the requester explicitly says otherwise.** Never change shipped behavior (constants, config, logic) just to satisfy a failing test.

## What this is

Single-app Vite starter (no monorepo) carrying the conventions of the ProvenMe web monorepo:

- Vite + React 19 + TypeScript (strict) + React Router 7
- TanStack Query, react-hook-form + Zod, Zustand
- shadcn/ui components on Tailwind CSS v4 with design tokens
- Envelope-unwrapping API client aligned with the **NestJS starter** (`{ success, message, data }`)

## Commands

| Command              | Purpose                                                                  |
| :------------------- | :----------------------------------------------------------------------- |
| `npm run dev`        | Vite dev server (mock API when `VITE_API_URL` is empty)                  |
| `npm run build`      | Typecheck + production build (fails without a deployable `VITE_API_URL`) |
| `npm run typecheck`  | `tsc -b` — run before finishing                                          |
| `npm run lint:check` | ESLint (`--max-warnings 0`) — run before finishing                       |
| `npm run lint`       | ESLint with `--fix`                                                      |
| `npm test`           | Vitest run — run before finishing                                        |
| `npm run format`     | Prettier write                                                           |

Husky: pre-commit runs lint-staged (eslint --fix + prettier on staged files); pre-push runs typecheck + lint:check + test.

## Project layout

```
src/
├── app/                # providers (QueryClient, theme, toaster), router
├── components/         # app-level components (layout, AuthGuard, theme toggle)
│   └── ui/             # shadcn/ui components + AsyncState, LoadingButton
├── features/
│   ├── auth/           # placeholder auth store + useAuth/useSignIn/useSignOut
│   └── users/          # example feature module (the pattern to copy)
├── lib/
│   ├── api/            # axios instance, envelope api.*, ENDPOINTS, mock adapter
│   ├── constants/      # ROUTES
│   └── errors/         # ERROR_CODE_MESSAGES, extract*, onError
├── pages/              # route components (home, about, login, dashboard, 404, error)
├── types/              # shared types (API envelope, PaginatedResponse)
├── validation/         # shared Zod schemas (forms + reusable by the API)
└── test/               # vitest setup
```

Path alias: `@/*` → `src/*` (tsconfig + vite alias).

## Feature module pattern

Every feature follows this structure:

```
features/<feature>/
├── api/
│   └── <feature>Api.ts          # API functions using api.get/post
├── hooks/
│   └── use-<feature>.ts         # React Query hooks (useQuery + useMutation)
├── types/
│   └── <feature>.responses.ts   # TypeScript response types
├── components/                   # Feature-specific UI components
└── index.ts                      # Barrel exports — the feature's public surface
```

## API pattern

### 1. Endpoints (src/lib/api/endpoints.ts)

Centralized endpoint constants organized by domain:

```ts
ENDPOINTS.USERS.LIST(); // "/users"
ENDPOINTS.USERS.GET_BY_ID(id); // "/users/<id>"
```

### 2. Feature API (features/<feature>/api/<feature>Api.ts)

```ts
import { api, ENDPOINTS } from "@/lib/api";

export const usersApi = {
  getUsers: () => api.get<UserListItem[]>(ENDPOINTS.USERS.LIST()),
};
```

`api.*` unwraps the `{ success, message, data }` envelope and throws `ApiError`
carrying `code`, `statusCode` and `details`.

### 3. React Query hooks (features/<feature>/hooks/use-<feature>.ts)

```ts
export const USERS_KEYS = {
  all: ["users"] as const,
  list: () => ["users", "list"] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};

export function useUsers() {
  return useQuery({ queryKey: USERS_KEYS.list(), queryFn: () => usersApi.getUsers() });
}
```

## Types (src/types)

Shared TypeScript types mirror the NestJS API shapes. Add new types here for
cross-feature use; feature-only types live in `features/<f>/types/`.

```ts
interface PaginatedResponse<T> {
  data: T[];
  meta: { total; page; limit; totalPages; hasNextPage; hasPrevPage };
}
```

## Error handling

### Error code map (src/lib/errors/error-codes.ts)

API error codes map to human-readable messages. **Keep in sync with the NestJS
starter's `src/common/errors.ts` (ErrorCode enum) on every run — when the API
adds a code, update both sides.**

### Extracting errors

```ts
import { extractErrorMessage, extractFieldErrors, onError } from "@/lib/errors";

onError(error); // toast.error with extracted message — use as React Query onError
const message = extractErrorMessage(error); // inline display
const fields = extractFieldErrors(error); // Record<field, messages[]> for forms
```

### Error check order

1. `body.code` → lookup in `ERROR_CODE_MESSAGES`
2. `body.error.message` (named refusal)
3. `body.message` (string | string[])
4. Plain string / Error.message (transport fallback)

## Route constants

**Always use centralized routes** from `@/lib/constants/routes`:

```tsx
import { ROUTES } from "@/lib/constants/routes";

<Link to={ROUTES.DASHBOARD.ROOT}>Dashboard</Link>;
navigate(ROUTES.AUTH.LOGIN);
```

**All navigation must use `ROUTES.*` — no hardcoded strings in `<Link>`, `navigate()`,
`<Navigate to>` or `window.location`.** One change in `routes.ts` propagates everywhere.

## UI components

Import from their paths:

```tsx
import { Button, LoadingButton, AsyncState, Skeleton } from "@/components/ui/...";
import { toast } from "sonner";
```

### Buttons

**Always use `Button` from `@/components/ui/button` — never native `<button>`**
for clickable controls. Pick a `variant` (`default`, `outline`, `ghost`,
`secondary`, `destructive`, `link`) and `size`, override layout via `className`.
Use `asChild` with `<Link>` when the button must render as a link. For pending
mutations use `LoadingButton`.

### Styling

- Tailwind CSS v4 (`src/index.css` holds the design tokens)
- `cn()` from `@/lib/utils` for class merging
- shadcn components live in `src/components/ui` — extend them there, don't fork

## Auth pattern (placeholder)

```ts
import { useAuth, useSignIn, useSignOut } from "@/features/auth";

const { user, isAuthenticated } = useAuth();
```

Protected routes wrap their element:

```tsx
<AuthGuard>
  <DashboardPage />
</AuthGuard>
```

`AuthGuard` redirects to `ROUTES.AUTH.LOGIN` with `location.state.from`, and the
login page redirects back after sign-in. Replace the store's `signIn`/`signOut`
bodies with real API calls — nothing else changes.

## Async state handling

**Every data-driven surface must explicitly handle ALL of its async states —
loading, error, empty, and idle — on every change.** Never ship a region that
renders blank while a request is in flight, mistakes a failed request for an
empty result, or has no placeholder before the user has selected anything.

| State   | Trigger                           | Required rendering                                                             |
| :------ | :-------------------------------- | :----------------------------------------------------------------------------- |
| Loading | query/mutation in flight          | `Skeleton` for lists/panels; `LoadingButton`/`isPending` for actions           |
| Error   | request failed                    | message **and** a retry affordance — never the empty state                     |
| Empty   | request succeeded with zero items | "nothing yet" copy; filtered-empty must read differently from unfiltered-empty |
| Idle    | nothing selected / no input yet   | explicit placeholder, not a blank pane                                         |

**`AsyncState` from `@/components/ui/async-state` renders these states — use it
instead of hand-written `isLoading ? … : isError ? … : length === 0 ? …` chains.**
It checks the states in the only safe order — idle → loading → error → empty →
content — so a failed read can never render as an empty one, and the failure
branch offers the retry (never the empty branch).

```tsx
<AsyncState
  isLoading={isLoading}
  isError={isError}
  isEmpty={items.length === 0}
  onRetry={refetch}
  skeleton={<ListSkeleton />}
  empty={isFiltered ? <NoMatches /> : <NoItems />}
>
  <List items={items} />
</AsyncState>
```

## Toast notifications

```ts
import { toast } from "sonner";
import { onError } from "@/lib/errors";

toast.success("Saved successfully");
useMutation({ mutationFn: apiCall, onError }); // auto-toast with extracted message
```

## Component extraction

**State locality decides when something becomes its own component.** If state —
or logic built on that state — is only needed inside one region of a parent,
move that region _together with its state_ into a separate component.

Do **not** extract a chunk of JSX just because it is a chunk of JSX. Stateless
badges, labels and loading skeletons stay with the screen that renders them
(see `UsersSkeleton` inside `users-table.tsx`). Extract only when the JSX is
quite large (above ~70 lines) or state demands it.

## Key conventions

1. **No hardcoded routes** — use `ROUTES.*` from `@/lib/constants/routes`
2. **No hardcoded API URLs** — use `ENDPOINTS.*` from `@/lib/api`
3. **Feature isolation** — each feature has its own api/hooks/types/components
4. **Error codes first** — when the API sends a code, show the mapped message
5. **Async states always** — every data-fetching surface renders loading, error,
   empty (filtered vs unfiltered) and idle through `AsyncState`
6. **Error codes sync** — check `src/lib/errors/error-codes.ts` against the
   NestJS starter's `src/common/errors.ts` on every run
7. **One exported component per file** — file-local helper components may stay
   with the screen that owns them
8. **Query hooks per component** — each component owns at most 1–3 React Query
   hooks; more signals it should be split
9. **No `any` / `unknown` types** — import shared types from `@/types` or define
   feature-specific types in `types/`; narrow status/enum-like fields to
   string-literal unions
10. **Extract by state locality** — state serving one region moves with that
    region into its own component
11. **Use `Button` from `@/components/ui/button`** — no native `<button>` for
    clickable controls

## Verify before you finish

```bash
npm run typecheck
npm run lint:check
npm test
```

All three must pass. For changes that touch routing or rendering, also boot
(`npm run dev`) and click through the affected pages.

## Gotchas

- **Production builds fail on purpose** when `VITE_API_URL` is missing or
  localhost — `VITE_*` values are inlined at build time. Set a real URL, or
  `ALLOW_LOCAL_PRODUCTION_BUILD=1` to build the mock demo.
- **Empty `VITE_API_URL` enables the mock adapter** (`src/lib/api/mock.ts`) so
  the app runs without a backend. Delete the mock together with the switch in
  `src/lib/api/axios.ts` once a real API is wired.
- **shadcn components are yours** — they live in `src/components/ui` and are
  formatted by Prettier like the rest of the code; re-running `shadcn add -o`
  overwrites local edits.
- The app runs on port 5173 (`npm run dev`), tests run in jsdom with
  `src/test/setup.ts` (jest-dom matchers).
