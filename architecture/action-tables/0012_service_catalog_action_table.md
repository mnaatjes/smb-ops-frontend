---
title: "Action Table: Service Catalog Interaction and Ingestion Contracts"
status: "accepted"
date: "2026-11-05"
tags: ["action-table", "architecture", "service-catalog", "contracts", "forms", "interactions"]
---

# Action Table: Service Catalog Interaction and Ingestion Contracts

## 1. Overview & Scope

This Action Table defines the deterministic interaction contract for all user triggers across the Service Catalog workspace (`ServiceCatalogView.vue`), including card selection, filtering, drawer inspections, and modal-based form ingestions.

---

## 2. Workspace & Ingestion Action Matrix

| UI Element | Trigger Event | Component Prop / Emit | Store Action / Handler Target | Optimistic UI Behavior | Error Remediation / Guard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Service Card (`BaseCard`)** | `@click` | `emit('select-service', item: ServiceCatalogItem)` | Sets `selectedServiceId = item.id`; opens inspection drawer | Card active elevation; drawer opens immediately (`size="md"`) | None (read-only action). |
| **Tier Filter Pill** | `@click` | Handler in page | Mutates `activeFilter = tier` | Re-filters active card grid instantaneously with zero layout shift | If already active, toggles back to `'ALL'`. |
| **"+ New Core Service" Button** | `@click` | Handler in page | Sets `isCoreModalOpen = true` | `BaseModal` mounts with `CreateCoreServiceForm` | Guarded against unauthenticated operators. |
| **"+ New Care Plan" Button** | `@click` | Handler in page | Sets `isAddOnModalOpen = true` | `BaseModal` mounts with `CreateAddOnForm` | Guarded against unauthenticated operators. |
| **Drawer Close Trigger (`X`)** | `@click` | `emit('close')` | Sets `selectedServiceId = null` | Drawer slides off right viewport boundary | Unlocks stage canvas scroll. |
| **`BaseRepeater` "Add Another"** | `@click` | `emit('update:modelValue')` | Appends empty string to array | New text input appears with autofocus | Disabled if `array.length >= maxItems`. |
| **`BaseRepeater` Remove Button** | `@click` | `emit('update:modelValue')` | Splices item at target index | Row fades out immediately | Disabled if `array.length <= minItems`. |
| **Core Service Form Submit** | `@submit` | `emit('submit', payload: CreateCoreServicePayload)` | Dispatches `leadStore.createServiceOffering(payload)` | Submit button enters loading spinner state; inputs locked | Show `BaseAlert` with API error; keep form populated. |
| **Add-On Care Plan Submit** | `@submit` | `emit('submit', payload: CreateAddOnPayload)` | Dispatches `leadStore.createServiceOffering(payload)` | Submit button enters loading spinner state; inputs locked | Show `BaseAlert` with API error; keep form populated. |
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
