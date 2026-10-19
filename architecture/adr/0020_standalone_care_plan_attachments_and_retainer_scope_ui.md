---
title: "ADR-0020: Standalone Care Plan Attachments and Retainer Scope UI"
tags: ["adr", "ui", "care-plans", "client-accounts", "timecard", "contracts"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# ADR-0020: Standalone Care Plan Attachments and Retainer Scope UI

## Context and Problem Statement

`ClientDossierDrawer.vue` displayed a `MaintenanceGauge` initialized with a static 30-minute cap, giving the false impression that all clients receive 30 minutes of free monthly support. Furthermore, `ClientOnboardingModal.vue` bundled recurring retainer fees implicitly with initial project deliverables.

Following backend ADR-0012, the frontend must support selling one-off project contracts cleanly while allowing operators to attach standardized Care Plans (`CARE_PLAN_30`, `CARE_PLAN_60`, `CARE_PLAN_90`) either during initial onboarding or on-demand directly inside the Client Account workspace.

## Decision Drivers

* **Zero-Confusion Maintenance Visuals:** If a client does not have an active care plan, the gauge must clearly read "0 / 0 min (No Active Care Plan)" rather than displaying 30 minutes of unearned support.
* **On-Demand Plan Attachment:** Operators must be able to add a Care Plan to an active client with a single click from the workspace contracts card.
* **Streamlined Onboarding:** Decouple primary project services from recurring care plans in the onboarding workflow.

## Decision Outcome

Chosen option: **Option A (Dynamic Cap Rendering and Workspace Plan Attachment)**.

1. **Gauge Zero-State:**
   * When `timecard.monthly_retainer_cap_minutes === 0`, `MaintenanceGauge.vue` displays a neutral badge: "No Active Care Plan". Any logged minutes are visually highlighted as billable out-of-scope work.
2. **Workspace Contract Attachment:**
   * An "+ Attach Care Plan" button in the `Active Service Contracts` card opens a lightweight modal to select Bronze (30m), Silver (60m), or Gold (90m) care plans and immediately attach them to the client account.
3. **Onboarding Add-On Checkbox:**
   * In `ClientOnboardingModal.vue`, recurring care plan selection is presented as an optional add-on tier rather than mandatory inclusion.

## Positive Consequences

* Preserves accurate operator awareness of contracted service levels.
* Allows seamless post-launch upselling from one-off projects to recurring care plans without re-onboarding.
