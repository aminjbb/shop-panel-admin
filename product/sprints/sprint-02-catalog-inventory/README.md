# Sprint 02 - Catalog & Inventory

هدف: جایگزینی mockهای محصول و دسته‌بندی با API واقعی و مدل دیتابیس پایدار.

## Epic 03 - مدیریت کاتالوگ محصول و موجودی

### PBI-03-01 - لیست محصولات با جستجو، فیلتر، مرتب‌سازی و صفحه‌بندی

معیار پذیرش:

- `GET /api/v1/products` پارامترهای `search`، `category`، `stockStatus`، `sortBy`، `page` و `pageSize` را پشتیبانی کند.
- جستجو در title، SKU، description، نام و SKU واریانت‌ها انجام شود.
- response شامل `products`، `totalCount`، `page`، `pageSize`، `totalPages` و `activeFiltersCount` باشد.

اولویت: Must

### PBI-03-02 - ایجاد و ویرایش محصول با واریانت

معیار پذیرش:

- `POST /api/v1/products` محصول با حداقل title، sku، category، price، image و variants بسازد.
- `PATCH /api/v1/products/{id}` اطلاعات محصول و واریانت‌ها را ویرایش کند.
- SKU محصول و SKU هر واریانت یکتا باشد.
- `totalStock` و `stockStatus` از مجموع stock واریانت‌ها محاسبه شود.
- در صورت نبود واریانت، امکان ساخت واریانت پیش‌فرض وجود داشته باشد.

اولویت: Must

### PBI-03-03 - حذف محصول و محافظت وابستگی‌ها

معیار پذیرش:

- `DELETE /api/v1/products/{id}` حذف soft یا archive انجام دهد.
- اگر محصول در سفارش، صفحه اصلی یا نظر استفاده شده، رفتار مشخص باشد: archive یا خطای conflict.
- تست conflict برای محصول دارای سفارش وجود داشته باشد.

اولویت: Should

### PBI-03-04 - تغییر سریع موجودی

معیار پذیرش:

- `PATCH /api/v1/products/{id}/stock` ورودی `variantId` و `delta` بگیرد.
- موجودی منفی نشود.
- تغییر موجودی در audit log ثبت شود.
- در صورت رسیدن به آستانه کمبود، اعلان low stock تولید شود.

اولویت: Must

### PBI-03-05 - مدیریت داده SEO محصول

معیار پذیرش:

- slug محصول یکتا باشد.
- محدودیت طول meta title و meta description validate شود.
- `noIndex` و `focusKeywords` ذخیره و برگردانده شوند.
- endpoint `GET /api/v1/products/slug-check` وجود داشته باشد.

اولویت: Should

## Epic 04 - دسته‌بندی درختی و ویژگی‌ها

### PBI-04-01 - لیست و درخت دسته‌بندی‌ها

معیار پذیرش:

- `GET /api/v1/categories` فیلتر `search`، `status`، `parentId` و `sortBy` را پشتیبانی کند.
- `GET /api/v1/categories/tree` ساختار `children`، `depth` و `pathNames` را برگرداند.
- `GET /api/v1/categories/stats` آمار کلی را برگرداند.

اولویت: Must

### PBI-04-02 - ایجاد و ویرایش دسته‌بندی با attributes

معیار پذیرش:

- `POST /api/v1/categories` و `PATCH /api/v1/categories/{id}` از attributeهای `text`، `number` و `select` پشتیبانی کنند.
- slug دسته‌بندی یکتا باشد.
- parent نمی‌تواند خود دسته یا یکی از فرزندانش باشد.
- برای select attribute، گزینه‌ها validate و ذخیره شوند.

اولویت: Must

### PBI-04-03 - حذف هوشمند دسته‌بندی

معیار پذیرش:

- `DELETE /api/v1/categories/{id}?cascadeDelete=true|false` پیاده‌سازی شود.
- در حالت cascade، همه descendants حذف یا archive شوند.
- در حالت غیر cascade، فرزندان مستقیم به parent قبلی منتقل شوند.
- response شامل `deletedIds` و `reassignedIds` باشد.

اولویت: Should

### PBI-04-04 - تغییر وضعیت و ترتیب نمایش دسته‌ها

معیار پذیرش:

- `PATCH /api/v1/categories/{id}/toggle-status` وضعیت فعال را تغییر دهد.
- `PATCH /api/v1/categories/reorder` آرایه `orderedIds` دریافت کند.
- تغییر ترتیب atomic باشد.

اولویت: Should
