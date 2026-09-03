# بک‌لاگ توسعه بک‌اند FastAPI

تاریخ تهیه: 2026-08-28

این فایل فقط ایندکس کوتاه backlog است. برای مصرف کمتر توکن، Epicها و PBIها داخل فایل‌های Sprint جدا شده‌اند.

## خلاصه پروژه

پنل فعلی یک اپلیکیشن React/Vite برای مدیریت فروشگاه است که داده‌ها را از mock service و `localStorage` می‌خواند. بک‌اند FastAPI باید این دامنه‌ها را پوشش دهد:

- احراز هویت، نشست و RBAC
- داشبورد تحلیلی
- صفحه‌ساز و بنرهای صفحه اصلی
- دسته‌بندی درختی و ویژگی‌ها
- محصول، واریانت، موجودی و SEO
- سفارش، پرداخت، ارسال و فاکتور
- مشتریان، کوپن‌ها، نظرات، تیکت‌ها و اعلان‌ها
- تنظیمات فروشگاه، روش ارسال، پرسنل، رسانه و audit

## فایل‌های Sprint

| Sprint | فایل | Epicها |
| --- | --- | --- |
| 01 | [Foundation & Security](./sprints/sprint-01-foundation-security/README.md) | Epic 01, 02, بخشی از 13 |
| 02 | [Catalog & Inventory](./sprints/sprint-02-catalog-inventory/README.md) | Epic 03, 04 |
| 03 | [Orders & Settings](./sprints/sprint-03-orders-settings/README.md) | Epic 05, 10 |
| 04 | [Support & CRM](./sprints/sprint-04-support-crm/README.md) | Epic 06, 08 |
| 05 | [Commerce, Content & Analytics](./sprints/sprint-05-commerce-content-analytics/README.md) | Epic 07, 09, 11 |
| 06 | [Media & Operations](./sprints/sprint-06-media-operations/README.md) | Epic 12, باقی 13 |

## اسناد مکمل

- [API Map](./backend-fastapi-api-map.md): نقشه endpointهای لازم برای اتصال frontend به FastAPI.

## Definition of Done عمومی

- مدل دیتابیس، schemaهای ورودی/خروجی و migration مربوطه آماده باشد.
- endpointها status code و error shape یکسان داشته باشند.
- عملیات protected با نقش مناسب کنترل شود.
- pagination، filter و sort مطابق نیاز frontend کار کند.
- تست واحد service و تست integration برای endpointهای اصلی وجود داشته باشد.
- OpenAPI بدون خطا تولید شود.
