---
title: "ADR-0029: Headless Assertion Matrix in Vitest for Component Invariant Verification"
tags: ["frontend", "architecture", "vitest", "testing", "governance", "invariants", "adr"]
created_at: "2026-10-23"
last_updated_at: "2026-10-23"
---

# ADR-0029: Headless Assertion Matrix in Vitest for Component Invariant Verification

## Context
As established in `architecture/notes/ui_component_specification_artifacts.md`, component engineering in `smb-ops-frontend` decouples Contract & Layout Declaration from Behavioral Invariant Verification. While Gherkin (`tests/e2e/specs/`) governs high-level business user journeys and `/dev/components` provides an interactive living workbench for visual CSS rendering, a formal, standardized testing procedure is required to verify component behavior, structural properties, and interaction invariants.

Testing component visual styles in headless runners (JSDOM) creates brittle tests because JSDOM lacks a full CSS/layout engine. Conversely, writing Gherkin for discrete UI components creates high execution latency and selector fragility. 

We require an explicit architectural standard defining how headless unit test matrices (`tests/unit/*.spec.ts`) are structured, what they verify, and how they are enforced across local development and CI pipelines.

## Decision

### 1. Adoption of Headless Assertion Matrix in Vitest
We adopt the **Headless Assertion Matrix** using Vitest and `@vue/test-utils` as the canonical standard for component-level invariant testing:
1. **Decoupled Responsibilities:**
   * **Vitest (`tests/unit/`):** Verifies behavioral invariants, DOM lifecycle, event emissions, structural attributes, and error boundaries in milliseconds.
   * **Living Workbench (`/dev/components`):** Renders visual layout, responsive geometry, theme tokens, and CSS cascades in the browser.
   * **Gherkin (`tests/e2e/specs/`):** Exercises end-to-end multi-step business journeys across views.
2. **Strict Exclusion of Style Assertions:**
   * Unit tests must never assert computed CSS styles (e.g., hex colors, padding, margins, flex directions).
   * Tests may only assert structural state classes (e.g., `.input-error`, `.is-active`, `.modal-backdrop`) and accessibility/HTML attributes (`disabled`, `type="submit"`, `aria-*`).

### 2. Invariant Classification Taxonomy
Component tests are organized by an invariant taxonomy tailored to component archetypes rather than an arbitrary test count:
- **DOM Lifecycle Invariants:** Mount conditions (`v-if`), `<Teleport>` targets, and teardown cleanup.
- **Prop Reflection & Contract Invariants:** Structural attributes and semantic state classes derived from input props.
- **Event Emission & Payload Invariants:** Verification of emitted custom events and strictly typed payload schemas.
- **Keyboard & Accessibility Invariants:** Keystroke interception (`Escape`), scroll locks, and native button submission types.
- **Boundary & Suppression Invariants:** Error state messaging, input disablement, and loading state click suppression.

### 3. CI & Pre-Commit Enforcement Gates
Execution of the Headless Assertion Matrix is enforced as a blocking quality gate:
1. **CI Pipeline (`.github/workflows/ci.yml`):**
   * The `Run Unit & Architectural Tests` step (`pnpm run test`) runs all unit assertion matrices on every pull request targeting `main`. PR merges are blocked if any matrix fails.
2. **Local PR Workflow Requirement:**
   * Prior to pushing any branch or opening a PR, all component matrices must execute and pass in the isolated Docker container environment:
     ```bash
     docker run --rm -v $(pwd):/app -w /app node:20-alpine sh -c "corepack enable && pnpm test"
     ```

### 4. Implementation Mandate for Reference Documentation
The implementation phase of this ADR and its accompanying SDD-0012 mandates the creation of:
* `docs/reference/headless_assertion_matrix_procedure.md`: A comprehensive Diataxis reference manual establishing authoring procedures, archetype matrices, and copy-paste examples.

## Consequences

- **Positive:**
  - Guarantees sub-second feedback on UI behavior and structural integrity without brittle CSS assertions.
  - Clear separation of concerns between visual inspection (`/dev/components`) and programmatic assertions (`Vitest`).
  - Automated CI enforcement prevents regressions in component contracts.
- **Negative:**
  - Developers must author and maintain dedicated unit assertion matrices for every new UI component before merging.
