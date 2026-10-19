---
title: "ADR-0017: Pursued Opportunity Contacts and Activity Ledger UI"
status: "accepted"
date: "2026-10-19"
deciders: ["@mnaatjes", "Systems Engineering Team"]
consulted: ["Frontend Guild"]
informed: ["Operations Guild"]
---

# ADR-0017: Pursued Opportunity Contacts and Activity Ledger UI

## Context and Problem Statement

Operators managing leads in the **Pursued Pipeline** need to record stakeholder contacts (e.g. Owner, General Manager) and log sequential outreach activities (calls, voicemails, emails, walk-ins, scheduled meetings). Currently, `OpportunityDossierDrawer.vue` displays static prospect info and deficit scores, but provides no controls to manage multiple contacts, log interactions, or advance pipeline milestone stages.

## Decision Drivers

* **Contact Person Selection:** Operators must be able to specify exactly which person was contacted or with whom an appointment is scheduled.
* **Streamlined Logging:** Activity entry must be fast (under 15 seconds) directly inside the dossier drawer.
* **Stage Progression:** Operators need direct visual feedback on the current milestone (`CLAIMED`, `CONTACT_ATTEMPTED`, `ENGAGED`, `APPOINTMENT_SCHEDULED`, `PROPOSAL_PRESENTED`).
* **Visual Audit Trail:** Chronological timeline showing who was called, messages left, and upcoming appointments.

## Decision Outcome

Chosen option: **Integrated Opportunity Dossier Ledger**.

We will enhance `OpportunityDossierDrawer.vue` with three dedicated cards:
1. **Pipeline Stage Bar:** Visual stepper showing current stage with 1-click progression.
2. **Stakeholder Contacts Directory:** Contact cards list with "+ Add Contact" trigger, role tags, and "Target" appointment selector.
3. **Outreach Log & Scheduled Appointment Feed:** Form to log touchpoints, date/time picker for appointments, and a chronological activity list.

### Positive Consequences

* Operators have a complete CRM interaction hub inside the sliding drawer without navigating away from the pipeline.
* Scheduled appointments are surfaced prominently on the card grid and drawer header.
* Stage progression in the drawer maintains prospect status continuity (`PURSUED` / `QUALIFIED`), ensuring pursued pipeline cards remain pinned to the dashboard across stage updates.

