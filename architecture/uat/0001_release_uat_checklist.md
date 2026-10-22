---
title: "Release UAT Checklist: Reconstructed Presentation & Workflow Layer"
tags: ["uat", "verification", "ui-reconstruction", "presentation"]
created_at: "2026-10-22"
last_updated_at: "2026-10-22"
---

# Release UAT Checklist: Reconstructed Presentation & Workflow Layer

This document serves as the formal User Acceptance Testing (UAT) checklist for validating the scaffold-retained bottom-up UI reconstruction completed under **ADR-0027**, **ADR-0028**, **SDD-0010**, and **SDD-0011**.

All tests may be executed directly against local dev server (`pnpm dev`) or against staging environment builds.

---

## 1. Living Workbench Verification (`/dev/components`)

Verify that the atomic design primitives, telemetry widgets, and domain modals render deterministically in isolation without console errors or bleed.

- [ ] **1.1 BaseButton Harness**
  - Navigate to `/dev/components`.
  - Verify primary, secondary, danger, and ghost button variants render with standard padding and typography.
  - Verify the loading spinner toggles cleanly on button click and disables mouse interactions.
- [ ] **1.2 BaseBadge & BaseInput Harness**
  - Verify emerald, amber, rose, indigo, and slate badge tokens render in both `sm` and `md` sizes.
  - Verify `BaseInput` focus ring responds correctly and error states display the red border and error caption.
- [ ] **1.3 BaseModal Structural Shell**
  - Click "Open Standard Modal" and verify modal teleports to `body`, centers within max width 640px, and prevents background scrolling.
  - Press `Escape` key and verify modal dismisses cleanly.
  - Click backdrop area outside modal card and verify modal dismisses.
- [ ] **1.4 MaintenanceGauge Threshold Telemetry**
  - Adjust the interactive capacity slider.
  - Verify gauge bar and percentage indicator dynamically shift colors: $\le 75\%$ Emerald, $76-100\%$ Amber, $>100\%$ Rose.
  - Verify 0-capacity allocations render the neutral slate baseline rather than `NaN%`.
- [ ] **1.5 Feature Modal Launchers & Payloads**
  - Launch `ContractAgreementModal`, toggle agreement type, modify agreed rate, and verify output JSON payload updates in the live payload preview.
  - Launch `LogWorkModal`, enter minutes, select work category, and verify payload.
  - Launch `VaultSecretModal`, input test secret credentials, and verify sanitized emission payload.
  - Launch `ClientOnboardingModal`, step through all 3 wizard screens, and verify final composite payload.

---

## 2. Integrated Production Workflow UAT

Verify integrated operational flows in `HomeView.vue` and `ClientDossierDrawer.vue`.

- [ ] **2.1 Multi-Step Client Onboarding Journey**
  - On the main dashboard, click `+ Onboard Client`.
  - **Step 1 (Contact & Identity):** Fill in business name, contact person, email, and website. Click `Next: Select Services`.
  - **Step 2 (Service Offerings):** Select one or more service cards, set the agreed recurring rate, and verify deliverables preview checklist. Click `Next: Vault & Dispatch`.
  - **Step 3 (Vault & Dispatch):** Fill in initial server or portal credentials (label, type, username, password). Click `Complete Onboarding`.
  - Verify modal dismisses and the new client appears in the active client table.
- [ ] **2.2 Client Dossier Contract Attachment**
  - Click any client row in the table to slide open the `ClientDossierDrawer`.
  - In the Contracts section, click `Attach Contract`.
  - Select a catalog service, toggle billing cycle (Monthly Retainer vs One-Time), configure agreed rate, and click `Attach Contract Agreement`.
  - Verify the new contract displays immediately under the client's active contracts.
- [ ] **2.3 Vault Secret Provisioning & Masked Reveal**
  - In the open client dossier, navigate to the `Infrastructure Secrets` tab.
  - Click `+ Add Secret`.
  - Enter secret label, select credential type (`SERVER_SSH`, `DATABASE_CREDENTIALS`, etc.), and input password.
  - Click `Save Secret` and confirm secret appears in the secrets list with masked preview (`••••••••`).
  - Click `Reveal` and confirm 30-second countdown timer initiates before auto-masking.
- [ ] **2.4 Retainer Maintenance Work Logging**
  - In the open client dossier with an active care plan, click `Log Maintenance Work`.
  - Enter minutes spent (e.g., `90`), select `Care Plan Retainer`, and type a brief description.
  - Click `Save Timecard Entry`.
  - Verify entry appends to the maintenance activity list and `MaintenanceGauge` updates retained vs used hours dynamically.
