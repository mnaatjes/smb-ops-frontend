---
title: "Software Design Document: Bottom-Up Presentation Reconstruction, Sunsetting Topology, and /dev/components Staging Plan"
tags: ["design", "ui", "reconstruction", "topology", "dev-workbench", "staging"]
created_at: "2026-10-22"
last_updated_at: "2026-10-22"
---

# Software Design Document: Bottom-Up Presentation Reconstruction, Sunsetting Topology, and /dev/components Staging Plan

## 1. System Overview
This document specifies the technical execution plan, directory topology transformations, sunsetting procedure, and phased staging order for reconstructing the presentation layer of `smb-ops-frontend` from isolated primitives to unified workspaces.

---

## 2. Directory Topology Transformation

### 2.1 As-Is vs. Sunsetting vs. Target Topology

```text
src/
├── app/                                        [RETAINED - Stable App Scaffold]
│   ├── main.ts
│   └── router/index.ts                         [Adds /dev/components route]
├── shared/
│   ├── api/                                    [RETAINED - Stable HTTP Client]
│   ├── styles/                                 [RETAINED - Tailwind Tokens & Theme]
│   └── ui/                                     [WAVE 1 & 2 RECONSTRUCTION]
│       ├── BaseBadge.vue                       [Wave 1 - Re-articulated]
│       ├── BaseButton.vue                      [Wave 1 - Re-articulated]
│       ├── BaseInput.vue                       [Wave 1 - Re-articulated]
│       ├── BaseModal.vue                       [Wave 2 - Re-articulated]
│       ├── MaintenanceGauge.vue                [Wave 3 - Re-articulated]
│       └── ThemeToggle.vue                     [RETAINED]
├── features/                                   [WAVE 4 FEATURE MODALS & WORKSPACES]
│       ├── client-onboarding/
│       │   ├── ClientOnboardingModal.legacy.vue [SUNSETTING - Renamed & Flagged]
│       │   └── ClientOnboardingModal.vue        [Wave 4 - Re-articulated Wizard]
│       ├── client-maintenance/
│       │   ├── LogMaintenanceModal.legacy.vue   [SUNSETTING - Renamed & Flagged]
│       │   └── LogWorkModal.vue                 [Wave 4 - Re-articulated Work Logger]
│       ├── contracts/
│       │   └── ContractAgreementModal.vue       [Wave 4 - New Unified Modal]
│       ├── client-dossier/
│       │   └── ClientDossierDrawer.vue          [RETAINED - Consumes new modals]
│       ├── opportunity-dossier/
│       │   └── OpportunityDossierDrawer.vue     [RETAINED - Consumes new modals]
│       └── service-catalog/
│           ├── ServiceFilterDropdown.vue        [Wave 3 - Re-articulated]
│           └── CreateServiceModal.legacy.vue    [SUNSETTING - Renamed & Flagged]
└── pages/
    ├── HomeView.vue                            [RETAINED - Master Layout]
    └── DevComponentsView.vue                   [NEW - Interactive Staging Canvas]
```

---

## 3. Four-Wave Component Staging Sequence

```mermaid
flowchart TD
    subgraph Wave 1 [Wave 1: Atomic Primitives]
        W1A["1. BaseButton.vue\n(Types, Variants, Loading, Disabled)"]
        W1B["2. BaseBadge.vue\n(Tokens, Colors, Pills)"]
        W1C["3. BaseInput.vue\n(Text, Email, Number, Focus, Errors)"]
    end

    subgraph Wave 2 [Wave 2: Dumb Structural Shell]
        W2["4. BaseModal.vue\n(Backdrop, Teleport, ESC, Close, Max-Width 640px)"]
    end

    subgraph Wave 3 [Wave 3: Compound Telemetry & Controls]
        W3A["5. MaintenanceGauge.vue\n(Progress, Retainer Caps, Threshold Colors)"]
        W3B["6. ServiceFilterDropdown.vue\n(Multi-select, Counter Badge, Reset)"]
    end

    subgraph Wave 4 [Wave 4: Domain Feature Modals]
        W4A["7. ContractAgreementModal.vue\n(Single Price, Recurring Toggle, Deliverables)"]
        W4B["8. LogWorkModal.vue\n(Minutes, Retainer vs Billable vs Internal)"]
        W4C["9. VaultSecretModal.vue\n(Labels, Types, Password Encryption, Masking)"]
        W4D["10. ClientOnboardingModal.vue\n(Unified 3-Step Conversion Wizard)"]
    end

    Wave 1 -->|"Injected into footer/body"| Wave 2
    Wave 1 -->|"Injected into"| Wave 3
    Wave 2 -->|"Wraps Shell"| Wave 4
    Wave 3 -->|"Referenced by"| Wave 4
```

### Detailed Rationale for Ordering:
* **Why `BaseButton`, `BaseBadge`, and `BaseInput` MUST Precede `BaseModal`:**
  A modal cannot have an ergonomic footer or inputs without verified buttons and fields. By building and testing `BaseButton` first (verifying `buttonType="submit"` and loading states), `BaseModal` and all downstream feature modals are built on verified foundations.
* **Why Feature Modals Precede Workspaces:**
  Building `ContractAgreementModal.vue` in isolation allows testing its single-price inputs and recurring toggles without navigating through full client tables or onboarding wizards.

---

## 4. File Sunsetting & Deprecation Procedure

To prevent accidental use of deprecated components during the reconstruction:

1. **Step 1: Apply Renaming Convention:**
   Rename the existing file by inserting `.legacy` before `.vue`:
   ```bash
   git mv src/features/client-maintenance/LogMaintenanceModal.vue src/features/client-maintenance/LogMaintenanceModal.legacy.vue
   ```
2. **Step 2: Add In-Code Deprecation Banner:**
   Insert a standard visual comment block at line 1 of the template:
   ```html
   <!-- ========================================================================= -->
   <!-- DEPRECATED COMPONENT (ADR-0028)                                           -->
   <!-- DO NOT IMPORT IN NEW FEATURES. Scheduled for removal upon Wave 4 release. -->
   <!-- ========================================================================= -->
   ```
3. **Step 3: Update Active References:**
   Update temporary imports in `HomeView.vue` to point to `.legacy.vue` until the clean replacement component is verified.
4. **Step 4: Deletion on Replacement Verification:**
   When the replacement component is verified in `/dev/components` and wired into production views, execute `git rm` on the `.legacy.vue` file.

---

## 5. Developer Workbench Interface (`/dev/components`)

`src/pages/DevComponentsView.vue` implements a tabbed or scrolling catalog displaying every component in all operational states:

```
+-----------------------------------------------------------------------------------------------+
| SMB Operations Developer Workbench (/dev/components)                                         |
+-----------------------------------------------------------------------------------------------+
| [Wave 1: Primitives]     [Wave 2: BaseModal]     [Wave 3: Telemetry]     [Wave 4: Feature Modals]|
+-----------------------------------------------------------------------------------------------+
| Section: BaseModal & Dumb Shell Ergonomics                                                    |
|                                                                                               |
| Trigger: [Open Standard Modal]  [Open Wide Modal]  [Open Scrollable Body Modal]               |
| Invariant Checklist:                                                                          |
| [x] Centered on screen                                                                        |
| [x] Max-width <= 640px                                                                        |
| [x] Dismiss on backdrop click                                                                 |
| [x] Dismiss on Escape key                                                                     |
| [x] Body scroll locked when open                                                              |
+-----------------------------------------------------------------------------------------------+
```
