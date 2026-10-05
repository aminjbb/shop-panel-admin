---
name: fsd-implementation
description: Implement or extend frontend features using Feature-Sliced Design in this repository, with Graphify-guided paths, design tokens, TanStack Query, i18n, RTL, accessibility, and maintainable tests.
---

# FSD Implementation

Use this skill for new features, pages, entities, widgets, and shared UI in this React/Vite repository.

## Required workflow

1. Run `node .codex/scripts/graphify.mjs` and read `.codex/graphify/graph.json`. Use its `layers`, `aliases`, and `imports` to choose existing slices and exact paths before creating files.
2. Inspect relevant `.codex/rules/*.mdc` and existing `.codex/skills/FSD-Architecture`, `Design-Tokens`, `Testing`, `Accessibility`, and `TanStack-Query-Debug` guidance. Treat repository conventions as the source of truth.
3. Place code in the lowest valid FSD layer: `shared-app → entities → features → widgets → pages → app`; imports may only flow downward. Keep API access in the slice API/model boundary and keep UI presentational.
4. Reuse existing design-system components and tokens. Do not introduce native controls, hard-coded colors, arbitrary typography, physical left/right spacing, or duplicated primitives.
5. For server state use TanStack Query v5 object syntax, stable query keys, loading/error/empty/success states, and mutation invalidation. Put translations in the locale files and keep translation hooks out of UI components.
6. Add or update focused Vitest/RTL tests for behavior and regression cases. Prefer tests at the model/feature boundary and meaningful user interactions over snapshots.
7. Run graphify again, typecheck/lint/build and the focused tests. Report changed files, graph paths, and commands/results.

## Completion contract

The work is incomplete until the implementation is graph-visible, follows FSD import direction, has relevant tests, and verification results are recorded. If a requested change crosses layer boundaries, explain the violation and choose the smallest compliant design.
