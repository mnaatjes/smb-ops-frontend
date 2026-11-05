---
title: "0015: Pursued Opportunity Pipeline Action Table"
status: "accepted"
date: "2026-11-05"
tags: ["architecture", "action-table", "interactions", "pursued", "pipeline", "drawers", "modals"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# 0015: Pursued Opportunity Pipeline Action Table

## 1. Overview & Action Contracts

This action table specifies every user and programmatic action within the Pursued Opportunity Pipeline workspace (`PursuedLeadsView.vue`), defining user triggers, UI controls, preconditions, state modifications, and asynchronous Pinia/API dispatches.

---

## 2. Exhaustive Interaction Table

| Action ID | Trigger / Element | UI Component | Precondition | State Mutation / Store Call | Expected Visual Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ACT-PURSUED-01` | Mount workspace route | Route navigation `/pursued` | None | `store.loadRankedLeads()`, `store.loadServices()` | Stage renders with 4 KPI cards, stage filters, and table |
| `ACT-PURSUED-02` | Click stage filter pill | Filter button group | Filter selected | `activeStageFilter = selected` | Table filters to show only opportunities matching selected stage |
| `ACT-PURSUED-03` | Type in search input | Text input | User typing | `searchQuery = input.value` | Table filters rows in real time by business name or address |
| `ACT-PURSUED-04` | Adjust min score slider | Range input | Slider moved | `minScore = Number(val)` | Table filters out leads with opportunity score below threshold |
| `ACT-PURSUED-05` | Click opportunity table row | `BaseTable` `@row-click` | Target row exists | `selectedLead = row.rawLead`, `isDossierOpen = true` | Slideout `OpportunityDossierDrawer` opens to 960px with vitals & hub |
| `ACT-PURSUED-06` | Click "Open Dossier" button | `BaseButton` in action slot | Target row exists | `selectedLead = row.rawLead`, `isDossierOpen = true` | `OpportunityDossierDrawer` opens displaying contacts & activity |
| `ACT-PURSUED-07` | Click "Advance Stage" button | `BaseButton` in action slot | Target opportunity stage is not terminal | `store.setOpportunityStage(id, nextStage)` | Stage badge increments to next pipeline stage; banner confirms |
| `ACT-PURSUED-08` | Click "Convert to Client" button | `BaseButton` in action slot or dossier | Opportunity in pipeline | `leadToConvert = row.rawLead`, `isConvertModalOpen = true` | `ClientOnboardingModal` opens centered via `#modal-portal` |
| `ACT-PURSUED-09` | Submit client onboarding form | Submit in `ClientOnboardingModal` | Valid contract terms | `store.convertToClient(id, payload)` | Lead removed from `/pursued`, added to `/clients`, modal closes |
| `ACT-PURSUED-10` | Click "Disqualify" button | `BaseButton` in dossier or action menu | Opportunity in pipeline | `leadToDisqualify = row.rawLead`, `isDisqualifyModalOpen = true` | `DisqualifyModal` opens with structured reason select |
| `ACT-PURSUED-11` | Confirm disqualification | Submit in `DisqualifyLeadForm` | Valid reason chosen | `store.disqualifyLead(id, payload)` | Lead removed from table, Aside pursued badge decrements, modal closes |
| `ACT-PURSUED-12` | Close dossier drawer | Click overlay / Close button / `Escape` | Drawer open | `isDossierOpen = false`, `selectedLead = null` | Drawer slides closed with clean transition |
| `ACT-PURSUED-13` | Dismiss alert banner | Click dismiss icon on `BaseAlert` | Alert banner visible | `successBanner = null` | Banner dismissed without layout shift |
