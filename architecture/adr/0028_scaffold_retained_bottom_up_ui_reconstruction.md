---
title: "ADR-0028: Scaffold-Retained Bottom-Up UI Reconstruction, Sunsetting Protocol, and Component Staging Order"
tags: ["frontend", "architecture", "reconstruction", "sunsetting", "dev-workbench", "governance"]
created_at: "2026-10-22"
last_updated_at: "2026-10-22"
---

# ADR-0028: Scaffold-Retained Bottom-Up UI Reconstruction, Sunsetting Protocol, and Component Staging Order

## Context
During UAT Cycle 1, while the application foundation (Feature-Sliced Design layout, Tailwind token subsystem, Pinia stores, and Docker runtime) proved sound, numerous discrete presentation workflows and modals exhibited broken form submissions, mismatched inputs, legacy 30m retainer assumptions, and cognitive friction. Continuing to patch broken, legacy presentation components via stopgap edits creates technical debt and cognitive fatigue. 

A clean architectural reset of the presentation layer is required. Rather than a destructive "Big Bang" wipe that breaks stores and API integration, we adopt a **Scaffold-Retained Bottom-Up Reconstruction** driven entirely through the `/dev/components` workbench before re-integrating into workspaces.

## Decision

### 1. Retention of Architectural Scaffold
The following stable infrastructure layers are **strictly preserved**:
- `src/app/`: Vite application setup, router configuration, CSS entrypoint.
- `src/shared/styles/`: Design tokens, Tailwind directives, dark mode custom properties.
- `src/shared/api/`: Typed Axios HTTP client and endpoint functions.
- `src/entities/`: Pinia state stores (`useLeadStore`, `useDoctrineStore`) and TypeScript domain models.
- Container infrastructure: Docker Compose test stack and GitHub Actions CI pipelines.

### 2. Reset of Transient Testing Artifacts
Existing manual UAT checklists (`architecture/uat/0001_release_uat_checklist.md`) and legacy Gherkin scenarios (`tests/e2e/specs/*.feature`) that test deprecated presentation flows are retired/cleared. Clean Gherkin scenarios and UAT checklists will be authored anew as re-articulated workflows are integrated.

### 3. File Sunsetting & Deprecation Protocol (`.legacy.vue`)
To eliminate developer confusion between active, in-progress, and abandoned components:
1. **Explicit Deprecation Rename:** Any existing component scheduled for replacement is immediately renamed with the suffix `.legacy.vue` (e.g., `ClientOnboardingModal.vue` $\rightarrow$ `ClientOnboardingModal.legacy.vue`).
2. **Visual In-Code Warning:** Every `.legacy.vue` component receives a mandatory deprecation header block:
   ```html
   <!-- DEPRECATED / LEGACY COMPONENT: Scheduled for removal upon completion of ADR-0028 -->
   ```
3. **Wholesale Purge Gate:** Once a clean replacement component is verified in `/dev/components` and integrated into its workspace, its corresponding `.legacy.vue` file is deleted from the filesystem in that feature's PR.

### 4. Bottom-Up Component Reconstruction Sequence
Components must be authored and verified in `/dev/components` in strict dependency order—primitives first, compound controls second, feature modals third:

1. **Wave 1: Atomic Primitives (Must precede BaseModal):**
   - **Step 1: `BaseButton.vue`:** Button types (`button`, `submit`), variants (`primary`, `secondary`, `danger`), spinner loading state, disabled state.
   - **Step 2: `BaseBadge.vue`:** Tokenized color variants (`emerald`, `amber`, `rose`, `indigo`, `slate`), sizing, borders.
   - **Step 3: `BaseInput.vue`:** Text, number, email, and password types with focus borders and error states.
2. **Wave 2: Dumb Structural Shells:**
   - **Step 4: `BaseModal.vue`:** Centered dialog ($\le 640$px), backdrop blur, teleport, `✕` close, Escape key dismissal, scroll lock.
3. **Wave 3: Compound Telemetry & Selection Controls:**
   - **Step 5: `MaintenanceGauge.vue`:** Dynamic visual progress meter, 0-cap neutral indicator, threshold colors ($\le 75\%$, $76-100\%$, $>100\%$).
   - **Step 6: `ServiceFilterDropdown.vue`:** Multi-select service focus dropdown with active counter badge and clear triggers.
4. **Wave 4: Atomic Feature Workflows (Domain Modals):**
   - **Step 7: `ContractAgreementModal.vue`:** Reusable across Onboarding and Dossier; single agreed price input, recurring/one-time toggle, deliverables preview.
   - **Step 8: `LogWorkModal.vue`:** Clean task duration, work categorization (`retainer`, `billable_extra`, `internal`).
   - **Step 9: `VaultSecretModal.vue`:** Credential label, category, username, password, masked reveal.
   - **Step 10: `ClientOnboardingModal.vue`:** Streamlined 3-step wizard composing the verified `ContractAgreementModal` and `VaultSecretModal`.

## Consequences
- **Positive:** Eradicates legacy code clutter via visual `.legacy.vue` labeling; ensures all components are visually and programmatically verified in `/dev/components` before integration; preserves application stability and backend API compatibility.
- **Negative:** Requires systematic re-authoring of components through the 4 waves before restoring complete end-to-end user journeys.
