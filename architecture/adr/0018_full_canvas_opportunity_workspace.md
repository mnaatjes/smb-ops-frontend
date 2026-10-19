---
title: "ADR-0018: Full-Canvas Dual-Column Split Opportunity Workspace"
tags: ["ui", "workspace", "crm", "dossier", "maps", "playbook"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# ADR-0018: Full-Canvas Dual-Column Split Opportunity Workspace

## Context and Problem Statement

The initial `OpportunityDossierDrawer.vue` used a fixed 540px right-sliding panel. As the sales pipeline advanced to require Google Maps geographic context, multi-contact directories, appointment scheduling, chronological activity timelines, audit deficit breakdowns, aligned service catalog offerings, and pitch scripts, a single-column drawer became overwhelmed with cognitive friction and vertical scroll fatigue.

## Decision Drivers

* **Ergonomic Sales Velocity:** Operators need to view business identity, map location, and pitch scripts on one side while actively typing outreach notes and managing contacts on the other.
* **Viewport Maximization:** The workspace should occupy the entire canvas (`calc(100vw - 260px)`) while preserving the vertical navigation rail for instant global context.
* **Deep Interaction Support:** Clear hierarchy for contacts, appointments, one-click contact enrichment discovery, and stage progression.

## Decision Outcome

Chosen option: **Option A (Full-Canvas Dual-Column Split Dossier)**.

The drawer width is expanded from 540px to `w-full max-w-[calc(100vw-260px)]` with a responsive two-column layout:

### Column 1 (Left - 40% width): Prospect Context & Sales Playbook
1. **Header & Geo-Card:** Business title, address, phone, website link, and Google Maps embed (with direct external map launch).
2. **Deficit Rubric & Audit Radar:** Key audit failures (SSL missing, mobile viewport absence, slow TTFB, PDF menus).
3. **Aligned Services & Outreach Playbook:** Service offerings matched to the lead with 1-click copyable telephone pitches, email templates, and objection handlers.

### Column 2 (Right - 60% width): Engagement & CRM Ledger
1. **Interactive Stage Stepper:** Visual milestone bar (`CLAIMED` -> `CONTACT_ATTEMPTED` -> `ENGAGED` -> `APPOINTMENT_SCHEDULED` -> `PROPOSAL_PRESENTED`).
2. **Stakeholder Contacts Hub:** Contact list, role tags, appointment target toggle, manual contact creation, and a "Discover Contacts" trigger executing automated enrichment.
3. **Outreach & Activity Timeline:** Touchpoint logging form and chronological activity feed.

### Positive Consequences

* No tab switching required during active phone calls.
* Full-canvas real estate allows rich map embedding and clean script presentation.
