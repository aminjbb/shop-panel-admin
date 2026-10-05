# Agent Workflow

این فایل قرارداد اجرایی agentهای پروژه است. هر کار feature، refactor یا bugfix باید طبق این فلو انجام شود و وضعیت مرحله بعدی در گزارش کار ثبت شود.

## فلو اجباری

```text
INTAKE
  ↓
GRAPHIFY
  ↓
IMPLEMENTATION
  ├─ feature-builder  برای قابلیت جدید
  └─ refactor-agent    برای بازآرایی بدون تغییر رفتار
  ↓
CODE REVIEW
  ├─ changes_requested → برگشت به implementation با یافته‌های review
  └─ approved
       ↓
     QA
     ├─ failed → bugfix-agent → QA مجدد
     └─ passed → DONE
```

## قوانین اجرای فلو

1. در شروع کار و قبل از هر دور implementation، review، QA یا bugfix این دستور اجرا شود:

   ```bash
   npm run graphify
   ```

   خروجی Graphify در `.codex/graphify/graph.json` منبع مسیرها، layerها، dependencyها، reverse dependencyها و تست‌های مرتبط است.

2. agent پیاده‌سازی باید قبل از تغییر فایل‌ها Graphify را بخواند و مسیرهای موجود را reuse کند. ایجاد slice یا component جدید بدون بررسی گراف مجاز نیست.

3. پس از پایان implementation، کار حتماً به `code-reviewer` سپرده شود. Review باید FSD import direction، design token، RTL، i18n، accessibility، TanStack Query، stateهای loading/error/empty/success و تست‌ها را بررسی کند.

4. تا زمانی که review با وضعیت `approved` تمام نشده، کار به QA سپرده نمی‌شود. وضعیت `changes_requested` یعنی implementation باید با یافته‌های review اصلاح و دوباره review شود.

5. فقط کار approved به `qa-agent` سپرده می‌شود. QA باید:
   - Graphify را دوباره اجرا کند؛
   - تست‌های مرتبط را از گراف انتخاب کند؛
   - تست‌های لازم Vitest/RTL را بنویسد یا تکمیل کند؛
   - typecheck، lint و build را در صورت وجود اجرا کند؛
   - accessibility، RTL، query invalidation و regression behavior را بررسی کند.

6. هر خطای QA باید به شکل handoff کامل به `bugfix-agent` ارسال شود. handoff باید شامل command شکست‌خورده، reproduction، expected، actual، severity، فایل‌های تغییرکرده و graph paths باشد.

7. `bugfix-agent` فقط علت ریشه‌ای را در کوچک‌ترین محدوده FSD اصلاح می‌کند، تست regression اضافه می‌کند، Graphify و بررسی‌های متمرکز را اجرا می‌کند و نتیجه را به `qa-agent` برمی‌گرداند.

8. چرخه `bugfix-agent → qa-agent` تا عبور تمام checkهای ضروری ادامه پیدا می‌کند. QA با test شکست‌خورده، check حذف‌شده یا نتیجه نامشخص pass اعلام نمی‌شود.

## قرارداد handoff

هر agent باید این قالب را در خروجی خود حفظ کند:

```yaml
work_item: <name>
kind: feature|refactor|bugfix
graph_paths:
  - <path>
changed_files:
  - <path>
review: pending|changes_requested|approved
qa: pending|failed|passed
failures:
  - command: <command>
    reproduction: <steps>
    expected: <expected result>
    actual: <actual result>
    severity: blocker|high|medium|low
next_agent: feature-builder|refactor-agent|code-reviewer|qa-agent|bugfix-agent|none
```

## دستورات Graphify

```bash
npm run graphify
node .codex/scripts/graphify.mjs find <fragment>
node .codex/scripts/graphify.mjs impact <src/file> [...]
npm run graphify:check
```

`graphify:check` findings معماری موجود را گزارش می‌کند و در صورت وجود violation یا unresolved local import با exit code غیرصفر خارج می‌شود. این findings باید در review ثبت شوند و نباید پنهان یا نادیده گرفته شوند.

## مسیر agentها

- `.codex/agents/feature-flow.md` — orchestrator اصلی
- `.codex/agents/feature-builder.md` — ساخت feature
- `.codex/agents/refactor-agent.md` — refactor
- `.codex/agents/code-reviewer.md` — review
- `.codex/agents/qa-agent.md` — تست و QA
- `.codex/agents/bugfix-agent.md` — رفع خطاهای QA

## معیار پایان کار

کار فقط زمانی `DONE` است که:

- Graphify به‌روز شده باشد؛
- review وضعیت `approved` داشته باشد؛
- QA وضعیت `passed` داشته باشد؛
- تست‌ها، typecheck، lint و buildهای لازم نتیجه موفق داشته باشند؛
- مسیر فایل‌های تغییرکرده و محدودیت‌های باقی‌مانده گزارش شده باشند.
