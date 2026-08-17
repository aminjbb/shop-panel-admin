# Design Tokens Skill

> **Source of truth:** `src/index.css`
> **Version:** 1.0.0 | **Updated:** 2026-05-10

---

## Core Rule

> **NEVER use hardcoded color values or raw font sizes.**
> All colors, typography, spacing, radius, and borders must come from design tokens defined in `src/index.css`.

---

## Color Tokens

### Semantic Tokens (use these in UI — prefer over base tokens)

#### Background
| Token | Usage |
|-------|-------|
| `var(--color-bg-default)` | Default page/section background |
| `var(--color-bg-subtle)` | Subtle background (white) |
| `var(--color-bg-muted)` | Muted / disabled background |
| `var(--color-bg-elevated)` | Cards, modals, popovers |
| `var(--color-bg-overlay)` | Overlay / backdrop |

#### Text
| Token | Usage |
|-------|-------|
| `var(--color-text-default)` | Primary body text |
| `var(--color-text-subtle)` | Secondary / helper text |
| `var(--color-text-disabled)` | Disabled text |
| `var(--color-text-inverse)` | Text on dark/primary background |
| `var(--color-text-link)` | Hyperlinks |
| `var(--color-text-muted)` | Muted text (slightly lighter) |
| `var(--color-text-faded)` | Faded / placeholder text |

#### Interactive / Brand
| Token | Usage |
|-------|-------|
| `var(--color-interactive-default)` | Primary buttons, active states |
| `var(--color-interactive-hover)` | Hover state |
| `var(--color-interactive-active)` | Pressed / active state |
| `var(--color-interactive-subtle)` | Light background for interactive areas |
| `var(--color-interactive-focus)` | Focus ring color |

#### Border
| Token | Usage |
|-------|-------|
| `var(--color-border-default)` | Default border |
| `var(--color-border-strong)` | Emphasized border |
| `var(--color-border-focus)` | Focus border |
| `var(--color-border-subtle)` | Very subtle / light dividers |

#### Icon
| Token | Usage |
|-------|-------|
| `var(--color-icon-default)` | Default icon fill |
| `var(--color-icon-subtle)` | Secondary icon |
| `var(--color-icon-interactive)` | Clickable / interactive icon |
| `var(--color-icon-disabled)` | Disabled icon |

#### Status
| Token | Usage |
|-------|-------|
| `var(--color-status-success)` | Success text / icon |
| `var(--color-status-success-bg)` | Success chip / badge background |
| `var(--color-status-danger)` | Error / danger text |
| `var(--color-status-danger-bg)` | Error background |
| `var(--color-status-info)` | Info text |
| `var(--color-status-info-bg)` | Info background |
| `var(--color-status-warning)` | Warning text |
| `var(--color-status-warning-bg)` | Warning background |
| `var(--color-status-active-bg)` | Active status badge background |
| `var(--color-status-active-text)` | Active status badge text |
| `var(--color-status-active-indicator)` | Active status dot |
| `var(--color-status-inactive-indicator)` | Inactive status dot |
| `var(--color-status-suspended-bg)` | Suspended badge background |
| `var(--color-status-suspended-text)` | Suspended badge text |

#### Navigation & Misc
| Token | Usage |
|-------|-------|
| `var(--color-nav-active-bg)` | Active nav item background |
| `var(--color-badge-role-bg)` | Role badge background |
| `var(--color-badge-role-text)` | Role badge text |
| `var(--color-stat-total-icon-bg)` | Stats icon background |
| `var(--color-notification-dot)` | Notification indicator dot |
| `var(--color-selection-selected)` | Selected item highlight |
| `var(--color-selection-highlighted)` | Text selection highlight |

---

### Base Palette Tokens (use only if no semantic token fits)

| Scale | Tokens |
|-------|--------|
| Primary | `--color-primary-100` `--color-primary-300` `--color-primary-500` `--color-primary-700` `--color-primary-900` |
| Neutral | `--color-neutral-50` `--color-neutral-100` `--color-neutral-200` `--color-neutral-300` `--color-neutral-500` `--color-neutral-600` `--color-neutral-700` `--color-neutral-900` |
| Success | `--color-success-100` `--color-success-300` `--color-success-500` `--color-success-700` `--color-success-900` |
| Danger | `--color-danger-100` `--color-danger-300` `--color-danger-500` `--color-danger-700` `--color-danger-900` |
| Warning | `--color-warning-100` `--color-warning-300` `--color-warning-500` `--color-warning-700` `--color-warning-900` |
| Info | `--color-info-100` `--color-info-300` `--color-info-500` `--color-info-700` `--color-info-900` |

---

## Typography Classes

> Use **exactly one** typography class per text element. Never use raw `text-[...]` or `font-semibold`.

