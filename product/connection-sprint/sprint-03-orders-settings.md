# Sprint 03 — Orders & Settings

## وضعیت: پیاده‌سازی‌شده

قرارداد این Sprint از OpenAPI سرویس درحال اجرا (`http://localhost:8000/openapi.json`) و route/schemaهای بک‌اند در `C:\project\shop-back` استخراج شد؛ هیچ endpoint حدسی استفاده نشده است.

## خروجی

- entity مستقل `order`: فهرست، جزئیات، تغییر fulfillment، تغییر payment و invoice.
- entity مستقل `store-settings`: دریافت و جایگزینی کامل تنظیمات فروشگاه.
- entity مستقل `shipping-method`: فهرست، ایجاد، ویرایش کامل، تغییر وضعیت و حذف.
- entity مستقل `admin-staff`: فهرست، ایجاد، تغییر نقش، تغییر وضعیت و حذف.
- DTOهای wire در `entities/*/types` و تبدیل DTO به ViewModel در mapperهای feature نگهداری می‌شوند.
- hookهای Orders و سه بخش Settings به TanStack Query متصل شده‌اند و پس از mutation، query مرتبط invalidate می‌شود.
- resetهای mock از صفحات production حذف شدند.
- فرم ایجاد مدیر با قرارداد واقعی `temporaryPassword` (حداقل ۱۲ کاراکتر) هماهنگ شد.
- فیلترها، pagination و `AbortSignal` درخواست‌های list به API منتقل می‌شوند.

## قرارداد و فایل‌های اصلی

- [Frontend handoff](../api/sprint-03-orders-settings-frontend-handoff.md)
- `src/entities/order`
- `src/entities/store-settings`
- `src/entities/shipping-method`
- `src/entities/admin-staff`
- `src/features/orders/models/orderMapper.ts`
- `src/features/settings/models/settingsMappers.ts`

## نکات مرزی

- API سفارش payment method و transaction ID برنمی‌گرداند؛ UI آن را با مقدار `unknown` نگاشت می‌کند و داده ساختگی تولید نمی‌شود.
- API روش ارسال description و شرط ارسال رایگان per-method ندارد؛ این کنترل‌های قدیمی از فرم production حذف شدند.
- endpoint فهرست کارکنان aggregate count نقش/وضعیت ندارد؛ شمارنده‌های UI از صفحه جاری مشتق می‌شوند و `totalCount` مقدار سراسری است.
- `PATCH /shipping-methods/{id}` یک replacement کامل است؛ hook پیش از ارسال payload ویرایش را با مقدار فعلی merge می‌کند.

## Verification

- `npm.cmd run lint` — موفق (`tsc --noEmit`).
- `npm.cmd run build` — موفق؛ Vite فقط هشدار CSS قدیمی `var(--color-...)` را گزارش کرد.
