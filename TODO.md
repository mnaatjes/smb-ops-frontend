# SMB Ops Frontend Reconstruction & Implementation Plan

This roadmap tracks the step-by-step execution of **ADR-0027** (BaseModal & Workbench Governance), **ADR-0028** (Scaffold-Retained Bottom-Up UI Reconstruction), and their governing design documents (**SDD-0010**, **SDD-0011**).

---

## Phase 0: Test Reset & Sunsetting Deprecated Presentation Artifacts

- [ ] **0.1 Reset Deprecated Testing Artifacts**
  - Clear transient manual checklist in `architecture/uat/0001_release_uat_checklist.md`.
  - Clear deprecated Gherkin workflow scenarios in `tests/e2e/specs/` that test broken legacy presentation flows.
- [ ] **0.2 Apply Deprecation Renaming Protocol (`.legacy.vue`)**
  - Rename `ClientOnboardingModal.vue` $\rightarrow$ `ClientOnboardingModal.legacy.vue` with deprecation banner.
  - Rename `LogMaintenanceModal.vue` $\rightarrow$ `LogMaintenanceModal.legacy.vue` with deprecation banner.
  - Rename `CreateServiceModal.vue` $\rightarrow$ `CreateServiceModal.legacy.vue` with deprecation banner.
  - Update intermediate imports in `HomeView.vue` to maintain green build.

---

## Phase 1: Workbench Route & Atomic Primitives (Wave 1)

- [ ] **1.1 Establish Developer Workbench Route (`/dev/components`)**
  - Register `/dev/components` route in `src/app/router/index.ts`.
  - Create interactive staging canvas `src/pages/DevComponentsView.vue`.
  - Verify routing on development Docker stack (`http://localhost:8090/dev/components`).
- [ ] **1.2 Re-articulate `BaseButton.vue`**
  - Verify explicit `buttonType: 'button' | 'submit' | 'reset'`.
  - Support variants (`primary`, `secondary`, `danger`), loading spinner state, and disabled state.
  - Add visual test section in `/dev/components`.
  - Unit test: `tests/unit/BaseButton.spec.ts`.
- [ ] **1.3 Re-articulate `BaseBadge.vue`**
  - Implement tokenized color variants (`emerald`, `amber`, `rose`, `indigo`, `slate`), border tokens, and pill sizing.
  - Add visual test section in `/dev/components`.
  - Unit test: `tests/unit/BaseBadge.spec.ts`.
- [ ] **1.4 Re-articulate `BaseInput.vue`**
  - Support text, number, email, and password types with focus borders and error states.
  - Add visual test section in `/dev/components`.
  - Unit test: `tests/unit/BaseInput.spec.ts`.

---

## Phase 2: Dumb Structural Shell & Boundary Enforcement (Wave 2)

- [ ] **2.1 Re-articulate `BaseModal.vue`**
  - Implement pure dumb frame with Vue `<Teleport to="body">`.
  - Enforce max-width $\le 640$px (`max-w-xl` / `500px`), centered flexbox layout, and dark backdrop (`rgba(0,0,0,0.65)`).
  - Implement ergonomic dismissals: backdrop click, `✕` close button, and `Escape` key listener.
  - Implement body scroll locking when active.
  - Mount and verify interactive modal demo on `/dev/components`.
- [ ] **2.2 Implement Automated Modal Invariant Tests**
  - Author `tests/unit/BaseModal.spec.ts` (8-point ergonomic and geometric assertion matrix).
  - Author architectural boundary rules in `tests/architecture/test_boundaries.spec.ts`:
    - Anti-Inception Rule (no modal may import/render another modal).
    - Anti-Canvas-Bleed Rule (no modal may contain `calc(100vw - 260px)`).

---

## Phase 3: Compound Telemetry & Selection Controls (Wave 3)

- [ ] **3.1 Re-articulate `MaintenanceGauge.vue`**
  - Implement dynamic progress track with threshold colors ($\le 75\%$ emerald, $76-100\%$ amber, $>100\%$ rose).
  - Implement neutral state for 0-minute cap clients.
  - Add live interactive sliders on `/dev/components` to test all 4 gauge states.
  - Unit test: `tests/unit/MaintenanceGauge.spec.ts`.
- [ ] **3.2 Re-articulate `ServiceFilterDropdown.vue`**
  - Support multi-select service focus with clear `{{ count }} active` counter badge.
  - Provide reset triggers and empty-state guidance in table integration.
  - Add interactive filter harness on `/dev/components`.

---

## Phase 4: Atomic Domain Feature Modals (Wave 4)

- [ ] **4.1 Implement `ContractAgreementModal.vue`**
  - Design unified dual-mode modal (Onboarding staging vs. Client Account direct mutation).
  - Support single agreed rate input (remove min-max) and recurring vs. one-time toggle.
  - Implement discrete deliverables checklist preview.
  - Exercise and verify on `/dev/components`.
  - Unit test: `tests/unit/ContractAgreementModal.spec.ts`.
- [ ] **4.2 Implement `LogWorkModal.vue`**
  - Re-articulate timecard logging with minutes input and 3-way work category dropdown (`retainer`, `billable_extra`, `internal`).
  - Exercise and verify on `/dev/components`.
  - Unit test: `tests/unit/LogWorkModal.spec.ts`.
- [ ] **4.3 Implement `VaultSecretModal.vue`**
  - Re-articulate credential creation with label, secret type, username, and password fields.
  - Exercise on `/dev/components`.
- [ ] **4.4 Re-articulate `ClientOnboardingModal.vue`**
  - Streamline into a clean 3-step wizard composing the verified `ContractAgreementModal` and `VaultSecretModal`.
  - Exercise on `/dev/components`.

---

## Phase 5: Workspace Integration, Sunsetting Purge & Fresh Testing Suites

- [ ] **5.1 Integrate Reconstructed Modals into Production Views**
  - Wire `ContractAgreementModal.vue` and `LogWorkModal.vue` into `ClientDossierDrawer.vue`.
  - Wire `ClientOnboardingModal.vue` into `HomeView.vue`.
- [ ] **5.2 Execute Sunset Purge**
  - Delete all `.legacy.vue` components from the filesystem via `git rm`.
- [ ] **5.3 Author Fresh Gherkin Specifications**
  - Author clean Gherkin feature files in `tests/e2e/specs/` covering the unified workflows.
  - Validate syntax with `pnpm run lint:gherkin`.
- [ ] **5.4 Author Clean Release UAT Checklist**
  - Author `architecture/uat/0001_release_uat_checklist.md` reflecting the verified, clean user journeys.