| Class | Font size | Weight | Use for |
|-------|-----------|--------|---------|
| `text-display-lg-semibold` | 32px | 600 | Hero titles |
| `text-display-md-semibold` | 28px | 600 | Page titles |
| `text-display-sm-semibold` | 24px | 600 | Section titles |
| `text-heading-lg-semibold` | 20px | 600 | Card / panel headings |
| `text-heading-md-semibold` | 18px | 600 | Sub-headings |
| `text-body-lg-semibold` | 16px | 600 | Emphasized body text |
| `text-body-lg-reg` | 16px | 400 | Regular body text |
| `text-body-sm-semibold` | 14px | 600 | Labels, table headers |
| `text-body-sm-reg` | 14px | 400 | Secondary body text |
| `text-label-lg-semibold` | 12px | 600 | Tags, badges (bold) |
| `text-label-lg-reg` | 12px | 400 | Captions, helper text |
| `text-label-sm-semibold` | 10px | 600 | Micro labels |

### Font Size Variables (CSS vars — for custom components only)
| Variable | Value |
|----------|-------|
| `var(--font-size-xs)` | 10px |
| `var(--font-size-sm)` | 12px |
| `var(--font-size-md)` | 14px |
| `var(--font-size-base)` | 16px |
| `var(--font-size-lg)` | 18px |
| `var(--font-size-xl)` | 20px |
| `var(--font-size-2xl)` | 24px |
| `var(--font-size-3xl)` | 28px |
| `var(--font-size-4xl)` | 32px |

### Font Weight Variables
| Variable | Value |
|----------|-------|
| `var(--font-weight-regular)` | 400 |
| `var(--font-weight-semibold)` | 600 |

---

## Border Radius Classes

| Class | Value | Use for |
|-------|-------|---------|
| `rounded-none` | 0px | No radius |
| `rounded-xs` | 4px | Chips, tags, small badges |
| `rounded-sm` | 12px | Inputs, cards, panels |
| `rounded-md` | 20px | Buttons, modals |
| `rounded-lg` | 32px | Pills, large cards |

---

## Border Width Classes

| Class | Value |
|-------|-------|
| `border-none` | 0px |
| `border-xs` | 1px |
| `border-sm` | 2px |
| `border-md` | 4px |

---

## Shadow Classes

| Class | Use for |
|-------|---------|
| `shadow-1` | Subtle elevation (cards) |
| `shadow-2` | Low elevation |
| `shadow-3` | Medium elevation |
| `shadow-4` | High elevation (modals) |
| `shadow-5` | Very high elevation (drawers) |
| `shadow-6` | Maximum elevation (popovers, tooltips) |

---

## Usage Examples

### Color in Tailwind utility (via CSS variable)
```tsx
// ✅ Correct — semantic token
<div className="bg-[var(--color-bg-elevated)] text-[var(--color-text-default)]">
  Content
</div>

// ✅ Correct — status badge
<span className="bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]">
  Active
</span>

// ❌ Wrong — hardcoded hex
<div className="bg-[#ffffff] text-[#111827]">Content</div>

// ❌ Wrong — Tailwind palette utility
<div className="bg-white text-gray-900">Content</div>
```

### Typography
```tsx
// ✅ Correct
<h1 className="text-display-md-semibold">Page Title</h1>
<p className="text-body-sm-reg">Description text</p>
<span className="text-label-lg-semibold">Badge</span>

// ❌ Wrong — raw size utilities
<h1 className="text-2xl font-semibold">Page Title</h1>
<p className="text-[14px] font-normal">Description</p>
```

### Border Radius
```tsx
// ✅ Correct
<div className="rounded-sm">Card</div>
<button className="rounded-md">Submit</button>

// ❌ Wrong
<div className="rounded-[12px]">Card</div>
<button className="rounded-xl">Submit</button>
```

### Border
```tsx
// ✅ Correct
<input className="border-xs border-[var(--color-border-default)]" />

// ❌ Wrong
<input className="border border-gray-300" />
```

---

## Adding a New Token

If a design color does not exist in `src/index.css`:
1. Add it to the `@theme { }` block or `:root { }` in `src/index.css`.
2. Use the new variable — never use hardcoded values.

```css
/* src/index.css — add inside @theme {} */
--color-my-new-token: #...;
```

Then use it:
```tsx
<div className="bg-[var(--color-my-new-token)]" />
```

---

## Forbidden

| Pattern | Why |
|---------|-----|
| `#xxxxxx` inline hex | Not token-based, breaks theming |
| `rgb(...)` / `rgba(...)` inline | Same as above |
| `text-gray-*`, `bg-blue-*` etc. | Tailwind palette, not semantic |
| `text-[14px]` | Raw size, use typography class |
| `font-semibold` / `font-normal` alone | Always pair with size via typography class |
| `rounded-[...]` | Use radius token class |
| `border-[...]` | Use border width class |
