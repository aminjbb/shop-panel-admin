# Sprint 01 — اتصال Foundation و Security

## هدف

جایگزینی auth mock با نشست واقعی، آماده‌سازی transport برای تمام sprintها و
ایمن‌کردن bootstrap برنامه.

## صفحات و فایل‌های درگیر

- `src/pages/LoginPage.tsx`
- `src/features/auth/context/AuthContext.tsx`
- `src/features/auth/models/useLoginFormModel.ts`
- `src/features/auth/ui/ProtectedRoute.tsx`
- `src/widgets/auth/*`
- `src/App.tsx`
- `src/shared-app/appHeader/*`
- `src/shared-app/appSidebar/*`
- `src/config/api.ts`

## endpointهای این sprint

| Entity method | Endpoint | مصرف‌کننده |
|---|---|---|
| `healthApi.getServiceHealth` | `GET /health` | ابزار diagnostics؛ readiness صفحه نیست |
| `healthApi.getApiHealth` | `GET /api/v1/health` | bootstrap/readiness برنامه |
| `healthApi.getLiveness` | `GET /api/v1/health/live` | diagnostics compatibility |
| `healthApi.getReadiness` | `GET /api/v1/health/ready` | diagnostics compatibility |
| `authApi.login` | `POST /auth/login` | LoginPage |
| `authApi.getCurrentAdmin` | `GET /auth/me` | restore session و shell |
| `authApi.refresh` | `POST /auth/refresh` | refresh coordinator |
| `authApi.logout` | `POST /auth/logout` | header/sidebar/dashboard |

Avatar در Sprint 06 متصل می‌شود.

## backlog اجرایی

### CS-01-01 — Query runtime و bootstrap

- نصب `@tanstack/react-query`.
- ایجاد `QueryClient` با retry محدود برای GET و `retry: false` برای mutation.
- افزودن provider در root برنامه.
- اجرای readiness query پیش از بارگذاری داده‌های private.
- نمایش unavailable state روی 503 بدون پاک‌کردن نشست کاربر.

معیار پذیرش: قطع backend یا database به صفحه loading بی‌نهایت منجر نشود و retry
دستی در دسترس باشد.

### CS-01-02 — Session storage

- جایگزینی typeهای قدیمی `@/types/auth` با public typeهای `@/entities/auth` در
  جریان نشست.
- ذخیره کامل `accessToken`، `refreshToken` و هر دو expiry.
- استفاده از `localStorage` برای `rememberMe=true` و `sessionStorage` برای false.
- تبدیل `AdminUser.fullName/avatarUrl/lastLoginAt` به props موردنیاز header/sidebar؛
  ترجیحاً با ViewModel در widget و نه تغییر DTO.
- حذف `MOCK_USERS`، quick-fill و simulate-500 از build production.

معیار پذیرش: refresh مرورگر نشست معتبر را با `/auth/me` بازیابی کند و secretها
در log یا toast نمایش داده نشوند.

### CS-01-03 — Login و validation

- `useLoginFormModel` از `authApi.login` استفاده کند.
- خطاهای `body.email` و `body.password` از 422 روی field متناظر قرار گیرند.
- `invalid_credentials` فقط پیام عمومی نشان دهد.
- روی 429، دکمه تا `retryAfterSeconds` غیرفعال و countdown قابل مشاهده باشد.
- submit دوم در زمان pending مسدود شود.

معیار پذیرش: login موفق token pair و user را اتمیک ثبت کند و فقط یک navigation
به dashboard انجام شود.

### CS-01-04 — Single-flight refresh

- یک coordinator خارج از component tree بسازید تا هم‌زمان فقط یک refresh request
  داشته باشد.
- `setAccessTokenProvider` به session جاری متصل شود.
- requestهای منتظر پس از refresh موفق فقط یک بار replay شوند.
- روی `invalid_refresh_token` یا وضعیت نامشخص rotation، session پاک و کاربر به
  login هدایت شود.
- درخواست refresh هرگز access token header نفرستد.

معیار پذیرش: چند پاسخ هم‌زمان 401 فقط یک درخواست refresh تولید کنند.

### CS-01-05 — Logout و RBAC shell

- logout با access token و refresh token فعلی اجرا شود.
- local session در `finally` پاک شود؛ 204 به‌عنوان success بدون JSON parse شود.
- routeها و actionها بر اساس `AdminRole` پنهان/غیرفعال شوند.
- پاسخ 403 همچنان به‌عنوان دفاع نهایی مدیریت شود.
- `ProtectedRoute` تا پایان restore، loading state نشان دهد و redirect زودهنگام
  نکند.

## تست‌های ضروری

- login success، invalid credentials، validation و rate limit.
- restore با `/auth/me` موفق و access token منقضی.
- single-flight refresh و تعویض هم‌زمان هر دو token.
- logout 204 و logout هنگام access token نامعتبر.
- readiness 200، dependency 503 و retry دستی.

## خروجی sprint

- `authMockApi.ts` دیگر در مسیر runtime استفاده نشود.
- همه requestهای sprintهای بعدی access token معتبر دریافت کنند.
- Login، restore، refresh و logout روی backend واقعی end-to-end کار کنند.

## وضعیت پیاده‌سازی frontend

- [x] QueryClient، provider و health bootstrap با retry دستی اضافه شد.
- [x] login، `/auth/me`، refresh تک‌پرواز و logout به entity API واقعی متصل شد.
- [x] نشست نسخه‌بندی‌شده با انتخاب `localStorage` یا `sessionStorage` پیاده‌سازی شد.
- [x] replay یک‌باره پس از `invalid_access_token` و rotation اتمیک token pair اضافه شد.
- [x] auth mock، quick-fill و نمایش/copy توکن خام از runtime حذف شد.
- [x] محدودسازی shell و routeها بر اساس `AdminRole` اعمال شد.
- [x] TypeScript check و production build با موفقیت اجرا شد.
- [ ] سناریوهای end-to-end این سند باید پس از در دسترس بودن backend اجرا شوند.
