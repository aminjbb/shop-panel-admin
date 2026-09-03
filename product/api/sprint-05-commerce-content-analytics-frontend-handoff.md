# Sprint 05 — Commerce, Content & Analytics Frontend API Handoff

## Document control

| Item | Value |
| --- | --- |
| Epic/PBIs | Epic 07 (PBI-07-01..04), Epic 09 (PBI-09-01..04), Epic 11 (PBI-11-01..02) |
| API version | `/api/v1` |
| Document version/date | 1.0 / 2026-08-30 |
| Migration | `0009_commerce_content_analytics` |
| Verification | `319 passed`, coverage `90.54%`; Ruff and mypy passed; offline Alembic upgrade/downgrade SQL passed |
| OpenAPI operations | `list_coupons`, `get_coupon`, `create_coupon`, `update_coupon`, `toggle_coupon_status`, `archive_coupon`, `validate_coupon`, `list_homepage_sections`, `homepage_stats`, `create_homepage_section`, `reorder_homepage_sections`, `update_homepage_section`, `toggle_homepage_section`, `archive_homepage_section`, `publish_homepage`, `get_storefront_homepage`, `analytics_dashboard` |

## Environment and common protocol

Local base URL is `http://localhost:8000/api/v1`; staging and production hosts are deployment configuration. IDs are UUID strings. Timestamps are ISO-8601 timestamps with an offset. `Decimal` values are JSON strings, for example `"12.00"`. Unknown JSON body fields are rejected. Responses echo a valid `X-Request-ID`, or generate one; callers may provide 1–128 characters matching `[A-Za-z0-9._:-]`.

Private endpoints require `Authorization: Bearer <access-token>`. Access tokens come from Sprint 01 login and are normally short-lived; refresh through `POST /auth/refresh`. `super_admin` has all listed permissions. `inventory_manager` has `coupon.read`, `homepage.read`, and `analytics.read`, but no coupon/homepage writes. `support_agent` has none of the Sprint 05 private permissions. The coupon-preview and storefront endpoints are public.

There is no idempotency key or optimistic-concurrency version for Sprint 05. Disable duplicate mutation submits; on timeout, refetch before retrying because a mutation may already have succeeded.

### Error envelope

All handled errors use this exact shape, and `error.requestId` equals response header `X-Request-ID`.

```json
{"error":{"code":"conflict","message":"The request conflicts with current state.","details":{"resource":"coupon","reason":"code_taken"},"requestId":"commerce-42"}}
```

| HTTP | Code | Details | Client action |
| ---: | --- | --- | --- |
| 401 | `authentication_required` | `{}`; `WWW-Authenticate: Bearer` | Authenticate. |
| 401 | `invalid_access_token` | `{}`; `WWW-Authenticate: Bearer` | Refresh once, then authenticate. |
| 403 | `forbidden` | `{}` | Do not retry; hide forbidden control. |
| 404 | `resource_not_found` | `{"resource":"coupon|homepage_section|published_homepage"}` | Remove/refetch stale state. |
| 409 | `conflict` | `{"resource":string,"reason":string}` | Branch on `reason` listed below. |
| 422 | `validation_error` | `{"fields":[{"field":"body.value","reason":"decimal_max_digits"}]}` | Correct the named field. |
| 500 | `internal_server_error` | `{}` | Safe fallback; retain request ID. Do not auto-retry a mutation. |

## Shared objects

`Coupon`:

```json
{"id":"11111111-1111-1111-1111-111111111111","code":"SUMMER10","type":"percentage","value":"10.00","minOrderValue":"100.00","usageLimit":3,"usedCount":1,"status":"active","startDate":"2026-08-29T00:00:00Z","endDate":"2026-09-01T00:00:00Z","categoryIds":[],"createdAt":"2026-08-30T00:00:00Z","updatedAt":"2026-08-30T00:00:00Z"}
```

`type` is `percentage|fixed`; `status` is `active|disabled|expired`; `minOrderValue` and `usageLimit` may be `null`; all other fields are present and non-null. Coupon values have at most 14 digits and 2 fractional digits.

`HomepageSection`:

```json
{"id":"22222222-2222-2222-2222-222222222222","type":"banner_grid_2","title":"Sale","config":{"banners":[{"imageUrl":"https://cdn.example.test/a.png"},{"imageUrl":"https://cdn.example.test/b.png"}]},"displayOrder":0,"isActive":true,"createdAt":"2026-08-30T00:00:00Z","updatedAt":"2026-08-30T00:00:00Z"}
```

