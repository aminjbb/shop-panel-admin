# Git Commit Message Instruction

> **Version:** 1.0.0 | **Updated:** 2026-05-11

---

## Overview

All commit messages must follow the conventions below based on which agent performed the work.
Every commit message starts with a **type prefix**, followed by the **work name** in parentheses, a colon, and a short summary.

---

## Format

```
<type>(<work-name>): <A summary of what has been done>
```

---

## Type Prefixes by Agent

| Agent | Prefix | When to Use |
|-------|--------|-------------|
| Feature Agent | `feat` | When a new feature, page, widget, entity, or component is added |
| Refactor Agent | `ref` | When existing code is restructured, cleaned up, or improved without changing behavior |

---

## Rules

- The `<work-name>` must match the feature, widget, page, or entity name being worked on (camelCase or kebab-case accepted).
- The summary must be written in **English**, be concise (max ~72 characters), and use the **imperative mood** (e.g. "add", "fix", "update", not "added", "fixed").
- Do **not** end the summary line with a period.
- If multiple scopes are affected, pick the primary one for `<work-name>`.

---

## Examples

### Feature Agent

```
feat(tenantCreate): add tenant creation form with validation
feat(organizationalUnit): implement tree section UI and model
feat(personList): add person list page with filters and pagination
feat(statCard): add reusable stat card shared component
```

### Refactor Agent

```
ref(tenantCreate): extract form logic into useTenantCreate model
ref(dynamicTable): move pagination logic to computePagination utility
ref(selectFieldBox): separate types into types/index.ts
ref(organizationalUnit): align widget structure with FSD rules
```

---

## Optional Body

If additional context is needed, add a blank line after the summary and write a short paragraph or bullet list:

```
feat(tenantCreate): add tenant creation form with validation

- Adds TenantCreateWidget with controlled inputs
- Wires useTenantCreate model for API calls
- Includes Persian i18n keys for all labels
```

---

## Forbidden

- Do **not** use vague messages like `fix stuff`, `update`, `WIP`, or `changes`.
- Do **not** use raw Conventional Commits types (`chore`, `docs`, `style`) unless the agent type matches — stick to `feat` and `ref` for agent-driven work.
- Do **not** omit the `(<work-name>)` scope.
