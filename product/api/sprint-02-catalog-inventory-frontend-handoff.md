# Sprint 02 — Catalog & Inventory Frontend API Handoff

## Document control

| Item | Value |
|---|---|
| Epic/PBIs | Epic 03 / PBI-03-01…05; Epic 04 / PBI-04-01…04 |
| API version | `/api/v1` |
| Document version/date | 1.0 / 2026-08-29 |
| OpenAPI source | Running app: `/openapi.json`; operation IDs named below |
| Migrations | `0003_catalog_inventory`, `0004_inventory_idempotency_and_sku_registry` |

## Common protocol

Development base URL is `http://localhost:8000`; configure staging and production from the environment, then append `/api/v1`.

Every endpoint here needs `Authorization: Bearer <access-token>`. `super_admin` and `inventory_manager` have all catalog permissions used here; `support_agent` receives `403 forbidden`. Missing credentials return `401 authentication_required`; an invalid or expired access token returns `401 invalid_access_token` (both include `WWW-Authenticate: Bearer`). Token login/refresh behavior is unchanged from the Sprint 01 handoff.

All JSON requests use `Content-Type: application/json`. `X-Request-ID` is optional (1–128 characters matching `[A-Za-z0-9._:-]`); the service echoes a valid supplied value or generates one in every response. IDs are UUID strings, timestamps are ISO-8601 UTC strings, and decimals are JSON strings (for example `"99.99"`). JSON bodies reject unknown fields. Null is distinct from omission on PATCH: a provided nullable field replaces the old value; omitted fields are retained.

The public error body is always:

```json
{"error":{"code":"conflict","message":"The request conflicts with current state.","details":{"resource":"inventory","reason":"negative_stock"},"requestId":"catalog-req-42"}}
```

`code` is the stable branching value, `message` is safe display text, `details` is an object whose keys are listed per error below, and `requestId` matches `X-Request-ID`. Validation failures use `422 validation_error` and `details.fields`, an array of `{ "field": "body.price", "reason": "decimal_max_places" }`. Unexpected server failures use `500 internal_server_error` with empty `details`; show a safe fallback and retain the request ID for support.

### Shared success shapes

`Product` (returned by product create/read/update/stock and nested in a product list):

```json
{"id":"11111111-1111-1111-1111-111111111111","title":"Mechanical Keyboard","sku":"KB-1","category":"22222222-2222-2222-2222-222222222222","price":"99.99","image":"https://example.com/keyboard.jpg","description":"A keyboard","slug":"mechanical-keyboard","metaTitle":"Keyboard","metaDescription":"Compact keyboard","noIndex":false,"focusKeywords":["keyboard"],"variants":[{"id":"33333333-3333-3333-3333-333333333333","sku":"KB-1-BLK","name":"Black","stock":7}],"totalStock":7,"stockStatus":"low_stock","createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}
```

`totalStock` is the sum of all variant `stock`; `stockStatus` is `out_of_stock` at 0 or lower, `low_stock` from 1 through 10, otherwise `in_stock`.

`Category` (returned by category create/read/update/toggle, lists, tree, and options):

```json
{"id":"22222222-2222-2222-2222-222222222222","name":"Keyboards","slug":"keyboards","parentId":null,"isActive":true,"sortOrder":0,"attributes":[{"name":"Layout","type":"select","options":["ANSI","ISO"],"isRequired":true}],"createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}
```

Attribute `type` is exactly `text`, `number`, or `select`. `options` may be null for `text`/`number`; it must be a non-empty array for `select` (each option is a string; the route schema imposes no item-length restriction).

## Product endpoints

### GET `/products` — `list_products`

Permission: `product.read`. It has no side effect and returns `200`:

