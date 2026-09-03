# Sprint 06 — Media & Operations Frontend API Handoff

## Document control

| Item | Value |
|---|---|
| Epic/PBIs | Epic 12 / PBI-12-01; Epic 13 / PBI-13-02, PBI-13-03 |
| API version | `/api/v1` |
| Document version/date | 1.0 / 2026-08-31 |
| OpenAPI source | Running application: `/openapi.json` |
| Migrations | `0010_media_assets_and_catalog_media`, `0011_development_reset_operations` |
| Verification | `339 passed`; coverage `90.28%`; Ruff, mypy and offline Alembic SQL passed |

## Environment and common protocol

Development normally uses `http://localhost:8000/api/v1`. Configure staging and production hostnames outside the client and append `/api/v1`.

Protected endpoints use `Authorization: Bearer <access-token>`. Access tokens expire according to `SHOP_ACCESS_TOKEN_TTL_MINUTES` (default 15 minutes); refresh tokens are rotated by `POST /auth/refresh`. `super_admin` and `inventory_manager` may use generic media upload. Any authenticated administrator may change only their own avatar. Development reset requires `super_admin`. Missing credentials return `401 authentication_required`; invalid or expired access tokens return `401 invalid_access_token`; both include `WWW-Authenticate: Bearer`.

All JSON bodies use `Content-Type: application/json`; upload bodies use `multipart/form-data` and the browser must set its boundary. `X-Request-ID` is optional on every request: it must match `[A-Za-z0-9._:-]{1,128}`. A valid supplied value, or a server-generated value, is returned as `X-Request-ID` in every response. IDs are UUID strings and timestamps are ISO-8601 UTC strings. Decimal product prices remain JSON strings.

### Browser security and CORS

Every HTTP response, including public `/openapi.json` and static local media responses, has these response headers:

| Header | Exact value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` |

No Content-Security-Policy header is emitted. Do not implement client logic that assumes CSP is present.

CORS is enabled only for configured explicit HTTP(S) origins. Wildcard origins are rejected by server configuration; production will not start without at least one `SHOP_CORS_ALLOWED_ORIGINS` entry. Credentials are not allowed (`Access-Control-Allow-Credentials` is absent). Configured origins can send `Authorization`, `Content-Type`, `X-Request-ID`, and `Idempotency-Key`; the browser can read `X-Request-ID`. Unconfigured origins receive no `Access-Control-Allow-Origin` response header.

### Public error envelope

All application errors use this exact envelope:

```json
{
  "error": {
    "code": "validation_error",
    "message": "The request is invalid.",
    "details": {
      "fields": [{"field": "header.Idempotency-Key", "reason": "missing"}]
    },
    "requestId": "frontend-6-01"
  }
}
```

`error.code` is the stable branch key. `error.message` is safe display text. `error.details` is always an object; for `validation_error`, `details.fields` is an array of `{field, reason}`. `error.requestId` equals `X-Request-ID` and must be retained for support.

| HTTP | Code | Meaning |
|---:|---|---|
| 401 | `authentication_required` | No Bearer token; response includes `WWW-Authenticate: Bearer`. |
| 401 | `invalid_access_token` | Token is invalid, expired, or identifies an inactive account; response includes `WWW-Authenticate: Bearer`. |
| 403 | `forbidden` | Authenticated role or environment is not authorized. |
| 409 | `conflict` | Current resource state rejects the operation; `details` gives `resource` and `reason`. |
| 422 | `validation_error` | Missing/invalid field, header, UUID, enum, or schema constraint. |
| 422 | `http_error` | Uploaded bytes are empty, exceed the limit, or are not a supported image signature. `details` is `{}`. |
| 429 | `rate_limited` | Login/refresh abuse limit or login concurrency limit was reached; includes `Retry-After` and `details.retryAfterSeconds`. |
| 500 | `internal_server_error` | Unexpected failure. Show a safe fallback; do not retry a mutation automatically. |

## Frontend flow: product image

1. Select a file, then call `POST /media/upload` with `kind=product`.
2. Store returned `id` as the product form's `imageMediaId`; use returned `url` only for preview.
3. Submit `imageMediaId` to `POST /products` or `PATCH /products/{productId}`.
4. Render returned `image` as the resolved image URL and retain `imageMediaId` for later edits.
5. If upload returns `422 http_error`, ask for a JPEG, PNG, or WebP file no larger than 5 MiB. Do not retry the same invalid file.

## Endpoint: upload media

### `POST /media/upload`

| Item | Value |
|---|---|
| Purpose | Persist a product, homepage, or store-logo image and return its UUID-backed stable URL. |
| Auth/permission | Bearer token; `super_admin` or `inventory_manager` (`media.upload`). `support_agent` receives `403 forbidden`. |
| Side effects | Writes the image to configured storage and creates a media-asset record. |
| Idempotency | No idempotency key. Disable duplicate file-submit controls. |
| Cache | Do not cache the mutation response; returned URL is stable for the persisted asset. |

Send multipart fields:

| Field | Type | Required | Constraints | Example |
|---|---|---:|---|---|
| `kind` | string | Yes | Exactly `product`, `homepage`, or `store_logo`. `avatar` is not accepted here. | `product` |
| `file` | binary file | Yes | Content bytes must identify as JPEG, PNG, or WebP. The filename and supplied MIME type are not trusted. 1 byte through 5 MiB inclusive. | `keyboard.webp` |

Success is `201 Created`:

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "kind": "product",
  "url": "/media/product/11111111-1111-1111-1111-111111111111.png",
  "contentType": "image/png",
  "byteSize": 12,
  "createdAt": "2026-08-31T00:00:00Z"
}
```

