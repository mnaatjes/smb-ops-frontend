---
title: "Action Table: Add-ons and Recurring Subscriptions Interaction Contracts"
status: "accepted"
date: "2026-11-05"
tags: ["action-table", "architecture", "addons", "subscriptions", "care-plans", "contracts", "forms"]
---

# Action Table: Add-ons and Recurring Subscriptions Interaction Contracts

## 1. Overview & Scope

This Action Table defines the deterministic interaction contract for all user triggers across the Add-ons and Recurring Subscriptions workspace (`AddOnsView.vue`), including plan selection, retainer cap filtering, deep SLA inspections, and deep drawer plan ingestions (`CreateAddOnForm.vue`).

---

## 2. Workspace & Ingestion Action Matrix

| UI Element | Trigger Event | Component Prop / Emit | Store Action / Handler Target | Optimistic UI Behavior | Error Remediation / Guard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Care Plan Card (`BaseCard`)** | `@click` | `emit('select-plan', item: ServiceCatalogItem)` | Sets `selectedPlanId = item.id`; opens inspection drawer | Card active elevation; drawer opens immediately (`size="md"`) | None (read-only action). |
| **Retainer Cap Filter Pill** | `@click` | Handler in page | Mutates `activeCapFilter = cap` | Re-filters active card grid instantaneously with zero layout shift | If already active, toggles back to `'ALL'`. |
| **"+ New Care Plan" Button** | `@click` | Handler in page | Sets `isCreateDrawerOpen = true` | `BaseDrawer` (`size="lg"`, 960px) mounts with `CreateAddOnForm` | Guarded against unauthenticated operators. |
| **Drawer Close Trigger (`X`)** | `@click` | `emit('close')` | Sets `selectedPlanId = null` or `isCreateDrawerOpen = false` | Drawer slides off right viewport boundary | Unlocks stage canvas scroll. |
| **`BaseRepeater` "Add Another"** | `@click` | `emit('update:modelValue')` | Appends empty string to array | New text input appears with autofocus | Disabled if `array.length >= maxItems`. |
| **`BaseRepeater` Remove Button** | `@click` | `emit('update:modelValue')` | Splices item at target index | Row fades out immediately | Disabled if `array.length <= minItems`. |
| **Monthly Rate Input (`BaseInput`)** | `@input` | `v-model.number="form.monthly_rate"` | Mutates monthly fee | Updates live form payload | Validates numeric value > 0. |
| **Retainer Cap Select (`BaseSelect`)** | `@change` | `v-model="form.monthly_retainer_cap_minutes"` | Mutates retainer cap | Updates support minutes allocation | Clamped to standard options (0, 30, 60, 90, 120m). |
| **Add-On Care Plan Submit** | `@submit` | `emit('submit', payload: CreateAddOnPayload)` | Dispatches `leadStore.createServiceOffering(payload)` | Submit button enters loading spinner state; inputs locked | Show `BaseAlert` with API error; keep form populated. |
| **Audit Parameter Input** | `@input` | `v-model="auditParamsRaw"` | Splits comma-separated strings | Live chips update below input | Validates string list length > 0. |

---

## 3. Emitted Event Schemas & Types

```typescript
export interface CreateAddOnPayload {
  code: string
  name: string
  description: string
  rank: 'Rank 2' | string
  pricing_model: 'MONTHLY_RETAINER'
  monthly_rate: number
  monthly_retainer_cap_minutes: number
  target_profile: string
  scope: string[]
  deliverables: string[]
  exclusions: string[]
  audit_parameters: string[]
  minimum_opportunity_score: number
}
```
