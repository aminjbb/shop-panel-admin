# Sprint 03 — Orders و Settings

## وضعیت: مسدود به‌دلیل نبود قرارداد frontend handoff

صفحات زیر در UI وجود دارند، اما هیچ قرارداد واقعی متناظر در `product/api` و هیچ
entity API برای آن‌ها ارائه نشده است:

- `src/pages/OrdersPage.tsx`
- `src/features/orders/*`
- `src/pages/SettingsPage.tsx`
- `src/features/settings/hooks/useStoreSettings.ts`
- `src/features/settings/hooks/useShippingMethods.ts`
- `src/features/settings/hooks/useAdminStaff.ts`

`settingsApi.resetDevelopmentData` فقط یک عملیات local/test است و جایگزین API
تنظیمات فروشگاه، روش ارسال یا مدیریت پرسنل نیست.

## endpointهای موردنیاز پیش از شروع

Backend باید handoff نهایی حداقل برای موارد زیر ارائه کند:

- order list، stats، detail و fulfillment update.
- payment status update، invoice/print contract در صورت server-side بودن.
- get/update store settings.
- list/create/update/toggle/archive shipping method.
- list/create/update-role/toggle/archive admin staff.
- permission matrix، pagination، error reasons و decimal/date serialization.

## کارهای مجاز تا رفع blocker

- mockها پشت `VITE_DATA_SOURCE=mock` باقی بمانند.
- UI و ViewModelها می‌توانند مستقل refactor شوند، اما network type یا endpoint
  حدسی ساخته نشود.
- صفحه production باید واضحاً حالت demo/mock را نشان دهد یا route آن غیرفعال
  باشد؛ داده mock نباید به‌عنوان داده واقعی نمایش داده شود.
- resetهای mock با reset واقعی development اشتباه گرفته نشوند.

## معیار ورود به sprint اتصال

- فایل `product/api/sprint-03-...-frontend-handoff.md` اضافه شده باشد.
- entityهای `order`، `storeSettings`، `shippingMethod` و `adminStaff` بر اساس
  قرارداد freeze‌شده ایجاد شده باشند.
- تست contract backend و role permission مشخص شده باشد.

## Definition of Done آینده

- تمام importهای `mockOrderService` و `mockSettingsService` حذف شوند.
- OrdersPage و هر سه بخش Settings چهار وضعیت داده را پوشش دهند.
- mutationها invalidation، error mapping و permission guard کامل داشته باشند.
