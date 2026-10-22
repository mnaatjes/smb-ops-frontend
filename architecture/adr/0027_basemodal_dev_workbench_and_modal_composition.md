---
title: "ADR-0027: BaseModal Primitive, Dev Component Workbench, and Feature Modal Composition Governance"
tags: ["frontend", "architecture", "ui", "modals", "dev-workbench", "governance"]
created_at: "2026-10-22"
last_updated_at: "2026-10-22"
---

# ADR-0027: BaseModal Primitive, Dev Component Workbench, and Feature Modal Composition Governance

## Context
As the SMB Operations frontend expands, multiple business workflows require modal interactions (e.g. Onboarding, Contract Attachments, Work Logging, Secret Vault Management). Previously:
1. Modal implementations varied across features, causing UI inconsistencies, divergent backdrop behaviors, and duplicated submit logic.
2. Developers lacked an isolated, sandboxed environment to visually inspect, exercise, and test UI primitives without running complex multi-step business workflows against live backend state.
3. The definition, scope, and architectural boundaries of what constitutes a "modal" versus a "full-canvas workspace" or "drawer" were informal, creating the risk of monolithic "God-component" modals.

## Decision

### 1. Architectural Definition & Boundary of a Modal
A **Modal** in SMB Operations is formally defined as:
> *A temporary, focused, modeless-blocking dialog overlay that commands 100% of the user's immediate attention to complete a single atomic task, acknowledge an alert, or configure a discrete entity before returning to the underlying operational canvas.*

* **What a Modal IS:**
  - Focused on a single, isolated transactional task (e.g. attach one contract, log one work entry, add one secret).
  - Centered on screen, constrained to max-width $\le 640$px, with a dark semi-transparent backdrop (`rgba(0, 0, 0, 0.65)`).
  - Dismissible via explicit Cancel/Close, backdrop click, or `Escape` key.
* **What a Modal is NOT (Anti-Patterns):**
  - ❌ A primary operational canvas or persistent dashboard.
  - ❌ A full-screen multi-pane application (e.g. `ClientDossierDrawer.vue` is a full-canvas workspace drawer `calc(100vw - 260px)`, NOT a modal).
  - ❌ A deeply nested container holding independent sub-modals.

### 2. The 2-Tier Composition Architecture
* **Tier 1: Dumb UI Shell (`src/shared/ui/BaseModal.vue`):**
  - Owns purely structural and ergonomic behaviors: DOM teleportation, backdrop rendering, card positioning, header title, `✕` close button, slot distribution (`default`, `footer`), ESC key listener, and body scroll lock.
  - Zero domain knowledge: No imports from `@/entities/`, no Pinia stores, no API clients, no form validation schemas.
* **Tier 2: Domain Feature Modals (`src/features/*/`):**
  - Feature-specific wrappers (e.g. `ContractAgreementModal.vue`, `LogMaintenanceModal.vue`) that wrap `BaseModal.vue`.
  - Own all domain rules, Zod schemas, input bindings, error states, and API submissions.
  - Reusable across contexts (e.g. `ContractAgreementModal` is invoked in both initial onboarding and in-dossier contract add-on adjustments).

### 3. Developer Component Workbench Route (`/dev/components`)
* Introduce a developer-only sandbox route:
  - Path: `/dev/components`
  - View: `src/pages/DevComponentsView.vue`
* Provides an isolated interactive workbench to exercise `BaseModal`, `BaseButton`, `BaseBadge`, `BaseInput`, and `MaintenanceGauge` across all supported states (default, active, loading, error, disabled) without database dependencies.

### 4. Testing & Automated Definition Enforcement
To prevent architectural drift and uphold the formal definition of a modal, enforcement is automated across three pipeline layers:
* **Layer 1: Structural & Ergonomic Unit Tests (`tests/unit/BaseModal.spec.ts`):**
  - **Ergonomics:** Asserts `@close` emits on Escape key, backdrop click, and close button click.
  - **Geometry & Tokens:** Asserts modal card styling enforces `max-width <= 640px` and the backdrop uses tokenized semi-transparent overlay (`rgba(0, 0, 0, 0.65)`).
* **Layer 2: Architectural Boundary Tests (`tests/architecture/test_boundaries.spec.ts`):**
  - **No Nested Modals (Anti-Inception Rule):** Scans all `src/**/*Modal.vue` components to verify no modal imports or renders another modal component (only `BaseModal` is permissible).
  - **No Canvas Bleed:** Asserts that no component named `*Modal.vue` contains full-canvas viewport sizing (`calc(100vw - 260px)`).
* **Layer 3: Pre-Commit & CI Pipelines:**
  - Enforced automatically via `pnpm run test` on every local commit and PR check.
* **Human Intent Boundary:**
  - Business purpose (*"Is this modal focused on a single transactional task?"*) is validated via PR code review and documented against governing feature ADRs.

## Consequences
- **Positive:** Eradicates UI drift across modals; eliminates duplicated form logic; provides a zero-friction sandbox route (`/dev/components`) for visual regression testing; preserves strict Feature-Sliced Design boundary decoupling.
- **Negative:** Requires authoring dedicated unit tests and documentation whenever new feature modals wrap `BaseModal`.
