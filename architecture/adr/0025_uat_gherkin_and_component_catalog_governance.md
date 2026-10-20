---
title: "ADR-0025: UAT Specification, Gherkin Pipeline, and Component Catalog Governance"
tags: ["frontend", "testing", "uat", "gherkin", "diataxis", "governance"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# ADR-0025: UAT Specification, Gherkin Pipeline, and Component Catalog Governance

## Context
As features expand across the SMB Operations suite (client onboarding, credential vaults, opportunity workflows, care plans, timecards), human-in-the-loop manual testing and automated regressions require systematic rigor. Previously, testing consisted primarily of unit and boundary tests (`tests/unit/`, `tests/architecture/`). Testing documentation lacked:
1. Canonical location definitions separating human UAT sign-off ledgers, automated Gherkin features, and visual component guides.
2. An established authoring sequence connecting business workflows to component visual truth and release gates.
3. Tooling and automated CI linting for Gherkin specifications and acceptance documentation.

## Decision

1. **Topology and Canonical Boundaries:**
   - **Gherkin Specifications (`tests/e2e/specs/*.feature`):** Automated, executable business scenarios written in standard Gherkin syntax (`Feature / Scenario / Given / When / Then`). Direct input for browser runners (Playwright / Cypress).
   - **UAT Checklists and Release Audits (`architecture/uat/*.md`):** Engineering Plane under the Unified Process Test Discipline. Houses discrete manual validation checklists, pass/fail audit records, environment metadata, and sign-offs.
   - **Component Truth Reference Catalog (`docs/reference/*.md`):** Customer / Operator Plane under Diataxis. Houses visual component cheat sheets, token usage, state matrices, and behavioral expectations.

2. **Ordered Workflow Lifecycle:**
   - **Phase 1: Feature Behavior Definition (`tests/e2e/specs/<feature>.feature`):** Product workflows and acceptance criteria authored in Gherkin prior to UI implementation.
   - **Phase 2: UI Component Implementation & Cheat Sheet (`src/shared/ui/` + `docs/reference/ui_components.md`):** Component developed and cataloged with expected colors, states, badges, and behaviors.
   - **Phase 3: UAT Release Audit Document (`architecture/uat/<ID>_<feature>_uat_plan.md`):** Discrete human test checklist generated with click-by-click verification steps and pass/fail checkboxes.
   - **Phase 4: Execution & Verification:** Manual run conducted, checkboxes marked, commits tagged, and signed off before merge.

3. **Tooling & Linter Enforcement:**
   - Tooling: `@cucumber/gherkin` and `@cucumber/gherkin-lint` (or ESLint / markdownlint rules).
   - Package scripts: `pnpm run lint:gherkin` and `pnpm run lint:docs`.
   - CI Pipeline: `.github/workflows/ci.yml` validates Gherkin syntax and UAT frontmatter/checklist structure on every PR.

## Consequences
- **Positive:** Eradicates guesswork during human testing; enforces clear Diataxis vs. Unified Process boundary separation; prevents syntax decay in feature files via automated CI gates.
- **Negative:** Requires authoring and updating Gherkin and UAT documents alongside complex UI features.
