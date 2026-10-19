---
title: "Information Architecture: Client Account Full-Canvas Workspace"
tags: ["ia", "client-accounts", "workspace", "navigation"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# Information Architecture: Client Account Full-Canvas Workspace

## 1. Hierarchy & Navigation Path

* **Level 1:** Global Navigation Rail (`Client Accounts` view).
* **Level 2:** Client Account Card / Row trigger (`Open Workspace / Dossier`).
* **Level 3:** Full-Canvas Split Workspace Overlay (`ClientDossierDrawer.vue`).

## 2. Workspace Viewport Structure

```text
[Viewport Container: .workspace-overlay]
 └── [Canvas: .workspace-canvas (width: calc(100vw - 260px))]
      ├── [Header: .workspace-header]
      │    ├── Breadcrumbs ("Client Accounts" / "CLIENT-ID: {uid}")
      │    ├── Business Name & State Badge
      │    └── Actions: "+ Log Work", "✕ Close"
      └── [Body: .workspace-body]
           ├── [Column 1: .col-left (44%)]
           │    ├── [Card: Account Profile]
           │    ├── [Card: Continuity & SLA Health Probes]
           │    └── [Card: Active Service Contracts]
           └── [Column 2: .col-right (56%)]
                ├── [Card: Monthly Retainer Timecard]
                └── [Card: Credentials & Access Vault]
```

## 3. Visual Weight & Hierarchy

* High visual emphasis placed on operational readiness: Gauge status and health probe bullets.
* Secondary emphasis on credential reveal workflows to protect operator confidentiality.
