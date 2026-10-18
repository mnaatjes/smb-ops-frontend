---
title: "0013: Client Accounts Workspace and Onboarding Lifecycle"
status: "accepted"
date: "2026-10-18"
tags: ["adr", "frontend", "client-accounts", "lifecycle", "workspace"]
---

# 0013: Client Accounts Workspace and Onboarding Lifecycle

## Context and Problem Statement

When an operator converts a lead from the Pursued Pipeline (`POST /api/leads/:id/convert`), the prospect transitions to `ClientAccount`.

Currently, the `Client Accounts` workspace tab in `HomeView.vue` is a static placeholder without interactive workflows. Operators need to:
1. View converted clients in an organized grid with lifecycle badges (`ONBOARDING`, `ACTIVE_RETAINER`, `FIXED_PROJECT`, `DORMANT`).
2. Open a side drawer / dossier to inspect active contracts, signed agreement links, and contact information.
3. Record monthly maintenance work against the 30-minute retainer scope limit.
4. Monitor digital continuity telemetry (SSL status, automated backup snapshots, uptime ping indicators).

## Decision Drivers

* Adhere to Feature-Sliced Design (FSD): place client widgets under `widgets/client-accounts/` and features under `features/client-contracts/` and `features/client-maintenance/`.
* High-density, actionable UI providing instant visibility into out-of-scope maintenance and overdue continuity checks.
* Seamless navigation via the existing `AsideNavRail.vue`.

## Decision Outcome

Chosen option: Implement a multi-facet **Client Accounts Workspace**:
* **Workspace Cards:** Compact client cards highlighting business name, contact info, contract tier badge, and continuity status indicator.
* **Client Details Drawer (`ClientDossierDrawer.vue`):** Deep inspection panel presenting:
  * Signed MSA / SOW links and billing parameters.
  * Monthly maintenance minute gauge (e.g., `15 / 30 mins used`).
  * Digital Continuity Telemetry card (last SSL check, last S3 backup, uptime status).
* **Maintenance Work Modal (`LogMaintenanceModal.vue`):** Modal dialog to record maintenance adjustments with duration and notes.