`type` is `hero|banner_grid_2|banner_grid_3|product_carousel|rich_text`; `title` may be `null`; `config` is a JSON object; `displayOrder` is an integer >= 0; timestamps and ID are non-null.

## Coupons

### `GET /coupons` — list_coupons

Permission `coupon.read` (`super_admin`, `inventory_manager`). Query: `search` optional string (case-insensitive code substring), `status` optional `active|disabled|expired`, `type` optional `percentage|fixed`, `page` integer default 1/minimum 1, `limit` integer default 20/range 1–100, `sortBy` `createdAt|code|endDate` default `createdAt`, and `sortOrder` `asc|desc` default `desc`. Filters precede paging. Archived coupons never appear. If a listed coupon has passed `endDate`, the server changes it to `expired` before returning it.

```json
{"coupons":[{"id":"11111111-1111-1111-1111-111111111111","code":"SUMMER10","type":"percentage","value":"10.00","minOrderValue":"100.00","usageLimit":3,"usedCount":1,"status":"active","startDate":"2026-08-29T00:00:00Z","endDate":"2026-09-01T00:00:00Z","categoryIds":[],"createdAt":"2026-08-30T00:00:00Z","updatedAt":"2026-08-30T00:00:00Z"}],"totalCount":1,"page":1,"limit":20}
```

Success `200`. An out-of-range page returns `coupons: []` and unchanged metadata. Errors: `401`, `403`, `422` (invalid enum/page/limit), `500`.

### `GET /coupons/{id}` — get_coupon

Permission `coupon.read`; path `id` is UUID. Success `200 Coupon`. Errors: `401`, `403`, `404` (`resource:"coupon"`, including archived coupons), `422` (bad UUID), `500`.

### `POST /coupons` — create_coupon

Permission `coupon.write` (`super_admin` only). Required JSON body:

```json
{"code":" summer10 ","type":"percentage","value":"10.00","minOrderValue":"100.00","usageLimit":3,"startDate":"2026-08-29T00:00:00Z","endDate":"2026-09-01T00:00:00Z","categoryIds":[]}
```

`code` is 1–64 chars and is stored trimmed and uppercase; `value` is > 0 with at most 14/2 digits; percentage value must also be 1–100; `minOrderValue` is nullable, >= 0; `usageLimit` is nullable, >= 1; dates are required and `startDate < endDate`; `categoryIds` defaults to `[]`, maximum 100 UUIDs. Success `201 Coupon` (same shape above), initially `usedCount:0` and `status:"active"`. Errors: `401`, `403`, `422`, `409` reasons `code_taken|percentage_range|invalid_dates_or_value|usage_limit_below_used_count`, `500`.

### `PATCH /coupons/{id}` — update_coupon

Permission `coupon.write`; `id` UUID. Body is partial: omitted fields retain stored values. `minOrderValue` and `usageLimit` may explicitly be `null`; every other supplied field must be non-null and obey the POST constraints. Example:

```json
{"code":" autumn10 ","minOrderValue":null}
```

Success `200 Coupon`; `usedCount`, creation time, status and omitted values are preserved. Errors: `401`, `403`, `404 resource_not_found` `resource:"coupon"`, `422`, the same coupon `409` reasons as POST, and `500`.

### `PATCH /coupons/{id}/toggle-status` — toggle_coupon_status

Permission `coupon.write`; no body. Toggles `active ↔ disabled` and returns `200 Coupon`. If the coupon has reached/passed `endDate`, status is synchronized then the endpoint returns `409 conflict` with `{"resource":"coupon","reason":"expired_requires_date_extension"}`; update `endDate` first. Errors: `401`, `403`, `404 coupon`, `422`, `409`, `500`. It is a toggle, not idempotent.

### `DELETE /coupons/{id}` — archive_coupon

Permission `coupon.write`; no body. Success `204` with empty body; soft-archives the coupon. Later detail/update/toggle/archive returns `404 coupon`. Errors: `401`, `403`, `404`, `422`, `500`.

### `POST /coupons/validate` — validate_coupon

Public; no Authorization. Required body:

```json
{"code":"SUMMER10","customerId":"33333333-3333-3333-3333-333333333333","cartTotal":"120.00","categoryIds":[]}
```

`code` is 1–64 chars and matched trimmed/uppercase; `customerId` UUID; `cartTotal` decimal >= 0 with at most 14/2 digits; `categoryIds` default `[]`, max 100. Success `200`:

