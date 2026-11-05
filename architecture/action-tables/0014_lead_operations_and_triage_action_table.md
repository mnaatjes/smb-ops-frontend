---
title: "Action Table: Lead Operations and Triage Interaction Contracts"
status: "accepted"
date: "2026-11-05"
tags: ["action-table", "architecture", "leads", "triage", "contracts", "base-table", "discovery"]
---

# Action Table: Lead Operations and Triage Interaction Contracts

## 1. Overview & Scope

This Action Table defines the deterministic interaction contract for all user triggers across the Lead Operations and Triage workspace (`LeadsView.vue`), including batch discovery, table row selection, 1-click qualification, manual prospect ingestion, and disqualification.

---

## 2. Workspace & Triage Action Matrix

| UI Element | Trigger Event | Component Prop / Emit | Store Action / Handler Target | Optimistic UI Behavior | Error Remediation / Guard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Table Row (`BaseTable`)** | `@row-click` | `emit('row-click', row: RankedLead)` | Sets `selectedLeadId = row.prospect.id`; opens dossier | Row highlights with active border; `BaseDrawer` slides in (`size="lg"`) | None (read-only action). |
| **"Discover & Audit" Button** | `@click` | Handler in `DiscoveryBar` | Calls `leadStore.discoverLeads(location, limit)` | Button enters disabled spinner state; loading overlay mounts over table | Re-enable button; display `BaseAlert` variant="danger". |
| **"Clear Findings" Button** | `@click` | Handler in `DiscoveryBar` | Calls `leadStore.clearLeads()` | Prompts `window.confirm`; resets table to empty state | Clears only un-pursued discovery findings. |
| **"Qualify" Button** | `@click.stop` | Handler on table row | Calls `leadStore.qualifyLead(lead.prospect.id)` | Row fades out instantly; Aside "Pursued" counter increments (+1) | Row restores if API request fails; toast error displayed. |
| **"Disqualify" Button** | `@click.stop` | Handler on table row | Sets `activeDisqualifyLead = lead`; opens modal | `BaseModal` mounts with `DisqualifyLeadForm` | Traps background scroll and focus. |
| **"+ Manual Lead" Button** | `@click` | Handler in page header | Sets `isManualDrawerOpen = true` | `BaseDrawer` mounts with `ManualLeadForm` | Focus shifts to business name input. |
| **Manual Lead Form Submit** | `@submit` | `emit('submit', payload: CreateProspectPayload)` | Calls `leadStore.createManualLead(payload)` | Submit button enters loading state; new lead appended to table top | Display `BaseAlert` with error; keep form populated. |
| **Disqualify Form Submit** | `@submit` | `emit('submit', payload: DisqualifyLeadPayload)` | Calls `leadStore.disqualifyLead(id, reason)` + optional suppress | Row removed immediately from table | Show `BaseAlert` with API error; keep modal open. |
| **Service Filter Dropdown** | `@update:modelValue`| `v-model="activeServiceFilters"` | Mutates store filter state | Re-filters active table rows instantaneously with zero layout shift | Resetting to empty array displays All Services. |
| **Min Score Slider** | `@input` | `v-model.number="minScore"` | Mutates `leadStore.setMinScore(value)` | Re-filters table rows based on `opportunity_score >= minScore` | Default threshold is 0. |

---

## 3. Emitted Event Schemas & Types

```typescript
export interface CreateProspectPayload {
  business_name: string
  website_url?: string | null
  phone?: string | null
  address?: string | null
  source?: string
}

export interface DisqualifyLeadPayload {
  reason: string
  notes?: string
  suppress?: boolean
}
```
