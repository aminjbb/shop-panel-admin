# نقشه API مورد نیاز برای اتصال پنل به FastAPI

این سند endpointهای پیشنهادی را بر اساس typeها، hookها و mock serviceهای فعلی frontend فهرست می‌کند. هدف این است که frontend با کمترین تغییر از `localStorage` و mock service به backend واقعی وصل شود.

## قراردادهای مشترک

Base URL پیشنهادی:

```text
/api/v1
```

Header احراز هویت:

```text
Authorization: Bearer <access_token>
```

خطای استاندارد:

```json
{
  "error": {
    "code": "not_found",
    "message": "Resource not found",
    "details": {},
    "requestId": "req_..."
  }
}
```

## Auth

| Method | Path | کاربرد |
| --- | --- | --- |
| POST | `/auth/login` | ورود با email، password و rememberMe |
| GET | `/auth/me` | دریافت کاربر جاری |
| POST | `/auth/refresh` | تمدید access token |
| POST | `/auth/logout` | خروج و revoke refresh token |

مدل‌های اصلی: `AdminUser`، `LoginCredentials`، `AuthResponse`، `AuthSession`.

## Analytics

| Method | Path | Query | کاربرد |
| --- | --- | --- | --- |
| GET | `/analytics/dashboard` | `timeRange=7d|30d|90d|1y` | داده داشبورد تحلیلی |

response باید با `DashboardMetrics` سازگار باشد.

## Products

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/products` | `search`, `category`, `stockStatus`, `sortBy`, `page`, `pageSize` | لیست محصول |
| GET | `/products/{id}` | - | جزئیات محصول |
| POST | `/products` | `ProductFormData` | ایجاد محصول |
| PATCH | `/products/{id}` | `Partial<ProductFormData>` | ویرایش محصول |
| DELETE | `/products/{id}` | - | حذف/آرشیو محصول |
| PATCH | `/products/{id}/stock` | `variantId`, `delta` | تغییر سریع موجودی |
| GET | `/products/category-options` | - | گزینه‌های دسته برای فرم محصول |
| GET | `/products/slug-check` | `slug`, `excludeId` | بررسی یکتایی slug |

قواعد مهم:

- `totalStock` از مجموع stock واریانت‌ها محاسبه شود.
- `stockStatus` با آستانه فعلی: صفر یا کمتر `out_of_stock`، ۱ تا ۱۰ `low_stock`، بیشتر از ۱۰ `in_stock`.
- SKU محصول و واریانت یکتا باشد.

## Categories

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/categories` | `search`, `status`, `parentId`, `sortBy` | لیست flat |
| GET | `/categories/tree` | `search`, `status` | ساختار درختی |
| GET | `/categories/{id}` | - | جزئیات دسته |
| GET | `/categories/slug-check` | `slug`, `excludeId` | بررسی یکتایی slug |
| POST | `/categories` | `CategoryFormData` | ایجاد دسته |
| PATCH | `/categories/{id}` | `Partial<CategoryFormData>` | ویرایش دسته |
| DELETE | `/categories/{id}` | `cascadeDelete=true|false` | حذف هوشمند |
| PATCH | `/categories/reorder` | `orderedIds` | تغییر ترتیب |
| PATCH | `/categories/{id}/toggle-status` | - | فعال/غیرفعال کردن |
| GET | `/categories/stats` | - | آمار دسته‌بندی |

قواعد مهم:

- parentId نباید خود دسته یا descendant آن باشد.
- حذف غیرآبشاری باید فرزندان مستقیم را به parent قبلی منتقل کند.

## Orders

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/orders` | `status`, `paymentStatus`, `search`, `dateFrom`, `dateTo`, `page`, `limit`, `sortBy`, `sortOrder` | لیست سفارش‌ها |
| GET | `/orders/{id}` | - | جزئیات سفارش با id یا orderNumber |
| PATCH | `/orders/{id}/fulfillment` | `UpdateFulfillmentPayload` | تغییر وضعیت ارسال |
| PATCH | `/orders/{id}/payment` | `status` | تغییر وضعیت پرداخت |
| GET | `/orders/{id}/invoice` | - | داده فاکتور |
| DELETE | `/orders/{id}` | - | حذف/آرشیو سفارش، فقط در صورت مجاز |

قواعد مهم:

- برای status `shipped`، courierName و trackingCode الزامی است.
- deliveredAt و dispatchedAt باید خودکار و فقط در transition معتبر ثبت شوند.
- order item باید snapshot باشد.

## Customers

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/customers` | `search`, `tier`, `status`, `page`, `limit`, `sortBy`, `sortOrder` | لیست CRM |
| GET | `/customers/{id}` | `include=orders,tickets` | جزئیات مشتری |
| PATCH | `/customers/{id}/toggle-status` | - | فعال/مسدود کردن |
| PATCH | `/customers/{id}/tier` | `tier` | تغییر سطح وفاداری |

