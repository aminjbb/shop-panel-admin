# Sprint 01 Foundation and Security Frontend API Handoff

This is the consumer contract for the endpoints implemented in Sprint 01. It
is derived from the final FastAPI routes, Pydantic schemas, exception handlers,
application use cases, contract tests, and generated OpenAPI. Paths listed in
`product/backend-fastapi-api-map.md` outside health and authentication are
future backlog items and are not implemented by this sprint.

## Document control

| Item | Value |
|---|---|
| Epic/PBIs | Epic 01: PBI-01-01, PBI-01-02, PBI-01-03; Epic 02: PBI-02-01, PBI-02-02, RBAC core of PBI-02-03; Epic 13: auth/audit core of PBI-13-01 |
| API version | `v1`; default versioned prefix `/api/v1` |
| Document version/date | 1.0 / 2026-08-28 |
| Backend revision | Current workspace snapshot; this directory is not a Git repository, so no commit SHA is available |
| OpenAPI source | Runtime-generated `FastAPI.openapi()` schema on 2026-08-28 |
| Owner | Backend team |

## Environment and common protocol

### Base URLs

| Environment | Base URL | Notes |
|---|---|---|
| Local development | `http://localhost:8000` | Default Uvicorn address in repository setup |
| Staging | Environment-owned; not declared in this repository | Append the configured API prefix, default `/api/v1` |
| Production | Environment-owned; not declared in this repository | Append the configured API prefix, default `/api/v1` |

`GET /health` is deliberately outside the version prefix. All other endpoints
in this document use `/api/v1` with the default configuration.

### Authentication, sessions, and roles

- Access tokens are returned in JSON and transported as
  `Authorization: Bearer <accessToken>`. Cookies are not used.
- Access tokens are HS256 JWTs with issuer, audience, subject, JTI, issued-at,
  expiry, role, and token type claims. The default lifetime is 15 minutes.
- Refresh tokens are opaque strings returned in JSON. The database stores only
  their SHA-256 digest. A normal login creates a refresh family with a 7-day
  absolute lifetime; `rememberMe: true` creates a 30-day family by default.
- A successful refresh returns both a new access token and a new refresh token.
  Replace both client values atomically. The old refresh token is immediately
  revoked. Rotation never extends the family past its original expiry.
- Reuse of an already-rotated refresh token revokes its whole token family.
  The public response remains the generic `invalid_refresh_token` error.
- `/auth/me` and `/auth/logout` require any active admin role. The server reloads
  the account from the database on each access-token-authenticated request, so
  a disabled account or stale/invalid subject is rejected even if JWT expiry has
  not been reached.
- Implemented role wire values are `super_admin`, `inventory_manager`, and
  `support_agent`. No Sprint 01 auth endpoint requires a narrower permission.
  The later business endpoints and their permission checks are not implemented.

### Common headers and CORS

| Header | Direction | Required | Example | Meaning |
|---|---|---:|---|---|
| `Content-Type` | Request | Yes for JSON body endpoints | `application/json` | Login, refresh, and logout bodies are JSON |
| `Authorization` | Request | Only `/auth/me` and `/auth/logout` | `Bearer eyJ...` | Admin access token; the refresh endpoint does not use this header |
| `X-Request-ID` | Request | No | `web-01-login-7` | Accepted only when it matches `[A-Za-z0-9._:-]{1,128}`; otherwise replaced |
| `X-Request-ID` | Response | Yes | `web-01-login-7` | Accepted client ID or a generated 32-character hexadecimal ID |
| `WWW-Authenticate` | Error response | On access/credential 401 errors | `Bearer` | Authentication challenge; absent on `invalid_refresh_token` |
| `Retry-After` | Error response | On 429 | `60` | Integer seconds before retrying |

When configured, CORS uses an explicit origin allowlist, does not allow
credentials, permits `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS`,
accepts `Authorization`, `Content-Type`, `X-Request-ID`, and `Idempotency-Key`,
and exposes `X-Request-ID`. Allowing `Idempotency-Key` through CORS does not
mean these endpoints implement idempotency-key semantics.

### Wire conventions

- IDs are UUID strings, for example
  `11111111-1111-1111-1111-111111111111`.
