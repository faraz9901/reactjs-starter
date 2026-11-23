# Contributing

Thanks for your interest in improving this starter.

## Getting started

```bash
npm install
npm run dev
```

The app boots against the built-in mock API, so no backend is needed to develop.

## Before you open a PR

Run the full quality gate — all of it must pass:

```bash
npm run typecheck
npm run lint:check
npm test
npm run format:check
```

Husky runs lint-staged (eslint --fix + prettier) on commit and the same checks
on push, so a green local push means a green CI.

## Guidelines

- Follow the conventions in [AGENTS.md](./AGENTS.md): routes via `ROUTES.*`,
  endpoints via `ENDPOINTS.*`, async states via `AsyncState`, `Button` instead
  of native `<button>`, feature modules behind a barrel `index.ts`.
- Keep the starter focused — prefer reusable conventions, docs and tooling over
  app-specific features.
- When behavior changes, add or update tests. Tests pin the code's actual
  behavior; never change shipped behavior just to satisfy a test.
- Update [README.md](./README.md) and [AGENTS.md](./AGENTS.md) when you change
  commands, project structure or conventions.

## Reporting bugs

Open an issue including:

- what you expected vs what happened
- steps to reproduce
- `node -v` and `npm -v` output
- whether `VITE_API_URL` is empty (mock mode) or set
