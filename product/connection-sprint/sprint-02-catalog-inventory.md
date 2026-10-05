# Sprint 02 — اتصال Catalog و Inventory

## هدف

جایگزینی mockهای Product و Category با API واقعی، با حفظ فرم‌ها، جدول‌ها، فیلترها
و رفتار موجودی.

## وابستگی

- Sprint 01 کامل باشد.
- بخش upload رسانه از Sprint 06 آماده باشد؛ create product بدون `imageMediaId`
  معتبر نیست.

## صفحات و فایل‌های درگیر

- `src/pages/ProductsPage.tsx`
- `src/widgets/products/ui/ProductCatalogWidget.tsx`
- `src/features/products/hooks/useProducts.ts`
- `src/features/products/ui/*`
- `src/pages/CategoriesPage.tsx`
- `src/features/categories/hooks/useCategories.ts`
- `src/features/categories/ui/*`
- `src/features/products/api/mockProductService.ts`
- `src/features/categories/api/mockCategoryService.ts`

## endpointهای Product — 7 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `productApi.list` | `GET /products` | جدول/کارت، search، filter، sort، pagination |
| `productApi.get` | `GET /products/{id}` | بازکردن edit/detail و refetch |
| `productApi.create` | `POST /products` | فرم ایجاد پس از upload |
| `productApi.update` | `PATCH /products/{id}` | فرم ویرایش؛ variants جایگزینی کامل |
| `productApi.archive` | `DELETE /products/{id}` | تأیید حذف/آرشیو |
| `productApi.adjustStock` | `PATCH /products/{id}/stock` | quick stock control |
| `productApi.checkSlug` | `GET /products/slug-check` | بررسی debounce شده slug |

## endpointهای Category — 11 مورد

| Entity method | Endpoint | جریان UI |
|---|---|---|
| `categoryApi.productOptions` | `GET /products/category-options` | select دسته در فرم محصول |
| `categoryApi.list` | `GET /categories` | لیست flat و parent options |
| `categoryApi.get` | `GET /categories/{id}` | detail/edit |
| `categoryApi.tree` | `GET /categories/tree` | جدول درختی |
| `categoryApi.stats` | `GET /categories/stats` | کارت‌های آمار |
| `categoryApi.create` | `POST /categories` | فرم ایجاد/فرزند |
| `categoryApi.update` | `PATCH /categories/{id}` | فرم ویرایش |
| `categoryApi.archive` | `DELETE /categories/{id}` | cascade یا reassign |
| `categoryApi.toggleStatus` | `PATCH /categories/{id}/toggle-status` | کنترل وضعیت |
| `categoryApi.reorder` | `PATCH /categories/reorder` | ذخیره ترتیب |
| `categoryApi.checkSlug` | `GET /categories/slug-check` | validation advisory |

## backlog اجرایی

### CS-02-01 — Mapper و query model محصولات

- typeهای `@/types/product` را از network boundary حذف کنید.
- mapper برای decimal string قیمت، UUID دسته، nullable metadata و variantهای API
  تعریف کنید.
- enum sort فعلی camelCase را به مقادیر wire مانند `created_at_desc` نگاشت کنید.
- فیلتر `all` را به omission در query تبدیل کنید.
- debounce جستجو و cancel درخواست قبلی را اضافه کنید.

معیار پذیرش: pagination صرفاً از `page/pageSize/totalPages` پاسخ استفاده کند و
filter count محلی حدس زده نشود.

### CS-02-02 — Queryهای ProductsPage

- list query با key شامل تمام filterها.
- detail query فقط هنگام بازشدن فرم/detail فعال شود.
- loading/error/empty/success مستقل برای desktop و mobile.
- پاسخ stale یا page خارج از محدوده باعث crash نشود.

### CS-02-03 — Create/Edit محصول

- ابتدا فایل با `mediaApi.upload({kind:'product'})` ارسال شود.
- `MediaAsset.id` به `imageMediaId` تبدیل و سپس create/update اجرا شود.
- در edit، اگر تصویر عوض نشده `imageMediaId` فعلی حفظ شود.
- `image` هرگز در request ارسال نشود و فقط برای preview/render استفاده شود.
- variants در update به‌صورت مجموعه کامل فرستاده شوند؛ variant موجود `id` داشته
  باشد و variant جدید بدون `id` ارسال شود.
