# Sprint 04 — Support & CRM Frontend API Handoff

## Document control

| Item | Value |
|---|---|
| Epic/PBIs | Epic 06: PBI-06-01..03; Epic 08: PBI-08-01..04 |
| API version | `/api/v1` |
| Document version/date | 1.0 / 2026-08-29 |
| Backend evidence | `288 passed`; Ruff and mypy passed |
| Migration | `0008_support_crm` |
| OpenAPI source | Running application `/openapi.json`; operation IDs are named below |

## Environment and common protocol

Use `http://localhost:8000/api/v1` locally. Staging and production hostnames are deployment configuration; append the configured API prefix (default `/api/v1`). All endpoints in this document are **back-office admin endpoints**. There is deliberately no public endpoint in Sprint 04 for creating a review or ticket.

Send `Authorization: Bearer <access-token>` and `Content-Type: application/json` for requests with a body. Access tokens are issued by Sprint 01 login, normally expire after 15 minutes (runtime configurable 1–60 minutes), and are refreshed by `POST /auth/refresh`. `X-Request-ID` is optional: use 1–128 ASCII characters matching `[A-Za-z0-9._:-]`; the server echoes a valid value or generates one on every response. Do not send `Idempotency-Key`: these endpoints do not implement idempotency or optimistic concurrency.

IDs are UUID strings. Timestamps are ISO-8601 strings with an offset (examples use `Z`). Monetary decimals are serialized as JSON strings. Body schemas reject unknown fields. For the five mutation bodies, fields are required and `null` is invalid.

Roles: `super_admin` can use every endpoint below. `support_agent` can read customers, notifications, reviews and tickets and can moderate/reply/archive reviews and update/reply to tickets. Only `super_admin` can toggle a customer or change a customer tier. `inventory_manager` has none of these permissions.

### Error envelope

Every handled error has this exact shape; `requestId` equals the response `X-Request-ID`.

```json
{"error":{"code":"resource_not_found","message":"The requested resource was not found.","details":{"resource":"ticket"},"requestId":"crm-req-42"}}
```

| Field | Type | Meaning |
|---|---|---|
| `error.code` | string | Stable machine code. |
| `error.message` | string | Safe display/log message. |
| `error.details` | object | Code-specific fields; empty when not applicable. |
| `error.requestId` | string | Correlation ID for support. |

The following errors are reachable as applicable to the endpoint tables below:

| HTTP | Code | Exact shape/trigger | Frontend action |
|---:|---|---|---|
| 401 | `authentication_required` | Missing Bearer credential; `details: {}`; `WWW-Authenticate: Bearer`. | Authenticate. |
| 401 | `invalid_access_token` | Invalid, expired, or inactive access token; `details: {}`; `WWW-Authenticate: Bearer`. | Attempt normal refresh once, then sign in. |
| 403 | `forbidden` | Authenticated role lacks the named permission; `details: {}`. | Hide/disable capability; do not retry. |
| 404 | `resource_not_found` | UUID identifies no active customer/review/ticket/notification; `details: {"resource":"customer|review|ticket|notification"}`. | Remove stale item and refresh list. |
| 422 | `validation_error` | Invalid UUID/query/body or body field; `details: {"fields":[{"field":"body.status","reason":"literal_error"}]}`. | Map `fields` to form/query UI and correct it. |
| 500 | `internal_server_error` | Unexpected server failure; `details: {}`. | Show safe fallback; retain request ID. |

`422` is not emitted for ticket-list `status`/`priority` values because those query parameters are unconstrained strings; unrecognised values simply produce an empty result. `500` may be retried only with a user-safe, bounded retry policy; mutations are not idempotent, so do not automatically retry them.

### Shared success objects

The following are exact response shapes; fields not populated by stored data are JSON `null`.

```json
{"id":"11111111-1111-1111-1111-111111111111","fullName":"Ada Customer","mobile":"09120000000","email":"ada@example.test","tier":"bronze","status":"active","totalOrders":1,"totalSpent":"119","lastOrderDate":"2026-08-29T00:00:00Z","createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}
```

`Customer`: `id` UUID; `fullName` string; `mobile` string; `email` string|null; `tier` `bronze|silver|gold|vip`; `status` `active|blocked`; `totalOrders` integer; `totalSpent` decimal string; `lastOrderDate` timestamp|null; `createdAt` and `updatedAt` timestamps.

```json
{"id":"22222222-2222-2222-2222-222222222222","customerId":"11111111-1111-1111-1111-111111111111","productId":null,"customerName":"Ada Customer","rating":5,"body":"Great","status":"pending","adminReply":null,"repliedAt":null,"createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}
```

