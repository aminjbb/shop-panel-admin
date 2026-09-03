# Sprint 03 - Orders & Settings

هدف: عملیاتی کردن سفارش‌ها، ارسال، فاکتور و تنظیمات حیاتی پنل.

## Epic 05 - سفارش، پرداخت، ارسال و فاکتور

### PBI-05-01 - لیست سفارش‌ها با فیلتر و آمار

معیار پذیرش:

- `GET /api/v1/orders` فیلترهای `status`، `paymentStatus`، `search`، `dateFrom`، `dateTo`، `page`، `limit`، `sortBy` و `sortOrder` را پشتیبانی کند.
- جستجو در شماره سفارش، نام مشتری، موبایل، شهر، کد رهگیری و آیتم‌ها انجام شود.
- response شامل `orders`، `counts` و `stats` باشد.

اولویت: Must

### PBI-05-02 - جزئیات سفارش و snapshot اقلام

معیار پذیرش:

- `GET /api/v1/orders/{id}` با id یا orderNumber کار کند.
- اقلام سفارش snapshot قیمت، نام، واریانت، تعداد و تصویر زمان خرید را نگه دارند.
- اطلاعات مشتری و آدرس تحویل در سفارش snapshot شود.

اولویت: Must

### PBI-05-03 - تغییر وضعیت ارسال

معیار پذیرش:

- `PATCH /api/v1/orders/{id}/fulfillment` وضعیت‌های `processing`، `ready_to_ship`، `shipped`، `delivered` و `canceled` را پشتیبانی کند.
- برای `shipped`، courierName و trackingCode اجباری باشد.
- `dispatchedAt` و `deliveredAt` خودکار ثبت شوند.
- تغییر وضعیت در history سفارش ثبت شود.

اولویت: Must

### PBI-05-04 - تغییر وضعیت پرداخت

معیار پذیرش:

- `PATCH /api/v1/orders/{id}/payment` وضعیت‌های `paid`، `pending`، `failed` و `refunded` را پشتیبانی کند.
- هنگام paid شدن، `paidAt` در صورت خالی بودن ثبت شود.
- تغییرات مالی فقط برای نقش مجاز انجام شود.

اولویت: Should

### PBI-05-05 - خروجی فاکتور و چاپ

معیار پذیرش:

- `GET /api/v1/orders/{id}/invoice` داده کامل فاکتور شامل تنظیمات فروشگاه، اقلام، مالیات، تخفیف، ارسال و مبلغ پرداختی را برگرداند.
- داده فاکتور به تنظیمات فروشگاه وابسته باشد.

اولویت: Should

## Epic 10 - تنظیمات فروشگاه، ارسال و پرسنل

### PBI-10-01 - تنظیمات فروشگاه

معیار پذیرش:

- `GET /api/v1/settings/store` تنظیمات را برگرداند.
- `PUT /api/v1/settings/store` تنظیمات storeName، legalName، supportPhone، supportEmail، address، currency، taxRate، freeShippingThreshold، orderPrefix، enableOrderTracking، invoiceFooterNote و logoUrl را ذخیره کند.
- currency فقط `IRT` یا `IRR` باشد.
- taxRate و threshold مقدار معتبر داشته باشند.

اولویت: Must

### PBI-10-02 - روش‌های ارسال

معیار پذیرش:

- `GET /api/v1/shipping-methods`، `POST /api/v1/shipping-methods`، `PATCH /api/v1/shipping-methods/{id}` و `DELETE /api/v1/shipping-methods/{id}` پیاده‌سازی شوند.
- `PATCH /api/v1/shipping-methods/{id}/toggle-status` وضعیت فعال را تغییر دهد.
- coveredCities از `all` یا لیست شهرها پشتیبانی کند.
- iconName فقط مقادیر مجاز frontend را قبول کند.

اولویت: Should

### PBI-10-03 - مدیریت پرسنل ادمین

معیار پذیرش:

- `GET /api/v1/admin-staff` فیلتر search، role، status و pagination را پشتیبانی کند.
- `POST /api/v1/admin-staff` عضو جدید با ایمیل یکتا بسازد.
- `PATCH /api/v1/admin-staff/{id}/role` نقش را تغییر دهد.
- `PATCH /api/v1/admin-staff/{id}/toggle-status` فعال/غیرفعال کند.
- `DELETE /api/v1/admin-staff/{id}` حذف soft انجام دهد.

اولویت: Must