- Timestamps are ISO 8601 date-time strings with timezone, normally UTC `Z`.
- Public JSON uses camelCase. Unknown request fields are rejected with 422.
- Response fields are always present unless explicitly described as nullable.
  `user.lastLoginAt` is always present and may be `null`.
- No endpoint in this sprint returns money or decimal fields.
- Successful responses are direct typed JSON models, not wrapped in `data`.

### Public error envelope

All errors use this exact top-level shape:

```json
{
  "error": {
    "code": "validation_error",
    "message": "The request is invalid.",
    "details": {
      "fields": [
        {
          "field": "body.email",
          "reason": "value_error"
        }
      ]
    },
    "requestId": "web-01-login-7"
  }
}
```

| Field | Type | Nullable | Meaning |
|---|---|---:|---|
| `error.code` | string | No | Stable lower-snake-case frontend branching key |
| `error.message` | string | No | Safe English message; do not use it as the branching key |
| `error.details` | JSON object | No | Empty object or the exact contextual fields documented below |
| `error.details.fields` | array of `{field: string, reason: string}` | No when code is `validation_error` | Pydantic location joined with dots and stable validation reason |
| `error.requestId` | string | No | Same value as response `X-Request-ID`; include in support reports |

The exact shared error variants used by endpoints in this document are:

#### 422 — `validation_error`

```json
{
  "error": {
    "code": "validation_error",
    "message": "The request is invalid.",
    "details": {
      "fields": [
        {"field": "body.refreshToken", "reason": "string_too_short"}
      ]
    },
    "requestId": "req-validation-1"
  }
}
```

The `field` and `reason` values vary with the invalid input. Examples include
`body.email` / `value_error`, `body.password` / `string_too_short`, and an
unknown body field / `extra_forbidden`.

#### 429 — `rate_limited`