| Response field | Type | Meaning |
|---|---|---|
| `id` | UUID | Persisted media ID; submit this as `imageMediaId` for a product. |
| `kind` | string | Stored kind; equals the submitted kind. |
| `url` | string | Stable public URL. It is relative for default local storage and can be absolute for S3/CDN storage. Resolve relative URLs against the API origin. |
| `contentType` | string | Detected, not client-declared, MIME type: `image/jpeg`, `image/png`, or `image/webp`. |
| `byteSize` | integer | Detected file size in bytes. |
| `createdAt` | ISO-8601 UTC datetime | Asset creation time. |

Reachable errors:

| HTTP | Code | Exact trigger | Frontend action |
|---:|---|---|---|
| 401 | `authentication_required` or `invalid_access_token` | Missing or unusable Bearer token. | Refresh/sign in, then select the file again. |
| 403 | `forbidden` | Role lacks `media.upload`. | Hide generic uploader for `support_agent`. |
| 422 | `validation_error` | Missing `kind`/`file`, invalid kind, or malformed multipart request. | Map `details.fields` to the form. |
| 422 | `http_error` | Empty/over-5-MiB file, or content signature is not JPEG/PNG/WebP. | Reject the file; choose a compliant image. |
| 500 | `internal_server_error` | Storage/persistence failure not otherwise mapped. | Preserve the selected file locally and offer explicit retry. |

The API does not expose a delete operation or a signed-upload workflow. Do not send external image URLs in this endpoint.

## Endpoint: change the current administrator avatar

### `PATCH /auth/me/avatar`

| Item | Value |
|---|---|
| Purpose | Upload an avatar and set it for the currently authenticated administrator. |
| Auth/permission | Any authenticated active administrator; ownership is always the token subject. |
| Side effects | Creates a media asset and atomically updates the caller's `avatarUrl`. No other user can be targeted. |
| Idempotency | No idempotency key; disable duplicate submits. |

Send `multipart/form-data` with one required `file` field. It has the same byte inspection and 1 byte–5 MiB JPEG/PNG/WebP constraints as generic media upload. There is no `kind` field.