`Review`: UUID `id`; nullable UUID `customerId`/`productId`; `customerName` and `body` strings; `rating` integer 1–5; `status` `pending|approved|rejected`; nullable `adminReply` and `repliedAt`; timestamps. Archived reviews are never returned.

```json
{"id":"33333333-3333-3333-3333-333333333333","customerId":"11111111-1111-1111-1111-111111111111","subject":"Delivery question","customerName":"Ada Customer","status":"open","priority":"medium","activity":[],"messages":[],"createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}
```

`Ticket`: UUID `id`; nullable UUID `customerId`; `subject` string; nullable `customerName`; `status` `open|in_progress|waiting_customer|closed`; `priority` `low|medium|high|urgent`; `activity` array of `{ "kind": string, "at": timestamp }`; `messages` array of `{ "id": UUID, "senderKind": string, "body": string, "createdAt": timestamp }`; timestamps. List items always contain `activity: []` and `messages: []`; detail includes persisted values and messages ordered oldest first.

```json
{"id":"44444444-4444-4444-4444-444444444444","kind":"low_stock","isRead":false,"createdAt":"2026-08-29T00:00:00Z","payload":{"productId":"55555555-5555-5555-5555-555555555555","variantId":null,"stock":2,"title":"Low stock","body":"Keyboard is low."}}
```

`Notification`: UUID `id`; `kind` string; `isRead` boolean; `createdAt` timestamp; `payload` object with nullable UUID `productId`/`variantId`, nullable integer `stock`, nullable string `title`/`body`. Archived notifications are never returned.

## Customer endpoints

### GET `/customers` — `list_customers`

Permission `customer.read` (`super_admin`, `support_agent`); no side effect, cache only as a short-lived list. Headers: `Authorization` required; `X-Request-ID` optional. Query: `search` string|null (case-insensitive partial match against name/mobile/email), `tier` enum|null, `status` enum|null, `page` integer default 1/minimum 1, `limit` integer default 20/range 1–100, `sortBy` string default `createdAt`, `sortOrder` `asc|desc` default `desc`. Recognised sort keys are `createdAt`, `totalOrders`, `totalSpent`, `lastOrderDate`; any other string falls back to created time. Filters are applied before pagination. `counts` and `stats` are global, unfiltered aggregate values; `totalCount` is filtered count.

```json
{"customers":[{"id":"11111111-1111-1111-1111-111111111111","fullName":"Ada Customer","mobile":"09120000000","email":"ada@example.test","tier":"bronze","status":"active","totalOrders":1,"totalSpent":"119","lastOrderDate":"2026-08-29T00:00:00Z","createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}],"totalCount":1,"page":1,"limit":20,"counts":{"active":1,"blocked":0},"stats":{"totalCustomers":1,"totalOrders":1,"totalSpent":"119"}}
```

Returns `200`. An out-of-range page returns `customers: []` with unchanged metadata. Reachable errors: `401`, `403`, `422` (invalid enum/page/limit), `500`.

### GET `/customers/{id}` — `get_customer`

Permission `customer.read`; `id` is a UUID. Query booleans `includeOrders` and `includeTickets` default `false`. `includeOrders=true` returns at most 20 stored-order summaries (the implementation preserves its stored order sequence); each is `{id,orderNumber,total,createdAt,fulfillmentStatus}`. `includeTickets=true` returns at most 20 tickets newest first; each is `{id,subject,status,priority,createdAt}`. When an include flag is false, its response key is present with value `null` (not `[]`).

```json
{"id":"11111111-1111-1111-1111-111111111111","fullName":"Ada Customer","mobile":"09120000000","email":"ada@example.test","tier":"bronze","status":"active","totalOrders":1,"totalSpent":"119","lastOrderDate":"2026-08-29T00:00:00Z","createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z","orders":[{"id":"66666666-6666-6666-6666-666666666666","orderNumber":"ORD-000001","total":"119","createdAt":"2026-08-29T00:00:00Z","fulfillmentStatus":"processing"}],"tickets":[]}
```

Returns `200`; reachable errors: `401`, `403`, `404` with `resource:"customer"`, `422` (bad UUID/boolean), `500`.

### PATCH `/customers/{id}/toggle-status` — `toggle_customer_status`

`super_admin` only. No body. Toggles `active` to `blocked` or `blocked` to `active`, updates `updatedAt`, and appends `customer_status_changed` to the audit log in the same transaction. Returns `200 Customer` (the shared Customer example, with the resulting `status`). It is not idempotent: disable duplicate clicks and refetch after timeout. Reachable errors: `401`, `403`, `404 resource_not_found` with `resource:"customer"`, `422` (bad UUID), `500`.

### PATCH `/customers/{id}/tier` — `set_customer_tier`

`super_admin` only. Body is required, unknown fields forbidden:

```json
{"tier":"vip"}
```

`tier` is a non-null enum `bronze|silver|gold|vip`. Returns `200 Customer` with the new tier, updated timestamp, and an atomic `customer_tier_changed` audit log entry. Reachable errors: `401`, `403`, `404 resource_not_found` with `resource:"customer"`, `422 validation_error`, `500`. This is a full assignment, not a toggle; avoid automatic retries.

## Review endpoints

### GET `/reviews` — `list_reviews`

Permission `review.read` (`super_admin`, `support_agent`). Query: `status` enum|null, `rating` integer|null (1–5), `search` string|null (case-insensitive partial customer name/body match), `page` integer default 1/minimum 1, `limit` integer default 20/range 1–100. There is no client sort parameter: results are always newest `createdAt` first. Filtering precedes pagination.

```json
{"reviews":[{"id":"22222222-2222-2222-2222-222222222222","customerId":"11111111-1111-1111-1111-111111111111","productId":null,"customerName":"Ada Customer","rating":5,"body":"Great","status":"pending","adminReply":null,"repliedAt":null,"createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}],"totalCount":1,"page":1,"limit":20}
```

Returns `200`; empty pages use `reviews: []`. Reachable errors: `401`, `403`, `422`, `500`.

### PATCH `/reviews/{id}/status` — `set_review_status`

Permission `review.moderate` (`super_admin`, `support_agent`). Body:

```json
{"status":"approved"}
```

`status` is required and exactly `pending|approved|rejected`; unknown fields and null fail validation. Returns `200 Review` with the assigned status and new `updatedAt`. Reachable errors: `401`, `403`, `404 resource_not_found` (`resource:"review"`, including archived reviews), `422`, `500`. This endpoint has no transition matrix and no idempotency key; a repeated identical assignment is harmless in value but changes `updatedAt`.

### POST `/reviews/{id}/reply` — `reply_review`

Permission `review.reply` (`super_admin`, `support_agent`). Body:

```json
{"body":"Thank you for the feedback."}
```

`body` is required, string length 1–4000. Returns `200 Review`, setting `adminReply`, `repliedAt`, and `updatedAt`. A review whose current status is `pending` or `approved` becomes `approved`; a `rejected` review remains `rejected`. Replace the displayed review with the response rather than assuming approval. Reachable errors: `401`, `403`, `404 resource_not_found` (`resource:"review"`), `422`, `500`. Do not auto-retry because each successful retry replaces reply/timestamp.

### DELETE `/reviews/{id}` — `archive_review`

Permission `review.delete` (`super_admin`, `support_agent`). No body; returns `204 No Content`. It performs soft archive; later reads and further mutations return `404 resource_not_found` with `resource:"review"`. Reachable errors: `401`, `403`, `404`, `422` (bad UUID), `500`. Remove the item from local lists only after `204`.

## Ticket endpoints

### GET `/tickets` — `list_tickets`

Permission `ticket.read` (`super_admin`, `support_agent`). Query: `status` string|null, `priority` string|null, `search` string|null (case-insensitive subject/customer-name partial match), `page` integer default 1/minimum 1, `limit` integer default 20/range 1–100. Valid stored values are status `open|in_progress|waiting_customer|closed` and priority `low|medium|high|urgent`; list filters do not validate these strings. No sort parameter exists: order is newest `createdAt` first.

```json
{"tickets":[{"id":"33333333-3333-3333-3333-333333333333","customerId":"11111111-1111-1111-1111-111111111111","subject":"Delivery question","customerName":"Ada Customer","status":"open","priority":"medium","activity":[],"messages":[],"createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}],"totalCount":1,"page":1,"limit":20}
```

Returns `200`; empty pages use `tickets: []`. Reachable errors: `401`, `403`, `422` (page/limit only), `500`.

### GET `/tickets/{id}` — `get_ticket`

Permission `ticket.read`; `id` UUID; no query/body. Returns `200 Ticket`. Its `messages` are oldest-first and `activity` is persisted order:

```json
{"id":"33333333-3333-3333-3333-333333333333","customerId":"11111111-1111-1111-1111-111111111111","subject":"Delivery question","customerName":"Ada Customer","status":"in_progress","priority":"medium","activity":[{"kind":"admin_message","at":"2026-08-29T00:00:00Z"}],"messages":[{"id":"77777777-7777-7777-7777-777777777777","senderKind":"admin","body":"We are checking this.","createdAt":"2026-08-29T00:00:00Z"}],"createdAt":"2026-08-29T00:00:00Z","updatedAt":"2026-08-29T00:00:00Z"}
```

Reachable errors: `401`, `403`, `404 resource_not_found` (`resource:"ticket"`), `422`, `500`.