Headers include `Retry-After: 60` and `X-Request-ID: req-limited-1`.

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Too many attempts. Try again later.",
    "details": {"retryAfterSeconds": 60},
    "requestId": "req-limited-1"
  }
}
```

The numeric retry delay is computed from the current fixed window and may be
between 1 and the configured window length.

#### 500 — `internal_server_error`

```json
{
  "error": {
    "code": "internal_server_error",
    "message": "An unexpected error occurred.",
    "details": {},
    "requestId": "req-failure-1"
  }
}
```

Internal exception text is never exposed. Retry only GET operations or a POST
whose side-effect status can be safely established; use `requestId` for support.

## Recommended frontend session flow

1. Call login once and store the returned access/refresh pair and both expiry
   timestamps. Prevent duplicate login submissions.
2. On app restoration, call `/auth/me` with the access token.
3. On `invalid_access_token`, allow only one in-flight refresh operation for the
   whole frontend. On refresh success, atomically replace both tokens and retry
   the original safe request once.
4. On `invalid_refresh_token`, clear the entire local session and show login.
   Do not retry the same refresh value: reuse of a rotated value can revoke the
   remaining family.
5. On logout, send the current access and refresh tokens. Clear local auth state
   after the 204. Because logout intentionally hides refresh-token existence,
   the same authenticated request can be repeated safely.
6. On 429, disable the action until the `Retry-After` duration has elapsed.

## Endpoint: Simple service health

### Overview

| Item | Value |
|---|---|
| Method/path | `GET /health` |
| Purpose/caller | Unversioned process health for local tools and simple probes |
| Auth/permission | None |
| Side effects | None |
| Idempotency/cache | Safe and idempotent; no explicit cache headers are set |

### Request

No path parameters, query parameters, request body, or required headers.
`X-Request-ID` is optional as defined above.

### Success — 200

Header `X-Request-ID` is always present.

```json
{"status": "ok"}
```

| Field | Type | Nullable | Always present | Allowed value |
|---|---|---:|---:|---|
| `status` | string | No | Yes | `ok` |

### Errors

| HTTP/code | Trigger | Retry/frontend action |
|---|---|---|
| 500 / `internal_server_error` | Unexpected server failure | Retry with bounded backoff; report `requestId` |

The exact 500 body is the shared example above.

### Frontend notes and verification

This route does not test PostgreSQL and must not be used as a readiness gate.
Route/schema: `presentation/http/routers/health.py`,
`schemas/health.py`. Contract: `tests/contract/test_health_api.py`.
OpenAPI operation ID: `get_service_health`.

## Endpoint: Frontend API health and readiness

### Overview

| Item | Value |
|---|---|
| Method/path | `GET /api/v1/health` |
| Purpose/caller | Frontend-facing API and PostgreSQL readiness check |
| Auth/permission | None |
| Side effects | Executes `SELECT 1`; no data mutation |
| Idempotency/cache | Safe and idempotent; no explicit cache headers are set |

### Request

No path parameters, query parameters, request body, or required headers.

### Success — 200

Header `X-Request-ID` is always present.

```json
{
  "status": "ready",
  "checks": {"database": "ok"}
}
```

| Field | Type | Nullable | Always present | Allowed value |
|---|---|---:|---:|---|
| `status` | string | No | Yes | `ready` |
| `checks` | object | No | Yes | Dependency status container |
| `checks.database` | string | No | Yes | `ok` |

### Errors

| HTTP/code | Exact trigger | Retry/frontend action |
|---|---|---|
| 503 / `dependency_unavailable` | PostgreSQL connect or `SELECT 1` fails | Treat service as unavailable; retry with bounded backoff |
| 500 / `internal_server_error` | Unexpected server failure outside the known dependency failure | Retry with bounded backoff; report `requestId` |

Exact 503 response:

```json
{
  "error": {
    "code": "dependency_unavailable",
    "message": "A required dependency is unavailable.",
    "details": {"dependency": "database", "reason": "unavailable"},
    "requestId": "req-readiness-1"
  }
}
```

The 500 body is the shared example above.

### Frontend notes and verification

Use 200 as ready and 503 as temporarily unavailable; there is no intermediate
status or polling interval imposed by the API. Route/use case/adapter:
`presentation/http/routers/health.py`,
`application/use_cases/check_readiness.py`,
`infrastructure/database/probe.py`. Contract:
`tests/contract/test_health_api.py`. OpenAPI operation ID: `get_api_health`.

## Endpoint: Process liveness compatibility route

### Overview and request

`GET /api/v1/health/live` is a retained operational compatibility route. It is
unauthenticated, has no parameters or body, has no side effects, is idempotent,
and sets no explicit cache headers. `X-Request-ID` is optional on the request
and always returned.

### Success — 200

```json
{"status": "ok"}
```

`status` is a required, non-null string whose only value is `ok`.

### Errors and verification

Only 500 / `internal_server_error` is reachable from the declared route; use
the shared exact 500 body and retry with bounded backoff. This endpoint does not
test PostgreSQL. Route/schema: `presentation/http/routers/health.py`,
`schemas/health.py`. Contract: `tests/contract/test_health_api.py`. OpenAPI
operation ID: `get_liveness`.

## Endpoint: Application readiness compatibility route

### Overview and request

`GET /api/v1/health/ready` is the retained operational readiness route. It is
unauthenticated, has no parameters or body, executes PostgreSQL `SELECT 1`, is
idempotent, and sets no explicit cache headers. `X-Request-ID` is optional on
the request and always returned.

### Success — 200

```json
{
  "status": "ready",
  "checks": {"database": "ok"}
}
```

The required, non-null fields and allowed values are identical to
`GET /api/v1/health`.

### Errors and verification

| HTTP/code | Exact trigger | Retry/frontend action |
|---|---|---|
| 503 / `dependency_unavailable` | PostgreSQL connect or `SELECT 1` fails | Retry with bounded backoff |
| 500 / `internal_server_error` | Unexpected server failure | Retry with bounded backoff; report `requestId` |

Use the exact shared 500 example and the exact 503 example under frontend API
health. Route/use case/adapter: `presentation/http/routers/health.py`,
`application/use_cases/check_readiness.py`,
`infrastructure/database/probe.py`. Contract:
`tests/contract/test_health_api.py`. OpenAPI operation ID: `get_readiness`.

## Endpoint: Admin login

### Overview

| Item | Value |
|---|---|
| Method/path | `POST /api/v1/auth/login` |
| Purpose/caller | Authenticate an admin and create a refresh session |
| Auth/permission | None; valid active account credentials required |
| Side effects | Updates `lastLoginAt`, creates refresh session, appends success/failure audit event |
| Idempotency/cache | Not idempotent; every successful request creates a new token family; no cache headers |

### Request

Headers: `Content-Type: application/json` is required. `X-Request-ID` is
optional. `Authorization` is neither required nor used. There are no path or
query parameters.

```json
{
  "email": "admin@example.com",
  "password": "correct-password",
  "rememberMe": true
}
```

| Field | Type/format | Required | Nullable | Constraints/default | Meaning |
|---|---|---:|---:|---|---|
| `email` | string/email | Yes | No | Valid email; normalized for lookup | Admin email |
| `password` | string | Yes | No | 1–128 characters | Plaintext credential, never returned or stored as plaintext |
| `rememberMe` | boolean | No | No | Default `false` | Chooses normal vs remembered refresh-family lifetime |

Unknown fields are forbidden. This is not a partial-update request.

### Success — 200

`X-Request-ID` is always present.

```json
{
  "user": {
    "id": "11111111-1111-1111-1111-111111111111",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2026-08-27T10:00:00Z",
    "lastLoginAt": "2026-08-28T10:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.signature",
  "refreshToken": "JxU7LZB8m9y0D3eF2gH4kN6pQ1rS5tV8wXcA7bE9fGk",
  "accessTokenExpiresAt": "2026-08-28T10:15:00Z",
  "refreshTokenExpiresAt": "2026-09-27T10:00:00Z"
}
```

| Field | Type/format | Nullable | Always present | Constraints/meaning |
|---|---|---:|---:|---|
| `user` | object | No | Yes | Current persisted admin identity |
| `user.id` | UUID string | No | Yes | Admin identifier |
| `user.email` | email string | No | Yes | Normalized email |
| `user.fullName` | string | No | Yes | Display name |
| `user.role` | enum string | No | Yes | `super_admin`, `inventory_manager`, or `support_agent` |
| `user.isActive` | boolean | No | Yes | `true` on a successful login |
| `user.createdAt` | ISO 8601 date-time | No | Yes | Account creation time |
| `user.lastLoginAt` | ISO 8601 date-time or null | Yes | Yes | Updated to this successful login time |
| `accessToken` | string | No | Yes | Bearer JWT; default lifetime 15 minutes |
| `refreshToken` | string | No | Yes | Opaque secret; use only for refresh/logout |
| `accessTokenExpiresAt` | ISO 8601 date-time | No | Yes | Exact access expiry |
| `refreshTokenExpiresAt` | ISO 8601 date-time | No | Yes | Exact fixed family expiry: default 7 or 30 days |

### Errors

| HTTP/code | Exact trigger | Retry/frontend action |
|---|---|---|
| 401 / `invalid_credentials` | Email absent from the database, password mismatch, or account inactive; response does not distinguish them | Do not retry automatically; show generic credential error |
| 422 / `validation_error` | Missing/invalid email, password outside 1–128, wrong type/null, or unknown field | Map `details.fields` to inputs and correct request |
| 429 / `rate_limited` | Per-IP, per-normalized-email, or concurrent-login limit exceeded | Disable submit for `Retry-After` seconds |
| 500 / `internal_server_error` | Unexpected server/database failure | Do not blindly resubmit because session creation may have committed; report `requestId` |

Exact 401 response, including `WWW-Authenticate: Bearer`:

```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "The email or password is incorrect.",
    "details": {},
    "requestId": "req-login-failed-1"
  }
}
```

The exact 422, 429, and 500 shapes appear in the shared error section.

Default process-local limits are 5 attempts per normalized account and 20 per
client IP in each 60-second fixed window. Login concurrency is 4 per process;
failure to obtain a slot within 50 ms returns 429 with a 1-second retry. These
controls are process-local and therefore not authoritative across multiple API
instances. Production must enforce a shared/edge rate limit; the frontend must
still honor any API `Retry-After` response.

### Frontend edge cases and verification

- Prevent double submit: two successful requests create two independent
  sessions.
- Never log, persist in analytics, or display `password`, `accessToken`, or
  `refreshToken`.
- Treat all 401 login failures identically; account discovery is intentionally
  unavailable.
- Route/schema/use case: `presentation/http/routers/auth.py`,
  `schemas/auth.py`, `application/use_cases/auth/login.py`. Error/rate limiting:
  `presentation/http/errors.py`, `dependencies.py`.
- Contract: `tests/contract/test_auth_login_api.py`. OpenAPI operation ID:
  `login_admin`.

## Endpoint: Get current admin

### Overview and request

| Item | Value |
|---|---|
| Method/path | `GET /api/v1/auth/me` |
| Purpose/caller | Restore/validate the current admin identity |
| Auth/permission | `Authorization: Bearer <accessToken>`; any active admin role |
| Side effects | None; account is reloaded from PostgreSQL |
| Idempotency/cache | Safe and idempotent; no explicit cache headers are set |

There are no path/query parameters or request body. `X-Request-ID` is optional.

### Success — 200

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "email": "admin@example.com",
  "fullName": "Admin User",
  "role": "support_agent",
  "isActive": true,
  "createdAt": "2026-08-27T10:00:00Z",
  "lastLoginAt": "2026-08-28T10:00:00Z"
}
```