Success is `200 OK`:

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "email": "inventory@example.com",
  "fullName": "Inventory",
  "role": "support_agent",
  "isActive": true,
  "createdAt": "2026-08-31T00:00:00Z",
  "lastLoginAt": null,
  "avatarUrl": "/media/avatar/22222222-2222-2222-2222-222222222222.webp"
}
```

`lastLoginAt` and `avatarUrl` are nullable; this successful endpoint always supplies the newly stored non-null `avatarUrl`. Update the local authenticated-user state from the returned complete user object.

| HTTP | Code | Exact trigger | Frontend action |
|---:|---|---|---|
| 401 | `authentication_required` or `invalid_access_token` | Missing or unusable Bearer token. | Refresh/sign in. |
| 422 | `validation_error` | Missing file or malformed multipart request. | Correct the form. |
| 422 | `http_error` | Empty/over-5-MiB file, or unsupported image content. | Ask for a compliant image. |
| 500 | `internal_server_error` | Storage/persistence failure not otherwise mapped. | Keep the old avatar and offer explicit retry. |

## Product API compatibility change

The only changed product request field is the image reference. `POST /products` (`create_product`) and `PATCH /products/{product_id}` (`update_product`) use the existing Bearer authentication and catalog permissions, and now accept `imageMediaId`.

| Endpoint | Request change | Response change | Frontend action |
|---|---|---|---|
| `POST /products` | Required `imageMediaId`: UUID from `POST /media/upload`; direct `image` input is not accepted. | Returns `imageMediaId` (UUID or null) and `image` (resolved URL string). | Upload first; send returned ID. |
| `PATCH /products/{productId}` | Optional `imageMediaId`: UUID. Omit to retain the current image; a supplied value replaces it. Direct `image` input is not accepted. | Returns the same `imageMediaId` and resolved `image`. | Use the existing returned ID unless the user selected and uploaded a replacement. |

Create example (only relevant fields shown):

```json
{
  "title": "Mechanical Keyboard",
  "sku": "KB-1",
  "category": "33333333-3333-3333-3333-333333333333",
  "price": "99.99",
  "imageMediaId": "11111111-1111-1111-1111-111111111111",
  "variants": []
}
```

Product responses retain the legacy-compatible `image` URL so current rendering code can continue to use it:

```json
{
  "id": "44444444-4444-4444-4444-444444444444",
  "image": "/media/product/11111111-1111-1111-1111-111111111111.png",
  "imageMediaId": "11111111-1111-1111-1111-111111111111"
}
```

If the supplied asset ID is missing or inactive, product create/update returns `409 conflict` with `details: {"resource":"media","reason":"missing_or_inactive"}`. Preserve the rest of the product form, prompt for a new upload, then resubmit. Existing product conflicts, permissions, response fields, and variant replacement semantics remain documented in the Sprint 02 handoff.

## Endpoint: reset development data

### `POST /settings/reset-dev-data`

| Item | Value |
|---|---|
| Purpose | Remove mock business data in local/test environments only. This is an internal development tool, not a storefront/admin production feature. |
| Auth/permission | Bearer token, `super_admin`, and server environment exactly `local` or `test`. |
| Side effects | Deletes mock business data transactionally; preserves admin identities, refresh sessions, immutable audit logs, and previously recorded reset keys. |
| Idempotency | Required per administrator/key. Repeating the same key is a successful `204` and does not reset again. |

Required headers:

| Header | Required | Constraints | Exact example |
|---|---:|---|---|
| `Authorization` | Yes | Valid Bearer access token for a super admin. | `Bearer <access-token>` |
| `X-Confirm-Reset` | Yes | Exact literal `development-data`. | `development-data` |
| `Idempotency-Key` | Yes | 1–128 characters. | `reset-sprint-06-001` |

There is no body. Success is `204 No Content` with an empty response body.

| HTTP | Code | Exact trigger | Frontend action |
|---:|---|---|---|
| 401 | `authentication_required` or `invalid_access_token` | Missing or unusable token. | Refresh/sign in. |
| 403 | `forbidden` | Caller is not a super admin, or environment is staging/production. | Do not expose the action outside local/test. |
| 422 | `validation_error` | Missing/empty/overlong `Idempotency-Key` or missing headers. | Correct headers. |
| 422 | `http_error` | `X-Confirm-Reset` is present but is not exactly `development-data`. | Require the exact confirmation text. |
| 500 | `internal_server_error` | Unexpected reset failure. | Refresh the UI before a manually chosen retry with a new key. |

On the first successful reset, invalidate all client caches for catalog, inventory, orders, customers, reviews, tickets, coupons, homepage, shipping, media and settings. Do not assume a previously displayed media URL still exists after reset.

## Login and refresh rate-limit overlay

`POST /auth/login` and `POST /auth/refresh` keep their existing request/success schemas from the Sprint 01 handoff. They now can return:

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Too many attempts. Try again later.",
    "details": {"retryAfterSeconds": 60},
    "requestId": "login-6-01"
  }
}
```

