---
title: "Action Table: Core Service Catalog Interaction and Ingestion Contracts"
status: "accepted"
date: "2026-11-05"
tags: ["action-table", "architecture", "service-catalog", "core-services", "contracts", "forms"]
---

# Action Table: Core Service Catalog Interaction and Ingestion Contracts

## 1. Overview & Scope

This Action Table defines the deterministic interaction contract for all user triggers across the Core Service Catalog workspace (`ServiceCatalogView.vue`), including card selection, filtering across core ranks (Rank 1A, 1B, 3, 4), drawer inspections, and modal-based core service form ingestions (`CreateCoreServiceForm.vue`).

---

## 2. Workspace & Ingestion Action Matrix

| UI Element | Trigger Event | Component Prop / Emit | Store Action / Handler Target | Optimistic UI Behavior | Error Remediation / Guard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Core Service Card (`BaseCard`)** | `@click` | `emit('select-service', item: ServiceCatalogItem)` | Sets `selectedServiceId = item.id`; opens inspection drawer | Card active elevation; drawer opens immediately (`size="md"`) | None (read-only action). |
| **Tier Filter Pill** | `@click` | Handler in page | Mutates `activeFilter = tier` | Re-filters active card grid instantaneously with zero layout shift | If already active, toggles back to `'ALL'`. |
| **"+ New Core Service" Button** | `@click` | Handler in page | Sets `isCreateDrawerOpen = true` | `BaseDrawer` (`size="lg"`, 960px) mounts with `CreateCoreServiceForm` | Guarded against unauthenticated operators. |
| **Drawer Close Trigger (`X`)** | `@click` | `emit('close')` | Sets `selectedServiceId = null` or `isCreateDrawerOpen = false` | Drawer slides off right viewport boundary | Unlocks stage canvas scroll. |
| **`BaseRepeater` "Add Another"** | `@click` | `emit('update:modelValue')` | Appends empty string to array | New text input appears with autofocus | Disabled if `array.length >= maxItems`. |
| **`BaseRepeater` Remove Button** | `@click` | `emit('update:modelValue')` | Splices item at target index | Row fades out immediately | Disabled if `array.length <= minItems`. |
| **Core Rank Select (`BaseSelect`)** | `@change` | `v-model="form.rank"` | Mutates form rank and updates price preview | Banner updates to canonical tier price ($150, $350, $300, $250) | Read-only price display. |
| **Core Service Form Submit** | `@submit` | `emit('submit', payload: CreateCoreServicePayload)` | Dispatches `leadStore.createServiceOffering(payload)` | Submit button enters loading spinner state; inputs locked | Show `BaseAlert` with API error; keep form populated. |
| **Parameter Registry Checkbox** | `@change` | `v-model="form.audit_parameters"` | Mutates local array | Checkbox toggles immediately | Checked values must exist in `supportedAuditParameters`. |

---

## 3. Emitted Event Schemas & Types

```typescript
export interface CreateCoreServicePayload {
  code: string
  name: string
  description: string
  rank: 'Rank 1A' | 'Rank 1B' | 'Rank 3' | 'Rank 4' | string
  pricing_model: 'FLAT_FEE' | 'HYBRID' | string
  price_min: number
  price_max: number
  target_profile: string
  scope: string[]
  deliverables: string[]
  exclusions: string[]
  audit_parameters: string[]
  minimum_opportunity_score: number
}
```
