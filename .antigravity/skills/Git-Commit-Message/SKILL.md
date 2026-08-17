# Git Commit Message Skill

> **Version:** 1.0.0 | **Updated:** 2026-05-11

---

## Core Rule

> When work is complete, **always** produce a commit message that follows the convention in `.cursor/instructions/Git-Commit-Message-Instruction.md`.
> Read that instruction file before composing any commit message.

---

## Trigger Phrases

This skill activates when the user says:
- "Commit this"
- "Write a commit message"
- "کامیت بده"
- "پیام کامیت بنویس"
- "Generate commit"
- After a Feature Agent or Refactor Agent finishes its work

---

## Required Workflow (always follow this order)

### Step 1: Identify the Agent Type

Determine which agent produced the work:

| Signal | Agent Type | Prefix |
|--------|-----------|--------|
| New page / widget / feature / entity / component was created | Feature Agent | `feat` |
| Existing code was restructured / cleaned / moved without behavior change | Refactor Agent | `ref` |

### Step 2: Identify the Work Name

- Use the primary **slice name** that was created or modified.
- Format: `camelCase` (e.g. `tenantCreate`, `organizationalUnit`, `dynamicTable`).
- If multiple slices were touched, choose the **primary** one.

### Step 3: Compose the Summary Line

```
<type>(<work-name>): <imperative-mood summary, max 72 chars>
```

Rules:
- Imperative mood — "add", "implement", "extract", "align", **not** "added", "implemented"
- English only
- No trailing period
- No vague words: `fix stuff`, `update`, `WIP`, `changes`

### Step 4: Decide if a Body is Needed

Add a body **only** if the change touches more than one meaningful area or reviewers need context. Leave one blank line between subject and body.

```
feat(tenantCreate): add creation form with validation

- Adds TenantCreateWidget with controlled TextFieldBox inputs
- Wires useTenantCreate model for POST /tenant API
- Includes Persian i18n keys under tenant.create.*
```

### Step 5: Output the Final Commit Message

Present the message in a code block so the user can copy it directly:

````
```
feat(organizationalUnit): implement tree section UI and model
```
````

---

## Examples by Agent

### Feature Agent (`feat`)

```
feat(tenantCreate): add tenant creation form with validation
feat(organizationalUnit): implement tree section UI and model
feat(personList): add person list page with filters and pagination
feat(statCard): add reusable stat card shared component
feat(toolbar): add shared toolbar with search and action slots
```

### Refactor Agent (`ref`)

```
ref(tenantCreate): extract form logic into useTenantCreate model
ref(dynamicTable): move pagination logic to computePagination utility
ref(selectFieldBox): separate types into types/index.ts
ref(organizationalUnit): align widget structure with FSD rules
ref(treeRow): replace hardcoded colors with design token variables
```

---

## Forbidden

- `chore`, `docs`, `style`, `fix` — these are NOT used for agent-driven feature or refactor work
- Omitting `(<work-name>)` scope
- Vague summaries: `update files`, `fix issues`, `changes`, `WIP`
- Non-English summaries
- Summaries longer than 72 characters

---

## Quick Reference Card

```
feat(<name>): <what was added/created>      ← Feature Agent
ref(<name>):  <what was restructured/moved> ← Refactor Agent
```
