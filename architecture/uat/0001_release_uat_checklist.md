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
- [x] **A.1 Discovery Input & Trigger**
  - **Action:** In Discovery Bar, enter location `Kalamazoo, MI` (or city, state, or zip) and limit `10`. Click `Discover & Audit Leads`.
  - **Expected:** Scan spinner animates; upon completion, discovery notification banner displays and new lead rows populate the triage table.
- [ ] **A.2 Service Filter Dropdown**
  - **Action:** Click Service Filter dropdown; select a service (e.g. `WEB_HOSTING`).
  - **Expected:** Table rows dynamically filter to show only leads matching that target service code.
- [x] **A.3 Lead Qualification (Move to Pipeline)**
  - **Action:** Click `Qualify` button on any unreviewed lead row.
  - **Expected:** Lead row immediately transitions out of Pool table.
- [x] **A.4 Lead Disqualification Modal**
  - **Action:** Click `Disqualify` button on lead `Fuji Japanese Restaurant`.
  - **Result Verified:** `DisqualifyModal` opened; selected reason `No website needed`, entered notes `Testing disqualification flow`, confirmed. Row removed from active pool.

---

### Section B: Pursued Opportunity Dossier & Contacts (`/` -> Pipeline)
- [x] **B.1 Pipeline Navigation & Drawer Open**
  - **Action:** Click `Pipeline` tab in the navigation rail. Click on a pursued opportunity row.
  - **Result Verified:** `OpportunityDossierDrawer` full canvas confirmed (`calc(100vw - 260px)`). All 9 subpanels verified (name, stage, map, rubric, playbook, services, contacts, touchpoint, timeline).
- [ ] **B.2 Contact Management**
  - **Action:** In Decision-Maker Roster, click `+ Add Contact`. Enter Name `John Smith`, Title `Owner`, Email `john@test.com`, Phone `515-555-0123`. Click `Save Contact`.
  - **Expected:** Contact card immediately appears in the roster grid.
- [ ] **B.3 Activity Ledger Logging**
  - **Action:** In Activity Ledger, enter note `Initial discovery phone call`, select `CALL`, click `Log Activity`.
  - **Expected:** New activity entry appends to top of timeline with current timestamp.

---

### Section C: Client Accounts Workspace & Secret Vault (`/` -> Clients)
- [x] **C.1 Client Accounts Grid & Onboarding Modal**
  - **Action:** In Pursued Pipeline, clicked `Convert to Client` on `The Blue Dolphin Restaurant`.
  - **Result Verified:** 4-step onboarding pipeline modal traversed (contact pre-population, service tier selection, terms verification, credential vault provisioning). Client account created and card renders in Client Accounts grid.
- [x] **C.2 Full-Canvas Client Workspace Drawer**
  - **Action:** Click on `The Blue Dolphin Restaurant` card in Client Accounts grid.
  - **Result Verified:** Full-canvas workspace (`calc(100vw - 260px)`) confirmed. Left column (Account Profile, Continuity & SLA Health, Active Service Contracts) and right column (Retainer Timecard & History, Credentials Vault) confirmed.
- [x] **C.3 Add-on Care Plan Attachment**
  - **Action:** In Active Service Contracts, clicked `+ Attach Care Plan`. Selected tier `CARE_PLAN_30` ($150/mo), clicked `Attach Contract`.
  - **Result Verified:** `CARE_PLAN_30` appears in contracts list; Maintenance Retainer gauge displays 30m monthly allocation. (Note: Contract lifecycle/pipeline re-work queued for subsequent design milestone).
- [x] **C.4 Discrete Deliverables Accordion & Commit UUID**
  - **Action:** Clicked `CARE_PLAN_30` accordion header card on `The Blue Dolphin Restaurant`.
  - **Result Verified:** Deliverables checklist expands; tagged commit UUID and checked item marked completed with persistent state. (Feature Request noted: extend discrete deliverable accordions to all Service Catalog offerings).
- [x] **C.5 Client Secret Vault (Add & Reveal)**
  - **Action:** Under Credentials & Access Vault, clicked `+ Add Secret`. Entered credentials, clicked `Encrypt & Store`.
  - **Result Verified:** Encrypted credential card created with masked secret. Clicking `Reveal` accurately displays plaintext secret with countdown timer.

---

### Section D: Service Catalog & Business Doctrine
- [x] **D.1 Service Catalog Workspace**
  - **Action:** In Service Catalog, clicked `+ Add Service Offering`. Selected Rank 1B, entered inputs, submitted.
  - **Result Verified:** Modal closed and new Service Card rendered in catalog. (Design Notes recorded for contract/service pipeline milestone: single price input instead of min-max, recurring vs. once toggle, and dedicated discrete deliverables data table).
- [x] **D.2 Business Doctrine Workspace**
  - **Action:** Clicked `Doctrine` tab in navigation rail; navigated doctrine documents.
  - **Result Verified:** Documentation dashboard rendered Markdown typography, tables, and Mermaid architecture diagrams correctly.

---

## 3. Defect & Regression Ledger
| # | Section / Step | Observed Issue | Expected Visual / Behavior | Severity | Resolution Status |
|---|---|---|---|---|---|
| 1 | Section A.1 | Overpass discovery timeout raises unhandled `Request failed with status code 504` in UI dialog. Searches append to previous findings instead of scoped replacement unless cleared manually. | Nginx proxy timeout increased (>=120s) and UI displays user-friendly retry banner instead of raw 504 error modal. | Medium | Resolved (ADR-0026) |
| 2 | Section A.2 | Dropdown blue badge displays number of *selected filters* rather than *matching leads*, misleading operators to expect table results. Selecting services yields empty table without indicating score/parameter qualification criteria. | Clarify badge labeling (or show matching results count per service), and display helpful empty state explaining why 0 leads match the selected service thresholds. | Medium | Resolved (ADR-0026) |
| 3 | Section B.2 | Add Contact Modal "Save Contact" button does not submit. `BaseButton` defaults to `type="button"` and lacks `@click` binding on the button or `type="submit"` support, causing modal click to be a no-op. | Add `type?: 'button' | 'submit'` prop to `BaseButton.vue` or attach `@click="handleSaveContact"` to the modal action button. | High | Resolved (ADR-0026) |
| 4 | Section B.3 | Record Touchpoint / Schedule Appointment button ("Schedule & Record") does not submit. `BaseButton` lacks form submit behavior and has no `@click="handleLogActivity"`. | Add `type?: 'button' | 'submit'` prop to `BaseButton.vue` or attach `@click="handleLogActivity"` to the form action button. | High | Resolved (ADR-0026) |
| 5 | Section C.2 | Section header "Monthly Retainer Timecard" in `ClientDossierDrawer.vue` is overly narrow and misleading, as the panel houses all client timecard entries (billable projects, non-billable, and retainer work) in addition to the monthly gauge. | Rename section header to "Timecards & Retainer Maintenance" or "Work Ledger & Retainer Tracking" for semantic clarity. | Low | Resolved (ADR-0026) |

---

## 4. Final Sign-off
- **Verification Environment:** [Staging / Local Docker]
- **Target Commit UUID:** [Git Commit Hash]
- **Sign-off Date:** [YYYY-MM-DD]
- **Sign-off By:** [Operator Signature]
