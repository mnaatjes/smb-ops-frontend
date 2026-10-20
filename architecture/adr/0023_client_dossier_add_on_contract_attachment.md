---
title: "ADR-0023: Client Account In-Dossier Care Plan Attachment and Contract Triggering"
tags: ["frontend", "client-accounts", "contracts", "care-plans", "timecards"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# ADR-0023: Client Account In-Dossier Care Plan Attachment and Contract Triggering

## Context
When client accounts are created, operators may initially contract one-off services (e.g. site audits, performance tuning) without an active recurring Care Plan retainer (`monthly_retainer_cap_minutes = 0`). Prior to this decision, the only mechanism to bind contracts occurred during the initial onboarding pipeline modal (`ClientOnboardingModal.vue`). There was no interactive capability within `ClientDossierDrawer.vue` to attach a recurring Add-on Care Plan post-onboarding, despite the backend exposing `POST /clients/{client_id}/contracts`.

## Decision
1. **API & Store Integration:**
   - Expose `addClientContractApi` in `src/shared/api/leads.ts` targeting `POST /clients/{client_id}/contracts`.
   - Add `attachContract` action to Pinia `useLeadStore` in `src/entities/lead/store.ts`. Upon successful response, reload client details and client timecard to immediately trigger backend retainer cap recalculations.
2. **In-Dossier Attachment UI:**
   - In `ClientDossierDrawer.vue`, add an "+ Attach Care Plan" action button within the "Active Service Contracts" header.
   - Provide an attachment modal presenting decoupled Care Plan tiers:
     - `CARE_PLAN_30`: Basic Care (30 min monthly support / $150/mo)
     - `CARE_PLAN_60`: Standard Care (60 min monthly support / $275/mo)
     - `CARE_PLAN_90`: Premium Care (90 min monthly support / $375/mo)
   - Allow setting custom billing rates or frequencies before confirming attachment.
3. **Reactive State Synchronization:**
   - Triggering contract creation immediately recalculates `monthly_retainer_cap_minutes`, updating the Maintenance Gauge and unlocking the "Monthly Care Plan (Retainer)" option in "+ Log Work".

## Consequences
- **Positive:** Operators can attach, upgrade, or add care plan retainers to clients at any point in the client lifecycle without manual database intervention or re-onboarding.
- **Negative:** None.
