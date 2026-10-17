---
title: "0002: Service-Driven Operations Information Architecture"
tags: ["architecture", "information-architecture", "service-catalog", "pipeline", "to-be"]
created_at: "2026-10-17"
last_updated_at: "2026-10-17"
---

# 0002: Service-Driven Operations Information Architecture

## 1. View Overview & Navigation Hierarchy

To eliminate cognitive overload, the frontend separates the operational workflow into four distinct workspaces:

1. **Workspace 1: Discovery Pool (`/discovery`):** Search by location, inspect service fit, and select leads to pursue.
2. **Workspace 2: Pursued Pipeline (`/pipeline`):** Manage active leads, view enriched key people/contacts, log outreach.
3. **Workspace 3: Client Accounts (`/clients`):** Track contracted clients, active service jobs, and scheduled meetings.
4. **Contextual Overlay: Lead Inspection Drawer:** Deep technical findings, audit parameter breakdowns, and contact dossiers.

---

## 2. Information Matrix by Workspace

### A. Discovery Pool View (`/discovery`)
* **Operator JTBD:** "When I want to find new prospects in an area, I want to search by city/zip and filter by specific service catalog opportunities (e.g. SEO, Web Dev), so I only add high-probability prospects to my pipeline."

| Display Component / Field | Priority | Business Justification | Source Endpoint / Attribute |
| :--- | :--- | :--- | :--- |
| `Location Search Bar` | P0 | Accepts City, State, or Zip Code | `POST /leads/discover` input |
| `Service Catalog Filter Pills` | P0 | Filter pool by service (SEO, POS, Web) | `GET /services` |
| `Business Name & Website` | P0 | Primary identity and inspection | `prospect.business_name`, `website_url` |
| `Qualified Service Badges` | P0 | Visual match against service catalog | `lead.qualified_services[]` |
| `Opportunity Score & Rubric` | P1 | Score with hover tooltip showing why | `audit.opportunity_score` + rubric |
| `Lightweight Audit Chips` | P1 | Immediate technical flags (`NO_SSL`, `PDF_MENU`) | `audit.issues[]` |
| `Action: "Add to My List"` | P0 | Claims lead into Pursued Pipeline | `POST /leads/:id/pursue` |
| `Action: "Suppress"` | P1 | Excludes from future discovery queries | `POST /leads/:id/suppress` |

### B. Pursued Pipeline View (`/pipeline`)
* **Operator JTBD:** "When I review my active prospects, I want to see identified key people, emails, phone numbers, and outreach state, so I can conduct targeted sales outreach."

| Display Component / Field | Priority | Business Justification | Source Endpoint / Attribute |
| :--- | :--- | :--- | :--- |
| `Lead Tracking UID` | P0 | Bounded reference across pipeline lifecycle | `lead.id` (shortened badge) |
| `Business Name & Address` | P0 | Client identification | `lead.business_name`, `lead.address` |
| `Enriched Key People` | P0 | Owner, Manager, or GM contact dossier | `lead.contacts[]` (name, title) |
| `Verified Channels` | P0 | Direct email & phone for cold outreach | `contacts[].email`, `contacts[].phone` |
| `Target Services` | P1 | Specific services pitched to this lead | `lead.target_services[]` |
| `Pipeline State Badge` | P0 | Stage (`ENRICHED`, `CONTACTED`, `FOLLOW_UP`) | `lead.state` |
| `Action: "Log Outreach"` | P0 | Records call, email, or meeting date | `POST /leads/:id/outreach` |
| `Action: "Convert to Client"` | P0 | Creates Client Account upon contract win | `POST /leads/:id/convert` |

### C. Client Accounts View (`/clients`)
* **Operator JTBD:** "When a prospect becomes a paying client, I want to manage their active service jobs, meeting schedule, and primary contacts, so I can deliver consulting services successfully."

| Display Component / Field | Priority | Business Justification | Source Endpoint / Attribute |
| :--- | :--- | :--- | :--- |
| `Client Business Name` | P0 | Client account identity | `client.business_name` |
| `Source Lead Lineage ID` | P2 | Traceability to original audit | `client.source_lead_id` |
| `Active Jobs / Engagements` | P0 | Contracted services (`SEO Overhaul`, etc.) | `client.engagements[]` |
| `Scheduled Meetings` | P1 | Upcoming kickoff or review calls | `client.meetings[]` |
| `Primary Account Contact` | P0 | Executive decision maker details | `client.primary_contact` |
| `Account State` | P1 | `ONBOARDING` \| `ACTIVE` \| `DORMANT` | `client.state` |

---

## 3. Opportunity Score Rubric Modal Specification

To eliminate confusion regarding scoring, clicking on an Opportunity Score opens a **Scoring Rubric Breakdown**:

* **Base Score:** 0 points.
* **Service Deficit Additions:**
  * Unencrypted HTTP / Expired SSL: `+25 pts` (Qualifies for `SVC-SEC`)
  * PDF Menus / No Mobile Viewport: `+30 pts` (Qualifies for `SVC-WEB`)
  * Slow Server TTFB (> 1500ms): `+15 pts` (Qualifies for `SVC-PERF`)
  * Missing OpenGraph / Title tags: `+15 pts` (Qualifies for `SVC-SEO`)
* **Viability Multipliers:**
  * Verified Phone + Physical Address: `1.2x multiplier`
  * Active POS Integration Detected: `1.1x multiplier`