```json
{"couponId":"11111111-1111-1111-1111-111111111111","code":"SUMMER10","discountAmount":"12.00","finalTotal":"108.00"}
```

It is a preview only: it neither creates a redemption nor increments `usedCount`; checkout must revalidate and consume atomically in its future owning workflow. Errors: `422`; `404 coupon`; `409 conflict` with reasons `customer_inactive|not_active|usage_limit_reached|minimum_order_value|category_not_eligible`; `500`.

## Homepage administration

All endpoints in this section use `Authorization`. `GET` endpoints require `homepage.read` (`super_admin`, `inventory_manager`); mutations require `homepage.write` (`super_admin` only).

### `GET /homepage/sections` — list_homepage_sections

Success `200` returns a bare array of `HomepageSection` objects, excluding archived items, ordered ascending by `displayOrder` then ID. Example: `[ {"id":"22222222-2222-2222-2222-222222222222","type":"rich_text","title":"Welcome","config":{},"displayOrder":0,"isActive":true,"createdAt":"2026-08-30T00:00:00Z","updatedAt":"2026-08-30T00:00:00Z"} ]`. Errors: `401`, `403`, `500`.

### `GET /homepage/stats` — homepage_stats

Success `200`:

```json
{"totalSections":1,"activeSections":1,"totalBanners":2,"totalProductsLinked":0,"heroSlidesCount":0}
```

All fields are non-null integers computed from non-archived draft sections. `totalBanners` counts `config.banners`; `totalProductsLinked` counts `config.productIds`; `heroSlidesCount` counts `config.slides` only on `hero`. Errors: `401`, `403`, `500`.

### `POST /homepage/sections` — create_homepage_section

Required full body (also the body shape for update):

```json
{"type":"banner_grid_2","title":"Sale","displayOrder":0,"isActive":true,"config":{"banners":[{"imageUrl":"https://cdn.example.test/a.png"},{"imageUrl":"https://cdn.example.test/b.png"}]}}
```

`type`, `config` are required; `title` nullable/max 240; `displayOrder` defaults 0/minimum 0; `isActive` defaults true. For `banner_grid_2` config must contain exactly 2 `banners`; for `banner_grid_3`, exactly 3. Every supplied banner must be an object with `imageUrl` beginning `https://`. If `config.productIds` is non-empty, every UUID must refer to an active, non-archived product. Success `201 HomepageSection`. Errors: `401`, `403`, `422`, `409` reasons `invalid_banner_count|banner_url_must_be_https|product_not_active`, `500`.

### `PATCH /homepage/sections/{id}` — update_homepage_section

Path `id` UUID; requires the same **full** `SectionInput` body as POST (this is replacement, not partial PATCH). Success `200 HomepageSection`. Errors: `401`, `403`, `404 resource_not_found` `resource:"homepage_section"`, `422`, the three POST `409` reasons, `500`.

### `PATCH /homepage/sections/reorder` — reorder_homepage_sections

Required body:

```json
{"orderedIds":["22222222-2222-2222-2222-222222222222"]}
```

`orderedIds` is a non-empty UUID array. It must contain every current non-archived section exactly once (inactive sections are included). Success `204` empty body and assigns `displayOrder` from zero in supplied order. Error `409` reason `ordered_ids_must_match_active_sections` is the implementation's stable reason text for a mismatch/duplicate; plus `401`, `403`, `422`, `500`.

### `PATCH /homepage/sections/{id}/toggle-active` — toggle_homepage_section

Path `id` UUID, no body. Success `200 HomepageSection` with opposite `isActive`; this is non-idempotent. Errors: `401`, `403`, `404 homepage_section`, `422`, `500`.

### `DELETE /homepage/sections/{id}` — archive_homepage_section

Path `id` UUID, no body. Success `204` empty body. It soft-archives and normalizes remaining draft `displayOrder` values. It does not modify an already published snapshot. Errors: `401`, `403`, `404 homepage_section`, `422`, `500`.

### `POST /homepage/publish` — publish_homepage

No body. Success `200`:

```json
{"sections":[{"id":"22222222-2222-2222-2222-222222222222","type":"banner_grid_2","title":"Sale","config":{"banners":[{"imageUrl":"https://cdn.example.test/a.png"},{"imageUrl":"https://cdn.example.test/b.png"}]},"displayOrder":0}]}
```