```json
{"products":[{"id":"11111111-1111-1111-1111-111111111111","title":"Mechanical Keyboard","sku":"KB-1","category":"22222222-2222-2222-2222-222222222222","price":"99.99","image":"https://example.com/keyboard.jpg","description":"A keyboard","slug":"mechanical-keyboard","metaTitle":"Keyboard","metaDescription":"Compact keyboard","noIndex":false,"focusKeywords":["keyboard"],"variants":[{"id":"33333333-3333-3333-3333-333333333333","sku":"KB-1-BLK","name":"Black","stock":7}],"totalStock":7,"stockStatus":"low_stock","createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}],"totalCount":3,"page":2,"pageSize":2,"totalPages":2,"activeFiltersCount":3}
```

| Query | Type/default | Constraints and semantics |
|---|---|---|
| `search` | string / omitted | 1–240 chars; case-insensitive partial search across product title, SKU, description, variant name and variant SKU. |
| `category` | UUID / omitted | Exact product category ID. |
| `stockStatus` | enum / omitted | `out_of_stock`, `low_stock`, `in_stock`; based on total variant stock. |
| `sortBy` | enum / `created_at_desc` | `created_at_desc`, `created_at_asc`, `title_asc`, `title_desc`, `price_asc`, `price_desc`, `stock_asc`, `stock_desc`. Ties are deterministically ordered by ID. |
| `page` | integer / `1` | At least 1. |
| `pageSize` | integer / `20` | 1–100. Empty page is `products: []`; `totalPages` is 0 when no products match. |

`activeFiltersCount` counts only supplied `search`, `category`, and `stockStatus`; sorting and pagination do not count. Reachable errors: `401 authentication_required|invalid_access_token`, `403 forbidden`, `422 validation_error` for invalid query values, and `500 internal_server_error`.

### GET `/products/{product_id}` — `get_product`

Permission: `product.read`; `product_id` is a UUID. Returns `200 Product`. Archived and nonexistent products return `404 resource_not_found` with `details: {"resource":"product"}`. Other reachable errors: common `401`, `403`, `422` (bad UUID), `500`.

### POST `/products` — `create_product`

Permission: `product.create`; creates a persistent product and returns `201 Product`. Request example:

```json
{"title":"Mechanical Keyboard","sku":"KB-1","category":"22222222-2222-2222-2222-222222222222","price":"99.99","image":"https://example.com/keyboard.jpg","description":"A keyboard","slug":"mechanical-keyboard","metaTitle":"Keyboard","metaDescription":"Compact keyboard","noIndex":false,"focusKeywords":["keyboard"],"variants":[{"sku":"KB-1-BLK","name":"Black","stock":7}]}
```

Required fields are `title` (1–240), `sku` (1–100), `category` (UUID), `price` (non-negative decimal, maximum 14 digits and 2 decimal places), and `image` (absolute HTTP(S) URL). `variants` defaults to `[]`; in that case the server creates `sku + "-default"`, name `Default`, stock `0`. Each supplied variant needs `sku` (1–100), `name` (1–160), non-negative `stock`, and may omit `id`. Optional `description` is nullable and at most 10,000 chars; `slug` is nullable and at most 160; `metaTitle` is nullable and at most 70; `metaDescription` is nullable and at most 160; `noIndex` defaults false; `focusKeywords` defaults `[]` and contains at most 20 strings.

`409 conflict` reasons are `inactive_or_missing` (`resource: category`), `sku_taken` or `variant_sku_taken` (`resource: product`), and `slug_taken` (`resource: product`). SKU ownership is globally unique across product and variant SKUs after trimming and upper-casing at persistence level: a canonical collision while reserving the product SKU produces `sku_taken`; a canonical collision while reserving a variant SKU produces `variant_sku_taken`. Also reachable: common `401`, `403`, `422`, `500`. This endpoint has no idempotency key; disable duplicate submits in the UI.

### PATCH `/products/{product_id}` — `update_product`

Permission: `product.update`; returns `200 Product`. The body accepts any non-empty subset of the POST fields (with the same constraints); `variants`, when supplied, replaces the full collection. Existing variants retained in that replacement must carry their current `id`; new ones omit `id`. Example: `{"title":"Mechanical Keyboard v2","variants":[{"id":"33333333-3333-3333-3333-333333333333","sku":"KB-1-BLK","name":"Black","stock":8}]}`.

