# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **ADHD-Friendly Continuous Component Living Workbench (ADR-0027, ADR-0028):**
  - Refactored `/dev/components` (`DevComponentsView.vue`) into a unified, continuous single-page review dashboard.
  - Eliminated multi-page tab friction in favor of a sticky quick-jump navigation header (`#primitives`, `#structural-shell`, `#telemetry`, `#domain-modals`).
  - Encapsulated each component in a crisp, isolated white card (`bg-white` inside `border-slate-200`) with discrete controls, explicit state readouts, and collapsible emission payload trays.
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
