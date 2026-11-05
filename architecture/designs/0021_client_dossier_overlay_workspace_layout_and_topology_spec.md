---
title: "SDD-0021: Client Dossier Overlay Workspace Layout and Topology Specification"
status: "accepted"
date: "2026-11-05"
tags: ["design", "architecture", "layout", "topology", "client-dossier", "full-canvas", "theme-tokens", "vault"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# SDD-0021: Client Dossier Overlay Workspace Layout and Topology Specification

## 1. Visual Topology & Spatial Architecture

The Client Dossier Overlay (`ClientDossierDrawer.vue`) is a full-canvas, dual-column workspace slideout that mounts over the active stage via `#drawer-portal` under `width: calc(100vw - 260px)`. It provides operational management for an active or onboarding client account (`ClientAccount`), orchestrating continuity health probes, active service contracts with git commit sha traceability, monthly retainer timecards (`MaintenanceGauge`), and an encrypted credentials vault:

1. **Header Orientation Strip:** Fixed top strip (`.workspace-header`) containing:
   - Breadcrumb Identity: `Client Accounts / CLIENT-ID: <id.slice(0, 8)>`.
   - Client Business Title & State Badge (`BaseBadge`: `active` [success], `onboarding` [primary], `dormant` [warning]).
   - Quick Action: `+ Log Work` trigger and `✕` close button (`Escape` hotkey listener).
2. **Dual-Column Independent Scroll Body (`.workspace-body`):**
   - **Column 1: Context, Telemetry & Contracts (Left - 44% width, `.col-left`):**
     - **Panel: Account Profile:** Primary contact person, direct email, phone number, and external website hyperlink (`↗`).
     - **Panel: Continuity & SLA Health:** Real-time health probe bullets (SSL certificate validity, endpoint uptime status, backup bucket location), probe timestamp, and interactive "Run Diagnostics Ping" action.
     - **Panel: Active Service Contracts:** Expandable contract accordion list showing service codes, monthly billing rate, billing frequency, and expandable discrete deliverables checklist with git commit sha tagging. Includes "+ Attach Care Plan" modal trigger.
   - **Column 2: Operations, Timecards & Credential Vault (Right - 56% width, `.col-right`):**
     - **Panel: Monthly Retainer Timecard & MaintenanceGauge:** Houses the `MaintenanceGauge` visual bar illustrating minutes logged vs. monthly retainer cap, out-of-scope breach warnings, and a granular log of recent maintenance work entries with duration chips.
     - **Panel: Credentials & Access Vault:** Encrypted credential cards with secret type chip, label, login URL, and username. Features an automated 15-second masked/plaintext password reveal countdown mechanism, clipboard copy helper, and purge action. Includes "+ Add Secret" modal trigger.
3. **Modal Delegation Portals:**
   - **Log Work Modal (`LogWorkModal.vue`):** Dispatched via `(e: 'log-work')` to `#modal-portal`.
   - **Attach Care Plan Modal (`ContractAgreementModal.vue`):** Dispatched via `(e: 'attach-contract')` to `#modal-portal`.
   - **Store Credential Modal (`VaultSecretModal.vue`):** Dispatched via `(e: 'add-secret')` to `#modal-portal`.

```
+===================================================================================================================+
|                                           VIEWPORT (100vw x 100vh)                                                |
+=============================================+=====================================================================+
|  LEFT NAV RAIL (BaseAside.vue)              |  CLIENT DOSSIER OVERLAY (ClientDossierDrawer.vue)                    |
|  [width: 260px]                             |  [width: calc(100vw - 260px), height: 100vh, fixed, z-index: 50]    |
|                                             |                                                                     |
|                                             |  * WORKSPACE HEADER:                                                |
|                                             |    Client Accounts / CLIENT-ID: 7a8b9c0d  [ACTIVE]  [+ Log Work] [✕]|
|                                             |    ===============================================================  |
|                                             |  * DUAL-COLUMN BODY:                                                |
|                                             |    +----------------------------------+---------------------------+ |
|                                             |    | COLUMN 1: Telemetry & Contracts  | COLUMN 2: Operations & Vault| |
|                                             |    | (44% width, scroll-y)            | (56% width, scroll-y)       |
|                                             |    |                                  |                             | |
|                                             |    | 👤 Account Profile               | ⏱️ Timecards & Retainer     | |
|                                             |    |   Contact: John Doe              |   [MaintenanceGauge: 25/60m]| |
|                                             |    |   Email: john@example.com        |   Recent Entries:           | |
|                                             |    |                                  |   - Core patch (15m)        | |
|                                             |    | 🛡️ Continuity & SLA Health       |   - DNS check (10m)         | |
|                                             |    |   ● SSL Valid                    |                             | |
|                                             |    |   ● Uptime Operational           | 🔐 Credentials Vault        | |
|                                             |    |   [Run Diagnostics Ping]         |   [WP Admin] admin_user     | |
|                                             |    |                                  |   •••••••• [Reveal (15s)]   | |
|                                             |    | 📄 Active Service Contracts      |   [+ Add Secret]            | |
|                                             |    |   CARE_PLAN_60 ($199/mo)         |                             | |
|                                             |    |   [▼] Deliverables Checklist     |                             | |
|                                             |    |   [+ Attach Care Plan]           |                             | |
|                                             |    +----------------------------------+---------------------------+ |
+=============================================+=====================================================================+
```

---

## 2. Invariant Layout Geometry & Theme Token Architecture

* **Spatial Footprint:** Occupies `calc(100vw - 260px)` width and `100vh` height anchored to the right boundary of the viewport.
* **Dual-Column Proportions:** Strictly 44% width for Column 1 (`.col-left`) and 56% width for Column 2 (`.col-right`).
* **Theme Token Decoupling (Light and Dark Support):**
  - Canvas Root: `background-color: var(--bg-app); color: var(--text-primary); border-left: 1px solid var(--border-color);`
  - Header & Cards: `background-color: var(--bg-surface); border: 1px solid var(--border-color);`
  - Subtle Surfaces / Tags: `background-color: var(--bg-surface-subtle); color: var(--text-secondary);`
  - Typography: Primary `var(--text-primary)`, Secondary `var(--text-secondary)`, Muted `var(--text-muted)`.
  - Accents & Links: `var(--accent-primary)`.
  - Zero hardcoded canvas colors (`#090d16`, `#0f172a`, `#1e293b`, `#f1f5f9` prohibited).
