# RTL Safety Skill

> **Languages:** Persian (RTL) + English (LTR) — Bilingual project
> **Version:** 1.0.0 | **Updated:** 2026-05-10

---

## Core Rule

> **Always use CSS logical properties for spacing and alignment.**
> Never use directional utilities (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`).
> The project supports both RTL (Persian) and LTR (English) layouts.

---

## Spacing: Logical vs Directional

| ❌ Directional (forbidden) | ✅ Logical (required) | Meaning |
|---------------------------|----------------------|---------|
| `ml-*` | `ms-*` | margin start (left in LTR, right in RTL) |
| `mr-*` | `me-*` | margin end (right in LTR, left in RTL) |
| `pl-*` | `ps-*` | padding start |
| `pr-*` | `pe-*` | padding end |
| `left-*` | `start-*` | position start |
| `right-*` | `end-*` | position end |
| `text-left` | `text-start` | text align start |
| `text-right` | `text-end` | text align end |
| `border-l-*` | `border-s-*` | border start |
| `border-r-*` | `border-e-*` | border end |
| `rounded-l-*` | `rounded-s-*` | rounded start |
| `rounded-r-*` | `rounded-e-*` | rounded end |
| `float-left` | `float-start` | float start |
| `float-right` | `float-end` | float end |

---

## RTL-Safe Flex/Grid

Flex and grid direction automatically mirrors in RTL. Use logical values:

| ❌ Directional | ✅ Logical |
|---------------|-----------|
| `flex-row` | safe (mirrors automatically in RTL) |
| `justify-start` | safe |
| `justify-end` | safe |
| `items-start` | safe |
| `items-end` | safe |

> Tailwind's `flex-row` and justify/align utilities are inherently RTL-safe when used inside an `rtl:` or `dir="rtl"` context. Do not invert them manually.

---

## RTL Variants (When Needed)

For cases where LTR and RTL need genuinely different values, use Tailwind's `rtl:` and `ltr:` variants:

```tsx
// Icon position differs between LTR and RTL
<div className="ltr:flex-row rtl:flex-row-reverse">
  <Icon />
  <span>Label</span>
</div>

// Specific overrides
<div className="ms-4 rtl:me-4">...</div>
```

---

## Examples

### ✅ Correct

```tsx
// Spacing
<div className="ms-4 me-2 ps-3 pe-1">RTL-safe content</div>

// Position
<button className="absolute end-4 top-4">Close</button>

// Text alignment
<p className="text-start">این متن از ابتدا شروع می‌شود</p>

// Border
<input className="border-s-2 border-s-[var(--color-border-default)]" />

// Rounded corners
<div className="rounded-s-sm">Card with start radius</div>

// Icon with label
<div className="flex items-center gap-2">
  <span className="text-[var(--color-icon-default)]"><Icon /></span>
  <span className="text-body-sm-reg">Label</span>
</div>
```

### ❌ Wrong

```tsx
// Directional spacing
<div className="ml-4 mr-2 pl-3 pr-1">Breaks in RTL</div>

// Directional positioning
<button className="absolute right-4 top-4">Close</button>

// Directional text alignment
<p className="text-left">متن چپ‌چین</p>

// Directional border
<input className="border-l-2" />

// Directional rounding
<div className="rounded-l-sm">Wrong</div>
```

---

## Bilingual Text Direction

When rendering content that may be Persian or English, apply `dir` attributes correctly:

```tsx
// Dynamic direction
<p dir={isRtl ? "rtl" : "ltr"} className="text-body-sm-reg">
  {content}
</p>

// Always RTL (Persian)
<span dir="rtl" className="text-body-sm-reg">متن فارسی</span>

// Always LTR (English, numbers, codes)
<span dir="ltr" className="text-label-lg-reg">+98 912 345 6789</span>
```

---

## Icons and Directional Symbols

Some icons have inherent direction (arrows, chevrons, back/forward). Mirror them in RTL:

```tsx
// Arrow that should flip in RTL
<ChevronRight className="rtl:rotate-180" />

// Back arrow
<ArrowLeft className="rtl:rotate-180" />

// Icons with no direction (close, check, star) — no mirroring needed
<X />
<Check />
```

---

## Audit Checklist

When reviewing a component for RTL safety:

- [ ] No `ml-*` or `mr-*` — replaced with `ms-*` / `me-*`
- [ ] No `pl-*` or `pr-*` — replaced with `ps-*` / `pe-*`
- [ ] No `left-*` or `right-*` for positioning — replaced with `start-*` / `end-*`
- [ ] No `text-left` or `text-right` — replaced with `text-start` / `text-end`
- [ ] No `border-l-*` or `border-r-*` — replaced with `border-s-*` / `border-e-*`
- [ ] No `rounded-l-*` or `rounded-r-*` — replaced with `rounded-s-*` / `rounded-e-*`
- [ ] Directional icons use `rtl:rotate-180` where needed
- [ ] Persian text has `dir="rtl"`, English/numeric content has `dir="ltr"`
- [ ] No hardcoded `direction: ltr/rtl` in inline styles

---

## Quick Reference Card

```
ms-* = margin-inline-start  →  left in LTR, right in RTL
me-* = margin-inline-end    →  right in LTR, left in RTL
ps-* = padding-inline-start →  left in LTR, right in RTL
pe-* = padding-inline-end   →  right in LTR, left in RTL
start-* = inset-inline-start
end-*   = inset-inline-end
```
