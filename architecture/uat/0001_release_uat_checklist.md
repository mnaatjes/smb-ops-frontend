---
title: "UAT Plan: End-to-End Release Acceptance Checklist"
tags: ["uat", "release-gate", "testing", "smb-ops-frontend"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
author: "Antigravity Automated Test Engineering"
target_environment: "http://localhost:8090"
status: "draft"
---

# UAT Plan: End-to-End Release Acceptance Checklist

## 1. Test Environment & Pre-Conditions
- **Base URL:** `http://localhost:8090`
- **Stack Refresh:** Execute `bash scripts/refresh_stack.sh` on `smb-ops-stack` to confirm all containers (`smb-ops-frontend`, `smb-ops-backend`) are healthy.
- **Prerequisites:** Seed test data active in memory / SQLite backend.

---

## 2. Test Execution Checklists

### Section A: Lead Discovery & Pool Triage (`/`)
- [ ] **A.1 Discovery Input & Trigger**
  - **Action:** In Discovery Bar, enter query `Plumbing` and location `Ames, IA`. Click `Discover & Audit`.
  - **Expected:** Scan spinner animates; upon completion, new lead rows populate the triage table.
- [ ] **A.2 Service Filter Dropdown**
  - **Action:** Click Service Filter dropdown; select a service (e.g. `WEB_HOSTING`).
  - **Expected:** Table rows dynamically filter to show only leads matching that target service code.
- [ ] **A.3 Lead Qualification (Move to Pipeline)**
  - **Action:** Click `Qualify` button on any unreviewed lead row.
  - **Expected:** Lead row immediately transitions out of Pool table.
- [ ] **A.4 Lead Disqualification Modal**
  - **Action:** Click `Disqualify` button on a lead row.
  - **Expected:** `DisqualifyModal` appears; select reason `OUT_OF_MARKET`, input note `Test reason`, click confirm.
  - **Expected:** Lead is removed from active pool.

---

### Section B: Pursued Opportunity Dossier & Contacts (`/` -> Pipeline)
- [ ] **B.1 Pipeline Navigation & Drawer Open**
  - **Action:** Click `Pipeline` tab in the navigation rail. Click on a pursued opportunity row.
  - **Expected:** `OpportunityDossierDrawer` slides open in full-canvas mode (`calc(100vw - 260px)`).
- [ ] **B.2 Contact Management**
  - **Action:** In Decision-Maker Roster, click `+ Add Contact`. Enter Name `John Smith`, Title `Owner`, Email `john@test.com`, Phone `515-555-0123`. Click `Save Contact`.
  - **Expected:** Contact card immediately appears in the roster grid.
- [ ] **B.3 Activity Ledger Logging**
  - **Action:** In Activity Ledger, enter note `Initial discovery phone call`, select `CALL`, click `Log Activity`.
  - **Expected:** New activity entry appends to top of timeline with current timestamp.

---

### Section C: Client Accounts Workspace & Secret Vault (`/` -> Clients)
- [ ] **C.1 Client Accounts Grid & Onboarding Modal**
  - **Action:** Click `Clients` tab in the navigation rail. Click `+ Onboard Client`.
  - **Expected:** 3-step onboarding modal opens. Enter Name `Apex Heating`, URL `https://apexheating.com`, select service `WEB_HOSTING`, click `Submit`.
  - **Expected:** Modal closes; `Apex Heating` appears in Client Accounts table.
- [ ] **C.2 Full-Canvas Client Workspace Drawer**
  - **Action:** Click on `Apex Heating` row in the client table.
  - **Expected:** Full-canvas dual-column workspace opens (`ClientDossierDrawer.vue`). Left column displays Account Profile & SLA Health; right column displays Retainer Timecard & Vault.
- [ ] **C.3 Add-on Care Plan Attachment**
  - **Action:** In Active Service Contracts, click `+ Attach Care Plan`. Select tier `CARE_PLAN_30` ($150/mo), click `Attach Contract`.
  - **Expected:** `CARE_PLAN_30` appears in contracts list; Maintenance Retainer gauge displays 30m monthly allocation.
- [ ] **C.4 Discrete Deliverables Accordion & Commit UUID**
  - **Action:** Click on the `CARE_PLAN_30` accordion header card.
  - **Expected:** Deliverables checklist expands showing monthly audit milestones.
  - **Action:** Check off an item (e.g. `Plugin & Core Patching`) and enter Git Commit UUID `a1b2c3d`. Reload browser.
  - **Expected:** Checked state and commit UUID persist from `localStorage`.
- [ ] **C.5 Client Secret Vault (Add & Reveal)**
  - **Action:** Under Credentials & Access Vault, click `+ Add Secret`. Enter Label `SSH Key`, Username `root`, Password `supersecretpass`, click `Save Credential`.
  - **Expected:** Credential card renders with password masked as `••••••••••••`.
  - **Action:** Click `Reveal` on the credential card.
  - **Expected:** Plaintext password displays with an active 15s countdown badge.

---

### Section D: Service Catalog & Business Doctrine
- [ ] **D.1 Service Catalog Workspace**
  - **Action:** Click `Services` tab in navigation rail. Click `+ Create Service`.
  - **Expected:** Fill Code `NEW_SVC`, Name `Speed Optimization`, Tier `TIER_1_STANDARD`, Rate `300`, click Save.
  - **Expected:** Service appears in catalog grid.
- [ ] **D.2 Business Doctrine Workspace**
  - **Action:** Click `Doctrine` tab in navigation rail. Select document from left sidebar.
  - **Expected:** Markdown content renders with headers, tables, and Mermaid architecture diagrams.

---

## 3. Defect & Regression Ledger
| # | Section / Step | Observed Issue | Expected Visual / Behavior | Severity | Resolution Status |
|---|---|---|---|---|---|
| - | - | None reported | All checks pass | - | Closed |

---

## 4. Final Sign-off
- **Verification Environment:** [Staging / Local Docker]
- **Target Commit UUID:** [Git Commit Hash]
- **Sign-off Date:** [YYYY-MM-DD]
- **Sign-off By:** [Operator Signature]
