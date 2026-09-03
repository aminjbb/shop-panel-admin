# Sprint 04 — اتصال Support و CRM

## هدف

اتصال صفحات مشتریان، نظرات، تیکت‌ها و اعلان header به ۱۷ endpoint واقعی و حذف
mock feedback/CRM.

## صفحات و فایل‌های درگیر

- `src/pages/CustomersPage.tsx`
- `src/features/crm/hooks/useCustomers.ts`
- `src/features/crm/ui/*`
- `src/pages/FeedbackPage.tsx`
- `src/features/feedback/hooks/useReviews.ts`
- `src/features/feedback/hooks/useTickets.ts`
- `src/features/feedback/hooks/useNotifications.ts`
- `src/features/feedback/ui/reviews/*`
- `src/features/feedback/ui/tickets/*`
- `src/shared-app/appHeader/NotificationCenter.tsx`

## endpointهای Customer — 4 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `customerApi.list` | `GET /customers` | لیست، آمار، filter و pagination |
| `customerApi.get` | `GET /customers/{id}` | modal جزئیات و includeها |
| `customerApi.toggleStatus` | `PATCH /customers/{id}/toggle-status` | block/unblock |
| `customerApi.setTier` | `PATCH /customers/{id}/tier` | تغییر سطح وفاداری |

## endpointهای Review — 4 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `reviewApi.list` | `GET /reviews` | tab نظرات |
| `reviewApi.setStatus` | `PATCH /reviews/{id}/status` | moderation |
| `reviewApi.reply` | `POST /reviews/{id}/reply` | پاسخ مدیر |
| `reviewApi.archive` | `DELETE /reviews/{id}` | آرشیو نظر |

## endpointهای Ticket — 5 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `ticketApi.list` | `GET /tickets` | tab تیکت‌ها |
| `ticketApi.get` | `GET /tickets/{id}` | chat/detail modal |
| `ticketApi.addMessage` | `POST /tickets/{id}/messages` | ارسال پاسخ |
| `ticketApi.setStatus` | `PATCH /tickets/{id}/status` | تغییر وضعیت |
| `ticketApi.setPriority` | `PATCH /tickets/{id}/priority` | تغییر اولویت |

## endpointهای Notification — 4 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `notificationApi.list` | `GET /notifications` | notification center |
| `notificationApi.readAll` | `PATCH /notifications/read-all` | خواندن همه |
| `notificationApi.read` | `PATCH /notifications/{id}/read` | خواندن موردی |
| `notificationApi.archive` | `DELETE /notifications/{id}` | حذف/آرشیو |

## backlog اجرایی

### CS-04-01 — Customers query و DTO mapping

- typeهای قدیمی CRM در network boundary با `@/entities/customer` جایگزین شوند.
- UI fieldهای قدیمی مانند `name/phone` به `fullName/mobile` نگاشت شوند.
- `totalSpent` به‌عنوان decimal string حفظ و فقط در formatter تبدیل شود.
- `totalCount/page/limit` مبنای pagination باشد؛ totalPages در پاسخ وجود ندارد و
  در ViewModel محاسبه شود.
- counts و stats به‌عنوان aggregate بدون filter نمایش داده شوند.

### CS-04-02 — Customer detail و mutationها

- detail query هنگام بازشدن modal و با includeهای لازم اجرا شود.
- `orders` و `tickets` nullable باشند؛ `null` با آرایه خالی معنای یکسان ندارد.
- toggle و set-tier فقط برای `super_admin` قابل مشاهده باشند.
- toggle non-idempotent است؛ duplicate click و auto-retry مسدود شود.
- پس از mutation، list و detail با response جایگزین یا invalidate شوند.

### CS-04-03 — Reviews

- query key شامل status، rating، search، page و limit باشد.
- status و rating UI به enum entity نگاشت شوند.
- پاسخ reply عیناً جایگزین review شود؛ UI نباید فرض کند وضعیت همیشه approved است.
- archive فقط بعد از 204 مورد را از list حذف کند.
- reply/status mutation retry خودکار نداشته باشد.

### CS-04-04 — Tickets

- list و detail cache جدا داشته باشند.
- queryهای `status` و `priority` در list عمداً `string` هستند؛ unknown value خطای
  422 نمی‌دهد و می‌تواند نتیجه خالی بدهد.
- پس از add-message، Ticket برگشتی اعمال و detail برای message UUID refetch شود.
- message خوش‌بینانه درج نشود تا duplicate ایجاد نشود.
- set-status و set-priority فعالیت و timestamp برگشتی را اعمال کنند.

### CS-04-05 — Notification Center

- `useNotifications` به notification entity منتقل شود و polling فقط در صورت نیاز
  محصول با interval کنترل‌شده اضافه شود.
- unread count از list فعال محاسبه شود.
- read/read-all value-idempotent هستند؛ archive فقط بعد از 204 اعمال شود.
- پس از stock adjustment موفق، notification list invalidate شود.
- payload nullable و `kind` رشته باز باقی بماند؛ renderer fallback داشته باشد.

### CS-04-06 — RBAC و حذف reset mock

- `support_agent`: دسترسی read/mutate review و ticket و read notification/customer.
- `super_admin`: علاوه بر بالا، customer toggle/tier.
- `inventory_manager`: route/actionهای Sprint 04 مخفی؛ 403 نیز مدیریت شود.
- دکمه reset مستقیم `mockFeedbackService.resetAllToDefaults` از FeedbackPage حذف
  و فقط reset عمومی development استفاده شود.
- importهای `mockCrmService` و `mockFeedbackService` از runtime حذف شوند.

## تست‌های ضروری

- customer filter/pagination و nullable include projection.
- permission controls برای هر سه role.
- rejected review پس از reply همچنان rejected باقی بماند.
- ticket message بدون optimistic duplicate و با detail refetch.
- read/read-all/archive notification و unread count.
- رفتار stale 404: بستن detail و refresh list.

## خروجی sprint

CustomersPage، هر دو حالت FeedbackPage و NotificationCenter بدون mock کار کنند و
تمام ۱۷ endpoint این sprint متصل باشند.
