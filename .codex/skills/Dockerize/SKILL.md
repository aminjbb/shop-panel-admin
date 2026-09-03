---
name: dockerize
description: >-
  Creates production-ready Docker setup for Dynova Frontend under docker/ (multi-stage Node
  build + Nginx, runtime VITE_* injection, env helper in src/config). Use when the user asks
  to dockerize, add Docker support, create Dockerfile/docker-compose, or deploy with Docker.
---

# Dockerize Skill

> **Project:** Dynova Frontend (React + Vite + TypeScript + Tailwind v4)
> **Version:** 1.2.0 | **Updated:** 2026-05-23

---

## Core Rule

> Production Docker setup: **Node 20 (build)** → **Nginx (serve)**.
> All Docker config lives under **`docker/`** — not the repo root.
> All `VITE_*` variables are injected at **runtime** via `docker/docker-entrypoint.sh`.
> Application code must read env via `getEnv()` from `src/config/env.ts`.

---

## Folder Layout

```
docker/
├── Dockerfile
├── docker-compose.yml
├── docker-entrypoint.sh
└── nginx.conf
.dockerignore              # repo root only — Docker requires it at build context root
.env                       # repo root — never copied into image
.env.example               # repo root — placeholder keys
src/config/env.ts          # runtime env helper
```

**Exception:** `.dockerignore` stays at repo root because the build context is the project root (`context: ..` in compose).

---

## Trigger Phrases

- "Dockerize the project" / "Dockerize کن"
- "Add Docker support"
- "Create Dockerfile" / "Create docker-compose"
- "Deploy with Docker"

---

## Project Context

| Key | Value |
|-----|-------|
| Package manager | `npm` (`package-lock.json`) |
| Build command | `npm run build` (`tsc -b && vite build`) — use `npx vite build` in Docker if `tsc` fails |
| Build output | `dist/` |
| Dev server port | `5173` |
| Prod server port | `80` (nginx) |
| Compose port map | `3000:80` |
| Env prefix | `VITE_` |

---

## Required Workflow

### Step 0 — Discover Environment Variables

1. Read `.env` and `.env.example`.
2. Grep `src/` for `import.meta.env.VITE_` and `getEnv('VITE_`.
3. Map every key in `docker/docker-compose.yml`.

| Variable | Used in code | Required |
|----------|--------------|----------|
| `VITE_API_BASE_URL` | `api.ts` | Yes |
| `VITE_APP_API_URL` | `api.ts` (fallback) | No |
| `VITE_KEYCLOAK_URL` | `keycloak.ts` | Yes |
| `VITE_KEYCLOAK_REALM` | `keycloak.ts` | Yes |
| `VITE_KEYCLOAK_CLIENT_ID` | `keycloak.ts` | Yes |
| Others in `.env` | config / generator | No |

> **Never** copy `.env` into the image.

---

### Step 1 — Check for Existing Files

Check `docker/` for: `Dockerfile`, `docker-compose.yml`, `nginx.conf`, `docker-entrypoint.sh`.
Check repo root for: `.dockerignore`, `src/config/env.ts`.

If any exist, read first and extend — do not overwrite blindly.

---

### Step 2 — Runtime Env Helper

Create `src/config/env.ts`:

```typescript
declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

export const getEnv = (key: string): string | undefined => {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)[key];
  if (typeof fromMeta === "string" && fromMeta.length > 0) return fromMeta;
  return window.__ENV__?.[key];
};
```

Update `src/config/api.ts` and `src/features/auth/keycloak.ts` to use `getEnv()` — no bare `import.meta.env.VITE_*`.

---

### Step 3 — Create Docker Files under `docker/`

#### `docker/Dockerfile`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx vite build

FROM nginx:stable-alpine AS runner
RUN apk add --no-cache curl
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

> Use `npx vite build` when `npm run build` fails on pre-existing TS errors.
> `sed -i 's/\r$//'` strips Windows CRLF from the entrypoint script.

#### `docker/nginx.conf`

SPA fallback (`try_files`), static asset cache, gzip, security headers — see existing file in repo.

#### `docker/docker-entrypoint.sh`

Injects all `VITE_*` env vars as `window.__ENV__` into `index.html` before nginx starts.

#### `docker/docker-compose.yml`

```yaml
services:
  dynova-frontend:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: dynova-frontend
    ports:
      - "3000:80"
    env_file:
      - ../.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

> Paths in compose are relative to the compose file directory (`docker/`).
> `context: ..` = project root. `dockerfile` path is relative to context.
> `env_file: ../.env` loads all `VITE_*` vars into the container — no duplicate `environment:` block needed.

#### `.dockerignore` (repo root)

```
node_modules
dist
.git
.gitignore
.env
.env.*
*.md
.vscode
.cursor
coverage
.github
```

---

### Step 4 — Update `.env.example`

All `VITE_*` keys with placeholders. Format: `KEY=value` (no spaces around `=`).

---

### Step 5 — Verify

From **project root**:

```bash
docker compose -f docker/docker-compose.yml up --build
docker build -f docker/Dockerfile -t dynova-frontend .
```

Open `http://localhost:3000`.

---

## Multi-Environment Pattern

```
docker/docker-compose.yml
docker/docker-compose.staging.yml
docker/docker-compose.prod.yml
```

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d
```

---

## Keycloak Deploy Notes

- Redirect URI: `http://localhost:3000/*` (or production URL).
- `VITE_KEYCLOAK_URL` and `VITE_API_BASE_URL` must be browser-reachable public URLs.

---

## Audit Checklist

- [ ] All Docker files under `docker/` (not repo root)
- [ ] `.dockerignore` at repo root
- [ ] `src/config/env.ts` + consumers use `getEnv()`
- [ ] `docker/docker-compose.yml` maps all `VITE_*` keys
- [ ] `.env.example` updated
- [ ] `docker compose -f docker/docker-compose.yml up --build` succeeds
- [ ] App loads at `http://localhost:3000`
- [ ] No secrets in image layers

---

## Forbidden

| Pattern | Why |
|---------|-----|
| Docker files at repo root | Use `docker/` folder |
| `ARG VITE_*` in Dockerfile | Bakes env into layers |
| `.env` copied into image | Exposes secrets |
| `npm run dev` as CMD | Dev server only |
| Port `5173` in prod | Vite dev only |
| Missing `try_files` in nginx | Breaks SPA routing |
| `npm ci --frozen-lockfile` | Wrong for npm — use `npm ci` |
| Bare `import.meta.env.VITE_*` in consumers | Ignores runtime injection |
