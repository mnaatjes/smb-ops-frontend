---
title: "ADR-0026: UAT Cycle 1 Defect Remediations and UI Form Submit Contracts"
tags: ["frontend", "uat", "remediation", "forms", "components", "error-handling"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# ADR-0026: UAT Cycle 1 Defect Remediations and UI Form Submit Contracts

## Context
During the execution of `architecture/uat/0001_release_uat_checklist.md`, 5 discrete defects and UX misalignments were surfaced across Discovery, Service Filters, Opportunities, and Client workspaces:
1. **Defect 1 (Section A.1):** Unhandled network/gateway timeouts from public OpenStreetMap Overpass mirrors produced raw `504` error modals.
2. **Defect 2 (Section A.2):** Filter dropdown blue pill badge was misinterpreted as result count rather than active filter count, and 0-match service filtering had an uninformative empty state.
3. **Defect 3 & 4 (Sections B.2, B.3):** `BaseButton.vue` defaulted strictly to `type="button"` and lacked submit prop support or explicit click bindings, blocking Add Contact and Record Touchpoint modal form submissions.
4. **Defect 5 (Section C.2):** Section header "Monthly Retainer Timecard" in `ClientDossierDrawer.vue` was overly narrow since the panel houses all client timecard entries (billable extras, non-billable, and retainer work).

## Decision

1. **Button Form Submit Support:**
   - Extend `BaseButton.vue` with `buttonType?: 'button' | 'submit' | 'reset'`, binding directly to `:type="buttonType"`.
   - Update `OpportunityDossierDrawer.vue` Add Contact and Record Touchpoint buttons with `button-type="submit"` and explicit `@click` handlers (`handleSaveContact`, `handleLogActivity`).
2. **Graceful Discovery Error Messaging:**
   - In `store.ts` `discoverLeads()`, intercept 504 and timeout errors to display a user-friendly status notification: *"Public directory service timed out. Please try again or reduce candidate limit."*
3. **Service Filter Badge and Empty State Clarity:**
   - In `ServiceFilterDropdown.vue`, update badge to render `{{ modelValue.length }} active` with tooltip indicating active filters applied.
   - In `LeadTriageTable.vue`, add `activeFilterCount` prop and display a contextual message when filters yield 0 matches explaining score/audit parameter thresholds.
4. **Timecards & Retainer Workspace Header Alignment:**
   - Rename panel title in `ClientDossierDrawer.vue` to `⏱️ Timecards & Retainer Maintenance`.

## Consequences
- **Positive:** Eradicates broken form submission paths; provides transparent UX feedback during network timeouts and filtered searches; establishes consistent `buttonType` contracts across UI primitives.
- **Negative:** None. Preserves all existing component contracts and backward compatibility.
