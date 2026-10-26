# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Systematic Frontend Workflow Specification Procedure (ADR-0031):**
  - Documented 4-Step Systematic Execution Workflow (Layout SDD, State Transition Matrix, Action Table, Gherkin Scenarios) with concrete templates and operational guidelines in `architecture/adr/0031_systematic_frontend_workflow_and_layout_specification_procedure.md`.

- **BaseMetricCard & BaseAlert Primitives (`src/shared/ui/`):**
  - Created `src/shared/ui/BaseMetricCard.vue` executive KPI ribbon card supporting nominal, alert, success, and warning tokens with clickable delegation; unit tested in `tests/unit/BaseMetricCard.spec.ts`.
  - Created `src/shared/ui/BaseAlert.vue` feedback notification banner with info, success, warning, and danger palettes and dismiss emission; unit tested in `tests/unit/BaseAlert.spec.ts`.
- **Form Sub-Tree Extraction Expansion (FEP / ADR-0030 / SDD-0013):**
  - Created `src/shared/ui/ManualLeadForm.vue` decoupled from `CreateLeadModal.vue`; unit tested in `tests/unit/ManualLeadForm.spec.ts`.
  - Created `src/shared/ui/DisqualifyLeadForm.vue` decoupled from `DisqualifyModal.vue`; unit tested in `tests/unit/DisqualifyLeadForm.spec.ts`.
- **Workbench Triage Atoms Exhibition (`/dev/components`):**
  - Exhibited `ScoreBadge.vue` across danger, warning, success, and unaudited tiers under Wave 3.
  - Exhibited `IssueChips.vue` with critical findings profiles under Wave 3.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.

### Added
- **Interactive Clickable Cards (`src/shared/ui/BaseCard.vue`):**
  - Added `clickable?: boolean` prop supporting full-card click delegation, active depression (`scale(0.99)`), hover elevation (`translateY(-2px)`), and keyboard navigation (`Enter` and `Space` dispatching `@click`).
  - Added unit test coverage in `tests/unit/BaseCard.spec.ts`.
- **Flyout Drawer Multi-Size Variants & Governance (`src/shared/ui/BaseDrawer.vue`):**
  - Added `size?: 'sm' | 'md' | 'lg' | 'full'` variants (`sm`: 420px for inspect, `md`: 680px for standard forms, `lg`: 960px for deep forms, `full`: 100% of Stage width).
  - Exhibited all four size variants with architectural governance callout in `/dev/components`.
  - Added unit test coverage in `tests/unit/BaseDrawer.spec.ts`.
- **Form Sub-Tree Extraction Expansion (FEP / ADR-0030 / SDD-0013):**
  - Created `src/shared/ui/ContractAgreementForm.vue` decoupled from `ContractAgreementModal.vue` with unit tests in `tests/unit/ContractAgreementForm.spec.ts`.
  - Recomposed `src/features/client-contracts/ContractAgreementModal.vue` to wrap `ContractAgreementForm`.
  - Created `src/shared/ui/LogWorkForm.vue` decoupled from `LogWorkModal.vue` with unit tests in `tests/unit/LogWorkForm.spec.ts`.
  - Recomposed `src/features/client-maintenance/LogWorkModal.vue` to wrap `LogWorkForm`.
  - Added interactive exhibition cards for both forms in `/dev/components` Wave 1.

### Fixed
- **BaseAside Collapsed State Ergonomics (`src/shared/ui/BaseAside.vue`):**
  - Separated expand button from the brand logo in collapsed mode into a dedicated `.collapsed-expand-bar`, eliminating visual overlap.
  - Enabled floating popover tooltips with pointer callout triangles on hover for icon buttons in collapsed rail mode via `[data-tooltip]` attributes, CSS pseudo-elements, `:deep()` penetration into slotted items, and unclipped `overflow: visible` rendering.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.

