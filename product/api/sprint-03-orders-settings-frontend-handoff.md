# Sprint 03 — Orders & Settings Frontend API Handoff

## Document control

| Item | Value |
|---|---|
| API version | `/api/v1` |
| Document date | 2026-09-04 |
| Source | Running backend `/openapi.json` plus route/schema/domain source |
| Serialization | UUID strings, ISO-8601 timestamps, decimal JSON strings |

همه endpointها به Bearer token نیاز دارند و خطاها از envelope مشترک `ApiErrorBody` استفاده می‌کنند.

## Orders

| Method | Path | Request | Success |
|---|---|---|---|
| GET | `/orders` | `status?`, `paymentStatus?`, `search?`, `dateFrom?`, `dateTo?`, `page`, `limit`, `sortBy`, `sortOrder` | `OrderListResponse` |
| GET | `/orders/{id_or_number}` | UUID یا شماره سفارش | `Order` |
| PATCH | `/orders/{id}/fulfillment` | `{status,courierName?,trackingCode?}` | `Order` |
| PATCH | `/orders/{id}/payment` | `{status,paidAmount?}` | `Order` |
| GET | `/orders/{id}/invoice` | — | `{store: StoreSettings, order: Order}` |

`FulfillmentStatus = processing | ready_to_ship | shipped | delivered | canceled` و `PaymentStatus = pending | paid | failed | refunded` است. sort fieldها: `createdAt | orderNumber | total | paidAmount`.

`Order` شامل customer snapshot، shipping address، items، مبلغ‌های `subtotal/discount/shipping/tax/paidAmount/total`، courier/tracking، timestampها، history و `createdAt` است. مبلغ‌ها string هستند. List پاسخ `{orders,totalCount,page,limit,counts,stats}` می‌دهد و `totalPages` در frontend محاسبه می‌شود.

Conflict reasonها: `invalid_fulfillment_transition`, `shipping_details_required`. خواندن به `order.read`، fulfillment به `order.update` و payment به super-admin محدود است.

## Store settings

| Method | Path | Request | Success |
|---|---|---|---|
| GET | `/settings/store` | — | `StoreSettings` |
| PUT | `/settings/store` | `StoreSettingsInput` کامل | `StoreSettings` |

فیلدها: `storeName`, nullable `legalName/supportPhone/supportEmail/address`, `currency: IRT|IRR`, decimal `taxRate`, nullable decimal `freeShippingThreshold`, `orderPrefix`, `enableOrderTracking`, nullable `invoiceFooterNote/logoUrl`. پاسخ `updatedAt` نیز دارد. logo باید HTTPS باشد. Conflict reason: `invalid_value`.

## Shipping methods

| Method | Path | Request | Success |
|---|---|---|---|
| GET | `/shipping-methods` | — | `ShippingMethod[]` |
| POST | `/shipping-methods` | `ShippingMethodInput` | `201 ShippingMethod` |
| PATCH | `/shipping-methods/{id}` | `ShippingMethodInput` کامل | `ShippingMethod` |
| PATCH | `/shipping-methods/{id}/toggle-status` | — | `ShippingMethod` |
| DELETE | `/shipping-methods/{id}` | — | `204` |

Input: `name`, decimal `price >= 0`, integer `estimatedDays 0..365`, nullable `coveredCities`، `iconName: truck|motorcycle|store|package`, optional `isActive`. null برای شهرها یعنی همه و در response به صورت `"all"` برمی‌گردد. Conflict reason: `invalid_value`.

## Admin staff

| Method | Path | Request | Success |
|---|---|---|---|
| GET | `/admin-staff` | `search?`, `role?`, boolean `status?`, `page`, `limit` | `AdminStaffListResponse` |
| POST | `/admin-staff` | `{email,fullName,temporaryPassword,role}` | `201 AdminStaff` |
| PATCH | `/admin-staff/{id}/role` | `{role}` | `AdminStaff` |
| PATCH | `/admin-staff/{id}/toggle-status` | — | `AdminStaff` |
| DELETE | `/admin-staff/{id}` | — | `204` |

Roleها: `super_admin | inventory_manager | support_agent`. رمز موقت ۱۲ تا ۱۲۸ کاراکتر است. DTO فقط `id,email,fullName,role,isActive,createdAt,lastLoginAt` دارد. Conflict reasonها: `invalid_temporary_password`, `email_taken`, `self_change_forbidden`, `last_super_admin`. mutationها فقط برای super-admin مجازند.
