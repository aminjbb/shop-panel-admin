# Sprint 06 — اتصال Media و Operations

## هدف

تکمیل جریان upload تصویر محصول، avatar مدیر، reset امن داده توسعه و رفتارهای
عملیاتی نرخ درخواست.

## تقسیم اجرایی

- **Sprint 06-A:** upload عمومی media؛ پیش‌نیاز create/edit محصول در Sprint 02.
- **Sprint 06-B:** avatar، reset development و hardening پس از اتصال صفحات اصلی.

## صفحات و فایل‌های درگیر

- `src/features/products/ui/ProductFormModal.tsx`
- `src/features/homepage/ui/SectionConfigModal.tsx`
- `src/shared-app/appHeader/HeaderUserMenu.tsx`
- `src/features/auth/context/AuthContext.tsx`
- reset actionهای فعلی Products/Feedback/Homepage/Settings
- `src/config/api.ts`

## endpointهای این sprint — 3 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `mediaApi.upload` | `POST /media/upload` | تصویر product/homepage/store logo |
| `authApi.changeAvatar` | `PATCH /auth/me/avatar` | پروفایل مدیر جاری |
| `settingsApi.resetDevelopmentData` | `POST /settings/reset-dev-data` | ابزار local/test |

Rate limit روی login/refresh endpoint جدیدی نیست و در Sprint 01 مدیریت می‌شود.

## backlog اجرایی

### CS-06-01 — Upload component/model مشترک

- file input در feature مالک فرم باقی بماند؛ `mediaApi` فقط transport باشد.
- client-side validation برای JPEG/PNG/WebP و حداکثر ۵ MiB اضافه شود، اما پاسخ
  server همچنان authority باشد.
- browser boundary را خودش بسازد؛ `Content-Type: multipart/form-data` دستی تنظیم
  نشود.
- upload duplicate غیرفعال و progress حداقل به‌صورت pending نمایش داده شود.
- `422 http_error` به خطای انتخاب فایل و `422 validation_error` به field error
  تبدیل شود.
- URL نسبی با `resolveApiAssetUrl` resolve و ID اصلی جداگانه نگهداری شود.

### CS-06-02 — اتصال تصویر Product

- `kind='product'` ارسال شود.
- ID پاسخ در `CreateProductInput.imageMediaId` قرار گیرد.
- در edit، upload فقط با انتخاب فایل جدید انجام شود.
- روی conflict `media/missing_or_inactive` فرم محصول حفظ و انتخاب upload مجدد
  پیشنهاد شود.
- upload موفق ولی submit محصول ناموفق asset orphan احتمالی است؛ چون delete API
  وجود ندارد، retry فرم باید همان media ID را تا زمان معتبر بودن reuse کند.

### CS-06-03 — اتصال تصویر Homepage/Store Logo

- editor بنر/hero از `kind='homepage'` استفاده کند و URL پایدار را داخل config
  قرار دهد.
- store logo فقط وقتی contract تنظیمات Sprint 03 ارائه شد به Settings متصل شود؛
  فعلاً فقط uploader domain پشتیبانی می‌کند.
- external URL به media upload ارسال نشود.

### CS-06-04 — Avatar مدیر جاری

- avatar action در HeaderUserMenu یا profile sheet اضافه شود.
- `authApi.changeAvatar({file})` اجرا و AdminUser کامل برگشتی در session state
  جایگزین شود.
- هدف user از UI/URL دریافت نشود؛ endpoint فقط کاربر جاری را تغییر می‌دهد.
- در خطا avatar قبلی حفظ شود.

### CS-06-05 — Reset development data

- action فقط وقتی build environment محلی/test است و role برابر `super_admin`
  نمایش داده شود.
- confirmation دقیق `development-data` از کاربر دریافت شود.
- برای هر reset عمدی key جدید ساخته شود؛ retry همان intent همان key را نگه دارد.
- پس از 204 تمام cacheهای catalog، inventory، customers، reviews، tickets،
  notifications، coupons، homepage، analytics، media و settings invalidate/clear
  شوند.
- تمام resetهای اختصاصی mock از صفحات حذف شوند.
- 403 محیط production به‌عنوان action ممنوع مدیریت شود، نه خطای قابل retry.

### CS-06-06 — Security و rate-limit UX

- `Retry-After` و `details.retryAfterSeconds` در login/refresh مصرف شوند.
- فرم تا پایان زمان غیرفعال بماند و retry loop ایجاد نشود.
- frontend به cookie یا credentialed CORS وابسته نباشد.
- `X-Request-ID` در error diagnostics حفظ شود.
- هیچ منطق frontend بر وجود CSP فرض نکند.

## تست‌های ضروری

- multipart بدون Content-Type دستی و ارسال صحیح kind/file.
- فایل خالی، نوع نامعتبر و بزرگ‌تر از ۵ MiB.
- resolve URL نسبی و عبور URL مطلق بدون تغییر معنایی.
- product upload سپس create، و reuse ID پس از خطای create.
- avatar update و حفظ avatar قبلی در failure.
- reset role/environment/confirmation/idempotency و پاک‌سازی cacheها.
- login/refresh rate-limit countdown بدون auto retry.

## خروجی sprint

- هر سه endpoint عملیات/رسانه متصل باشند.
- هیچ reset mock در runtime production باقی نماند.
- فرم محصول مطابق قرارداد نهایی Sprint 06 فقط `imageMediaId` ارسال کند.