### Added
- **Structural Shell & Navigation Primitives (GLOSSARY Section 5):**
  - Updated `architecture/GLOSSARY.md` formalizing definitions for Viewport, App Shell, Aside Navigation, Dashboard/Stage Canvas, and Flyout Workspace Drawer.
  - Created `src/shared/ui/BaseCard.vue` tokenized card surface primitive with slots and padding variants; verified with `tests/unit/BaseCard.spec.ts`.
  - Created `src/shared/ui/BaseTable.vue` standardized data table primitive with loading spinners, column formatting, and row click events; verified with `tests/unit/BaseTable.spec.ts`.
  - Created `src/shared/ui/BaseAside.vue` controlled navigation rail supporting expanded (240px) and collapsed (64px) modes; verified with `tests/unit/BaseAside.spec.ts`.
  - Created `src/shared/ui/BasePageContainer.vue` Stage layout wrapper standardizing page title hierarchies, toolbars, and scroll boundaries; verified with `tests/unit/BasePageContainer.spec.ts`.
  - Created `src/shared/ui/BaseDrawer.vue` flyout workspace overlay translating from right screen edge with aside boundary sizing; verified with `tests/unit/BaseDrawer.spec.ts`.
  - Exhibited all 5 components in `/dev/components` living workbench with interactive simulation controls.
  - Documented specifications in `docs/reference/ui_components.md`.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
- **Form Sub-Tree Extraction Procedure (ADR-0030, SDD-0013):**
  - Authored ADR-0030 and SDD-0013 establishing deterministic 5-step lifecycle for decoupling form sub-trees from modal shells into reusable presentation primitives.
  - Published operator runbook `docs/reference/form_subtree_extraction_procedure.md`.
  - Created `src/features/client-vault/VaultSecretForm.vue` pure form primitive with `v-model` binding and reactive validation signaling.
  - Implemented headless assertion matrix `tests/unit/VaultSecretForm.spec.ts` (100% pass).
  - Recomposed `VaultSecretModal.vue` to delegate to `VaultSecretForm.vue`.
  - Integrated `VaultSecretForm.vue` into Step 3 of `ClientOnboardingModal.vue`, eliminating input duplication.
  - Added interactive exhibition card in `/dev/components` under Wave 1 Primitives.
  - Sanitized nested secret passwords (`***MASKED***`) in `lastSavedOnboardPayload` in `/dev/components`.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
- **BaseList Primitive (`src/shared/ui/BaseList.vue`):**
  - Created standardized list primitive supporting `bullet`, `checkmark`, and `numbered` variants with standard and dense geometries.
  - Implemented headless assertion matrix `tests/unit/BaseList.spec.ts` (100% pass).
  - Documented `BaseList` in `docs/reference/ui_components.md`.
  - Added interactive exhibition card under Wave 1 in `/dev/components`.
  - Refactored `ContractAgreementModal.vue` to compose `BaseList` (`variant="checkmark"`) for deliverables scope.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
- **Workbench Light & Dark Mode Support (`/dev/components`):**
  - Integrated `ThemeToggle` into sticky navigation header for instant theme toggling.
  - Refactored all staging surfaces, cards, and feedback text in `DevComponentsView.vue` to use semantic theme tokens (`--bg-surface`, `--bg-surface-subtle`, `--text-primary`, `--border-color`).
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.

### Fixed
- **ProgressionIndicator & BaseWizard Font Contrast:**
  - Resolved low-contrast and invisible active step text on light surfaces by tokenizing active labels to `var(--accent-primary, #2563eb)` with font weight 700.
  - Resolved BaseWizard step 3 empty state in `/dev/components` by dynamically reflecting cluster identifier, environment selection, and pre-flight check list.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
