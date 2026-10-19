---
title: "0007: Opportunity Contacts and Activity Information Architecture"
tags: ["architecture", "information-architecture", "pipeline", "contacts", "activities"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# 0007: Opportunity Contacts and Activity Information Architecture

## 1. View Purpose & Operator Intent

* **Target View:** `OpportunityDossierDrawer.vue` (Accessed via `HomeView.vue` Pipeline Tab).
* **Operator Job-to-be-Done (JTBD):** "When reaching out to a claimed lead, I want to record the specific person I spoke to, log whether I left a voicemail or booked an appointment, and set the next meeting time so that I can systematically guide prospects from initial contact to contracted client."

## 2. Information Architecture Matrix

| Section / Component | Field / Data Point | Priority | Visual Treatment | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| **Pipeline Stage Bar** | Current Milestone | P0 | Segmented pill stepper (`CLAIMED` $\rightarrow$ `APPOINTMENT`) | `prospect.opportunity_stage` |
| **Contacts Directory** | Name, Role Title, Primary Flag | P0 | Contact cards with role badges | `prospect_contacts` |
| **Contacts Directory** | Direct Phone & Email | P0 | Clickable `tel:` and `mailto:` links | `contact.phone`, `contact.email` |
| **Activity Form** | Contact Selector | P0 | Dropdown of registered contacts | Local component ref |
| **Activity Form** | Channel (Call, Email, Meeting) | P0 | Channel icon button / select | `activity.channel` |
| **Activity Form** | Scheduled Appointment Datetime | P0 | Native `datetime-local` input | `activity.scheduled_at` |
| **Activity Timeline** | Event Log Feed | P0 | Chronological vertical feed with relative timestamps | `prospect_activities` |