This is `429 Too Many Requests` with `Retry-After: 60`. Login is limited by client IP and a SHA-256 digest of normalized email, and additionally by in-process login concurrency. Refresh is limited by client IP. The deployed limiter is process-local; do not infer a global cross-replica quota from this response. Disable the relevant form until `Retry-After` seconds elapse; do not spin or retry automatically.

## Storage and deployment notes

In `local` and `test`, default storage writes under `SHOP_MEDIA_LOCAL_ROOT` (default `var/media`) and returns URLs under `SHOP_MEDIA_PUBLIC_BASE_URL` (default `/media`), served by the application. In `staging` and `production`, `SHOP_MEDIA_STORAGE` must be `s3`; startup requires `SHOP_MEDIA_S3_BUCKET` and `SHOP_MEDIA_S3_PUBLIC_BASE_URL` (HTTP(S)). Optional `SHOP_MEDIA_S3_ENDPOINT_URL` and `SHOP_MEDIA_S3_REGION` select a compatible provider. The deployment/runtime supplies credentials and pre-provisions the bucket; the application does not create buckets. The API always returns a public stable URL, not a signed URL.

## Seed CLI (developer operation; no browser endpoint)

Run `shop-backend seed-dev-data` only with `SHOP_ENVIRONMENT=local` or `test`. It is idempotent: if a category already exists it leaves data unchanged. It seeds store settings, one `sample-products` category, one `DEV-SAMPLE-001` product, and one `DEV-SAMPLE-001-RED` variant. It creates no administrator or credentials and prints no secrets. In staging/production it is denied by the environment gate.

## Frontend integration checklist

- [ ] Upload images before creating/updating a product and store `imageMediaId`, not an external URL.
- [ ] Resolve a relative returned media `url`/product `image` against the API origin.
- [ ] Render `image`/`avatarUrl` only after checking the returned URL; retain IDs for mutations.
- [ ] Surface `422 http_error` as a file-selection error and use `error.code`, not text, for branching.
- [ ] Send and retain `X-Request-ID` for support; respect `429 Retry-After` on login/refresh.
- [ ] Expose reset only in local/test tooling, require the exact confirmation, generate a fresh idempotency key for a deliberately new reset, and invalidate listed caches on `204`.
- [ ] Configure the browser application to call only an allowed CORS origin and not require cookies/credentialed CORS.

## Verification references

- Routes/schemas: `src/shop_backend/presentation/http/routers/media.py`, `routers/auth.py`, `routers/development.py`, `schemas/media.py`, `schemas/catalog.py`, `schemas/auth.py`.
- Error/auth/security middleware: `presentation/http/errors.py`, `dependencies.py`, `middleware/request_id.py`, `middleware/security_headers.py`.
- Contract tests: `tests/contract/test_media_api.py`, `test_development_api.py`, `test_cors.py`, `test_catalog_api.py`.
- Application/unit tests: `tests/application/test_media.py`, `tests/unit/test_development.py`, `test_storage.py`, `test_settings.py`, `test_cli.py`.