- **VaultSecretModal Payload Preview Masking:**
  - Masked plain-text `password` values (`***MASKED***`) in the emitted payload inspection box within `/dev/components` to prevent sensitive credentials from appearing in operator logs.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
  - Created `src/shared/ui/BaseWizard.vue` headless/canvas sequential workflow engine supporting dynamic step slots, validation gates, and backward/forward navigation.
  - Created `src/shared/ui/ModalWizard.vue` dialog composition shell wrapping `BaseWizard` inside `BaseModal` with guarded exit confirmation on `Escape` or backdrop click.
  - Implemented headless assertion matrices `tests/unit/BaseWizard.spec.ts` and `tests/unit/ModalWizard.spec.ts` (100% pass).
  - Refactored `ClientOnboardingModal.vue` to compose `ModalWizard.vue` directly.
  - Added interactive exhibition cards in `/dev/components` under Wave 2 Structural Shells.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
  - Created `src/shared/ui/ProgressionIndicator.vue` reusable wizard and stepper progression bar with active, completed, and upcoming visual tokens.
  - Implemented headless assertion matrix `tests/unit/ProgressionIndicator.spec.ts` (100% pass).
  - Added interactive exhibition card in `/dev/components` under Wave 3 Telemetry & Selection.
  - Replaced cramped inline text stepper in `ClientOnboardingModal.vue` with `<ProgressionIndicator>`.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
- **BaseSelect and BaseTextarea Primitives (ADR-0027, ADR-0028):**
  - Created `src/shared/ui/BaseSelect.vue` with custom SVG chevron and theme token bindings to eliminate inconsistent browser `<select>` styling.
  - Created `src/shared/ui/BaseTextarea.vue` with strict non-resizable geometry (`resize: none`) to prevent modal and workspace distortions.
  - Added headless assertion matrices `tests/unit/BaseSelect.spec.ts` and `tests/unit/BaseTextarea.spec.ts` (100% pass).
  - Added exhibition cards in `/dev/components` under Wave 1 Primitives.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.

### Changed
- **Feature Modal Ergonomics & Button Alignment:**
  - Standardized modal action buttons into `<template #footer>` across `ContractAgreementModal.vue`, `LogWorkModal.vue`, and `VaultSecretModal.vue` ensuring strict right-aligned layout via `BaseModal`.
  - Replaced raw `<select>` and `<textarea>` elements with `<BaseSelect>` and `<BaseTextarea>`.
  - Cleaned deliverables list in `ContractAgreementModal.vue` to eliminate duplicate bullet/checkmark clutter.
  - Standardized number input incrementor spinbuttons in `BaseInput.vue`.
  - Removed redundant `.selection-badge` and locked `ServiceFilterDropdown.vue` width to `260px` to prevent layout shift.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
- **Headless Assertion Matrix Implementation & Reference Guide (ADR-0029, SDD-0012):**
  - Authored Diataxis reference manual `docs/reference/headless_assertion_matrix_procedure.md` establishing the 5-tier invariant taxonomy, archetype testing patterns, and containerized pre-commit enforcement.
  - Implemented missing headless assertion matrix for `ClientOnboardingModal.vue` (`tests/unit/ClientOnboardingModal.spec.ts`) asserting wizard step progression, DOM lifecycle, and dispatch payloads.
  - Refactored existing unit test suites for all `/dev/components` workbench items (`BaseButton`, `BaseBadge`, `BaseInput`, `BaseModal`, `MaintenanceGauge`, `ServiceFilterDropdown`, `ContractAgreementModal`, `LogWorkModal`, `VaultSecretModal`) to conform to SDD-0012 Invariant Taxonomy.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
- **Component Catalog & Visual Truth Update (ADR-0027, ADR-0028):**
  - Updated `docs/reference/ui_components.md` to document Wave 1 primitives (`BaseButton`, `BaseBadge`, `BaseInput`), Wave 2 shells (`BaseModal`), Wave 3 controls (`MaintenanceGauge`, `ServiceFilterDropdown`), and Wave 4 feature modals (`ContractAgreementModal`, `LogWorkModal`, `VaultSecretModal`, `ClientOnboardingModal`) with scoped vanilla CSS and design tokens.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.