## Coupons

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/coupons` | `search`, `status`, `type`, `page`, `limit`, `sortBy`, `sortOrder` | لیست کوپن |
| GET | `/coupons/{id}` | - | جزئیات کوپن |
| POST | `/coupons` | `CreateCouponPayload` | ایجاد کوپن |
| PATCH | `/coupons/{id}` | `UpdateCouponPayload` | ویرایش کوپن |
| PATCH | `/coupons/{id}/toggle-status` | - | فعال/غیرفعال کردن |
| DELETE | `/coupons/{id}` | - | حذف/آرشیو کوپن |
| POST | `/coupons/validate` | `code`, `customerId`, `cartTotal`, `categoryIds` | اعتبارسنجی برای checkout |

## Reviews

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/reviews` | `status`, `rating`, `search`, `page`, `limit`, `sortBy` | لیست نظرات |
| PATCH | `/reviews/{id}/status` | `status` | تایید/رد/در انتظار |
| POST | `/reviews/{id}/reply` | `replyText` | پاسخ ادمین |
| DELETE | `/reviews/{id}` | - | حذف/آرشیو نظر |

## Tickets

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/tickets` | `status`, `priority`, `search`, `page`, `limit`, `sortBy` | لیست تیکت‌ها |
| GET | `/tickets/{id}` | - | جزئیات تیکت |
| POST | `/tickets/{id}/messages` | `message` | ارسال پیام |
| PATCH | `/tickets/{id}/status` | `status` | تغییر وضعیت |
| PATCH | `/tickets/{id}/priority` | `priority` | تغییر اولویت |

## Notifications

| Method | Path | کاربرد |
| --- | --- | --- |
| GET | `/notifications` | لیست اعلان‌های ادمین |
| PATCH | `/notifications/{id}/read` | خوانده‌شدن یک اعلان |
| PATCH | `/notifications/read-all` | خوانده‌شدن همه اعلان‌ها |
| DELETE | `/notifications/{id}` | حذف اعلان |

## Homepage Builder

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/homepage/sections` | - | دریافت layout |
| PUT | `/homepage/sections` | `HomepageSection[]` | ذخیره کل layout |
| POST | `/homepage/sections` | `Partial<HomepageSection>` | افزودن سکشن |
| PATCH | `/homepage/sections/{id}` | `Partial<HomepageSection>` | ویرایش سکشن |
| DELETE | `/homepage/sections/{id}` | - | حذف سکشن |
| PATCH | `/homepage/sections/reorder` | `orderedIds` | تغییر ترتیب |
| PATCH | `/homepage/sections/{id}/toggle-active` | - | فعال/غیرفعال کردن |
| GET | `/homepage/stats` | - | آمار سکشن‌ها |
| POST | `/homepage/publish` | - | انتشار نسخه، برای فاز بعد |

## Settings

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/settings/store` | - | دریافت تنظیمات فروشگاه |
| PUT | `/settings/store` | `StoreSettings` | ذخیره تنظیمات فروشگاه |
| POST | `/settings/reset-dev-data` | - | reset داده توسعه، فقط dev |

## Shipping Methods

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/shipping-methods` | - | لیست روش‌های ارسال |
| POST | `/shipping-methods` | `CreateShippingMethodPayload` | ایجاد روش ارسال |
| PATCH | `/shipping-methods/{id}` | `Partial<ShippingMethod>` | ویرایش روش ارسال |
| PATCH | `/shipping-methods/{id}/toggle-status` | - | فعال/غیرفعال کردن |
| DELETE | `/shipping-methods/{id}` | - | حذف روش ارسال |

## Admin Staff

| Method | Path | Query/Body | کاربرد |
| --- | --- | --- | --- |
| GET | `/admin-staff` | `search`, `role`, `status`, `page`, `pageSize` | لیست پرسنل |
| POST | `/admin-staff` | `CreateStaffPayload` | ایجاد عضو |
| PATCH | `/admin-staff/{id}/role` | `role` | تغییر نقش |
| PATCH | `/admin-staff/{id}/toggle-status` | - | فعال/غیرفعال کردن |
| DELETE | `/admin-staff/{id}` | - | حذف عضو |

## پیشنهاد مدل‌های دیتابیس

- `admin_users`
- `admin_refresh_tokens`
- `roles` یا enum داخلی نقش‌ها
- `categories`
- `category_attributes`
- `products`
- `product_variants`
- `product_seo`
- `inventory_movements`
- `customers`
- `customer_addresses`
- `orders`
- `order_items`
- `order_status_history`
- `payments`
- `shipping_methods`
- `coupons`
- `coupon_redemptions`
- `product_reviews`
- `support_tickets`
- `support_ticket_messages`
- `admin_notifications`
- `homepage_sections`
- `homepage_versions`
- `store_settings`
- `media_assets`
- `audit_logs`

## نکات اتصال frontend

- برای کاهش تغییرات frontend، response names فعلی مانند `totalCount` در products و `total` در سایر لیست‌ها حفظ شود یا mapper مشترک در client اضافه شود.
- `pageSize` در محصول و `limit` در سفارش/CRM/کوپن/بازخورد متفاوت است. بهتر است backend هر دو را بپذیرد ولی response هر endpoint با contract فعلی همان ماژول سازگار بماند.
- enumهای TypeScript فعلی باید عینا در Pydantic schemaها mirror شوند.
- تاریخ‌ها در API همگی ISO 8601 باشند و تبدیل شمسی در frontend انجام شود.
- reset داده mock فقط برای development نگه داشته شود و پشت feature flag قرار گیرد.
