---
name: environment-config
description: >-
  Managing environment variables, .env files, and runtime config for Dynova
  Frontend. Use when env vars are undefined at runtime, when adding new VITE_*
  variables, or when debugging config differences between dev/stage/production.
---

# Environment Config Skill

> **Stack:** Vite + React + Docker (runtime injection)
> **Version:** 1.0.0 | **Updated:** 2026-06-30

---

## When to use this skill

- `VITE_*` variable is `undefined` at runtime
- App works locally but fails in staging/production
- Adding a new environment variable
- Debugging Docker container config issues
- Setting up a new `.env` file for a new environment

---

## How Env Vars Work in This Project

```
Build time (Vite)           Runtime (Docker)
─────────────────────       ─────────────────────────────
.env / .env.local  →        docker-entrypoint.sh injects
import.meta.env.VITE_*  →   window.__ENV__.VITE_*
    ↓                            ↓
getEnv("VITE_KEY")   ←── reads both (build-time first, runtime fallback)
```

The `getEnv()` helper in `src/config/env.ts` abstracts this — always use it.

---

## File Hierarchy

| File | Environment | Committed? |
|------|-------------|-----------|
| `.env` | All (base defaults) | Yes (no secrets) |
| `.env.local` | Local development override | No (gitignored) |
| `.env.staging` | Staging build | No (CI secret) |
| `.env.production` | Production build | No (CI secret) |
| `.env.example` | Template with placeholder values | Yes |

**Vite loading order (first match wins):**
`.env.local` → `.env.[mode].local` → `.env.[mode]` → `.env`

---

## The `getEnv()` Helper

Location: `src/config/env.ts`

```typescript
// src/config/env.ts

declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

export function getEnv(key: string): string {
  // Runtime injection (Docker) takes priority
  if (typeof window !== "undefined" && window.__ENV__?.[key]) {
    return window.__ENV__[key];
  }
  // Build-time (Vite)
  const value = (import.meta.env as Record<string, string>)[key];
  if (!value) {
    console.warn(`[env] Missing environment variable: ${key}`);
  }
  return value ?? "";
}
```

---

## Required Naming Convention

All project env vars must:
- Start with `VITE_` prefix (Vite only exposes these to the client)
- Use SCREAMING_SNAKE_CASE
- Be documented in `.env.example`

```bash
# ✅ Correct
VITE_API_BASE_URL=https://api.dev.dynova.ir
VITE_KEYCLOAK_URL=https://auth.dev.dynova.ir
VITE_KEYCLOAK_REALM=dynova

# ❌ Wrong — not exposed by Vite
API_BASE_URL=https://api.dev.dynova.ir
```

---

## Adding a New Environment Variable

Follow this checklist every time:

```
[ ] 1. Add to .env (with dev value)
[ ] 2. Add to .env.example (with placeholder: KEY=your-value-here)
[ ] 3. Read with getEnv("VITE_NEW_KEY") — never import.meta.env.VITE_NEW_KEY directly
[ ] 4. Add to docker/docker-compose.yml under environment:
[ ] 5. Update docker-entrypoint.sh to inject into window.__ENV__
[ ] 6. If TypeScript: add to vite-env.d.ts ImportMeta interface
```

### TypeScript declaration (optional but recommended):

```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  // add new vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## Common Problems and Fixes

### Problem: `undefined` at runtime in production/Docker

```
Symptom: API calls go to "undefined/api/persons"
Cause:   import.meta.env.VITE_API_BASE_URL used directly (not via getEnv)
         OR variable not injected into window.__ENV__ in entrypoint
```

**Fix:**
1. Replace all direct `import.meta.env.VITE_*` with `getEnv("VITE_*")`
2. Verify `docker/docker-entrypoint.sh` injects all required vars

---

### Problem: Variable defined in `.env` but undefined in app

```
Symptom: getEnv("VITE_KEY") returns ""
Cause 1: Variable name missing VITE_ prefix
Cause 2: .env file not in project root (must be at root, not in src/)
Cause 3: Vite dev server not restarted after adding the variable
```

**Fix:**
1. Check prefix — must be `VITE_`
2. Confirm `.env` is at project root (same level as `package.json`)
3. Restart dev server: `pnpm dev`

---

### Problem: Works locally, broken in CI/staging

```
Symptom: App works with pnpm dev but fails after pnpm build or in container
Cause:   Variable is in .env.local (gitignored) but not in .env or CI secrets
```

**Fix:**
1. Check `.env.local` for any secrets missing from CI environment
2. Add missing vars to CI/CD pipeline secrets
3. Add placeholder to `.env.example` so others know what's needed

---

### Problem: Different config for different environments

```
Dev    → http://localhost:8080/api
Staging → https://api.staging.dynova.ir
Prod   → https://api.dynova.ir
```

**Correct approach:**
```bash
# .env (dev defaults)
VITE_API_BASE_URL=http://localhost:8080/api

# Set in CI pipeline for staging:
VITE_API_BASE_URL=https://api.staging.dynova.ir

# Set in CI pipeline for production:
VITE_API_BASE_URL=https://api.dynova.ir
```

Never hardcode environment-specific URLs in source code.

---

## Audit Checklist

```
Environment Config Compliance
[ ] No direct import.meta.env.VITE_* in source (except env.ts itself)
[ ] getEnv() used everywhere that reads env vars
[ ] All VITE_* vars have VITE_ prefix
[ ] .env.example updated with every new variable
[ ] docker/docker-compose.yml lists all required VITE_* vars
[ ] No secrets committed to .env (only non-sensitive defaults)
[ ] vite-env.d.ts updated for TypeScript type safety
[ ] Dev server restarted after adding new variables
```

---

## Quick Reference

```typescript
// ✅ Always use this pattern
import { getEnv } from "@/config/env";
const BASE_URL = getEnv("VITE_API_BASE_URL");

// ❌ Never use directly in source files (other than env.ts)
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ❌ Never hardcode
const BASE_URL = "https://api.dynova.ir";
```