- **Headless Assertion Matrix Governance (ADR-0029, SDD-0012):**
  - Authored `architecture/adr/0029_headless_assertion_matrix_vitest_procedure.md` adopting Vitest unit matrices for component invariant testing decoupled from visual CSS inspection.
  - Authored `architecture/designs/0012_headless_assertion_matrix_specification.md` specifying archetype requirements, invariant taxonomies, and CI quality gates.
  - Verified and executed on conversation UUID: `52c10e21-b3db-439e-8f7c-c73cd78c0e55`.

- **AI Agent Response Protocols (GEMINI.md):**
  - Created root-level `GEMINI.md` defining strict dialogue output protocols: ADHD-friendly presentation, plain-English language without jargon, extreme brevity with scannable bullet points, and clean visual delineation.
  - Verified and executed on conversation UUID: `97669aa6-40bb-40b4-8ff4-1cecf813f5e0`.
- **Agent Session Handoff & Governance Context (ADR-0027, ADR-0028):**
  - Authored `architecture/notes/session_handoff_governance_context.md` consolidating PR lifecycles, FSD architecture standards, vanilla CSS styling requirements, and current presentation state for incoming Antigravity CLI sessions.
  - Verified and executed on conversation UUID: `97669aa6-40bb-40b4-8ff4-1cecf813f5e0`.
- **Global Typography Tokens & Modal Font Inheritance (ADR-0003, ADR-0027):**
  - Defined baseline `--font-sans` and `--font-mono` design tokens in `:root` inside `theme.css`.
  - Applied `font-family: var(--font-sans)` globally to `html, body`.
  - Bound `font-family: var(--font-sans, inherit)` directly to `.modal-card` in `BaseModal.vue` ensuring teleported modal shells inherit the global dashboard typography contract without hardcoding font names in discrete components.
  - Verified and executed on conversation UUID: `97669aa6-40bb-40b4-8ff4-1cecf813f5e0`.
- **ADHD-Friendly Component Living Workbench Scoped Vanilla CSS Refactor (ADR-0027, ADR-0028):**
  - Replaced unsupported Tailwind utility class names in `/dev/components` (`DevComponentsView.vue`) with explicit, scoped vanilla CSS.
  - Implemented concrete, guaranteed layout spacing: `.component-card` with `padding: 2.5rem`, `border: 2px solid #cbd5e1`, `border-radius: 16px`, and `margin-bottom: 2.5rem`.
  - Implemented high-contrast exhibition staging surfaces: `.staging-surface` with `background: #f8fafc`, `border: 2px dashed #cbd5e1`, `border-radius: 12px`, and `padding: 2.25rem`.
  - Structured wave sections with `margin-bottom: 5rem` to eliminate visual crowding.
  - Verified and executed on conversation UUID: `97669aa6-40bb-40b4-8ff4-1cecf813f5e0`.