It returns `404 resource_not_found` for the product. In addition to POST conflicts, `409 conflict` with `{ "resource":"product", "reason":"variant_has_inventory_history" }` prevents removing a variant that has inventory movements. There is no ETag/version precondition; refetch after a competing write. Other errors: common `401`, `403`, `422`, `500`.

### DELETE `/products/{product_id}` — `archive_product`

Permission: `product.delete`. Returns `204` with an empty body and archives the product (it disappears from reads/lists); it does not hard-delete variants or inventory history and writes an audit event. It currently does not inspect future order/homepage/review references: archive is the defined behavior. `404 resource_not_found` has `resource: product`; other errors: common `401`, `403`, `422`, `500`.

### PATCH `/products/{product_id}/stock` — `adjust_product_stock`

Permission: `inventory.adjust`. Required header: `Idempotency-Key`, non-empty, maximum 128 characters. Request body is `{"variantId":"33333333-3333-3333-3333-333333333333","delta":-2}`; `delta` is an integer in `[-100000,100000]`. Returns `200 Product`.

The transaction locks the target variant. It rejects negative resulting stock with `409 conflict`, `details: {"resource":"inventory","reason":"negative_stock"}`; no audit or low-stock notification is written. A successful first adjustment writes inventory movement and audit records. Crossing from above 10 to 10 or lower writes one durable `low_stock` admin notification. Reusing the same key by the same actor for the same product and variant with the same delta replays without another adjustment, audit event, or notification; its `200 Product` reflects the product at replay time. Reusing that scoped key with a different delta returns `409 conflict` reason `idempotency_key_reused`. Do not reuse a key for a different user or target; that is outside the uniqueness scope.

`404 resource_not_found` uses `resource: product_or_variant`. Missing/invalid `Idempotency-Key`, bad UUID, or out-of-range delta is `422 validation_error`. Other errors: common `401`, `403`, `500`. There is no optimistic version/ETag response; serialize competing UI adjustments per variant.

### GET `/products/slug-check` — `check_product_slug`; GET `/products/category-options` — `list_product_category_options`

Both require `product.read` and return `200`. Slug check requires `slug` (1–160) and optional UUID `excludeId`, returning `{"available":false}`. Category options returns an array of active `Category` values, for example `[<Category>]`. Both have common `401`, `403`, `500`; slug check also has `422` for its query values. Slug availability is advisory—creation/update remains the authority and can return `409 slug_taken`.

## Category endpoints

### GET `/categories` — `list_categories`; GET `/categories/{category_id}` — `get_category`

Both require `category.read` and return `200 Category[]` and `200 Category`, respectively. List query: `search` (1–160, case-insensitive name match), `status` (boolean), `parentId` (UUID), and `sortBy` default `sort_order_asc`; valid sort values are `sort_order_asc`, `sort_order_desc`, `name_asc`, `name_desc`, `created_at_asc`, `created_at_desc`. List ordering adds name then ID as ties. Detail returns `404 resource_not_found` with `resource: category` for missing/archived IDs. Both have common `401`, `403`, `422` (invalid UUID/query), and `500`.

### GET `/categories/tree` — `get_category_tree`; GET `/categories/stats` — `get_category_stats`

Permission: `category.read`. Tree accepts optional `search` (1–160) and `status` boolean, returns `200 CategoryTree[]`, where each node is a `Category` plus recursive `children`, integer `depth` (root 0), and `pathNames` (root-to-node names):

```json
[{"id":"22222222-2222-2222-2222-222222222222","name":"Keyboards","slug":"keyboards","parentId":null,"isActive":true,"sortOrder":0,"attributes":[],"createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z","children":[],"depth":0,"pathNames":["Keyboards"]}]
```

Stats has no parameters and returns `200 {"total":2,"active":1,"root":1}`. Both have common `401`, `403`, `500`; tree also has `422`.

### POST `/categories` — `create_category`; PATCH `/categories/{category_id}` — `update_category`

