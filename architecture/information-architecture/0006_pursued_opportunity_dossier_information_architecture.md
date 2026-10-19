---
title: "0006: Pursued Opportunity Dossier Information Architecture"
tags: ["architecture", "information-architecture", "pipeline", "dossier", "opportunities"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# 0006: Pursued Opportunity Dossier Information Architecture

## 1. View Purpose & Operator Intent

* **Target View:** `OpportunityDossierDrawer.vue` (Accessed via `HomeView.vue` Pipeline Tab).
* **Operator Job-to-be-Done (JTBD):** "When I review a claimed lead in the Pursued Pipeline, I want to inspect their complete audit score, concrete technical deficits, and recommended service packages in a dedicated slide drawer, so that I can prepare my outreach pitch and transition them seamlessly into client onboarding."

## 2. Information Architecture Matrix

| Section / Component | Field / Data Point | Priority | Visual Treatment | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| **Drawer Header** | Tracking UID | P0 | Monospace UID badge | `lead.prospect.id` |
| **Drawer Header** | Business Name | P0 | H3 bold text | `lead.prospect.business_name` |
| **Drawer Header** | Status Badge | P0 | Primary pill badge (`PURSUED`) | `lead.prospect.status` |
| **Section: Profile** | Website URL | P0 | Clickable external link | `lead.prospect.website_url` |
| **Section: Profile** | Phone & Address | P1 | Formatted contact items | `lead.prospect.phone`, `address` |
| **Section: Score Card**| Calculated Score | P0 | Large numeric gauge (X / 100) | `lead.audit.opportunity_score` |
| **Section: Deficit Factors** | SSL, Mobile, Speed, POS | P0 | Highlighted list with qualification tags | `lead.audit` parameters |
| **Section: Best-Fit Services** | Code, Name, Price, Description | P0 | Card stack with pricing badges | Computed from `services` catalog |
| **Action Zone** | Convert to Client Button | P0 | Primary action button | Emits `'convert'` event |
| **Action Zone** | Disqualify Lead Button | P1 | Secondary / danger action button | Emits `'disqualify'` event |
