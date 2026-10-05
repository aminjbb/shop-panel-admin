# Backend Node.js Trello Backlog

این backlog از نقشه API، اسپرینت‌های محصول و ساختار frontend استخراج شده است. کلیدهای `BE-###` برای جلوگیری از ایجاد کارت تکراری استفاده می‌شوند.

## Epic 0 — Foundation & Security (P0)

### BE-001 — راه‌اندازی سرویس Node.js و قرارداد API
Scope: TypeScript، ساختار modular، config، `/api/v1`، health/readiness، error envelope، requestId، OpenAPI، Docker محلی.
Acceptance: سرویس با env معتبر بالا بیاید؛ خطاها shape یکسان داشته باشند؛ OpenAPI تولید شود؛ health check قابل تست باشد.
Dependencies: ندارد.
Source: `product/connection-sprint/sprint-01-foundation-security.md`

### BE-002 — PostgreSQL schema و migration پایه
Scope: users, roles, refresh_tokens و audit foundation؛ migration/seed و transaction helper.
Acceptance: migration از صفر و rollback اجرا شود؛ unique/index/foreign keyها تعریف شوند؛ seed امن باشد.
Dependencies: BE-001.

### BE-003 — احراز هویت، session و RBAC
Scope: login, me, refresh, logout؛ password hashing، rotation/revocation، role/permission middleware.
Acceptance: token منقضی/لغو شده رد شود؛ endpointهای protected نقش مناسب را enforce کنند؛ brute-force/rate limit پایه وجود داشته باشد.
Dependencies: BE-002.
Source: `product/backend-node-api-map.md#Auth`

### BE-004 — تست و observability پایه
Scope: Vitest/Jest، integration test با DB، structured logging، metrics/error reporting و CI checks.
Acceptance: مسیر login و یک endpoint protected تست integration داشته باشد؛ CI typecheck/test/build را اجرا کند.
Dependencies: BE-001..003.

## Epic 1 — Catalog & Inventory (P1)

### BE-010 — دسته‌بندی درختی و ویژگی‌ها
Scope: CRUD categories، tree، slug-check، reorder، toggle-status، stats و جلوگیری از cycle.
Dependencies: BE-002, BE-003.
Source: `product/backend-node-api-map.md#Categories`

### BE-011 — محصولات، variant، SEO و جست‌وجو
Scope: CRUD products، filters/pagination، category options، slug/SKU uniqueness، variant و SEO.
Dependencies: BE-010.

### BE-012 — موجودی و ledger حرکات انبار
Scope: stock delta، inventory_movements، atomic update، low/out/in-stock و audit trail.
Dependencies: BE-011.

## Epic 2 — Orders, Payments & Shipping (P1)

### BE-020 — سفارش و snapshot اقلام
Scope: orders/order_items، فهرست/جزئیات/فاکتور، filter و pagination.
Dependencies: BE-011, BE-003.

### BE-021 — ماشین وضعیت سفارش و پرداخت
Scope: fulfillment/payment transitions، history، timestampهای معتبر و validation ارسال.
Dependencies: BE-020.

### BE-022 — روش ارسال و اتصال پرداخت
Scope: shipping methods CRUD، payment abstraction، webhook/idempotency و ثبت تراکنش.
Dependencies: BE-021.

## Epic 3 — CRM & Support (P1)

### BE-030 — مشتریان و سطح وفاداری
Scope: customers، search/filter، status/tier و جزئیات با orders/tickets.
Dependencies: BE-020.

### BE-031 — کوپن و اعتبارسنجی checkout
Scope: coupons CRUD، rules، redemption، date/usage limits و validate endpoint.
Dependencies: BE-020, BE-030.

### BE-032 — نظرات و تیکت پشتیبانی
Scope: reviews moderation/reply و tickets/messages/status/priority.
Dependencies: BE-030, BE-003.

## Epic 4 — Content, Analytics & Operations (P2)

### BE-040 — Homepage builder و publish workflow
Scope: sections CRUD، reorder، active toggle، stats و version/publish.
Dependencies: BE-011, BE-003.

### BE-041 — dashboard analytics و گزارش‌ها
Scope: dashboard metrics با timeRange، aggregation/index و export contract.
Dependencies: BE-020, BE-030.

### BE-042 — settings، staff، notifications و media
Scope: store settings، admin staff، notifications read state، media upload/storage abstraction و audit log.
Dependencies: BE-003, BE-040.

### BE-043 — hardening و production readiness
Scope: cache، queue برای کارهای async، rate limit، backup/restore، security headers، load test و runbook.
Dependencies: BE-004, BE-022, BE-042.

## Definition of Done مشترک
- migration/schema و API contract کامل است.
- validation، status code، error shape، auth/RBAC و pagination بررسی شده.
- unit/integration test برای مسیرهای اصلی وجود دارد.
- OpenAPI، لاگ ساختاریافته و traceability به frontend ثبت شده.
- کارت Trello شامل لینک فایل منبع و وابستگی‌ها است.