All fields use the same types, nullability, and role enum documented for the
login `user` object. The response is the user object itself, not `{user: ...}`.
`X-Request-ID` is always present.

### Errors

| HTTP/code | Exact trigger | Retry/frontend action |
|---|---|---|
| 401 / `authentication_required` | Authorization header is missing or does not contain Bearer credentials | If a token is expected, attach it; otherwise show login |
| 401 / `invalid_access_token` | JWT malformed, wrong signature/type/issuer/audience/claims, expired, unknown user, or inactive user | Attempt one refresh only when local refresh state exists; otherwise clear session |
| 500 / `internal_server_error` | Unexpected server/database failure | Retry GET with bounded backoff; report `requestId` |

Exact missing-header response, with `WWW-Authenticate: Bearer`:

```json
{
  "error": {
    "code": "authentication_required",
    "message": "Authentication is required.",
    "details": {},
    "requestId": "req-me-missing-1"
  }
}
```

Exact invalid/inactive token response, also with `WWW-Authenticate: Bearer`:

```json
{
  "error": {
    "code": "invalid_access_token",
    "message": "The access token is invalid or expired.",
    "details": {},
    "requestId": "req-me-invalid-1"
  }
}
```

The exact 500 shape appears in the shared error section.

Route/dependency/use case: `presentation/http/routers/auth.py`,
`presentation/http/dependencies.py`,
`application/use_cases/auth/get_current_user.py`. Contract:
`tests/contract/test_auth_session_api.py`. OpenAPI operation ID:
`get_current_admin`.

