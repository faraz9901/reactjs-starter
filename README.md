# React Starter

Production-ready React starter kit

## What's inside

| Layer          | Choice                                                                     |
| :------------- | :------------------------------------------------------------------------- |
| Build          | Vite 8 + React 19 + TypeScript (strict)                                    |
| Routing        | React Router 7 (data router, route error boundary)                         |
| Data           | TanStack Query 5 + axios client that unwraps `{ success, message, data }`  |
| Forms          | react-hook-form + Zod 4 (`zodResolver`)                                    |
| UI             | shadcn/ui components on Tailwind CSS v4 (design tokens in `src/index.css`) |
| State          | Zustand (placeholder auth store)                                           |
| Toasts / theme | sonner + next-themes (light/dark)                                          |
| Quality        | ESLint 9 flat config + Prettier + Husky + lint-staged + Vitest             |

## Quick start

```bash
npm install
npm run dev
```

The app boots against a **built-in mock API** (no backend needed): open
`http://localhost:5173`, sign in with any valid email + 8-char password, and the
dashboard shows the example `users` feature with loading → error → empty handling.

To point it at a real API (e.g. the NestJS starter), set `.env`:

```bash
VITE_API_URL=http://localhost:9000/api/v1
```

## Environment variables

| Variable                       | Purpose                                                                                          |
| :----------------------------- | :----------------------------------------------------------------------------------------------- |
| `VITE_API_URL`                 | API base URL. **Empty in dev → mock responses.** Required (non-localhost) for production builds. |
| `ALLOW_LOCAL_PRODUCTION_BUILD` | `1` skips the production build check (lets you ship the mock demo).                              |

`VITE_*` values are inlined into the bundle at build time — `npm run build` fails with a
clear message if `VITE_API_URL` is missing or localhost, because that can never be fixed
after deploy.

## Scripts

| Command                       | Purpose                                      |
| :---------------------------- | :------------------------------------------- |
| `npm run dev`                 | Vite dev server                              |
| `npm run build`               | Typecheck + production build                 |
| `npm run preview`             | Serve the production build                   |
| `npm run typecheck`           | `tsc -b`                                     |
| `npm run lint` / `lint:check` | ESLint with fix / check (`--max-warnings 0`) |
| `npm run test` / `test:watch` | Vitest (jsdom)                               |
| `npm run format`              | Prettier write                               |

**Quality gate:** pre-commit runs lint-staged (eslint --fix + prettier on staged files);
pre-push runs typecheck + lint:check + test.

## Project structure

```
src/
├── app/                  # AppProviders (QueryClient, theme, toaster), router
├── components/
│   ├── ui/               # shadcn/ui components + AsyncState, LoadingButton
│   ├── app-layout.tsx    # header/nav + <Outlet/>
│   ├── auth-guard.tsx    # private-route guard (placeholder auth)
│   └── theme-toggle.tsx
├── features/
│   ├── auth/             # placeholder session store + useAuth/useSignIn/useSignOut
│   └── users/            # example feature module — copy this pattern
│       ├── api/usersApi.ts
│       ├── hooks/use-users.ts      # React Query + USERS_KEYS factory
│       ├── types/users.responses.ts
│       ├── components/users-table.tsx
│       └── index.ts                # barrel
├── lib/
│   ├── api/              # axios instance, envelope `api.*`, ENDPOINTS, mock adapter
│   ├── constants/routes.ts         # ROUTES — no hardcoded paths anywhere
│   └── errors/           # ERROR_CODE_MESSAGES, extract*, onError
├── pages/                # home, about, login, dashboard, 404, route error
├── types/                # API envelope + PaginatedResponse
└── validation/           # shared Zod schemas
```

## Conventions (the short version)

- **Routes** — always `ROUTES.*` from `@/lib/constants/routes`; never string literals.
- **API URLs** — always `ENDPOINTS.*` from `@/lib/api`; the `api.get/post/...` helpers
  unwrap the envelope and throw `ApiError` with `code`/`statusCode`/`details`.
- **Feature modules** — `features/<f>/{api,hooks,types,components}` behind `index.ts`.
- **Async states** — every data surface renders loading → error → empty → content through
  `AsyncState` (a failed read can never look like an empty list).
- **Errors** — API `code`s map to messages in `ERROR_CODE_MESSAGES` (keep in sync with the
  NestJS starter's `src/common/errors.ts`); use `onError` as mutation `onError`.
- **Buttons** — `Button` / `LoadingButton` from `@/components/ui`, never native `<button>`.
- **Auth** — `AuthGuard` + placeholder store; swap the store bodies for real API calls.

Full detail lives in [AGENTS.md](./AGENTS.md).

## Tests

```bash
npm test
```

Examples pin the contracts: route constants, error extraction order, and `AsyncState`
branch order (a failed read never renders as empty).
