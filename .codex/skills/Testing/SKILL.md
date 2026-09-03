---
name: testing
description: >-
  Guides Vitest and React Testing Library setup and test patterns for Dynova
  Frontend (Vite, FSD, TanStack Query v5). Use when adding or fixing tests,
  the user mentions unit test, integration test, Vitest, RTL, MSW, or coverage.
---

# Testing Skill

> **Stack:** Vite project — prefer **Vitest** + **@testing-library/react** + **jsdom** when introducing tests.
> **Version:** 1.0.0 | **Updated:** 2026-05-11

---

## When tests are missing

This repo may not yet declare a test runner in `package.json`. Before writing tests:

1. Add dev deps: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
2. Add script: `"test": "vitest"`, optionally `"test:run": "vitest run"`.
3. Create `vitest.config.ts` aligned with Vite (`@vitejs/plugin-react`), with `test.environment: "jsdom"` and path alias `@` if used in app code.

Do **not** guess config paths; read existing `vite.config.ts` and mirror `resolve.alias`.

---

## FSD testing rules

| Layer | What to test | Where colocate |
|-------|----------------|----------------|
| `shared-app/**/logics` | Pure functions (pagination, mappers) | `__tests__/` folder next to the source file |
| `models/` | Hooks with `@testing-library/react` + wrapper providers | `__tests__/` folder inside the same slice |
| `api/` | Thin wrappers: mock `get/post/...` from `@/config/api` | `__tests__/` folder inside the same slice |
| `ui/` | Presentational only: render with props; assert roles/labels | `__tests__/` folder inside the same slice |

> **Convention:** All test files must be placed inside a `__tests__/` folder co-located within the same FSD slice/layer directory. Do **not** place test files next to the source file at the same level.

Example structure:
```
widgets/person/
  models/
    usePersonModel.ts
    __tests__/
      usePersonModel.test.ts
  logics/
    resolvePersonStatusFilter.ts
    __tests__/
      resolvePersonStatusFilter.test.ts
  ui/
    PersonCard.tsx
    __tests__/
      PersonCard.test.tsx
      __fixtures__/
        mockLabels.ts
```

**Forbidden in UI tests:** reaching into hook internals, testing `t()` inside UI (strings come from model).

---

## TanStack Query v5 in tests

- Wrap components under test with `QueryClientProvider` using a **new** `QueryClient` per test (disable retries: `retry: false`, short `gcTime` if needed).
- For async UI: `await findBy*` / `waitFor` after user events.
- Prefer mocking the **API module** (`*Api.ts`) when testing a widget model that calls API, unless you intentionally run MSW.

---

## Patterns

### Pure logic (fastest)

```typescript
import { describe, it, expect } from "vitest";
import { computeSomething } from "./computePagination";

describe("computeSomething", () => {
  it("handles empty input", () => {
    expect(computeSomething([])).toEqual({ page: 1, total: 0 });
  });
});
```

### Hook or small component with QueryClient

```typescript
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";

function wrapper(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>;
}
```

---

## Commands

After setup: `pnpm test` or `pnpm test:run` for CI-style single run. Always run `pnpm lint` and `pnpm build` before merging test-heavy PRs per project norms.

---

## Anti-patterns

- Testing implementation details (`className`, internal state) instead of behavior and accessibility.
- Shared mutable `QueryClient` across tests.
- Importing UI from wrong FSD layer just to “get coverage”.