## Endpoint: Refresh admin session

### Overview

| Item | Value |
|---|---|
| Method/path | `POST /api/v1/auth/refresh` |
| Purpose/caller | Rotate one active refresh session and issue a new token pair |
| Auth/permission | No access-token header; possession of a valid active refresh token |
| Side effects | Locks old session, creates replacement, revokes old token; replay can revoke family |
| Idempotency/cache | Non-idempotent and one-time-use; never submit the same token concurrently; no cache headers |

### Request

`Content-Type: application/json` is required and `X-Request-ID` is optional.
There are no path or query parameters.

```json
{"refreshToken": "JxU7LZB8m9y0D3eF2gH4kN6pQ1rS5tV8wXcA7bE9fGk"}
```

| Field | Type | Required | Nullable | Constraints | Meaning |
|---|---|---:|---:|---|---|
| `refreshToken` | string | Yes | No | 32–512 characters | Current opaque refresh token |

Unknown fields are forbidden.

### Success — 200

The response shape and field table are exactly `LoginResponse`, documented in
the login success section. Example:

```json
{
  "user": {
    "id": "11111111-1111-1111-1111-111111111111",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "support_agent",
    "isActive": true,
    "createdAt": "2026-08-27T10:00:00Z",
    "lastLoginAt": "2026-08-28T10:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new.signature",
  "refreshToken": "d9Rk1Lx7Qv3wT2cB6nM8sP4aH5jF0gE7uYzN1iO6CqA",
  "accessTokenExpiresAt": "2026-08-28T10:15:00Z",
  "refreshTokenExpiresAt": "2026-09-04T10:00:00Z"
}
```

