# Sprint 01 - Foundation & Security

هدف: آماده‌سازی پایه FastAPI، دیتابیس، قرارداد response و امنیت دسترسی.

## Epic 01 - زیرساخت بک‌اند

### PBI-01-01 - راه‌اندازی اسکلت پروژه FastAPI

به عنوان توسعه‌دهنده، می‌خواهم ساختار استاندارد پروژه FastAPI داشته باشم تا توسعه ماژول‌ها منسجم و قابل نگهداری باشد.

معیار پذیرش:

- پروژه شامل `app/main.py`، تنظیمات، router root و health check باشد.
- `GET /health` و `GET /api/v1/health` سالم بودن سرویس را برگردانند.
- CORS برای آدرس dev frontend قابل تنظیم باشد.
- `.env.example` شامل تنظیمات پایه باشد.

اولویت: Must

### PBI-01-02 - اتصال دیتابیس و migration

به عنوان توسعه‌دهنده، می‌خواهم اتصال PostgreSQL و Alembic آماده باشد تا مدل‌ها نسخه‌بندی شوند.

معیار پذیرش:

- اتصال async SQLAlchemy از env config خوانده شود.
- migration اولیه قابل اجرا و rollback باشد.
- health check بتواند وضعیت دیتابیس را گزارش کند.

اولویت: Must

### PBI-01-03 - قرارداد خطا، pagination و response مشترک

به عنوان frontend، می‌خواهم responseها و خطاها الگوی ثابت داشته باشند تا مدیریت state و toast ساده شود.

معیار پذیرش:

- خطاهای validation، authorization، not found و conflict ساختار ثابت داشته باشند.
- helper مشترک برای pagination شامل `page`، `limit/pageSize`، `total` و `totalPages` وجود داشته باشد.
- middleware برای request id اضافه شود.

اولویت: Must

## Epic 02 - احراز هویت، نشست و RBAC

### PBI-02-01 - ورود ادمین با JWT

به عنوان ادمین، می‌خواهم با ایمیل و رمز عبور وارد شوم تا به پنل دسترسی داشته باشم.

معیار پذیرش:

- `POST /api/v1/auth/login` ایمیل، password و `rememberMe` دریافت کند.
- رمز عبور hash شده ذخیره و بررسی شود.
- response شامل `user`، `accessToken`، `refreshToken` و زمان انقضا باشد.
- خطای credential اشتباه بدون افشای جزئیات حساب برگردد.

اولویت: Must

### PBI-02-02 - دریافت و تمدید نشست

به عنوان frontend، می‌خواهم نشست ادمین را validate و تمدید کنم تا refresh صفحه باعث خروج ناخواسته نشود.

معیار پذیرش:

- `GET /api/v1/auth/me` کاربر جاری را برگرداند.
- `POST /api/v1/auth/refresh` access token جدید تولید کند.
- `POST /api/v1/auth/logout` refresh token را revoke کند.

اولویت: Must

### PBI-02-03 - مجوزهای نقش‌ها

به عنوان مالک سیستم، می‌خواهم هر نقش فقط به عملیات مجاز دسترسی داشته باشد.

معیار پذیرش:

- `super_admin` به همه endpointها دسترسی داشته باشد.
- `inventory_manager` به محصول، دسته‌بندی، موجودی، سفارش و ارسال دسترسی عملیاتی داشته باشد.
- `support_agent` به تیکت، نظر، مشتری و مشاهده سفارش دسترسی داشته باشد.
- تست authorization برای حداقل ۱۰ endpoint حساس وجود داشته باشد.

اولویت: Must

## Epic 13 - مشاهده‌پذیری و امنیت عملیاتی

### PBI-13-01 - لاگ ساختاریافته و audit log

به عنوان تیم فنی، می‌خواهم عملیات حساس قابل ردیابی باشد.

معیار پذیرش:

- login، logout، تغییر نقش، تغییر موجودی، تغییر وضعیت سفارش، حذف محصول و تغییر تنظیمات audit شوند.
- لاگ‌ها request id داشته باشند.
- داده حساس مثل password و token در log ذخیره نشود.

اولویت: Must
