# برنامه اتصال APIهای پنل به صفحات

این پوشه برنامه اجرایی جایگزینی mock serviceهای رابط کاربری با APIهای واقعی
`src/entities` را مشخص می‌کند. مبنا، قراردادهای `product/api` و وضعیت فعلی صفحات
در `src/pages` است.

## هدف و محدوده

- پوشش کامل ۶۳ endpoint موجود، بدون اختراع قرارداد برای APIهای مستندنشده.
- حفظ مرز FSD: قرارداد و transport در `entities`، orchestration و state در
  `features`/`widgets` و composition در `pages`.
- حذف تدریجی وابستگی صفحات به `features/*/api/mock*Service.ts`.
- نگهداری typeهای wire در entity و تعریف ViewModel یا mapper فقط وقتی شکل فعلی UI
  با response واقعی متفاوت است.
- تحویل هر sprint به‌صورت قابل build، قابل rollback و مستقل از sprint بعدی تا حد
  ممکن.

## ترتیب اجرایی پیشنهادی

| ترتیب اجرا | سند | صفحات/سطح | تعداد endpoint |
|---:|---|---|---:|
| 1 | [Sprint 01](./sprint-01-foundation-security.md) | Login، session، shell و health | 8 |
| 2 | [Sprint 06-A](./sprint-06-media-operations.md) | زیرساخت upload موردنیاز فرم محصول | 1 از 3 |
| 3 | [Sprint 02](./sprint-02-catalog-inventory.md) | Products و Categories | 18 |
| 4 | [Sprint 04](./sprint-04-support-crm.md) | Customers، Feedback، Support و Notifications | 17 |
| 5 | [Sprint 05](./sprint-05-commerce-content-analytics.md) | Coupons، Homepage Builder و Dashboard | 17 |
| 6 | [Sprint 06-B](./sprint-06-media-operations.md) | avatar، reset و hardening | 2 از 3 |
| مسدود | [Sprint 03](./sprint-03-orders-settings.md) | Orders و بخش‌های Settings | 0 |

Sprint 06 به دو بخش اجرایی تقسیم شده چون `POST /products` در قرارداد نهایی به
`imageMediaId` نیاز دارد؛ بنابراین uploader باید قبل از اتصال mutationهای محصول
آماده باشد.

## پوشش قرارداد

| دامنه | تعداد |
|---|---:|
| Health | 4 |
| Auth | 5 |
| Product | 7 |
| Category | 11 |
| Customer | 4 |
| Review | 4 |
| Ticket | 5 |
| Notification | 4 |
| Coupon | 7 |
| Homepage | 8 |
| Storefront | 1 |
| Analytics | 1 |
| Media | 1 |
| Settings operation | 1 |
| **جمع** | **63** |

## تصمیم‌های معماری مشترک

### لایه داده

1. `src/config/api.ts` فقط transport، header، parse و `ApiError` را مدیریت کند.
2. هر feature فقط public API همان entity را import کند؛ import مستقیم از
   `entities/*/api` یا `entities/*/types` ممنوع باشد.
3. query keyها در model همان feature متمرکز شوند، برای مثال:
   `['products', 'list', filters]` و `['products', 'detail', id]`.
4. چون TanStack Query در پروژه نصب نیست، اولین task اتصال داده افزودن
   `@tanstack/react-query` و `QueryClientProvider` است.
5. entity DTO نباید برای سازگارشدن با UI تغییر کند. تبدیل decimal string، نام
   فیلدها یا enumهای نمایشی در mapper feature انجام شود.

### نشست و خطا

- access/refresh token با انتخاب `rememberMe` در storage مناسب ذخیره شوند.
- refresh فقط به‌صورت single-flight اجرا شود و token pair اتمیک جایگزین شود.
- روی `invalid_refresh_token` کل نشست پاک شود.
- `validation_error.details.fields` به فیلد فرم نگاشت شود.
- branchهای UI با `ApiError.code` و `details.reason` انجام شوند، نه متن پیام.
- `requestId` برای خطاهای غیرمنتظره در toast یا error panel قابل کپی باشد.
- mutation غیر idempotent retry خودکار نداشته باشد.

### وضعیت‌های صفحه

هر query باید چهار وضعیت loading، error، empty و success داشته باشد. mutationها
نیز pending state، جلوگیری از submit تکراری، پیام موفقیت و rollback/refetch مشخص
داشته باشند.

### feature flag و rollback

تا پایان هر sprint می‌توان انتخاب service را پشت `VITE_DATA_SOURCE=mock|api`
نگه داشت. شرط خروج از sprint این است که حالت `api` کامل باشد؛ mock فقط یک مسیر
rollback موقت است و نباید mapper یا type مشترک با entity بسازد.

## Definition of Done مشترک

- هیچ import از mock service در scope همان sprint باقی نمانده باشد.
- endpointهای جدول sprint در تست API/model پوشش داده شده باشند.
- TypeScript و production build موفق باشند.
- رفتار 401/403/404/409/422/429 مطابق قرارداد نمایش داده شود.
- invalidation پس از mutation بررسی شده باشد.
- کنترل دسترسی بر اساس role هم در UI و هم با واکنش درست به 403 اعمال شود.
- requestهای درحال اجرا هنگام unmount یا تغییر filter با `AbortSignal` لغو شوند.
- resetهای mock از صفحات production حذف یا فقط در ابزار development نگهداری شوند.

## خارج از محدوده فعلی

برای order، store settings، shipping methods و staff هیچ handoff در
`product/api` وجود ندارد. این صفحه‌ها تا دریافت قرارداد Sprint 03 نباید به API
حدسی متصل شوند.
