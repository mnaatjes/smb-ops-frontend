---
title: "ADR-0022: Workspace Stepper Placement, Onboarding Decoupling Polish, and Retainer Work Guardrails"
tags: ["frontend", "ux", "opportunity-dossier", "client-maintenance", "onboarding"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# ADR-0022: Workspace Stepper Placement, Onboarding Decoupling Polish, and Retainer Work Guardrails

## Context
Following the decoupling of Care Plans from the Service Catalog (ADR-0020) and the categorization of Timecard entries (ADR-0021), several visual and operational inconsistencies were discovered during dashboard interaction:
1. **Onboarding Retainer Coupling Language:** `ClientOnboardingModal.vue` retained static text referencing "30 minutes monthly support included" regardless of contracted services.
2. **Unguarded Retainer Work Logging:** `LogMaintenanceModal.vue` permitted logging work against "Monthly Care Plan (Retainer)" even if the client account possessed no active care plan (0 retainer minutes).
3. **Column Overcrowding in Opportunity Workspace:** In `OpportunityDossierDrawer.vue`, the 5-step `stage-stepper-bar` resided inside the 56% `col-right`, causing pill labels to crowd and overflow horizontally.
4. **Browser Native Scrollbar Clutter:** Both `OpportunityDossierDrawer.vue` and `ClientDossierDrawer.vue` exhibited default heavy OS/browser scrollbars on scrollable column containers (`col-left`).

## Decision
1. **Decouple Onboarding Scope Language:** Dynamically calculate retainer cap based on chosen care plans (`care_basic_30m`, `care_standard_60m`, `care_premium_90m`), displaying "0 minutes (No Care Plan)" or specific contracted minutes.
2. **Guard Retainer Work Option:** In `LogMaintenanceModal.vue`, accept `hasActiveCarePlan: boolean`. When `false`, disable `retainer_maintenance` in the dropdown and default selection to `billable_extra` with explanatory hint text.
3. **Full-Width Workspace Stepper:** Re-anchor `stage-stepper-bar` inside a dedicated, full-width header strip spanning both workspace columns directly underneath `workspace-header`.
4. **Bespoke Minimalist Scrollbars:** Implement sleek webkit/firefox scrollbar utility styling in `theme.css` matching surface design tokens and apply to `workspace-col`.

## Consequences
- **Positive:** Clear, non-conflicting onboarding terms; prevented erroneous retainer hour burn on non-retainer clients; eliminated stage stepper text wrapping and horizontal scrolling; clean, modern workspace aesthetics.
- **Negative:** None.
