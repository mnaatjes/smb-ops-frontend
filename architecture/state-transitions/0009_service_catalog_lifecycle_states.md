---
title: "State Transitions: Core Service Catalog Lifecycle and Ingestion States"
status: "accepted"
date: "2026-11-05"
tags: ["state-machine", "architecture", "service-catalog", "core-services", "fsm", "inspection", "ingestion"]
---

# State Transitions: Core Service Catalog Lifecycle and Ingestion States

## 1. Overview & Scope

This document specifies the Finite State Machine (FSM) governing the Core Service Catalog workspace (`ServiceCatalogView.vue`), its interaction with the Pinia lead entity store (`useLeadStore.ts`), deep inspection flyout drawers (`BaseDrawer.vue`), and the decoupled core creation modal (`CreateCoreServiceForm.vue`).

> [!NOTE]
> Add-on digital care plans and subscription contracts are handled under a dedicated workspace (`/addons`) and are strictly excluded from this state machine.

```
+---------------------------------------------------------------------------------------+
|                         CORE SERVICE CATALOG WORKSPACE FSM DOMAINS                    |
|  1. Catalog Hydration Domain:  UNINITIALIZED -> LOADING -> POPULATED / EMPTY / ERROR  |
|  2. Inspection Drawer Domain:  INSPECT_CLOSED <----------> INSPECT_OPEN(serviceId)    |
|  3. Ingestion Drawer Domain:   CREATE_CLOSED  <----------> CREATE_DRAWER_ACTIVE(lg)   |
|  4. Parameter Registry Domain: REGISTRY_STALE <----------> REGISTRY_CACHED            |
+---------------------------------------------------------------------------------------+
```

---

## 2. Catalog View Lifecycle State Machine

Governs primary data hydration, core tier selection filtering, and mutation reactivity.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Store Action |
| :--- | :--- | :--- | :--- | :--- |
| `UNINITIALIZED` | View Mount (`onMounted`) | `CATALOG_LOADING` | Skeleton shimmer cards in 3-column grid; disabled "+ New Core Service" trigger | Dispatch `leadStore.fetchServices()` and `leadStore.fetchAuditParameters()` |
| `CATALOG_LOADING` | Fetch Success (Length > 0) | `CATALOG_POPULATED` | Render `BaseCard` grid filtered to core offerings (Ranks 1A, 1B, 3, 4); active count badge in header | Cache services array and audit parameters in Pinia |
| `CATALOG_LOADING` | Fetch Success (Length == 0) | `CATALOG_EMPTY` | Render empty state card with "No Core Services Found" and create CTA | Clear error state |
| `CATALOG_LOADING` | Network Error / 500 | `CATALOG_ERROR` | Render `BaseAlert` (variant="danger") with retry button | Log error to telemetry; display dismissible alert |
| `CATALOG_POPULATED` | Filter Pill Clicked (`tier: string`) | `CATALOG_FILTERED` | Instant reactive filter re-slice (e.g. Rank 1A, 1B, 3, 4) without layout shift | Set `activeTier = tier` in local component state |
| `CATALOG_POPULATED` | Ingestion Success Event | `CATALOG_POPULATED` | Flash newly added service card with green highlight border; increment badge count | Optimistically append core service item to `services.value` |

---

## 3. Deep Inspection Drawer State Machine

Governs inspection overlay for detailed service profiles, deliverables, and parameter bindings.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Guard |
| :--- | :--- | :--- | :--- | :--- |
| `DRAWER_CLOSED` | Click on Core Service Card (`service.id`) | `DRAWER_OPEN` | `BaseDrawer` slides in from right (`size="md"`); body scroll locked | Set `activeService = service`; focus trap engaged |
| `DRAWER_OPEN` | Click Drawer Close Button (`X`) | `DRAWER_CLOSED` | Drawer translates off-screen; scroll unlocked | Clear `activeService = null`; return focus to clicked card |
| `DRAWER_OPEN` | Press `Escape` Key | `DRAWER_CLOSED` | Drawer closes immediately | Global keydown listener |
| `DRAWER_OPEN` | Click Backdrop Overlay | `DRAWER_CLOSED` | Drawer closes immediately | Click outside drawer boundary |

---

## 4. Administrative Ingestion Drawer State Machine

Governs core service creation drawer lifecycle (`BaseDrawer size="lg"`), parameter registry binding, and form submission.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Guard |
| :--- | :--- | :--- | :--- | :--- |
| `CREATE_CLOSED` | Click "+ New Core Service" | `CREATE_DRAWER_ACTIVE` | `BaseDrawer` (`size="lg"`, 960px) mounts `CreateCoreServiceForm.vue`; auto-focuses first input | Initialize empty payload with default Rank 1A ($150) pricing |
| `CREATE_DRAWER_ACTIVE` | Rank Selection Changed | `CREATE_DRAWER_ACTIVE` | Price preview banner recalculates instantly ($150, $350, $300, $250) | Mutate `payload.rank`, `payload.price_min`, `payload.price_max` |
| `CREATE_DRAWER_ACTIVE` | Form `@submit` emitted | `INGESTION_SUBMITTING` | Submit button disabled with spinner; inputs set to read-only | Call `leadStore.createServiceOffering(payload)` |
| `INGESTION_SUBMITTING` | API Success (201 Created) | `CREATE_CLOSED` | Drawer slides closed; success notification banner displayed in header | Trigger optimistic catalog append; reset form state |
| `INGESTION_SUBMITTING` | API Error (400 / 422 / 500) | `FORM_ERROR` | Error banner rendered at top of drawer; re-enable inputs | Retain operator input values; prevent data loss |
| `CREATE_DRAWER_ACTIVE` | Click Cancel / Backdrop / Esc | `CREATE_CLOSED` | Drawer slides closed without mutation | Confirm if form is dirty before closing |