Permissions: `category.create` and `category.update`. POST returns `201 Category`; PATCH returns `200 Category`. POST example:

```json
{"name":"Keyboards","slug":"keyboards","parentId":null,"isActive":true,"sortOrder":0,"attributes":[{"name":"Layout","type":"select","options":["ANSI","ISO"],"isRequired":true}]}
```

`name` is 1–160; `slug` is 1–160 and must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`; `parentId` is nullable UUID; `isActive` defaults true; `sortOrder` defaults 0 and is non-negative. PATCH accepts any subset and replaces `attributes` when supplied. Attribute name is 1–100 and `type` is `text|number|select`; a `select` must have non-empty `options` or returns conflict.

`409 conflict` reasons: `slug_taken`, `invalid_parent` (self or descendant parent), `invalid_attribute`; all use `resource: category`. PATCH can return `404 resource_not_found` with `resource: category`. Other errors: common `401`, `403`, `422`, `500`. Slug check below is advisory; no conditional-write/version mechanism exists.

### DELETE `/categories/{category_id}` — `archive_category`

Permission: `category.delete`. Query `cascadeDelete` is boolean and defaults false. It returns `200`, for example `{"deletedIds":["22222222-2222-2222-2222-222222222222"],"reassignedIds":["44444444-4444-4444-4444-444444444444"]}`. With true, archive the selected category and all descendants; `reassignedIds` is empty. With false, archive only the selected category and reassign each direct child to the selected category’s former parent; both ID arrays report the resulting operation. Missing ID is `404 resource_not_found` / `category`; other errors: common `401`, `403`, `422`, `500`.

### PATCH `/categories/{category_id}/toggle-status` — `toggle_category_status`; PATCH `/categories/reorder` — `reorder_categories`

Toggle requires `category.update`, has no body, flips `isActive`, and returns `200 Category`; missing IDs return `404 resource_not_found` / `category`. Reorder requires `category.update`; its body is `{"orderedIds":["22222222-2222-2222-2222-222222222222","44444444-4444-4444-4444-444444444444"]}` where the array is non-empty UUIDs. It performs the supplied ordering atomically and returns `204` with an empty body. Reorder returns `404 resource_not_found` / `category` if any supplied ID is unavailable. Both can return common `401`, `403`, `422`, `500`; there is no idempotency key or version token.

### GET `/categories/slug-check` — `check_category_slug`

Permission: `category.read`. Query `slug` is required (1–160); `excludeId` is an optional UUID. Returns `200 {"available":true}`. Errors: common `401`, `403`, `500`, plus `422`. The result is advisory; category mutation still enforces uniqueness.

## Frontend integration notes

1. Login/refresh first, then fetch category options/categories before creating a product; use UUID `category` values, not names.
2. Treat `409` reasons as explicit UI branches: show SKU/slug uniqueness messages, prohibit removing variants with inventory history, and refetch stock after `negative_stock` or idempotency conflicts.
3. Create one new `Idempotency-Key` per stock intent; retain it only to retry that exact actor/product/variant/delta operation. Disable repeated stock submits while the request is pending.
4. Invalidate product lists/detail after product mutations; invalidate category lists/tree/stats/options after category mutations. No caching validators or polling protocol are exposed.

## Verification evidence and known limits

The final route/schema/error contract is covered by `tests/contract/test_catalog_api.py`; application behaviors by `tests/application/test_catalog_application.py`; persistence and migration behavior by `tests/integration/test_catalog_repository.py` and `tests/integration/test_migrations.py`. Recorded verification: focused Sprint 02 tests 36 passed, base suite 199 passed, contract+integration 57 passed, Ruff format/check passed, and `mypy src` passed. `.venv\\Scripts\\python.exe -m pytest --cov=shop_backend --cov-report=term-missing` passed with 259 tests, 15 warnings, and 91.55% total coverage (minimum: 90%). Alembic 0004 offline upgrade/downgrade SQL passed; no live PostgreSQL migration run is recorded.
