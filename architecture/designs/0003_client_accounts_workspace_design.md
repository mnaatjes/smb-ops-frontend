---
title: "0003: Client Accounts Workspace and Dossier Design"
status: "draft"
date: "2026-10-18"
tags: ["design", "frontend", "client-accounts", "fsd", "ui-design"]
---

# 0003: Client Accounts Workspace and Dossier Design

## 1. Executive Summary

This Software Design Document details the UI components, Feature-Sliced Design (FSD) structure, and interaction patterns for the **Client Accounts Workspace** (`tab=clients`) in `smb-ops-frontend`.

```
                    +----------------------------------------+
                    |           HomeView (tab=clients)       |
                    +-------------------+--------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
        +-----------------+                           +-------------------+
        | ClientsGrid.vue |                           | EmptyClients.vue  |
        +--------+--------+                           +-------------------+
                 |
                 v (Click Client Card)
        +----------------------------+
        |   ClientDossierDrawer.vue  |
        |                            |
        |  + Contract Summary Card   |
        |  + Maintenance Minute Bar  |
        |  + Continuity Health Card  |
        |  + Recent Maintenance Logs |
        +--------------+-------------+
                       |
                       v (Click "+ Log Work")
        +----------------------------+
        |   LogMaintenanceModal.vue  |
        +----------------------------+
```

## 2. Component Hierarchy & FSD Slices

* **`widgets/client-accounts/`**:
  * `ClientsGrid.vue`: Responsive CSS grid hosting individual client cards.
  * `ClientCard.vue`: Card displaying business name, primary contact, contract type badge, and continuity status.
* **`features/client-dossier/`**:
  * `ClientDossierDrawer.vue`: Side drawer providing deep inspection of contracts, billing rate, signed document links, and historical maintenance entries.
* **`features/client-maintenance/`**:
  * `LogMaintenanceModal.vue`: Modal allowing operators to log minutes spent and task description against the 30-min SLA retainer cap.
  * `MaintenanceGauge.vue`: Progress indicator displaying used minutes vs remaining allowance.
* **`entities/client/`**:
  * `model.ts`: TypeScript contracts for `ClientAccount`, `ContractAgreement`, `MaintenanceLog`, `ContinuityHealth`.
  * `store.ts`: Pinia client store managing state, API queries, and mutations.

## 3. Visual & Interaction Design Specifications

### 3.1 Maintenance Gauge Invariant
* Under 25 minutes: Green progress bar (`var(--color-success)`).
* 25–30 minutes: Amber warning progress bar (`var(--color-warning)`).
* >30 minutes: Red overflow progress bar (`var(--color-danger)`) with badge: `Out-of-Scope (Additional SOW Required)`.

### 3.2 Continuity Health Indicator
* `All Systems Green`: Active SSL, successful weekly S3 backup within last 7 days, uptime check passing.
* `Warning`: Overdue backup (>7 days) or SSL expiring within 14 days.
* `Critical`: Website endpoint offline / HTTP error.