`X-Request-ID` is always present. Replace both tokens before releasing any
queued API requests. The new refresh expiry cannot exceed the original family
expiry, so it may be less than 7/30 days from this refresh.

### Errors

| HTTP/code | Exact trigger | Retry/frontend action |
|---|---|---|
| 401 / `invalid_refresh_token` | Token digest not found, token expired/revoked, rotated-token replay, family expired, user missing, or user inactive | Do not retry; clear all local auth state and require login |
| 422 / `validation_error` | Missing/null/wrong-type token, length outside 32–512, or unknown field | Correct request; never truncate/pad a token |
| 429 / `rate_limited` | Per-client-IP refresh limit exceeded | Wait `Retry-After`; retry once with the same still-unconsumed token |
| 500 / `internal_server_error` | Unexpected server/database failure | Do not automatically reuse the token because rotation commit state is unknown; clear/re-authenticate or reconcile explicitly |

Exact 401 response:

```json
{
  "error": {
    "code": "invalid_refresh_token",
    "message": "The refresh token is invalid or expired.",
    "details": {},
    "requestId": "req-refresh-invalid-1"
  }
}
```

This 401 does not include `WWW-Authenticate`. The exact 422, 429, and 500
shapes appear in the shared error section. The default refresh limit is 20
attempts per client IP per 60-second fixed window. It is process-local, so a
shared/edge limiter remains required for authoritative multi-instance control.

Route/schema/use case: `presentation/http/routers/auth.py`,
`schemas/auth.py`, `application/use_cases/auth/refresh_session.py`. Contract:
`tests/contract/test_auth_session_api.py`; replay behavior:
`tests/application/test_login.py`. OpenAPI operation ID:
`refresh_admin_session`.

## Endpoint: Logout admin

### Overview

| Item | Value |
|---|---|
| Method/path | `POST /api/v1/auth/logout` |
| Purpose/caller | Revoke a refresh token owned by the authenticated admin |
| Auth/permission | Valid `Authorization: Bearer <accessToken>`; any active admin role |
| Side effects | Revokes matching owned active refresh session and appends logout audit; otherwise no database change |
| Idempotency/cache | Idempotent with respect to refresh-token existence/state; no cache headers |

### Request

Headers `Content-Type: application/json` and
`Authorization: Bearer <accessToken>` are required. `X-Request-ID` is optional.
There are no path or query parameters.

```json
{"refreshToken": "d9Rk1Lx7Qv3wT2cB6nM8sP4aH5jF0gE7uYzN1iO6CqA"}
```

| Field | Type | Required | Nullable | Constraints | Meaning |
|---|---|---:|---:|---|---|
| `refreshToken` | string | Yes | No | 32–512 characters | Refresh token to revoke if it belongs to the bearer user |

Unknown fields are forbidden. A well-formed token that is unknown, already
revoked, or owned by another user is deliberately not distinguished.

### Success — 204

The body is empty. `X-Request-ID` is always present. There is no JSON success
envelope. The same authenticated request may be repeated and still returns 204.

### Errors

| HTTP/code | Exact trigger | Retry/frontend action |
|---|---|---|
| 401 / `authentication_required` | Bearer credentials missing | Clear local session or attach access token; do not expose logout as failed to user |
| 401 / `invalid_access_token` | Access JWT invalid/expired or persisted account missing/inactive | Clear local session; refresh solely to call logout is not required |
| 422 / `validation_error` | Missing/null/wrong-type token, length outside 32–512, or unknown field | Correct body if server revocation is still desired |
| 500 / `internal_server_error` | Unexpected server/database failure | Clear local state; server revocation is uncertain, so do not treat as confirmed |

Use the exact `authentication_required` and `invalid_access_token` examples from
`/auth/me`, and the exact shared 422 and 500 examples. Both 401 access errors
include `WWW-Authenticate: Bearer`.

Route/schema/use case: `presentation/http/routers/auth.py`,
`schemas/auth.py`, `application/use_cases/auth/logout.py`. Contract:
`tests/contract/test_auth_session_api.py`. OpenAPI operation ID: `logout_admin`.

## Pagination convention and endpoint availability

