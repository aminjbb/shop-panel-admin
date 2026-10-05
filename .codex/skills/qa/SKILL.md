---
name: qa
description: Validate feature and refactor changes with Graphify-aware test selection, Vitest/RTL checks, type safety, build verification, and actionable failure handoff.
---

# QA

Use after implementation or refactor review has approved the change.

## Workflow

1. Run `node .codex/scripts/graphify.mjs`; inspect `.codex/graphify/graph.json` and the changed-file graph neighborhood to identify impacted tests and integration edges.
2. Read `.codex/rules/testing.mdc` and `.codex/skills/Testing/SKILL.md`. Run the narrowest relevant Vitest/RTL tests first, then typecheck, lint, and production build when configured.
3. Verify behavior, loading/error/empty states, accessibility names and keyboard behavior, RTL/token compliance, query invalidation, and regression boundaries. Add tests for uncovered behavior before declaring pass.
4. Produce a QA report with commands, pass/fail status, coverage gaps, and exact file/line evidence.

## Failure handoff

Any failure creates a bugfix handoff containing: failing command, deterministic reproduction, expected/actual behavior, impacted graph paths, suspected layer, and severity. Send it to `bugfix-agent`; after the fix, rerun QA from step 1. Never mark QA passed with skipped or failing required checks.
