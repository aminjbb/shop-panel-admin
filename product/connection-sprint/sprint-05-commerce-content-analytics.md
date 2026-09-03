# Sprint 05 — اتصال Commerce، Content و Analytics

## هدف

اتصال CouponsPage، HomepageBuilderPage و بخش analytics داشبورد به ۱۷ endpoint
واقعی و جداسازی draft homepage از storefront published snapshot.

## صفحات و فایل‌های درگیر

- `src/pages/CouponsPage.tsx`
- `src/features/coupons/hooks/useCoupons.ts`
- `src/features/coupons/ui/*`
- `src/pages/HomepageBuilderPage.tsx`
- `src/features/homepage/hooks/useHomepageBuilder.ts`
- `src/features/homepage/ui/*`
- `src/pages/DashboardPage.tsx`
- `src/features/analytics/hooks/useAnalytics.ts`
- `src/features/analytics/ui/*`

## endpointهای Coupon — 7 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `couponApi.list` | `GET /coupons` | لیست، filter و pagination |
| `couponApi.get` | `GET /coupons/{id}` | detail/edit |
| `couponApi.create` | `POST /coupons` | فرم ایجاد |
| `couponApi.update` | `PATCH /coupons/{id}` | فرم ویرایش partial |
| `couponApi.toggleStatus` | `PATCH /coupons/{id}/toggle-status` | فعال/غیرفعال |
| `couponApi.archive` | `DELETE /coupons/{id}` | آرشیو |
| `couponApi.validate` | `POST /coupons/validate` | preview عمومی اعتبارسنجی |

## endpointهای Homepage — 8 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `homepageApi.listSections` | `GET /homepage/sections` | draft section list |
| `homepageApi.getStats` | `GET /homepage/stats` | stats cards |
| `homepageApi.createSection` | `POST /homepage/sections` | افزودن سکشن |
| `homepageApi.replaceSection` | `PATCH /homepage/sections/{id}` | جایگزینی کامل سکشن |
| `homepageApi.reorderSections` | `PATCH /homepage/sections/reorder` | drag/drop order |
| `homepageApi.toggleSection` | `PATCH /homepage/sections/{id}/toggle-active` | toggle draft |
| `homepageApi.archiveSection` | `DELETE /homepage/sections/{id}` | آرشیو draft |
| `homepageApi.publish` | `POST /homepage/publish` | انتشار snapshot |

## endpointهای Storefront و Analytics — 2 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `storefrontApi.getHomepage` | `GET /storefront/homepage` | live preview نسخه published |
| `analyticsApi.getDashboard` | `GET /analytics/dashboard` | Dashboard analytics tab |

## backlog اجرایی

### CS-05-01 — Coupons query و mapper

- typeهای قدیمی coupon از `@/types/crm` در network boundary حذف شوند.
- enum قدیمی `fixed_amount` به wire value صحیح `fixed` نگاشت یا UI اصلاح شود.
- value و minOrderValue decimal string بمانند؛ تبدیل عددی فقط برای input/display
  کنترل‌شده باشد.
- status ممکن است هنگام list توسط backend به `expired` تغییر کند؛ response منبع
  حقیقت باشد.
- pagination از `totalCount/page/limit` ساخته شود.

### CS-05-02 — Coupon mutations و validation

- create/update field validationهای 422 را روی فرم نمایش دهند.
- conflictهای `code_taken`، `percentage_range`، `invalid_dates_or_value` و
  `usage_limit_below_used_count` branch مجزا داشته باشند.
- toggle روی coupon منقضی reason برابر `expired_requires_date_extension` را به
  CTA ویرایش تاریخ تبدیل کند.
- validate عمومی بدون Authorization اجرا شود و نتیجه صرفاً preview باشد؛ هیچ
  usedCount محلی افزایش نیابد.
- پس از mutation، list/detail invalidate شوند؛ toggle auto-retry نداشته باشد.

### CS-05-03 — Homepage DTO و config adapter

- enumهای UI فعلی با wire typeهای `hero|banner_grid_2|banner_grid_3|`
  `product_carousel|rich_text` یکسان شوند.
- config باز بماند و adapter فقط فیلدهای شناخته‌شده هر editor را بسازد.
- برای banner grid تعداد دقیق banner و URL امن HTTPS پیش از submit بررسی شود.
- product picker فقط UUID محصولات active را در `productIds` قرار دهد.
- update با وجود نام PATCH، **full replacement** است؛ کل SectionInput ارسال شود.

### CS-05-04 — Reorder، toggle و archive

- reorder همیشه تمام IDهای draft غیرآرشیوی، شامل inactiveها، را بفرستد.
- drag/drop در زمان mutation lock شود و در خطا به ترتیب server rollback/refetch
  کند.
- conflict `ordered_ids_must_match_active_sections` باعث list refetch و درخواست
  تکرار دستی شود.
- archive پس از 204 list/stats را invalidate کند.
- toggle non-idempotent باشد و duplicate interaction مسدود شود.

### CS-05-05 — Publish و preview

- publish CTA dirty-state روشن و pending lock داشته باشد.
- پاسخ publish در cache مستقل `publishedHomepage` ذخیره شود.
- draft mutation نباید storefront cache را invalidate کند؛ فقط publish موفق این
  کار را انجام دهد.
- live preview دو حالت واضح Draft Preview و Published Preview داشته باشد؛ حالت
  Published از `storefrontApi.getHomepage` استفاده کند.
- 404 `published_homepage` به empty state «هنوز منتشر نشده» تبدیل شود.

### CS-05-06 — Analytics dashboard

- `useAnalytics` از `analyticsApi.getDashboard` با query key شامل timeRange
  استفاده کند.
- همه money/percentageها decimal string در DTO بمانند و در formatter صفحه تبدیل
  شوند.
- تاریخ‌های sales trend همان label برگشتی server و timezone برگشتی را مصرف کنند.
- snippetها حداکثر ۵ مورد تلقی شوند؛ UI total بیشتر را حدس نزند.
- Dashboard security tab از session Sprint 01 مستقل باقی بماند.

### CS-05-07 — RBAC و پاک‌سازی mock

- `inventory_manager`: read coupon/homepage/analytics، بدون write coupon/homepage.
- `super_admin`: همه عملیات.
- `support_agent`: action و routeهای private Sprint 05 مخفی.
- `couponApi.validate` و storefront public هستند و token header ارسال نکنند.
- importهای `mockCouponService`، `mockHomepageService` و `mockAnalyticsService`
  حذف شوند.
- resetهای اختصاصی mock با عملیات مرکزی development جایگزین شوند.

## تست‌های ضروری

- coupon decimal/enum mapper، conflictها و validate بدون auth.
- section full replacement و config constraints.
- reorder شامل inactiveها، rollback و conflict recovery.
- draft mutation بدون invalidation storefront و publish با invalidation.
- storefront 404 before-first-publish.
- analytics چهار timeRange و نمایش decimal/timezone.
- role matrix برای read/writeها.

## خروجی sprint

CouponsPage، HomepageBuilderPage و analytics dashboard بدون mock کار کنند؛ هر ۱۷
endpoint این sprint متصل و draft/published cache از هم مستقل باشند.