- conflictهای `sku_taken`، `variant_sku_taken`، `slug_taken`،
  `inactive_or_missing`، `variant_has_inventory_history` و media
  `missing_or_inactive` روی UI مناسب نمایش داده شوند.

### CS-02-04 — Stock mutation

- برای هر intent یک `Idempotency-Key` تازه بسازید.
- همان key فقط برای retry دقیق همان product/variant/delta نگهداری شود.
- mutationهای یک variant serialize شوند.
- optimistic update فقط با rollback قطعی انجام شود؛ روی `negative_stock` یا
  `idempotency_key_reused` detail/list refetch شود.
- پس از موفقیت list، detail و notification query invalidate شوند.

### CS-02-05 — Category queries و mutations

- tree، list و stats جداگانه cache شوند.
- status نمایشی `all|active|inactive` به `undefined|true|false` تبدیل شود.
- create child مقدار `parentId` واقعی را ارسال کند.
- attributes بدون `id` محلی به input API تبدیل شوند.
- delete dialog انتخاب روشن `cascadeDelete` داشته باشد و نتیجه
  `deletedIds/reassignedIds` را اعمال یا refetch کند.
- reorder کل آرایه لازم را یک‌بار و با pending lock ارسال کند.
- روی هر mutation، list/tree/stats/productOptions invalidate شوند.

### CS-02-06 — پاک‌سازی mock و reset

- importهای `mockProductService` و `mockCategoryService` از runtime حذف شوند.
- resetهای مخصوص هر mock حذف شوند؛ reset عمومی development در Sprint 06 انجام
  می‌شود.
- constant دسته‌های hardcoded با `categoryApi.productOptions` جایگزین شود.

## تست‌های ضروری

- تبدیل filter/sort UI به query wire.
- قیمت decimal string بدون خطای اعشاری در نمایش و submit.
- create/edit با upload موفق و upload conflict.
- replacement کامل variants و جلوگیری از حذف variant دارای history.
- idempotency تغییر stock و rollback خطا.
- category tree، delete cascade/reassign، toggle و reorder.
- invalidation تمام cacheهای وابسته.

## خروجی sprint

ProductsPage و CategoriesPage بدون mock کار کنند و تمام ۱۸ endpoint این sprint
از public API entityها مصرف شوند.

## وضعیت پیاده‌سازی frontend

- [x] هر ۷ endpoint محصول در `entities/product` با request/response type مستقل تعریف شد.
- [x] هر ۱۱ endpoint دسته‌بندی در `entities/category` با typeهای مستقل تعریف شد.
- [x] typeهای wire از ViewModelهای Product و Category جدا و mapperهای دوطرفه اضافه شدند.
- [x] ProductsPage به list/detail/create/update/archive/stock/slug-check واقعی متصل شد.
- [x] CategoriesPage به list/detail/tree/stats/create/update/archive/toggle/reorder/slug-check واقعی متصل شد.
- [x] category options از API دریافت می‌شود و constantهای hardcoded حذف شدند.
- [x] جستجو debounce، لغو request قبلی، mapping فیلتر `all` و sort wire پیاده‌سازی شد.
- [x] upload تصویر و تبدیل `MediaAsset.id` به `imageMediaId` پیش از ذخیره محصول اضافه شد.
- [x] stock mutation با `Idempotency-Key`، صف مستقل هر variant، rollback و refetch تعارض‌ها پیاده‌سازی شد.
- [x] mock serviceها و resetهای Product/Category از runtime و repository حذف شدند.
- [x] TypeScript check و production build با موفقیت اجرا شد.
- [ ] تست end-to-end سناریوهای این سند به backend در حال اجرا نیاز دارد.

> مبنای ورودی تصویر، قرارداد تجمیع‌شده فعلی پروژه است: override اسپرینت ۰۶
> (`imageMediaId`) بر نمونه قدیمی‌تر `image` در handoff اولیه اسپرینت ۰۲ اولویت دارد.
