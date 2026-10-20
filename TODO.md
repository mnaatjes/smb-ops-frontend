# SMB Ops Business Alignment & Action Plan

## Active Priority Tasks (Immediate Follow-ups & Remediations)

- [x] **1. Clean Onboarding Pipeline Add-on Terminology** (Completed in PR #38)
  - Remove legacy language regarding "30 minute add-on" across `ClientOnboardingModal.vue` and service catalog selection steps to reflect decoupled care plans.

- [x] **2. Client Dossier Add-on Attachment & Contract Triggering** (Completed in PR #39)
  - Enable attaching/adding an Add-on Care Plan package directly within the Client Account Dashboard/dossier/workspace (`ClientDossierDrawer.vue`).
  - Action should trigger a new Contract creation via backend client contract endpoints.

- [x] **3. Guard Retainer Option in Work Logging Modal** (Completed in PR #38)
  - In `LogMaintenanceModal.vue` ("+ Log Work"), disable the "Monthly Care Plan (Retainer)" option if the client account does not have an active Add-on Care Plan registered.

- [ ] **4. Active Service Contracts Discrete Actions Checklist** (Active Phase 3)
  - In `ClientDossierDrawer.vue` > Active Service Contracts, clicking a Service Item triggers an accordion element or popover displaying the list of discrete service deliverables/actions.
  - Include an interactive checkbox indicating completion status per service action (designed for future git commit UUID linkage).

- [x] **5. Pursued Pipeline Workspace Stepper Bar Header Span** (Completed in PR #38)
  - Resolve horizontal overflow of `stage-stepper-bar` inside the column layout.
  - Migrate `stage-stepper-bar` to the top of the workspace (as part of or directly beneath `workspace-header`), spanning across both `workspace-col` columns.

- [x] **6. Bespoke Minimal Scrollbar on Workspace Columns** (Completed in PR #38)
  - Replace default Google Chrome scrollbars on `workspace-col col-left` with a sleek, minimalist custom scrollbar or styled overflow utility.

---

## Active Priority Tasks (Item Evaluation & ROI Breakdown)

- [x] **1. Small Quality of Life Improvements to Dashboard** (Completed in PR #35 & #36)
  - Full-canvas dual-column Client Account workspace (`calc(100vw - 260px)`).
  - Decoupled Care Plan retainers with dynamic cap calculation and neutral 0-plan gauge.

- [ ] **2. Finalize Timecard System in Dashboard**
  - **ROI:** Medium (Direct tracking of billable extra hours vs. monthly retainer)
  - **Scope:**
    - Add 3-way entry categorization (`retainer_maintenance`, `billable_extra`, `internal_non_billable`).
    - Enforce only retainer maintenance consuming monthly plan cap.
    - Add entry category dropdown in `LogMaintenanceModal.vue`.
    - Display entry type badges in `ClientDossierDrawer.vue` maintenance history.
  - **Restrictions:** Hard stop after category tagging; no complex analytics or PDF invoice generators on this pass.

- [ ] **3. Client Contract PDF Storage Port**
  - **ROI:** Low-Medium
  - **Scope:** Minimal mechanism to associate/store a signed PDF contract link/file to a client account record.
  - **Restrictions:** Do not build a custom PDF generator or in-app signature tool. Use external PDF signing (e.g. DocuSign/HelloSign/PandaDoc/manual scan) and store the reference.

- [ ] **4. Hard Feature Freeze on Dashboard**
  - **ROI:** High (stops time waste)
  - **Scope:** Halt all feature additions, styling updates, and new views on frontend/backend.
  - **Restrictions:** Code edits strictly limited to bug fixes and LXC deployment configuration.

- [ ] **5. Deploy Dashboard & Stack to Provisioned LXC Host**
  - **ROI:** High (stability, persistent live data)
  - **Scope:**
    - Deploy container stack to provisioned LXC host.
    - Validate persistent volume mounts for SQLite data and runtime secrets.
    - Perform end-to-end beta test of core lead discovery -> audit -> opportunity workflow.
  - **Restrictions:** Keep deployment simple; use existing Docker Compose patterns.

- [ ] **6. Core Business Infrastructure Setup**
  - **ROI:** Critical (Required to legally transact and collect revenue)
  - **Scope:**
    - Establish payment collection method (Stripe payment link / business merchant).
    - Establish e-sign workflow (DocuSign / PandaDoc / HelloSign template).
    - Setup business bank account and bookkeeping separation.
    - Review basic tax liability handling and legal liability disclaimers.
    - Setup simple invoicing workflow.
  - **Restrictions:** Pure operational setup; zero custom software development.

---

## Future Feature Improvements (Archived Backlog)

### 1. Mobile & Responsive Viewport Adaptation (Frontend UX)
- [ ] **1.1 Collapsible Sidebar Navigation:**
  - Implement a hamburger menu trigger button for mobile / narrow viewports (< 768px).
  - Add collapsible / minimized navigation mode that collapses text labels and displays icon-only rail.
- [ ] **1.2 Dossier Drawer Mobile Fit:**
  - Make `dossier-drawer` responsive to narrow screen viewports (full-width overlay or slide-over drawer on mobile, with touch dismissal and scrolling body isolation).
- [ ] **1.3 Dashboard Grid & Table Responsiveness:**
  - Adapt client list grids, service catalog cards, and doctrine viewers for responsive mobile wrapping and horizontal scroll minimization.

### 2. Continuity & SLA Health Probes Architecture (Backend / Observability)
- [ ] **2.1 Health Probe Architecture Discovery & Mechanisms:**
  - Document probe mechanisms for:
    - SSL Certificate Validity / Expiry (remote TLS handshake).
    - Endpoint Uptime / Latency (remote HTTP/HTTPS probing).
    - DNS / Domain Propagation (remote DNS queries).
  - Determine remote polling vs. guest agent requirements.
- [ ] **2.2 Account-Level Relevance:**
  - Define if Continuity & SLA Health applies universally or per contracted service tier.

### 3. SLA & Deliverables Governance Per Service (Catalog / Domain)
- [ ] **3.1 Service-Specific SLA & Deliverable Matrix:**
  - Audit catalog services and define specific SLA terms, response windows, and caps per tier.
- [ ] **3.2 Dynamic Contract SLA Generator:**
  - Dynamic population of SLA terms from selected catalog service deliverables.

### 4. Secure Client Website Credential & Secret Management (Security / Ingestion)
- [x] **4.1 Zero-Knowledge / At-Rest Secret Encryption** (Completed)
- [x] **4.2 Onboarding Credential Vault Interface** (Completed)

### 5. Contract Agreement PDF Generation & Email Dispatch (Workflow / Billing)
- [ ] **5.1 PDF Contract Document Generator:**
  - Server-side PDF document rendering from signed or pending contract metadata.
- [ ] **5.2 Automated Client Email Dispatch:**
  - Automated transactional email dispatch delivering contract agreement PDF.

### 6. Fixed-Fee Invoicing & Time Tracking ROI Metrics (Finance / Timecards)
- [ ] **6.1 Internal Time Logging vs. Client Invoicing Separation:**
  - Decoupled internal task hours tracking from fixed-fee billing.
- [ ] **6.2 Fixed-Fee Invoicing Workflows:**
  - Structure client-facing invoice generation for fixed milestone / retainer fees.
- [ ] **6.3 Profitability & ROI Reporting:**
  - Metrics dashboard correlating logged hours against fixed contract revenue.

### 7. Administration KPI & Business Metrics Dashboard (Analytics / Reporting)
- [ ] **7.1 KPI Executive Cards:**
  - Total active client count, monthly recurring revenue (MRR) gauge, and total billed vs. retainer hours.
- [ ] **7.2 Aggregate Timecard Table & Visual Breakdown:**
  - Cross-client table of all logged maintenance entries for the active billing cycle.
  - Category breakdown chart (Retainer Maintenance vs. Billable Extra vs. Internal Pro-Bono).


