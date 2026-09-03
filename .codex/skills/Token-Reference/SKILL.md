# Token Reference

> **Version:** 2.0.0 | **Updated:** 2026-08-13
> **Purpose:** Complete design token map extracted directly from `src/index.css`.
> **Usage:** In inline styles or Tailwind CSS use `var(--token)` or utility classes like `.glass-card`.

---

## 1. CSS Custom Properties (`:root`)

### Primary Colors
| Token | Value | Description |
|-------|-------|-------------|
| `--primary` | `#6366f1` | Brand Indigo 500 |
| `--primary-hover` | `#4f46e5` | Brand Indigo 600 hover |
| `--color-primary` | `#6366f1` | Primary interactive color |
| `--color-primary-hover` | `#4f46e5` | Primary hover color |

### Secondary Colors
| Token | Value | Description |
|-------|-------|-------------|
| `--color-secondary` | `rgba(255, 255, 255, 0.15)` | Secondary glass button surface |
| `--color-secondary-hover` | `rgba(255, 255, 255, 0.25)` | Secondary hover surface |

### Backgrounds & Surfaces
| Token | Value | Description |
|-------|-------|-------------|
| `--color-background` | `#0f172a` | Dark Slate 900 page background |
| `--bg-gradient` | `linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)` | Dark mode background gradient |
| `--color-surface` | `rgba(255, 255, 255, 0.08)` | Default glass surface background |
| `--glass-bg` | `rgba(255, 255, 255, 0.08)` | Glass card background |
| `--glass-bg-hover` | `rgba(255, 255, 255, 0.12)` | Glass card hover background |
| `--glass-input-bg` | `rgba(0, 0, 0, 0.25)` | Input field background |

### Text Colors
| Token | Value | Description |
|-------|-------|-------------|
| `--color-text-primary` | `#ffffff` | Primary text color (100% white) |
| `--color-text-secondary` | `rgba(255, 255, 255, 0.7)` | Secondary text (70% white) |
| `--color-text-muted` | `rgba(255, 255, 255, 0.45)` | Muted / caption text (45% white) |

### Borders
| Token | Value | Description |
|-------|-------|-------------|
| `--glass-border` | `rgba(255, 255, 255, 0.12)` | Glass border color |
| `--color-border` | `rgba(255, 255, 255, 0.12)` | Input & card border color |
| `--color-border-focus` | `#6366f1` | Active focus ring border |

### Status Colors
| Token | Value | Description |
|-------|-------|-------------|
| `--color-error` | `#f87171` | Rose 400 error text/icon |
| `--color-error-bg` | `rgba(248, 113, 113, 0.15)` | Error background tint |
| `--color-error-border` | `rgba(248, 113, 113, 0.3)` | Error border tint |
| `--color-success` | `#4ade80` | Emerald 400 success text/icon |
| `--color-warning` | `#fbbf24` | Amber 400 warning text/icon |

### Border Radii
| Token | Value | Description |
|-------|-------|-------------|
| `--radius-sm` | `0.5rem` (8px) | Small radius (badges, tags) |
| `--radius-md` | `0.75rem` (12px) | Medium radius (inputs, buttons) |
| `--radius-lg` | `1.0rem` (16px) | Large radius (popovers, cards) |
| `--radius-xl` | `1.5rem` (24px) | Extra large radius (containers, modals) |

---

## 2. Utility Classes (`src/index.css`)

### `.glass-card`
Card surface with high blur backdrop and subtle border:
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
```

### `.glass-nav`
Top bar / navbar styling with backdrop blur:
```css
.glass-nav {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--glass-border);
}
```

### Mesh Blobs (`.mesh-blob`, `.blob-1`, `.blob-2`, `.blob-3`)
Background decorative glowing blur elements:
```html
<div className="mesh-blob blob-1" />
<div className="mesh-blob blob-2" />
<div className="mesh-blob blob-3" />
```

---

## 3. RTL-Safe Spacing Guidelines

| ❌ Avoid | ✅ Use |
|---------|--------|
| `ml-*` | `ms-*` |
| `mr-*` | `me-*` |
| `pl-*` | `ps-*` |
| `pr-*` | `pe-*` |
| `left-*` (positioning) | `start-*` |
| `right-*` (positioning) | `end-*` |

