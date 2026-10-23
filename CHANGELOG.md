# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

- **ProgressionIndicator Component (ADR-0027, ADR-0028):**
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