Sprint 01 implements a shared pagination primitive but exposes no collection
endpoint. Do not call a pagination URL yet and do not assume an items wrapper.
When a later endpoint adopts this primitive, its input contract is:

| Query | Type | Required | Default | Constraints/interactions |
|---|---|---:|---:|---|
| `page` | integer | No | 1 | Minimum 1; one-based |
| `limit` | integer | No | 20 | 1–100; legacy alias for page size |
| `pageSize` | integer | No | 20 | 1–100; frontend alias for page size |

If both `limit` and `pageSize` are supplied, they must be equal or validation
fails. Shared response metadata fields are `page`, `pageSize`, `total`, and
`totalPages`; empty results use `totalPages: 0`. The concrete collection
wrapper, filtering, sorting, and item order must be documented by each future
endpoint because Sprint 01 defines none.

## Compatibility and integration notes

| Consumer-visible change | Previous planning/example | Implemented contract | Frontend action |
|---|---|---|---|
| Error correlation field | Some older examples used `trace_id` | `requestId` in JSON and `X-Request-ID` header | Generate types from current OpenAPI; branch on current fields only |
| Error codes | Some older code/examples used uppercase names | Stable lower-snake-case codes | Update error-code unions/mappers |
| Success envelope | Backlog did not freeze one | Direct typed response, no `data` wrapper | Deserialize exact endpoint model |
| Refresh behavior | Generic “new access token” wording | Both tokens rotate; fixed family expiry; replay revokes family | Serialize refresh calls and replace both values atomically |
| Health compatibility | New required aliases | `/health` and `/api/v1/health` plus retained `/live` and `/ready` | Use `/api/v1/health` for frontend readiness |

## Frontend integration checklist

- [ ] Configure environment base URL and default `/api/v1` prefix.
- [ ] Use JSON camelCase names exactly and reject assumptions about a `data` wrapper.
- [ ] Keep access and refresh values out of logs, URLs, analytics, and error reports.
- [ ] Serialize refresh operations and atomically replace both returned tokens.
- [ ] Handle `authentication_required`, `invalid_credentials`,
  `invalid_access_token`, `invalid_refresh_token`, `validation_error`,
  `rate_limited`, `dependency_unavailable`, and `internal_server_error` only on
  the endpoints where listed.
- [ ] Use `details.fields[].field` for validation mapping and `requestId` for
  support correlation.
- [ ] Honor `Retry-After`; do not assume process-local rate limits are globally authoritative.
- [ ] Treat logout 204 as an empty body and clear local auth state.
- [ ] Do not integrate future products, orders, staff, or other API-map paths yet.
- [ ] Refresh generated client types from the final OpenAPI schema.

## Backend evidence and known limitations

- Contract command run on 2026-08-28:
  `.\.venv\Scripts\python.exe -m pytest tests/contract/test_health_api.py tests/contract/test_auth_login_api.py tests/contract/test_auth_session_api.py tests/contract/test_error_contract.py tests/contract/test_pagination_contract.py`
  — **28 passed** in 0.94 seconds (one warning).
- Runtime OpenAPI comparison on 2026-08-28 confirmed all eight documented paths,
  operation IDs, Bearer security on `/auth/me` and `/auth/logout`, exact response
  status sets, camelCase request/response schemas, role enum, and error envelope.
- Source evidence: `src/shop_backend/presentation/http/routers/health.py`,
  `routers/auth.py`, `schemas/`, `errors.py`, `dependencies.py`, auth use cases,
  token/rate-limit adapters, and the contract tests referenced per endpoint.
- Real PostgreSQL migration/readiness integration could not be executed on this
  workstation because the Docker daemon/PostgreSQL service was unavailable.
  Readiness success/failure behavior is contract-tested with controlled probes,
  and migration SQL/offline checks are separate backend delivery evidence; this
  limitation means the handoff does not claim a live local PostgreSQL end-to-end run.
- Rate limiters are intentionally in-process. They are useful immediate abuse
controls but are not authoritative across multiple workers or instances;
production requires shared gateway/edge enforcement. The application keys its
IP limits from `request.client.host`; deployments behind a proxy may treat that
value as caller identity only when trusted-proxy forwarding is explicitly and
safely configured. Otherwise it represents the proxy rather than the browser.
