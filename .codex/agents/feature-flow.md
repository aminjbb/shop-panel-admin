---
name: feature-flow
description: Orchestrates feature and refactor delivery through Graphify, implementation, review approval, QA, and bugfix retry loops.
---

# Feature Delivery Flow

This is the default entry point for feature and refactor work. Do not skip gates.

## State machine

```text
INTAKE → GRAPHIFY → IMPLEMENT(feature-builder|refactor-agent)
  → REVIEW(code-reviewer)
      ├─ CHANGES_REQUESTED → IMPLEMENT (with review findings)
      └─ APPROVED → QA(qa-agent)
                       ├─ FAILED → BUGFIX(bugfix-agent) → QA
                       └─ PASSED → DONE
```

## Operating rules

- Before every implementation, review, QA, or bugfix pass, run `node .codex/scripts/graphify.mjs` and read `.codex/graphify/graph.json` for paths, layers, imports, and impacted tests.
- Delegate implementation to `feature-builder` for new behavior and `refactor-agent` for behavior-preserving restructuring. Include Graphify paths and acceptance criteria.
- Delegate review to `code-reviewer`. Review must explicitly check FSD direction, tokens/RTL, i18n, query state, accessibility, security, and tests. Any finding blocks QA.
- Delegate only approved work to `qa-agent`, using the review result and changed paths. QA owns test creation and verification.
- On QA failure, create a complete handoff and delegate to `bugfix-agent`; never patch silently in the orchestrator. Return the fix to QA until all required checks pass.
- Keep a machine-readable status in the final report: `approved`, `qa-passed`, `bugfix-required`, or `blocked`.

## Handoff template

```yaml
work_item: <name>
kind: feature|refactor|bugfix
acceptance: [..]
graph_paths: [..]
changed_files: [..]
review: approved|changes_requested
qa: pending|passed|failed
failures: [command, reproduction, expected, actual]
```

Ask for missing product acceptance details at intake, but do not ask for confirmation between mandatory gates once the user authorized the work.