### POST `/tickets/{id}/messages` — `add_ticket_message`

Permission `ticket.reply` (`super_admin`, `support_agent`). Body is the same required `ReplyInput`:

```json
{"body":"We are checking this."}
```

On `200`, returns the updated **Ticket**, not the new message. The new admin message is persisted and an `admin_message` activity entry is appended atomically. If the ticket was `open`, it becomes `in_progress`; all other statuses remain unchanged. Fetch the ticket detail after success if the UI needs the generated message UUID, because it is not included in this response. Reachable errors: `401`, `403`, `404 resource_not_found` (`resource:"ticket"`), `422`, `500`. Disable duplicate sends; no idempotency/retry protection exists.

### PATCH `/tickets/{id}/status` — `set_ticket_status`

Permission `ticket.update` (`super_admin`, `support_agent`). Body:

```json
{"status":"closed"}
```

Required non-null status enum: `open|in_progress|waiting_customer|closed`. Returns `200 Ticket`, appends `{kind:"status",at:<timestamp>}` to `activity`, and updates `updatedAt`; no transition rules are enforced. Reachable errors: `401`, `403`, `404 resource_not_found` (`resource:"ticket"`), `422`, `500`.

### PATCH `/tickets/{id}/priority` — `set_ticket_priority`

Permission `ticket.update` (`super_admin`, `support_agent`). Body:

```json
{"priority":"urgent"}
```

Required non-null priority enum: `low|medium|high|urgent`. Returns `200 Ticket`, appends `{kind:"priority",at:<timestamp>}` and updates `updatedAt`. Reachable errors: `401`, `403`, `404 resource_not_found` (`resource:"ticket"`), `422`, `500`. Neither ticket mutation has concurrency/idempotency support; resolve last-write-wins UI races by refetching.

## Notification endpoints

### GET `/notifications` — `list_notifications`

Permission `customer.read` (`super_admin`, `support_agent`); no query/body. Results are active (not archived) notifications, newest `createdAt` first, without pagination.

```json
{"notifications":[{"id":"44444444-4444-4444-4444-444444444444","kind":"low_stock","isRead":false,"createdAt":"2026-08-29T00:00:00Z","payload":{"productId":"55555555-5555-5555-5555-555555555555","variantId":null,"stock":2,"title":"Low stock","body":"Keyboard is low."}}]}
```

Returns `200`; empty result is `{ "notifications": [] }`. Reachable errors: `401`, `403`, `500`.

### PATCH `/notifications/read-all` — `read_all_notifications`

Permission `customer.read`; no body; returns `204 No Content`. Marks every currently active unread notification read. It is value-idempotent (calling it again still returns `204`) but no idempotency key/concurrency guarantee is provided. Reachable errors: `401`, `403`, `500`.

### PATCH `/notifications/{id}/read` — `read_notification`

Permission `customer.read`; `id` UUID; no body. Returns `200 Notification` with `isRead:true` (the shared Notification shape). Calling it again also returns the item as read. Reachable errors: `401`, `403`, `404 resource_not_found` (`resource:"notification"`, including archived), `422`, `500`.

### DELETE `/notifications/{id}` — `archive_notification`

Permission `customer.read`; `id` UUID; no body. Returns `204 No Content` and soft-archives the notification, so it no longer appears in `GET /notifications`; subsequent read/archive returns `404 resource_not_found` with `resource:"notification"`. Reachable errors: `401`, `403`, `404`, `422`, `500`.

## Frontend integration checklist

1. Acquire/refresh an admin token before loading CRM routes; branch on role to hide customer mutation controls for `support_agent`.
2. Use `totalCount`, `page`, and `limit` for paged lists. Do not infer a total-page field: it is not returned.
3. Treat `orders` and `tickets` in customer detail as nullable include projections, not always-present arrays.
4. After a ticket message, use the returned status/activity and refetch detail for the message identifier; never optimistically insert a message that could be duplicated.
5. Archive actions are irreversible through this API; remove from UI only after `204`.
6. Present `validation_error.details.fields` by field and preserve `error.requestId` on unexpected failures.

## Verification references

- Routes and operation IDs: `src/shop_backend/presentation/http/routers/crm.py`.
- Request schemas: `src/shop_backend/presentation/http/schemas/crm.py`.
- Permission, side-effect and transaction behavior: `src/shop_backend/application/crm.py` and `src/shop_backend/domain/identity/permissions.py`.
- Serialization, filtering, ordering and include limits: `src/shop_backend/infrastructure/database/repositories/crm.py`.
- Error envelope: `src/shop_backend/presentation/http/errors.py` and `schemas/errors.py`.
- Regression evidence: `tests/application/test_crm_service.py` (including rejected-review reply preservation and atomic ticket message write).
