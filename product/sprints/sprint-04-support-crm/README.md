# Sprint 04 - Support & CRM

هدف: آماده‌سازی APIهای مشتری، نظرات، تیکت‌ها و اعلان‌های ادمین.

## Epic 06 - CRM مشتریان

### PBI-06-01 - لیست مشتریان و آمار CRM

معیار پذیرش:

- `GET /api/v1/customers` از `search`، `tier`، `status`، `page`، `limit`، `sortBy` و `sortOrder` پشتیبانی کند.
- response شامل `customers`، `counts` و `stats` باشد.
- totalOrders، totalSpent و lastOrderDate از سفارش‌های واقعی قابل محاسبه یا sync باشد.

اولویت: Should

### PBI-06-02 - جزئیات مشتری

معیار پذیرش:

- `GET /api/v1/customers/{id}` اطلاعات مشتری را برگرداند.
- امکان include کردن آخرین سفارش‌ها و تیکت‌ها با query parameter وجود داشته باشد.

اولویت: Should

### PBI-06-03 - مسدودسازی و تغییر سطح وفاداری

معیار پذیرش:

- `PATCH /api/v1/customers/{id}/toggle-status` بین active و blocked تغییر دهد.
- `PATCH /api/v1/customers/{id}/tier` tier را به `bronze`، `silver`، `gold` یا `vip` تغییر دهد.
- تغییرات در audit log ثبت شود.

اولویت: Should

## Epic 08 - نظرات محصول، تیکت‌ها و اعلان‌ها

### PBI-08-01 - مدیریت نظرات محصول

معیار پذیرش:

- `GET /api/v1/reviews` از status، rating، search، pagination و sort پشتیبانی کند.
- `PATCH /api/v1/reviews/{id}/status` وضعیت را تغییر دهد.
- `POST /api/v1/reviews/{id}/reply` پاسخ ادمین را ثبت کند و در صورت rejected نبودن، نظر را approved کند.
- `DELETE /api/v1/reviews/{id}` حذف یا archive کند.

اولویت: Must

### PBI-08-02 - مدیریت تیکت‌ها و پیام‌ها

معیار پذیرش:

- `GET /api/v1/tickets` از status، priority، search، pagination و sort پشتیبانی کند.
- `GET /api/v1/tickets/{id}` جزئیات و پیام‌ها را برگرداند.
- `POST /api/v1/tickets/{id}/messages` پیام جدید ثبت کند.
- پاسخ support در صورت open بودن تیکت، وضعیت را به `in_progress` تغییر دهد.

اولویت: Must

### PBI-08-03 - تغییر وضعیت و اولویت تیکت

معیار پذیرش:

- `PATCH /api/v1/tickets/{id}/status` وضعیت‌های `open`، `in_progress`، `waiting_customer` و `closed` را پشتیبانی کند.
- `PATCH /api/v1/tickets/{id}/priority` اولویت‌های `low`، `medium`، `high` و `urgent` را پشتیبانی کند.
- تغییرات در activity log تیکت ثبت شود.

اولویت: Should

### PBI-08-04 - اعلان‌های ادمین

معیار پذیرش:

- `GET /api/v1/notifications` اعلان‌ها را مرتب‌شده از جدید به قدیم برگرداند.
- `PATCH /api/v1/notifications/{id}/read` اعلان را read کند.
- `PATCH /api/v1/notifications/read-all` همه اعلان‌ها را read کند.
- `DELETE /api/v1/notifications/{id}` اعلان را حذف کند.

اولویت: Should
