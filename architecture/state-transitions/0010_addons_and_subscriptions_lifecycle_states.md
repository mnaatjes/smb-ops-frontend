---
title: "State Transitions: Add-ons and Recurring Subscriptions Lifecycle and Ingestion States"
status: "accepted"
date: "2026-11-05"
tags: ["state-machine", "architecture", "addons", "subscriptions", "care-plans", "fsm", "inspection", "ingestion"]
---

# State Transitions: Add-ons and Recurring Subscriptions Lifecycle and Ingestion States

## 1. Overview & Scope

This document specifies the Finite State Machine (FSM) governing the Add-ons and Recurring Subscriptions workspace (`AddOnsView.vue`), its interaction with the Pinia lead entity store (`useLeadStore.ts`), deep subscription inspection flyout drawers (`BaseDrawer.vue`), and the decoupled add-on creation workspace drawer (`CreateAddOnForm.vue`).

> [!NOTE]
> Fixed-scope one-time consulting packages (Ranks 1A, 1B, 3, 4) reside strictly under the Core Service Catalog workspace (`/services`) and are excluded from this state machine.

```
+---------------------------------------------------------------------------------------+
|                       ADD-ONS & SUBSCRIPTIONS WORKSPACE FSM DOMAINS                   |
|  1. Subscriptions Hydration Domain: UNINITIALIZED -> LOADING -> POPULATED / EMPTY    |
|  2. Plan Inspection Drawer Domain:  INSPECT_CLOSED <----------> INSPECT_OPEN(planId)  |
|  3. Ingestion Drawer Domain:        CREATE_CLOSED  <----------> CREATE_DRAWER_ACTIVE  |
|  4. Retainer Cap Filter Domain:     FILTER_ALL     <----------> FILTER_BY_CAP(min)    |
+---------------------------------------------------------------------------------------+
```

---

## 2. Subscription View Lifecycle State Machine

Governs primary data hydration, support cap filtering, and optimistic catalog mutations.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Store Action |
| :--- | :--- | :--- | :--- | :--- |
| `UNINITIALIZED` | View Mount (`onMounted`) | `SUBSCRIPTIONS_LOADING` | Skeleton shimmer cards in 3-column grid; disabled "+ New Care Plan" trigger | Dispatch `leadStore.fetchServices()` and `leadStore.fetchAuditParameters()` |
| `SUBSCRIPTIONS_LOADING` | Fetch Success (Length > 0) | `SUBSCRIPTIONS_POPULATED` | Render `BaseCard` grid filtered to recurring Rank 2 care plans; active count badge in header | Cache services array in Pinia |
| `SUBSCRIPTIONS_LOADING` | Fetch Success (Length == 0) | `SUBSCRIPTIONS_EMPTY` | Render empty state card with "No Care Plans Registered" and create CTA | Clear error state |
| `SUBSCRIPTIONS_LOADING` | Network Error / 500 | `SUBSCRIPTIONS_ERROR` | Render `BaseAlert` (variant="danger") with retry button | Log error to telemetry; display dismissible alert |
| `SUBSCRIPTIONS_POPULATED` | Cap Filter Pill Clicked (`cap: number \| 'ALL'`) | `SUBSCRIPTIONS_FILTERED` | Instant reactive filter re-slice (e.g. 0m, 30m, 60m, 90m+) without layout shift | Set `activeCapFilter = cap` in local component state |
| `SUBSCRIPTIONS_POPULATED` | Ingestion Success Event | `SUBSCRIPTIONS_POPULATED` | Flash newly added care plan card with emerald highlight border; increment badge count | Optimistically append item to `services.value` |

---

## 3. Deep Plan Inspection Drawer State Machine

Governs inspection overlay for detailed SLA commitments, deliverables, and parameter bindings.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Guard |
| :--- | :--- | :--- | :--- | :--- |
| `INSPECT_CLOSED` | Click on Care Plan Card (`plan.id`) | `INSPECT_OPEN` | `BaseDrawer` slides in from right (`size="md"`); body scroll locked | Set `activePlan = plan`; focus trap engaged |
| `INSPECT_OPEN` | Click Drawer Close Button (`X`) | `INSPECT_CLOSED` | Drawer translates off-screen; scroll unlocked | Clear `activePlan = null`; return focus to clicked card |
| `INSPECT_OPEN` | Press `Escape` Key | `INSPECT_CLOSED` | Drawer closes immediately | Global keydown listener |
| `INSPECT_OPEN` | Click Backdrop Overlay | `INSPECT_CLOSED` | Drawer closes immediately | Click outside drawer boundary |

---

## 4. Administrative Ingestion Drawer State Machine

Governs recurring care plan creation drawer lifecycle (`BaseDrawer size="lg"`), rate and cap inputs, and form submission.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Guard |
| :--- | :--- | :--- | :--- | :--- |
| `CREATE_CLOSED` | Click "+ New Care Plan" | `CREATE_DRAWER_ACTIVE` | `BaseDrawer` (`size="lg"`, 960px) mounts `CreateAddOnForm.vue`; auto-focuses first input | Initialize empty payload with default Rank 2 ($99/mo, 30m cap) defaults |
| `CREATE_DRAWER_ACTIVE` | Monthly Rate / Cap Changed | `CREATE_DRAWER_ACTIVE` | Rate preview tag updates ($99, $199, $299) | Mutate `payload.monthly_rate`, `payload.monthly_retainer_cap_minutes` |
| `CREATE_DRAWER_ACTIVE` | Form `@submit` emitted | `INGESTION_SUBMITTING` | Submit button disabled with spinner; inputs set to read-only | Call `leadStore.createServiceOffering(payload)` |
| `INGESTION_SUBMITTING` | API Success (201 Created) | `CREATE_CLOSED` | Drawer slides closed; success notification banner displayed in header | Trigger optimistic catalog append; reset form state |
| `INGESTION_SUBMITTING` | API Error (400 / 422 / 500) | `FORM_ERROR` | Error banner rendered at top of drawer; re-enable inputs | Retain operator input values; prevent data loss |
| `CREATE_DRAWER_ACTIVE` | Click Cancel / Backdrop / Esc | `CREATE_CLOSED` | Drawer slides closed without mutation | Confirm if form is dirty before closing |
