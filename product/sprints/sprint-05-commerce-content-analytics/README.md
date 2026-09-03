# Sprint 05 - Commerce, Content & Analytics

هدف: تکمیل قابلیت‌های فروش، صفحه اصلی و داشبورد تحلیلی.

## Epic 07 - کوپن و پروموشن

### PBI-07-01 - لیست و جزئیات کوپن

معیار پذیرش:

- `GET /api/v1/coupons` فیلتر `search`، `status`، `type`، pagination و sort را پشتیبانی کند.
- `GET /api/v1/coupons/{id}` جزئیات کوپن را برگرداند.
- وضعیت expired بر اساس `endDate` محاسبه یا sync شود.

اولویت: Should

### PBI-07-02 - ایجاد و ویرایش کوپن

معیار پذیرش:

- `POST /api/v1/coupons` و `PATCH /api/v1/coupons/{id}` پیاده‌سازی شوند.
- code یکتا و uppercase شود.
- برای percentage مقدار بین ۱ تا ۱۰۰ باشد.
- `startDate` از `endDate` کوچک‌تر باشد.
- `usageLimit` کمتر از `usedCount` نشود.

اولویت: Should

### PBI-07-03 - فعال/غیرفعال کردن و حذف کوپن

معیار پذیرش:

- `PATCH /api/v1/coupons/{id}/toggle-status` active و disabled را تغییر دهد.
- کوپن expired فقط با تمدید تاریخ بتواند active شود.
- `DELETE /api/v1/coupons/{id}` حذف soft انجام دهد.

اولویت: Could

### PBI-07-04 - اعتبارسنجی کوپن برای سفارش

معیار پذیرش:

- `POST /api/v1/coupons/validate` کد، customerId، cartTotal و categoryIds را دریافت کند.
- minOrderValue، بازه تاریخ، status و usageLimit بررسی شود.
- مقدار تخفیف محاسبه و برگردانده شود.

اولویت: Should

## Epic 09 - صفحه‌ساز صفحه اصلی و بنرها

### PBI-09-01 - دریافت layout و آمار سکشن‌ها

معیار پذیرش:

- `GET /api/v1/homepage/sections` سکشن‌ها را بر اساس `displayOrder` برگرداند.
- `GET /api/v1/homepage/stats` آمار totalSections، activeSections، totalBanners، totalProductsLinked و heroSlidesCount را برگرداند.

اولویت: Should

### PBI-09-02 - ایجاد و ویرایش سکشن

معیار پذیرش:

- `POST /api/v1/homepage/sections` نوع سکشن را دریافت و ساختار معتبر بسازد.
- `PATCH /api/v1/homepage/sections/{id}` تنظیمات سکشن را ویرایش کند.
- برای `banner_grid_2` دقیقا ۲ بنر و برای `banner_grid_3` دقیقا ۳ بنر validate شود.
- productIds باید به محصول فعال اشاره کنند.

اولویت: Should

### PBI-09-03 - ترتیب، فعال‌سازی و حذف سکشن‌ها

معیار پذیرش:

- `PATCH /api/v1/homepage/sections/reorder` آرایه orderedIds دریافت کند.
- `PATCH /api/v1/homepage/sections/{id}/toggle-active` وضعیت فعال را تغییر دهد.
- `DELETE /api/v1/homepage/sections/{id}` سکشن را حذف و displayOrder را normalize کند.

اولویت: Should

### PBI-09-04 - انتشار نسخه صفحه اصلی

معیار پذیرش:

- مدل draft و published برای layout وجود داشته باشد.
- `POST /api/v1/homepage/publish` نسخه فعال جدید بسازد.
- API public برای storefront فقط نسخه published را برگرداند.

اولویت: Could

## Epic 11 - داشبورد تحلیلی

### PBI-11-01 - خلاصه داشبورد فروش

معیار پذیرش:

- `GET /api/v1/analytics/dashboard?timeRange=7d|30d|90d|1y` پیاده‌سازی شود.
- شاخص‌های totalRevenue، totalOrdersCount، averageOrderValue و newCustomersCount بر اساس داده واقعی محاسبه شوند.
- `salesTrend`، `categorySalesShare`، `recentOrdersSnippet` و `topCustomersSnippet` برگردانده شوند.
- kpiها شامل value، formattedValue، changePercentage، isPositive و comparisonLabel باشند.

اولویت: Should

### PBI-11-02 - محاسبه تغییرات نسبت به دوره قبل

معیار پذیرش:

- برای هر timeRange دوره قبل متناظر محاسبه شود.
- تقسیم بر صفر کنترل شود.
- trendها بر اساس timezone تنظیم‌شده فروشگاه bucket شوند.

اولویت: Could