- **Bottom-Up Presentation Layer Reconstruction (PR #46, ADR-0027, ADR-0028, SDD-0010, SDD-0011):**
  - Scaffold-retained complete bottom-up rebuild of presentation layers across Wave 1 primitives (`BaseButton`, `BaseBadge`, `BaseInput`), Wave 2 structural shells (`BaseModal`), Wave 3 telemetry controls (`MaintenanceGauge`, `ServiceFilterDropdown`), and Wave 4 domain feature modals (`ContractAgreementModal`, `LogWorkModal`, `VaultSecretModal`, `ClientOnboardingModal`).
  - Purged deprecated `.legacy.vue` components and transient UAT run checklist.
  - Authored fresh high-level business workflow Gherkin specifications (`01_client_onboarding_wizard.feature`, `02_client_workspace_and_contracts.feature`, `03_timecard_and_maintenance.feature`) and release UAT checklist (`architecture/uat/0001_release_uat_checklist.md`).
  - Authored industry-standard component specification artifacts reference note (`architecture/notes/ui_component_specification_artifacts.md`).
  - Verified and executed on conversation UUID: `97669aa6-40bb-40b4-8ff4-1cecf813f5e0`.
- **UAT Cycle 1 Defect Remediations & Form Submit Contracts (PR #43, ADR-0026):**
  - Added `buttonType?: 'button' | 'submit' | 'reset'` prop to `BaseButton.vue` to allow native form submission.
  - Resolved blocked form submission on Add Contact Modal and Record Touchpoint forms in `OpportunityDossierDrawer.vue`.
  - Added user-friendly retry notification for public directory / Overpass timeouts in `useLeadStore.discoverLeads()`.
  - Clarified Service Filter Dropdown active filter counter badge and added helpful empty-state feedback in `LeadTriageTable.vue`.
  - Aligned Client Workspace panel header to "Timecards & Retainer Maintenance" in `ClientDossierDrawer.vue`.
  - Verified and executed on conversation UUID: `97669aa6-40bb-40b4-8ff4-1cecf813f5e0`.
- **UAT Specification, Gherkin Pipeline & Component Catalog Governance (PR #41, PR #42, ADR-0025, SDD-0009):**
  - Established canonical testing topology: Gherkin behavioral specs in `tests/e2e/specs/`, human release gates in `architecture/uat/`, and visual truth in `docs/reference/`.
  - Authored comprehensive Gherkin specifications covering client onboarding, discovery/triage, pursued opportunities, care plan contracts, and service catalog doctrine.
  - Authored `architecture/uat/0001_release_uat_checklist.md` with structured pass/fail verification checkboxes and defect ledger.
  - Authored `docs/reference/ui_components.md` visual and behavioral cheat sheet.
  - Added `gherkin-lint` configuration and automated CI verification gate in `.github/workflows/ci.yml`.
  - Verified and executed on conversation UUID: `97669aa6-40bb-40b4-8ff4-1cecf813f5e0`.
- **Feature-Sliced Design Implementation:**
  - `entities/lead/`: Pinia state store (`useLeadStore`) and TypeScript data contracts (`Prospect`, `AuditResult`, `RankedLead`).
  - `shared/api/leads.ts`: Typed API client for `/api/leads/*` backend endpoints.
  - `shared/ui/`: Reusable primitives `BaseBadge`, `BaseInput`, `BaseModal`, and `BaseButton`.
  - `features/lead-discovery/`: `DiscoveryBar.vue` location-based prospect ingress component.
  - `features/lead-audit/`: `BatchAuditTrigger.vue` batch auditing trigger with progress state.
  - `features/manual-lead/`: `CreateLeadModal.vue` manual lead creation dialog.
  - `features/lead-triage/`: `LeadTriageTable.vue`, `ScoreBadge.vue`, and `IssueChips.vue` triage presentation board.
  - `pages/HomeView.vue`: Master lead operations and triage workspace.
- **Theming & Dark Mode (ADR-0003 & SDD-0002):**
  - CSS custom properties design token system in `src/shared/styles/theme.css` covering surfaces, text, borders, alerts, and badges.
  - Reactive `useTheme` composable in `src/shared/composables/useTheme.ts` with `localStorage` persistence and OS `prefers-color-scheme` fallback.
  - `ThemeToggle.vue` component in `src/shared/ui/`.
- **Architecture Documentation:**
  - `architecture/adr/0002_lead_operations_and_triage_ui_architecture.md` (ADR-0002).
  - `architecture/designs/0001_lead_operations_and_triage_dashboard_design.md` (SDD-0001).
  - `architecture/adr/0003_design_token_system_and_dark_mode_architecture.md` (ADR-0003).
  - `architecture/designs/0002_dark_mode_theming_system_design.md` (SDD-0002).
- **Quality Assurance:**
  - Vitest test suites for `useLeadStore`, `LeadTriageTable`, and `useTheme` (16 passing tests).

### Fixed
- **DTO Envelope Parsing:** Unpacked backend `{ items: [...] }` object response envelopes for ranked leads and single-item array responses for manual prospect creation.
- **CI Template Synchronization:** Synchronized Corepack and Node 20 caching fixes from `template-vue-spa` v0.1.5.

---

## [0.1.0] - 2026-10-16

### Added
- Initial project scaffolding from `template-vue-spa`.
- Vue 3, Vite, Pinia, TypeScript, and ESLint boundaries setup.
