---
name: pr-checklist
description: >-
  Dynova Frontend merge-ready checklist: FSD, tokens, i18n, TanStack Query v5,
  RTL, and verification commands. Use when preparing or reviewing a PR, before
  merge, or when the user asks if the branch is ready to ship.
---

# PR Checklist Skill

> **Project:** Dynova Frontend
> **Version:** 1.0.0 | **Updated:** 2026-05-11

---

## Architecture & placement

- [ ] Files live in the correct FSD layer; imports only flow **downward** (pages → widgets → features → entities → shared-app).
- [ ] **UI** files contain no hooks for data fetching, no `useTranslation`, no type definitions, no API imports.
- [ ] Types live in slice `types/index.ts` (or feature/entity equivalent).
- [ ] Root `ui/<SliceName>.tsx` is a composer only — every distinct section is its own sub-component file in the same `ui/` folder (no monolithic single-file UI).

---

## Data fetching

- [ ] TanStack Query uses **object** signature (`useQuery({ queryKey, queryFn, ... })`).
- [ ] `queryKey` shape matches convention: `[slice, operation, ...params]`.
- [ ] Mutations `invalidateQueries` with slice prefix where appropriate.
- [ ] Data-driven UIs handle **loading, error, empty, success** states.

---

## i18n

- [ ] No new user-visible string without a key in `src/lib/i18n/locales/fa/translation.json`.
- [ ] Keys are **camelCase** at every level; organized under slice root.
- [ ] `useTranslation` only in models/logics — not in UI or pages.

---

## Design & RTL

- [ ] No hardcoded hex/rgb or raw Tailwind palette colors for design — semantic tokens / CSS variables only.
- [ ] Typography uses mapped token classes (`text-body-*`, `text-heading-*`, etc.) — no arbitrary `text-[…]` for font size/weight.
- [ ] Spacing and alignment use logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`) where directional utilities would break RTL.

---

## API

- [ ] HTTP only via `src/config/api.ts` helpers from `*Api.ts` files.

---

## Verification (run locally)

- [ ] `pnpm lint`
- [ ] `pnpm build` (includes `tsc -b` per `package.json`)

If the branch adds tests (see Testing skill): `pnpm test:run` when that script exists.

---

## PR description (suggested)

Use complete sentences: **what** changed, **why**, and **how to verify** (routes clicked, edge cases). Link tickets if applicable.

---

## Severity rubric for review comments

- **Blocker:** breaks build, leaks secrets, violates API layer, or ships user-visible untranslated strings.
- **Major:** wrong FSD layer, TanStack v4-style hooks, missing error/empty states.
- **Minor:** token/typography drift, small a11y gaps with clear fix.
