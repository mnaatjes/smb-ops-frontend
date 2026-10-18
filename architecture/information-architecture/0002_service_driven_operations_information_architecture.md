---
title: "0002: Service-Driven Operations Information Architecture"
tags: ["architecture", "information-architecture", "service-catalog", "pipeline", "to-be"]
created_at: "2026-10-17"
last_updated_at: "2026-10-17"
---

# 0002: Service-Driven Operations Information Architecture

## 1. View Overview & Navigation Hierarchy

The frontend dashboard separates operational workspaces from meta-administrative processes using a dual navigation model:

1. **Vertical Aside Navigation Rail (Left-Hand Rail):**
   * **Workspace Workflows:**
     * `Discovery Pool` (`/discovery` or `tab=pool`): Ingress, geo-discovery, lightweight audits, and lead qualification.
     * `Pursued Pipeline` (`/pipeline` or `tab=pipeline`): Active claimed leads, contact dossier discovery, and client conversion.
     * `Client Accounts` (`/clients` or `tab=clients`): Paying accounts, active consulting jobs, and meeting delivery.
   * **Meta-Processes & Administration:**
     * `Service Catalog Management`: Direct inspection and configuration of service offerings, audit parameters, and deliverable scopes.
     * `System Health & Settings`: API endpoint configuration, dark mode toggle, and environment telemetry.
2. **Contextual Overlays & Drawers:**
   * **Opportunity Score Rubric Modal:** Explains 0–100 score computation factors mapped to consulting offerings.
   * **Unified Disqualify & Suppression Dialog:** Disqualification reason capture with permanent suppression toggle.
   * **Service Catalog Inspection Drawer:** Displays full service details, deliverables, and audit threshold criteria.

---

## 2. Information Matrix by Workspace

### A. Discovery Pool View (`/discovery`)
* **Operator JTBD:** "When I want to find new prospects in an area, I want to search by city/zip and filter by specific service catalog opportunities (e.g. SEO, Web Dev), so I only qualify high-probability prospects into my pipeline."

| Display Component / Field | Priority | Business Justification | Source Endpoint / Attribute |
| :--- | :--- | :--- | :--- |
| `Location Search Bar` | P0 | Accepts City, State, or Zip Code | `POST /leads/discover` input |
| `Run Batch Audit (with Tooltip)` | P0 | Runs technical audit with hover explanation | `POST /leads/audit` |
| `Service Catalog Filter Pills` | P0 | Filter pool by service (SEO, POS, Web) | `GET /services` |
| `Business Name & Website` | P0 | Primary identity, address, and phone | `prospect.business_name`, `website_url`, `phone`, `address` |
| `Opportunity Score & Rubric` | P0 | Clickable score badge opening rubric breakdown | `audit.opportunity_score` + rubric |
| `Audited Findings & Tech` | P0 | Immediate technical flags (`NO_SSL`, `PDF_MENU`, `POS: toast`) | `audit.issues[]`, `audit.cms_detected`, `audit.pos_integrations` |
| `Action: "Qualify"` | P0 | Claims lead into Pursued Pipeline (`status = 'PURSUED'`) | `POST /leads/:id/pursue` |
| `Action: "Disqualify"` | P0 | Opens rejection dialog with optional permanent suppression | `POST /leads/:id/disqualify` + `POST /leads/:id/suppress` |

> [!NOTE]
> **Removed Columns:**
> * `Discovered / Source`: Irrelevant for active triage evaluation; omitted to maximize space for technical audit findings.
> * `Status`: Redundant; all entries in the Discovery Pool are un-pursued candidates.

### B. Pursued Pipeline View (`/pipeline`)
* **Operator JTBD:** "When I review my active prospects, I want to see identified key people, emails, phone numbers, and outreach state, so I can conduct targeted sales outreach."

| Display Component / Field | Priority | Business Justification | Source Endpoint / Attribute |
| :--- | :--- | :--- | :--- |
| `Lead Tracking UID` | P0 | Bounded reference across pipeline lifecycle | `lead.id` (shortened badge) |
| `Business Name & Address` | P0 | Client identification | `lead.business_name`, `lead.address` |
| `Enriched Key People` | P0 | Owner, Manager, or GM contact dossier | `lead.contacts[]` (name, title) |
| `Verified Channels` | P0 | Direct email & phone for cold outreach | `contacts[].email`, `contacts[].phone` |
| `Target Services` | P1 | Specific services pitched to this lead | `lead.target_services[]` |
| `Action: "Convert to Client"` | P0 | Creates Client Account upon contract win | `POST /leads/:id/convert` |
| `Action: "Disqualify"` | P1 | Rejects lead during active outreach | `POST /leads/:id/disqualify` |

### C. Client Accounts View (`/clients`)
* **Operator JTBD:** "When a prospect becomes a paying client, I want to manage their active service jobs, meeting schedule, and primary contacts, so I can deliver consulting services successfully."

| Display Component / Field | Priority | Business Justification | Source Endpoint / Attribute |
| :--- | :--- | :--- | :--- |
| `Client Business Name` | P0 | Client account identity | `client.business_name` |
| `Source Lead Lineage ID` | P2 | Traceability to original audit | `client.source_lead_id` |
| `Active Jobs / Engagements` | P0 | Contracted services (`SEO Overhaul`, etc.) | `client.engagements[]` |
| `Primary Account Contact` | P0 | Executive decision maker details | `client.primary_contact` |
| `Account State` | P1 | `onboarding` \| `active` \| `dormant` | `client.state` |

---

## 3. Opportunity Score Rubric Modal Specification

To eliminate confusion regarding scoring, clicking on an Opportunity Score opens a **Scoring Rubric Breakdown**:

* **Base Score:** 0 points.
* **Service Deficit Additions:**
  * Unencrypted HTTP / Expired SSL: `+25 pts` (Qualifies for `SVC-SEC`)
  * PDF Menus / No Mobile Viewport: `+30 pts` (Qualifies for `SVC-WEB`)
  * Slow Server TTFB (> 1000ms): `+15 pts` (Qualifies for `SVC-PERF`)
  * Active Commercial POS Integration: `+15 pts` (Qualifies for `SVC-POS`)
* **Consulting Alignment:**
  * Displays corresponding Service Catalog codes alongside qualifying technical deficits.

