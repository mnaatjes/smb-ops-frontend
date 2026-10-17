---
title: "View Information Architecture Matrices"
tags: ["architecture", "information-architecture", "view-models", "specification"]
created_at: "2026-10-17"
last_updated_at: "2026-10-17"
---

# View Information Architecture Matrices

## Purpose

The **View Information Architecture Matrix** defines the data contracts and cognitive requirements for screens, views, and dashboards in the frontend application. It specifies the precise contextual fields an operator must observe in order to make a business decision, alongside the queries required to fetch that data.

Both human developers and LLM agents reference this document to:
* Avoid over-fetching or under-fetching by establishing concrete read models for each screen.
* Design UI widgets, tables, and inspection sidebars based on required decision fields.
* Bind backend query endpoints to Feature-Sliced Design (FSD) pages and widgets cleanly.

## File Naming Convention

All specification documents in this directory must follow sequential four-digit numbering:
```text
0001_<view_or_page_name>_information_architecture.md
0002_lead_triage_dashboard_information_architecture.md
```

## Schema & Core Properties

Every document authored in this directory must define the following properties:

1. **View Identifier & Route:** The URL route and component slice (e.g., `/triage`, `pages/triage`).
2. **Operator Job-To-Be-Done (JTBD):** The specific outcome the operator is working toward while on this screen.
3. **Information Matrix:** Tabular specification of fields displayed, priority, business justification, and data source.
4. **Backend Query Mapping:** HTTP endpoints, query parameters, pagination, and caching strategies.
5. **Permitted Actions Set:** Allowable user actions and commands executable from this screen.

## Document Template

Use the following template when authoring a new view information architecture document:

```markdown
---
title: "000X: <View Name> Information Architecture"
tags: ["architecture", "information-architecture", "<view-slug>"]
created_at: "YYYY-MM-DD"
last_updated_at: "YYYY-MM-DD"
---

# 000X: <View Name> Information Architecture

## 1. View Overview

* **Route:** `/<route-path>`
* **FSD Page Slice:** `pages/<page-name>`
* **Operator Job-To-Be-Done:** As an operator, I need to `<inspect/triage/review>` `<entity>` so that `<business outcome>`.

## 2. Information Matrix

| Display Field | Data Type | Visual Priority | Business Justification | Source Endpoint / Attribute |
| :--- | :--- | :--- | :--- | :--- |
| `Lead Name` | `string` | P0 (Primary) | Identifies business prospect | `GET /leads` $\rightarrow$ `items[].name` |
| `Triage Score`| `number` | P0 (Primary) | Immediate ranking sort order | `GET /leads` $\rightarrow$ `items[].score` |
| `Risk Flags` | `string[]` | P1 (Secondary)| Decision context for acceptance | `GET /leads` $\rightarrow$ `items[].flags` |
| `Audit Date` | `ISO8601` | P2 (Tertiary) | Freshness verification | `GET /leads` $\rightarrow$ `items[].audited_at` |

## 3. Data Ingestion & State Strategy

* **Primary Query:** `GET /api/v1/<resource>`
* **Pagination / Filtering:** Cursor-based pagination (`limit`, `cursor`), filterable by status.
* **Store / Cache Layer:** Pinia store (`use<Name>Store`) or TanStack Vue Query cache key `['<resource>', queryParams]`.
* **Empty / Error States:**
  * Zero records: Display empty triage queue state with manual refresh button.
  * API failure (5xx): Show retry banner with persistent cached view if available.

## 4. Permitted Actions Matrix

| Permitted Action | Trigger Control | Required Role / Guard | Target Feature Slice |
| :--- | :--- | :--- | :--- |
| `Review Lead` | Table row click | None | `features/inspect-lead` |
| `Assign Triage` | Button in row | Role: `operator` | `features/assign-lead` |
| `Batch Export` | Top toolbar button | Selected rows > 0 | `features/export-leads` |
```
