---
title: "State Transitions: Lead Operations and Triage Lifecycle States"
status: "accepted"
date: "2026-11-05"
tags: ["state-machine", "architecture", "leads", "triage", "discovery", "qualification", "fsm"]
---

# State Transitions: Lead Operations and Triage Lifecycle States

## 1. Overview & Scope

This document specifies the Finite State Machine (FSM) governing the Lead Operations & Triage workspace (`LeadsView.vue`), its coordination with the Pinia lead store (`useLeadStore.ts`), table datasets, batch discovery execution, lead qualification transitions, and overlay slideouts.

```
+---------------------------------------------------------------------------------------+
|                         LEAD OPERATIONS & TRIAGE FSM DOMAINS                          |
|  1. Lead Pool Hydration Domain: UNINITIALIZED -> LOADING -> POPULATED / EMPTY / ERROR  |
|  2. Discovery Execution Domain: IDLE <----------> DISCOVERING_AND_AUDITING            |
|  3. Inspection Dossier Domain:  DOSSIER_CLOSED <-> DOSSIER_OPEN(leadId)               |
|  4. Qualification Lifecycle:    POOL_MEMBER  ---> PURSUED (Pipeline Ingress)          |
|  5. Rejection & Suppression:    POOL_MEMBER  ---> DISQUALIFIED / SUPPRESSED           |
+---------------------------------------------------------------------------------------+
```

---

## 2. Lead Pool Lifecycle State Machine

Governs primary table hydration, discovery ingress, and local filtering re-slices.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Store Action |
| :--- | :--- | :--- | :--- | :--- |
| `UNINITIALIZED` | View Mount (`onMounted`) | `POOL_LOADING` | `BaseTable` renders loading state row; metric cards display shimmer | Dispatch `leadStore.loadRankedLeads()` and `leadStore.loadServices()` |
| `POOL_LOADING` | Fetch Success (Count > 0) | `POOL_POPULATED` | `BaseTable` renders nominal data rows; KPI metric cards populated | Cache ranked leads in Pinia `leads.value` |
| `POOL_LOADING` | Fetch Success (Count == 0) | `POOL_EMPTY` | `BaseTable` renders empty state row ("No leads available. Run discovery"); KPIs at 0 | Clear error state |
| `POOL_LOADING` | Network Error / 500 | `POOL_ERROR` | `BaseAlert` variant="danger" with retry button | Log error trace to telemetry |
| `POOL_POPULATED` | Click "Discover & Audit Leads" | `DISCOVERING_AND_AUDITING` | Table displays loading overlay; status notification banner active; button disabled | Call `leadStore.discoverLeads(location, limit)` |
| `DISCOVERING_AND_AUDITING` | Discovery Success | `POOL_POPULATED` | Table immediately refreshes with new audited leads; toast confirms findings count | Automatically reload pool leads; update KPI ribbon |
| `POOL_POPULATED` | Service Filter Selected | `POOL_FILTERED` | Table re-filters rows instantaneously matching service criteria; metric ribbon updates | Mutate `activeServiceFilters.value` |
| `POOL_POPULATED` | Click "Clear Findings" | `POOL_EMPTY` | Table clears to empty state; metric cards reset to 0 | Call `leadStore.clearLeads()` |

---

## 3. Lead Qualification & Disposition State Machine

Governs 1-click qualification to the Pursued Pipeline and disqualification modals.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Guard |
| :--- | :--- | :--- | :--- | :--- |
| `POOL_MEMBER` | Click "Qualify" Button | `QUALIFYING` | Row button enters loading spinner; action locked | Call `leadStore.qualifyLead(lead.prospect.id)` |
| `QUALIFYING` | API Success | `PURSUED` | Row transitions out of table immediately; Pursued Aside badge increments (+1) | Mutates status to `'PURSUED'`, moving lead from `poolLeads` to `pursuedLeads` |
| `QUALIFYING` | API Error | `POOL_MEMBER` | Row restored; error notification displayed | Show `BaseAlert` with error |
| `POOL_MEMBER` | Click "Disqualify" Button | `MODAL_DISQUALIFY` | Mount `BaseModal` wrapping `DisqualifyLeadForm.vue` | Set `activeDisqualifyLead = lead`; trap focus |
| `MODAL_DISQUALIFY` | Form Submit (`reason`, `suppress`) | `DISQUALIFYING` | Modal submit button enters loading spinner; inputs locked | Call `leadStore.disqualifyLead(id, reason)` (and `suppressLead` if checked) |
| `DISQUALIFYING` | API Success | `DISQUALIFIED` | Modal closes; row removed from table immediately | Remove lead from local pool; show success feedback |
| `MODAL_DISQUALIFY` | Click Cancel / Backdrop / Esc | `POOL_MEMBER` | Modal unmounts without mutation | Clear `activeDisqualifyLead = null` |

---

## 4. Deep Inspection Dossier Drawer State Machine

Governs slideout drawer displaying technical audit deficit rubrics and opportunity playbooks.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Guard |
| :--- | :--- | :--- | :--- | :--- |
| `DOSSIER_CLOSED` | Click Table Row (`lead.prospect.id`) | `DOSSIER_OPEN` | `BaseDrawer` (`size="lg"`, 960px) slides open displaying audit findings | Set `selectedLead = lead`; lock canvas scroll |
| `DOSSIER_OPEN` | Click Drawer Close (`X`) | `DOSSIER_CLOSED` | Drawer slides closed; scroll unlocked | Clear `selectedLead = null`; return focus to clicked row |
| `DOSSIER_OPEN` | Press `Escape` Key | `DOSSIER_CLOSED` | Drawer closes immediately | Global keydown listener |
| `DOSSIER_OPEN` | Click "Qualify Lead" in Drawer | `PURSUED` | Drawer closes; lead transitions to Pursued Pipeline | Dispatches `qualifyLead(lead.prospect.id)` |
