# SMB Ops System Backlog & Action Items

## 1. Mobile & Responsive Viewport Adaptation (Frontend UX)
- [ ] **1.1 Collapsible Sidebar Navigation:**
  - Implement a hamburger menu trigger button for mobile / narrow viewports (< 768px).
  - Add collapsible / minimized navigation mode that collapses text labels and displays icon-only rail.
- [ ] **1.2 Dossier Drawer Mobile Fit:**
  - Make `dossier-drawer` responsive to narrow screen viewports (full-width overlay or slide-over drawer on mobile, with touch dismissal and scrolling body isolation).
- [ ] **1.3 Dashboard Grid & Table Responsiveness:**
  - Adapt client list grids, service catalog cards, and doctrine viewers for responsive mobile wrapping and horizontal scroll minimization.

---

## 2. Continuity & SLA Health Probes Architecture (Backend / Observability)
- [ ] **2.1 Health Probe Architecture Discovery & Mechanisms:**
  - Document probe mechanisms for:
    - **SSL Certificate Validity / Expiry:** Remote TLS handshake (`openssl s_client` / `ssl.getpeercert()`) checking peer certificate subject and expiry timestamp. No client-side software required.
    - **Endpoint Uptime / Latency:** Remote HTTP/HTTPS probing (`GET / HEAD` request with configurable timeout and status code check). No client-side software required.
    - **DNS / Domain Propagation:** Remote DNS resolver queries (`NS`, `A`, `MX`). No client-side software required.
  - Determine if any advanced health checks require in-guest agents (e.g., WordPress plugin / heartbeat script for database or PHP errors) vs. purely remote non-invasive polling.
- [ ] **2.2 Account-Level Relevance:**
  - Define if Continuity & SLA Health is universally applied across all accounts or conditionally activated per contracted service tier (e.g., hosting/maintenance tiers vs. one-time discovery).

---

## 3. SLA & Deliverables Governance Per Service (Catalog / Domain)
- [ ] **3.1 Service-Specific SLA & Deliverable Matrix:**
  - Audit all catalog services; replace generic hardcoded *"Maintenance Retainer Cap: 30 minutes monthly support included"* across all contracts.
  - Define exact standard SLA terms, response windows, and monthly maintenance caps per service tier:
    - Core Support & Hosting Retainers vs. Implementation Projects vs. One-Time Audits.
- [ ] **3.2 Dynamic Contract SLA Generator:**
  - Update contract generation logic to dynamically populate SLA terms directly from selected catalog service deliverables rather than static fallback text.

---

## 4. Secure Client Website Credential & Secret Management (Security / Ingestion)
- [x] **4.1 Zero-Knowledge / At-Rest Secret Encryption:**
  - Design encryption architecture for ingesting client website credentials (CMS logins, hosting panel, SFTP/SSH, domain registrar).
  - Backend envelope encryption or AES-256-GCM symmetric encryption using managed environment secret keys (`SECRET_KEY` / Fernet / KMS).
- [x] **4.2 Onboarding Credential Vault Interface:**
  - Implement secure credential input fields in onboarding workflow with masked entries, clipboard copy helpers, and zero plain-text client logging.

---

## 5. Contract Agreement PDF Generation & Email Dispatch (Workflow / Billing)
- [ ] **5.1 PDF Contract Document Generator:**
  - Implement server-side PDF document rendering from signed or pending contract metadata and agreed SLAs (e.g., WeasyPrint, ReportLab, or Typst).
- [ ] **5.2 Automated Client Email Dispatch:**
  - Implement automated email dispatch service (via SMTP or transactional provider like Postmark / Resend) delivering the generated contract agreement PDF to the client for signature and record keeping upon onboarding completion.

---

## 6. Fixed-Fee Invoicing & Time Tracking ROI Metrics (Finance / Timecards)
- [ ] **6.1 Internal Time Logging vs. Client Invoicing Separation:**
  - Formalize industry best practice: decoupled internal task hours tracking from fixed-fee billing.
  - Retain detailed internal time logging per client task to measure effective hourly rate (EHR), project profitability, and real ROI.
- [ ] **6.2 Fixed-Fee Invoicing Workflows:**
  - Structure client-facing invoice generation for fixed milestone / retainer fees while providing optional timecard breakdown or retainage deduction summaries.
- [ ] **6.3 Profitability & ROI Reporting:**
  - Create metrics dashboard correlating logged hours against fixed contract revenue to highlight margin erosion or high-yield service offerings.