The result contains only active, non-archived sections in current display order. It stores an immutable snapshot; later draft edits, toggles and archives do not change this response or storefront until another publish. Published section objects deliberately omit `isActive`, `createdAt`, and `updatedAt`. Errors: `401`, `403`, `500`.

## Public storefront

### `GET /storefront/homepage` — get_storefront_homepage

Public; no headers/query/body. Success `200` returns the exact latest published payload shown for publish. It never exposes draft-only fields. Before first publication it returns `404 resource_not_found` with `details:{"resource":"published_homepage"}`. Other reachable error: `500`. Cache must be invalidated/refetched after an admin publish; no cache header or ETag contract exists.

## Analytics

### `GET /analytics/dashboard` — analytics_dashboard

Permission `analytics.read` (`super_admin`, `inventory_manager`). Query `timeRange` is `7d|30d|90d|1y`, default `30d`; other values return `422`. The server computes a half-open current interval `[now-range, now)` and equal preceding interval. Only orders whose `paymentStatus` is `paid` contribute revenue (`paidAmount`) and order-based metrics. Time-bucket date labels use the configured store timezone, default `Asia/Tehran` (zone data is packaged via `tzdata`).

```json
{"timeRangeStart":"2026-07-31T00:00:00Z","timeRangeEnd":"2026-08-30T00:00:00Z","timezone":"Asia/Tehran","kpis":{"totalRevenue":{"value":"120.00","formattedValue":"120.00","changePercentage":"0.00","isPositive":true,"comparisonLabel":"previous period"},"totalOrdersCount":{"value":1,"formattedValue":"1","changePercentage":"0.00","isPositive":true,"comparisonLabel":"previous period"},"averageOrderValue":{"value":"120.00","formattedValue":"120.00","changePercentage":"0.00","isPositive":true,"comparisonLabel":"previous period"},"newCustomersCount":{"value":0,"formattedValue":"0","changePercentage":"0.00","isPositive":true,"comparisonLabel":"previous period"}},"salesTrend":[{"date":"2026-08-29","revenue":"120.00"}],"categorySalesShare":[{"category":"Uncategorized","revenue":"120.00","percentage":"100.00"}],"recentOrdersSnippet":[{"id":"44444444-4444-4444-4444-444444444444","orderNumber":"ORD-000001","paidAmount":"120.00","createdAt":"2026-08-29T00:00:00Z"}],"topCustomersSnippet":[{"name":"Ada Customer","paidAmount":"120.00"}],"activeCustomerCount":1}
```

Every KPI has decimal-or-integer `value`, string `formattedValue`, decimal `changePercentage` (two places), boolean `isPositive`, and `comparisonLabel:"previous period"`; when prior value is zero, change is `0.00`. `salesTrend` is date ascending; `recentOrdersSnippet` and `topCustomersSnippet` are descending and capped at 5. Category names come from order item snapshots (`categoryName`, then `category`, otherwise `Uncategorized`), preserving historical classification when supplied. `newCustomersCount` counts customer records created in the current interval; `activeCustomerCount` is distinct customer IDs in current paid orders. Errors: `401`, `403`, `422`, `500`.

## Frontend integration checklist

1. Load private data only after a valid admin token; render write actions only for `super_admin`.
2. Use returned `totalCount`, `page`, and `limit` for coupon paging; lists have no total-page field.
3. Treat coupon validation as a UI quote, never as reservation or redemption.
4. On homepage reorder send the entire current draft section ID list, including inactive sections.
5. Publish explicitly after draft edits; invalidate storefront cache only after publish succeeds.
6. Display analytics decimal strings with the storefront's money formatter; use `timezone` and server date labels as returned.
7. For every error retain `error.requestId`; map `validation_error.details.fields` to the relevant form field.

## Verification references

- Final routes/operation IDs: `src/shop_backend/presentation/http/routers/commerce.py`.
- Input constraints: `src/shop_backend/presentation/http/schemas/commerce.py`.
- Authorization, business rules and side effects: `src/shop_backend/application/commerce.py`, `src/shop_backend/domain/identity/permissions.py`.
- Persistence/order/analytics calculations: `src/shop_backend/infrastructure/database/repositories/commerce.py`.
- Error contract: `src/shop_backend/presentation/http/errors.py`, `src/shop_backend/presentation/http/schemas/errors.py`.
- API regression coverage: `tests/contract/test_commerce_content_analytics_api.py`, `tests/application/test_commerce_service.py`, `tests/integration/test_commerce_crm_repositories.py`.
