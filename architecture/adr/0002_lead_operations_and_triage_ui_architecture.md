---
title: "ADR-0002: Lead Operations and Triage UI Architecture"
tags: ["frontend", "vue3", "fsd", "adr", "leads", "triage"]
created_at: "2026-10-17"
last_updated_at: "2026-10-17"
---

# ADR-0002: Lead Operations and Triage UI Architecture

## Status
Accepted

## Context and Problem Statement
The backend service (`smb-ops-backend`) exposes HTTP REST endpoints for discovering local business prospects, executing website infrastructure audits, and ranking opportunities based on a 0–100 score. The frontend single-page application (`smb-ops-frontend`) requires a responsive, high-density operations dashboard enabling operators to:
1. Trigger location-based lead discovery.
2. Trigger batch infrastructure audits across unscored prospects.
3. Filter and triage ranked opportunities with observable scoring breakdown and technical defect indicators.
4. Manually ingest one-off business prospects.

We must structure these capabilities strictly within the established Feature-Sliced Design (FSD) architecture without introducing tight coupling across layers or mutating shared domain models in ad-hoc presentation components.

## Decision Drivers
* Strict adherence to Feature-Sliced Design (FSD) inward layer hierarchy (`shared` $\leftarrow$ `entities` $\leftarrow$ `features` $\leftarrow$ `pages` $\leftarrow$ `app`).
* Clean contract alignment with backend FastAPI schemas (`smb_ops_api.adapters.driving.fastapi_app.schemas`).
* High-density, low-latency UI responsive to operator discovery and audit pipelines.
* Type safety via TypeScript interfaces and Pinia reactive stores.

## Considered Options
1. **Monolithic Single-Component View (`App.vue` or single `HomeView.vue`):** Embed all state, API calls, and styling in a single large component.
2. **Feature-Sliced Design Decomposition:** Decompose into:
   * `shared/api/leads.ts`: Typed Fetch client adapter for backend `/api/leads` and `/api/health`.
   * `entities/lead/`: Lead domain models, DTOs, and Pinia store managing lead collections and active filters.
   * `features/discover-leads/`: Ingress bar component managing location query input and discovery execution.
   * `features/batch-audit/`: Batch audit trigger and pipeline progress state.
   * `features/manual-prospect/`: Modal dialog for manual prospect ingestion.
   * `pages/TriageView.vue`: Primary composition page assembling filters, stats overview, and the triage table.

## Decision Outcome
Chosen Option: **Feature-Sliced Design Decomposition** (Option 2).

### Layer Allocations:
* **`src/shared/api/leads.ts`**: Pure HTTP boundary wrapping `fetch` against `/api/leads/*` and `/api/health`. Handles serialization, error mapping, and typing.
* **`src/entities/lead/model.ts`**: Defines immutable interfaces matching backend DTOs:
  * `Prospect`: Identity, business info, status, disqualification reason, timestamps.
  * `AuditResult`: Performance metrics, SSL, CMS, viewport, menu formats, POS integrations, opportunity score, critical issues.
  * `RankedLead`: Coupled pair of `prospect` and optional `audit`.
* **`src/entities/lead/store.ts`**: Pinia store `useLeadStore` managing:
  * `leads`: Array of `RankedLead`.
  * `minScoreFilter`: Number (0–100).
  * `selectedLead`: Currently inspected lead details.
  * Actions: `fetchRanked()`, `discover()`, `runBatchAudit()`, `createManualLead()`.
* **`src/features/lead-discovery/`**: Component providing location input, count selection, and execution feedback.
* **`src/features/lead-audit/`**: Component triggering batch audits with status indicators.
* **`src/features/lead-triage/`**: Sortable, filterable triage table displaying business name, score badge, website status, critical issue tags, and quick-action audit buttons.
* **`src/features/manual-lead/`**: Modal dialog capturing business name, URL, phone, and address.
* **`src/pages/HomeView.vue`**: Assembles the operations dashboard header, system health banner, discovery controls, and triage board.

## Consequences
### Positive
* Strict separation between transport concerns (`shared/api`), domain state (`entities/lead`), and operator interactions (`features/*`).
* High testability: individual features and stores can be unit tested without mounting the entire dashboard.
* Scalable foundation for future features (e.g., outreach logging, export to CSV/CRM).

### Negative / Trade-offs
* Requires multiple files and explicit exports compared to a single monolithic Vue file.
