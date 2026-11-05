---
title: "SDD-0020: Client Accounts and Retainers Workspace Layout and Topology Specification"
status: "accepted"
date: "2026-11-05"
tags: ["design", "architecture", "layout", "topology", "client-accounts", "retainers", "timecards", "drawers"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# SDD-0020: Client Accounts and Retainers Workspace Layout and Topology Specification

## 1. Visual Topology & Spatial Architecture

The Client Accounts & Retainers Workspace (`ClientAccountsView.vue`) mounts within the unified application shell (`BaseSiteLayout.vue`) inside `BasePageContainer.vue` under route `/clients`. It serves as the primary stage 3 operational ledger for converted, active, and dormant SMB client accounts, governing monthly digital continuity retainers, timecards, maintenance caps, SLA probes, and credential vaults:

1. **Header Orientation Strip:** Standardized `BasePageHeader.vue` with breadcrumbs (`Home / Client Accounts`), active client account count badge, and a primary action trigger (`Log Work` / `Onboard Client`).
2. **Executive Retainer & Account KPI Ribbon:** 4-column metric ribbon powered by `BaseMetricCard.vue` presenting:
   - Total Client Accounts (`store.clients.length`).
   - Active Retainer Accounts (`state === 'active'`).
   - Onboarding In-Progress Accounts (`state === 'onboarding'`).
   - Monthly Retainer MRR / Active Care Plans.
3. **Account State Filter & Search Control Deck:** High-density filter bar featuring:
   - State Filter Pills: `All Accounts`, `Active Retainers`, `Onboarding`, `Dormant`.
   - Keyword Search Input (`business_name`, primary contact, phone).
   - Retainer Service Tier Filter / Sort controls.
4. **Primary Account Presentation (`BaseCard.vue` Grid):** Responsive, high-density client account card deck (`grid-template-columns: repeat(auto-fill, minmax(360px, 1fr))`):
   - **Card Header:** Business name with external website link, primary contact vitals, and state badge (`BaseBadge.vue`: `active` [success], `onboarding` [primary], `dormant` [neutral]).
   - **Card Retainer Status & Contracts:** Contracted service codes (`CARE_PLAN_30`, `CARE_PLAN_60`, etc.), billing rate, and billing frequency.
   - **Card Health & Telemetry Indicators:** Continuity badge (SSL/Uptime health) and monthly maintenance minute gauge preview.
   - **Card Actions Footer:** Action button cluster: "Open Dossier" (launches `ClientDossierDrawer.vue`), "+ Log Work" (opens `LogWorkModal.vue`), and "+ Attach Care Plan" (opens `ContractAgreementModal.vue`).
5. **Contextual Overlay Portals:**
   - **Full-Depth Client Dossier Drawer (`ClientDossierDrawer.vue`, `BaseDrawer size="lg"`, 960px):** Slideout mounted via `#drawer-portal` upon card or action click, hosting the dual-column operations hub (Column 1: Account Profile, Continuity & SLA Health Probes, Governed Active Service Contracts; Column 2: Monthly Retainer Timecard & MaintenanceGauge, Credentials & Access Vault).
   - **Log Work Modal (`LogWorkModal.vue`, `BaseModal.vue`):** Mounted via `#modal-portal` for logging maintenance minutes against client care plan caps.
   - **Contract Agreement Modal (`ContractAgreementModal.vue`, `BaseModal.vue`):** Mounted via `#modal-portal` for attaching new care plan contracts or add-on agreements to client accounts.
   - **Vault Secret Modal (`VaultSecretModal.vue`, `BaseModal.vue`):** Mounted via `#modal-portal` for securely storing encrypted administrative credentials.

```
+===================================================================================================================+
|                                           VIEWPORT (100vw x 100vh)                                                |
+=============================================+=====================================================================+
|  LEFT NAV RAIL (BaseAside.vue)              |  MAIN STAGE VIEWPORT (BasePageContainer.vue)                        |
|  [width: 240px (expanded) / 64px (rail)]    |  [flex: 1, height: 100%, overflow-y: auto, max-width: 1440px]       |
|                                             |                                                                     |
|  * 3-TIER NAVIGATION:                       |  * PAGE ORIENTATION (BasePageHeader.vue):                           |
|    - Leads (/leads)                         |    - Breadcrumbs: Home / Client Accounts                            |
|    - Pursued (/pursued)                     |    - Title: "Client Accounts & Retainers"                           |
|    - Accounts (/clients) [ACTIVE]           |    - Subtitle: "Active Account Ledgers, Retainers, & Vault Access"  |
|    - Service Catalog (/services)            |    - Badges: [4 Active Clients]                                     |
|    - Add-ons & Subs (/addons)               |    - Actions: [ Onboard Client ]                                    |
|                                             |                                                                     |
|                                             |  * KPI METRIC RIBBON (4 Columns):                                   |
|                                             |    +----------------+ +----------------+ +------------------------+ |
|                                             |    | BaseMetricCard | | BaseMetricCard | | BaseMetricCard ...       | |
|                                             |    | Total Clients:4| | Active: 3      | | Onboarding: 1            | |
|                                             |    +----------------+ +----------------+ +------------------------+ |
|                                             |                                                                     |
|                                             |  * ACCOUNT STATE FILTER & SEARCH CONTROLS DECK:                     |
|                                             |    [ All ] [ Active Retainers ] [ Onboarding ] [ Dormant ]          |
|                                             |    [ Search Account Name or Contact... ]                            |
|                                             |                                                                     |
|                                             |  * CLIENT ACCOUNT CARDS GRID (BaseCard.vue):                        |
|                                             |    +----------------------------+  +----------------------------+   |
|                                             |    | [ACTIVE] Grand Rapids Bak. |  | [ACTIVE] Lakeside Auto     |   |
|                                             |    | Contact: John Doe          |  | Contact: Jane Smith        |   |
|                                             |    | Plan: CARE_PLAN_60 ($199)  |  | Plan: CARE_PLAN_30 ($99)   |   |
|                                             |    | ⏱️ Retainer: 25/60m Logged  |  | ⏱️ Retainer: 10/30m Logged  |   |
|                                             |    | [Open Dossier] [+ Log Work]|  | [Open Dossier] [+ Log Work]|   |
|                                             |    +----------------------------+  +----------------------------+   |
|                                             |                                                                     |
+=============================================+=====================================================================+
|  OVERLAYS (Portaled):                                                                                             |
|  - #drawer-portal: ClientDossierDrawer.vue (BaseDrawer size="lg", 960px)                                          |
|  - #modal-portal:  LogWorkModal.vue (Log Work to Timecard)                                                        |
|  - #modal-portal:  ContractAgreementModal.vue (Attach Care Plan)                                                  |
|  - #modal-portal:  VaultSecretModal.vue (Store Credential)                                                        |
+===================================================================================================================+
```

---

## 2. Invariant Layout Geometry

* **Stage Canvas Width:** Occupies `100%` width of stage viewport up to `max-width: 1440px`.
* **Card Deck Grid:** Driven by `BaseCard.vue` in a responsive auto-fill grid (`minmax(360px, 1fr)`), eliminating cramped row squishing and presenting contract, contact, and maintenance metrics clearly.
* **Drawer Portaling:** `ClientDossierDrawer.vue` mounts to `#drawer-portal` with `size="lg"` (960px) and slideout animation.
* **Modal Portaling:** Modals (`LogWorkModal`, `ContractAgreementModal`, `VaultSecretModal`) mount to `#modal-portal` without nested modal occlusion.
