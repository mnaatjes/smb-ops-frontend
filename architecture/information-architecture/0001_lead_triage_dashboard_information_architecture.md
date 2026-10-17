---
title: "0001: Lead Triage Dashboard Information Architecture"
tags: ["architecture", "information-architecture", "triage-dashboard", "as-is"]
created_at: "2026-10-17"
last_updated_at: "2026-10-17"
---

# 0001: Lead Triage Dashboard Information Architecture (As-Is)

## 1. View Overview

* **Route:** `/` (`HomeView.vue`)
* **FSD Page Slice:** `pages/HomeView.vue`
* **Operator Job-To-Be-Done:** Discover local business prospects, audit their technical setup, and view ranked opportunities sorted by score.

## 2. Information Matrix

| Display Component / Field | Data Type | Visual Priority | Business Justification | Source Endpoint / Attribute |
| :--- | :--- | :--- | :--- | :--- |
| `Total Leads Metric` | `number` | P0 | Aggregate operational inventory | `leads.length` |
| `Audited Leads Metric` | `number` | P0 | Audit pipeline throughput | Count where `item.audit !== null` |
| `High Priority Metric` | `number` | P0 | High-value target count | Count where `opportunity_score >= 70` |
| `Business Name` | `string` | P0 | Primary prospect identity | `prospect.business_name` |
| `Opportunity Score` | `number (0-100)` | P0 | Rank & prioritization | `audit.opportunity_score` |
| `Audited Finding Chips` | `badge[]` | P1 | Immediate technical issues | `audit.issues[]` & `technologies[]` |
| `Contact (Phone / Address)` | `string` | P1 | Verification & outreach | `prospect.phone`, `prospect.address` |
| `Website URL` | `url` | P1 | Direct inspection link | `prospect.website_url` |
| `Status Badge` | `NEW` \| `AUDITED` | P2 | Processing state | `prospect.status` |
| `Discovery Source & Date` | `string` / `date` | P2 | Attribution & age | `prospect.source`, `prospect.created_at` |

## 3. Data Ingestion & State Strategy

* **Initial Query:** `GET /api/v1/leads/ranked?min_score=0` triggered on `onMounted()`.
* **Client Store:** Pinia `useLeadStore()`.
* **Client Filtering:** In-memory computed property filtering `leads` by `minScore` threshold ($0$, $\ge 40$, $\ge 70$) and descending opportunity score sort.
* **Loading / Overlay:** Full-table overlay when `leadStore.loading == true`.
* **Banners:** Top alert banners for `statusMessage` and `error`.

## 4. Permitted Actions Matrix (As-Is)

| Permitted Action | Trigger Control | Required Role / Guard | Target Feature Slice |
| :--- | :--- | :--- | :--- |
| `Discover Leads` | Input text + "Discover" button | Non-empty location query | `features/lead-discovery` |
| `Batch Audit Leads` | "Run Technical Audit (15)" button | None | `features/lead-audit` |
| `Manual Add Lead` | "+ Add Lead" header button | Form fields valid | `features/manual-lead` |
| `Filter by Min Score` | `<select>` dropdown | None | Local state `leadStore.minScore` |
| `Toggle Theme` | Dark/Light mode icon | None | `shared/ui/ThemeToggle.vue` |
