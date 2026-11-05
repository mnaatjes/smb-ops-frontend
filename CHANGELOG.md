# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Client Accounts & Retainers Workspace (`src/pages/ClientAccountsView.vue`):**
  - Implemented primary Client Accounts & Retainers operational ledger conforming to ADR-0031 4-Step UI Specification Architecture (SDD-0020, FSM-0014, Action Table 0017, UAT-0008).
  - Designed with responsive `BaseCard.vue` card deck (`repeat(auto-fill, minmax(360px, 1fr))`) presenting account identity, state badge, primary contact, external URL, and active service contracts.
  - Implemented 4-column executive KPI metric ribbon (`Total Client Accounts`, `Active Retainers`, `Onboarding in Progress`, `Active Care Plans`).
  - Added interactive account state filtering pills (`All Accounts`, `Active Retainers`, `Onboarding`, `Dormant`) and real-time multi-field search.
  - Mounted full-canvas slideout `ClientDossierDrawer.vue` (`BaseDrawer size="lg"`, 960px) providing access to SLA continuity health probes, active contracts with git commit sha tagging, monthly retainer timecard gauge (`MaintenanceGauge`), and encrypted credential vault.
  - Integrated `LogWorkModal.vue`, `ContractAgreementModal.vue`, and `VaultSecretModal.vue` through `#modal-portal`.
  - Authored headless Vitest assertion matrix `tests/unit/ClientAccountsView.spec.ts` asserting orientation, KPI calculations, state filtering, drawer slideout, and maintenance work logging.
  - Conformed to ADR-0031 4-Step UI Specification Architecture (SDD-0019, FSM-0013, Action Table 0016, UAT-0007).
  - Decoupled hardcoded dark palette hex codes into semantic design tokens (`--bg-surface`, `--bg-app`, `--bg-surface-subtle`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border-color`), enabling both light and dark modes.
  - Retained dual-column independent scroll layout (44% Vitals & Diagnostic Deficit Rubric, 56% Commercial Engagement Hub & Activity Feed).
  - Added headless Vitest assertions in `tests/unit/OpportunityDossierDrawer.spec.ts` verifying light and dark theme mode adaptation and interactive stage stepper advancement.
- **Pursued Opportunity Pipeline Workspace (`src/pages/PursuedLeadsView.vue`):**
  - Implemented primary Pursued Opportunity Pipeline workspace conforming to ADR-0031 4-Step UI Specification Architecture (SDD-0018, FSM-0012, Action Table 0015, UAT-0006).
  - Promoted active pursued opportunities from a compressed table layout to a responsive `BaseCard.vue` card deck (`repeat(auto-fill, minmax(360px, 1fr))`) to accommodate dense business telemetry and multi-action controls without horizontal truncations or scrolling.
  - Added 4-column pipeline KPI metric ribbon (`Active Pursued Deals`, `Engaged / In Discussion`, `Proposals Out`, `Average Opp Score`).
  - Implemented interactive stage filter pill ribbon (`All Stages`, `Claimed`, `Contact Attempted`, `Engaged`, `Appointment Scheduled`, `Proposal Presented`) and real-time search & score filters.
  - Implemented 1-click stage advancement (`Advance Stage`) stepping opportunities through pipeline milestones (`claimed` $\rightarrow$ `proposal_presented`).
  - Integrated `OpportunityDossierDrawer.vue` (`BaseDrawer size="lg"`, 960px) for deep engagement telemetry, contact management, and outreach activity timeline.
  - Integrated `ClientOnboardingModal.vue` (`BaseModal.vue`) for converting opportunities directly into active Client Accounts (`/clients`).
  - Authored headless Vitest assertion matrix `tests/unit/PursuedLeadsView.spec.ts` asserting orientation, card deck rendering, stage filtering, stage progression, and client onboarding.
- **Lead Operations & Triage Workspace (`src/pages/LeadsView.vue`):**
  - Implemented primary Lead Operations and Triage workspace conforming to ADR-0031 4-Step UI Specification Architecture (SDD-0017, FSM-0011, Action Table 0014, UAT-0005).
  - Implemented executive KPI metric ribbon powered by 4 `BaseMetricCard` instances (`Discovery Pool`, `High Risk 70+`, `Moderate Deficit 40-69`, `Average Opp Score`).
  - Integrated `BaseTable.vue` with custom slot cells for business contact links, opportunity score badge (`ScoreBadge`), audited deficit chips (`IssueChips`), and action button cluster.
  - Implemented unified 1-click qualification transitioning leads out of Discovery Pool to `status = 'PURSUED'`, incrementing the Aside badge counter.
  - Mounted deep technical audit inspection via slideout drawer (`OpportunityDossierDrawer.vue`) on table row click.
  - Integrated manual prospect ingestion via deep drawer (`BaseDrawer.vue size="lg"` wrapping `ManualLeadForm.vue`) and unified disqualification modal (`BaseModal.vue` wrapping `DisqualifyLeadForm.vue`).
  - Added headless Vitest assertion matrix `tests/unit/LeadsView.spec.ts` asserting orientation, table rendering, deficit/score filtering, 1-click qualification, and drawer lifecycle.
- **Add-ons & Recurring Subscriptions Workspace (`src/pages/AddOnsView.vue`):**
  - Implemented primary Add-ons and Recurring Subscriptions workspace conforming to ADR-0031 4-Step UI Specification Architecture (SDD-0016, FSM-0010, Action Table 0013, UAT-0004).
  - Decoupled recurring digital care plans (`Rank 2`, `MONTHLY_RETAINER`) from one-off core consulting services.
  - Added retainer support cap filtering ribbon (`All`, `Automated 0m`, `30m Cap`, `60m Cap`, `90m+ Cap`).
  - Created `AddOnDetailsDrawer.vue` (`BaseDrawer size="md"`) surfacing SLA commitments, monthly client deliverables, and recurring scope via `BaseList`.
  - Mounted dynamic plan registration through `BaseDrawer size="lg"` (960px) wrapping `CreateAddOnForm.vue` and `BaseRepeater.vue`.
  - Added headless Vitest assertion matrix `tests/unit/AddOnsView.spec.ts` asserting orientation, core package exclusion, cap filtering, drawer inspection, and plan creation.
- **Core Service Catalog Workspace & Deep Inspection (`src/pages/ServiceCatalogView.vue`):**
  - Implemented primary Core Service Catalog workspace conforming to ADR-0031 4-Step UI Specification Architecture (SDD-0015, FSM-0009, Action Table 0012, UAT-0003).
  - Composed pre-tested primitives and layout atoms: `BasePageContainer`, `BasePageHeader`, clickable `BaseCard` grid, `BaseBadge`, `BaseAlert`, `BaseModal`, `CreateCoreServiceForm`, and `ServiceDetailsDrawer` (`BaseDrawer` size="md" + `BaseList`).
  - Decoupled one-time consulting and transformation offerings (Ranks 1A, 1B, 3, 4) from recurring add-on digital care plans (`/addons`).
  - Added commercial rank filter ribbon (All, Rank 1A, Rank 1B, Rank 3, Rank 4) with zero-layout-shift reactive filtering.
  - Authored headless Vitest assertion matrix `tests/unit/ServiceCatalogView.spec.ts` asserting orientation, add-on exclusion, tier filtering, drawer lifecycle, and modal ingestion.
- **BaseRepeater Dynamic Array Primitive (`src/shared/ui/BaseRepeater.vue`):**
  - Created dynamic array repeater primitive driven by an in-memory string array with text inputs, row insertion via "Add Another" button, and indexed row removal buttons.
  - Implemented constraints for `minItems`, `maxItems`, `disabled`, and customizable empty state slot.
  - Authored headless unit assertion matrix in `tests/unit/BaseRepeater.spec.ts` under ADR-0029 covering empty states, addition, indexed splicing, text binding, disabled states, and min/max boundaries.
  - Exhibited in `/dev/components` under Atomic UI Primitives (`#cat-primitives`) with both standard and min/max constrained demos.
  - Replaced multi-line textareas requiring "(One per line)" in both `CreateCoreServiceForm.vue` and `CreateAddOnForm.vue` (for Scope, Deliverables, and Exclusions) with `BaseRepeater`.

- **Dedicated Service Catalog & Add-On Creation Forms (`src/shared/ui/`):**
  - Created `CreateCoreServiceForm.vue` supporting canonical catalog rank pricing ($150 for Rank 1A, $350 for Rank 1B, $300 for Rank 3, $250 for Rank 4) with read-only price preview banner; unit tested in `tests/unit/CreateCoreServiceForm.spec.ts`.
  - Created `CreateAddOnForm.vue` supporting recurring digital care plans ($99, $199, $299) and retainer support caps (0, 30, 60, 90, 120m); unit tested in `tests/unit/CreateAddOnForm.spec.ts`.
  - Exhibited both forms in `/dev/components` under Decoupled Forms (`#cat-forms`) alongside live reactive JSON schema display panels.

- **Developer Components Workbench Reorganization & Scrolling Fix (`src/pages/DevComponentsView.vue`):**
  - Grouped all showcase components into 6 functional sections: Primitives (`#cat-primitives`), Forms (`#cat-forms`), Shell (`#cat-shell`), Wizards (`#cat-wizards`), Modals (`#cat-modals`), and Telemetry (`#cat-telemetry`).
  - Added sticky anchor navigation pills with live counts for each section.
  - Added reactive JSON payload inspect panels underneath all form cards.
  - Fixed vertical scrolling in `src/App.vue` for `#app-root.isolated-workspace`.
  - Verified and executed on conversation UUID: `f168e79f-2cab-4b17-9ef2-607df09b9ede`.

- **Base Site Shell Architecture & Layout Refactor (ADR-0031 / PR #65):**
  - Created universal application shell `src/app/layout/BaseSiteLayout.vue` featuring 3-tier navigation spine (`BaseAside.vue`), collapsible icon rail with `localStorage` persistence, off-canvas mobile drawer sheet, and stage canvas with root overlay portals (`#drawer-portal`, `#modal-portal`).
  - Isolated `/dev/components` workbench from `BaseSiteLayout` via `src/App.vue` conditional layout rendering (`route.meta.layout === 'isolated'`), enabling full vertical page scrolling and removing production navigation and orientation headers from the development staging environment.
  - Added decoupled placeholder workspace view `src/pages/PlaceholderWorkspaceView.vue` and cleared `src/pages/LeadsView.vue` to clean scaffolded stage.
  - Authored full 4-step specification suite: SDD (`architecture/designs/0014_base_site_shell_layout_and_topology_spec.md`), FSM (`architecture/state-transitions/0008_base_site_shell_lifecycle_states.md`), Action Table (`architecture/action-tables/0011_base_site_shell_action_table.md`), and UAT Scenarios (`architecture/uat/0002_base_site_shell_acceptance_criteria.md`).
  - Added headless unit test suite `tests/unit/BaseSiteLayout.spec.ts` asserting desktop topology, pure route stage invariant, mobile sheet drawer lifecycle, and rail collapse persistence.

- **BaseBreadcrumb & BasePageHeader Orientation Primitives (`src/shared/ui/`):**
  - Created `src/shared/ui/BaseBreadcrumb.vue` supporting nested breadcrumb items, custom separators, and router navigation; unit tested in `tests/unit/BaseBreadcrumb.spec.ts`.
  - Created `src/shared/ui/BasePageHeader.vue` combining breadcrumbs, view title, subtitle, context badges, and slotted action clusters with responsive flex wrap; unit tested in `tests/unit/BasePageHeader.spec.ts`.
  - Exhibited both components in `/dev/components` Wave 2 with interactive node tracking.

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
