---
name: error-boundary
description: >-
  React Error Boundary patterns for Dynova FSD. Use when a component crashes
  with a white screen, when adding resilience to a new page, or when debugging
  uncaught render errors. Covers placement, fallback UI, retry, and integration
  with TanStack Query error states.
---

# Error Boundary Skill

> **Stack:** React 18 + FSD + TanStack Query v5
> **Version:** 1.0.0 | **Updated:** 2026-06-30

---

## When to use this skill

- UI shows a white/blank screen with no error in the console (render error swallowed)
- A widget or feature crashes and takes the entire page down
- Adding a new page that should be resilient to partial failures
- Debugging "Cannot read properties of undefined" crashes in render

---

## How Error Boundaries Work

React Error Boundaries **catch errors thrown during render**, lifecycle methods, and constructors of child components. They do **not** catch:
- Async errors (inside `useEffect`, `setTimeout`, event handlers)
- Errors in the boundary component itself
- Server-side rendering errors

TanStack Query errors are **not** render errors — they are caught by `error` state in `useQuery`. Only combine with Error Boundary for unexpected JS crashes.

---

## Placement Strategy in FSD

```
pages/<PageName>.tsx           ← Page-level boundary (catches entire page)
  └── widgets/<Name>/ui/       ← Widget-level boundary (isolates widget crash)
        └── features/<Name>/ui/ ← Feature-level boundary (isolates feature crash)
```

**Rule:** Every page must have at least a **page-level** Error Boundary. For complex pages with multiple independent widgets, add **widget-level** boundaries.

---

## Implementation

### Option A — Using `react-error-boundary` (recommended)

Install if not present:
```bash
pnpm add react-error-boundary
```

#### Page-level usage in `pages/<PageName>.tsx`:
```tsx
import { ErrorBoundary } from "react-error-boundary";
import { PageNameWidget } from "@/widgets/pageName/ui/PageName";
import { ErrorPanel } from "@/shared-app/designSystem/errorPanel";

const PageName = () => (
  <ErrorBoundary
    FallbackComponent={({ error, resetErrorBoundary }) => (
      <ErrorPanel
        message={error.message}
        onRetry={resetErrorBoundary}
      />
    )}
    onError={(error, info) => console.error("[ErrorBoundary]", error, info)}
  >
    <PageNameWidget />
  </ErrorBoundary>
);

export default PageName;
```

#### Widget-level usage inside `widgets/<name>/ui/<Name>.tsx`:

Since UI files must be pure/presentational, wrap individual sections that can fail independently:
```tsx
import { ErrorBoundary } from "react-error-boundary";

// Only wrap sections that can independently fail
<ErrorBoundary FallbackComponent={SectionFallback}>
  <RiskySection data={props.data} />
</ErrorBoundary>
```

---

### Option B — Class-based (when react-error-boundary not available)

Create in `src/shared-app/errorBoundary/`:

```tsx
// src/shared-app/errorBoundary/ErrorBoundary.tsx
import { Component, ReactNode } from "react";
import EButton from "@/shared-app/designSystem/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.props.onError?.(error);
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <p className="text-body-sm-reg text-[var(--color-status-danger)]">
            خطایی رخ داد. لطفاً صفحه را بازنشانی کنید.
          </p>
          <EButton
            variant="outlined"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            تلاش مجدد
          </EButton>
        </div>
      );
    }
    return this.props.children;
  }
}
```

> **Note:** this class must live in `shared-app/errorBoundary/ui/` per FSD placement rules (with `types/index.ts` for `Props`/`State` if reused). Never use a native `<button>` or inline `style={{ color: ... }}` in the fallback — always `EButton` and token classes (`text-[var(--color-...)]`) per the Design-Tokens / Design-System-Catalog rules.

---

## Debugging with Error Boundaries

### Finding the crash location

1. Open React DevTools → Components tab
2. Find the component wrapped in `<ErrorBoundary>`
3. The error stack trace in console shows the exact render line

### Common crash patterns

```tsx
// ❌ Crash: data is undefined on first render
<Table rows={data.items} /> // data is undefined before query loads

// ✅ Fix: handle loading state before passing to component
if (isLoading) return <Skeleton />;
if (error) return <ErrorPanel onRetry={refetch} />;
if (!data?.items?.length) return <EmptyState />;
return <Table rows={data.items} />;
```

```tsx
// ❌ Crash: optional chaining missing
<span>{user.profile.name}</span> // user.profile can be null

// ✅ Fix
<span>{user.profile?.name ?? "—"}</span>
```

---

## Integration with TanStack Query

Error Boundary does **not** replace Query error states. Use both:

```tsx
// In widget UI (presentational):
// 1. TanStack Query error → handled by model → passed as prop to UI
// 2. Unexpected render crash → caught by Error Boundary wrapping the widget

// Model (models/useWidgetModel.ts):
const { data, isLoading, error, refetch } = useQuery({ ... });
return { data, isLoading, error, onRetry: refetch };

// UI (ui/Widget.tsx):
if (props.isLoading) return <Skeleton />;
if (props.error) return <ErrorPanel onRetry={props.onRetry} />;
// ErrorBoundary above catches any unexpected crash below this line
return <ActualContent data={props.data} />;
```

---

## Checklist

```
Error Boundary Compliance
[ ] Every page has at least a page-level Error Boundary in pages/<Name>.tsx
[ ] FallbackComponent provides "retry" action (resetErrorBoundary or setState)
[ ] Error Boundary does NOT replace TanStack Query error states
[ ] Class-based ErrorBoundary placed in shared-app/errorBoundary/ui/ if needed
[ ] onError callback logs the error (for monitoring)
[ ] UI crash (render error) distinguished from API error (query error state)
[ ] Fallback UI uses EButton and token classes — no native <button> or inline style={{ color: ... }}
```
