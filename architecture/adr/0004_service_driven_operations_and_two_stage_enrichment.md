---
title: "ADR-0004: Service-Driven Operations and Two-Stage Enrichment Architecture"
tags: ["frontend", "vue3", "fsd", "adr", "leads", "service-catalog", "pipeline"]
created_at: "2026-10-17"
last_updated_at: "2026-10-17"
---

# ADR-0004: Service-Driven Operations and Two-Stage Enrichment Architecture

## Status
Accepted

## Context and Problem Statement
The initial frontend dashboard implementation aggregated all discovered prospects into a single flat triage table. This created three core operational bottlenecks for SMB consulting practices:
1. **Unbounded Cognitive Overload:** Raw discovered prospects, active pursuit targets, and paying clients occupied the same visual space without clear lifecycle demarcations.
2. **Premature Enrichment Costs:** Attempting deep contact scraping (owners, managers, emails, direct phones) during initial geo-discovery incurred high scraping latencies and rate-limit waste on unqualified leads.
3. **Opaque Opportunity Scoring:** Operators lacked visibility into why a specific prospect achieved an opportunity score and which consulting service offerings (e.g., SEO modernization, security remediation, POS integration) addressed the detected deficits.

The frontend requires an information architecture and state model that separates discovery from pursuit, surfaces service catalog mapping, and transitions qualified prospects cleanly into client accounts.

## Decision Drivers
* Strict alignment with Unified Process disciplines and Feature-Sliced Design (FSD) boundaries (`shared` $\leftarrow$ `entities` $\leftarrow$ `features` $\leftarrow$ `pages`).
* Two-Stage Enrichment model: Lightweight scan during Discovery; deep contact Dossier scraping triggered only upon explicit operator pursuit ("Add to My List").
* Explicit Service Catalog filtering and deterministic Opportunity Score breakdown.
* Clear 1:1 entity transition from Lead to ClientAccount upon conversion.

## Considered Options
1. **Single Table with Multi-Column Status Filters:** Retain a single table and rely exclusively on dropdown filters to switch between `PENDING`, `AUDITED`, `PURSUED`, and `CLIENT`.
2. **Dedicated Workspace Tabs with Two-Stage Pipeline Model:** Split the operator dashboard into three focused workspaces:
   * **Discovery Pool (`pool`):** Geo/zip discovery ingress, lightweight technical audit tags, service catalog pills, and score rubric modal.
   * **Pursued Pipeline (`pipeline`):** Active leads claimed by the operator (`PURSUED`), carrying a stable Tracking UID, enriched contacts, and conversion actions.
   * **Client Accounts (`clients`):** Contracted client records linked to source leads, managing account lifecycle and consulting jobs.

## Decision Outcome
Chosen Option: **Dedicated Workspace Tabs with Two-Stage Pipeline Model** (Option 2).

### Architectural Implementation:
1. **Domain Interfaces (`src/shared/types/lead.ts`):**
   * Extended `ProspectStatus` with `'PURSUED' | 'ENRICHED' | 'SUPPRESSED'`.
   * Added `ServiceCatalogItem` defining service codes, audit parameters, and threshold score criteria.
   * Added `ClientAccount` defining the contracted business entity, source lead linkage (`source_lead_id`), and lifecycle state (`onboarding | active | dormant`).
2. **State Management (`src/entities/lead/store.ts`):**
   * Segregated reactive collections into `poolLeads` (unclaimed, unsuppressed) and `pursuedLeads` (`status === 'PURSUED'`).
   * Added actions for `pursueLead()`, `suppressLead()`, `convertToClient()`, `loadServices()`, and `loadClients()`.
3. **Presentation & Features (`src/features/*` & `src/pages/HomeView.vue`):**
   * Mounted `ServicePills.vue` in the Discovery Pool for service-driven filtering.
   * Created `ScoreRubricModal.vue` providing a 0–100 breakdown of service deficit factors (SSL, mobile viewport/PDF menus, latency, POS integration).
   * Added "Add to List", "Qualify", "Disqualify", and "Suppress" actions directly on triage rows.
   * Implemented Pursued Pipeline grid and Client Accounts management cards.

## Consequences

### Positive
* **Low Cognitive Overhead:** Operators only evaluate raw prospects in the Discovery Pool; active follow-ups remain isolated in the Pursued Pipeline.
* **Cost & Latency Optimization:** Contact scraping is deferred until an operator confirms commercial interest by adding the lead to their list.
* **Clear Business Value Proposition:** Scoring rubric links technical audit flags directly to billable service catalog offerings.

### Negative / Trade-offs
* Requires synchronized state updates across multiple Pinia getters (`poolLeads`, `pursuedLeads`, `clients`).
* Backend API endpoints (`/services`, `/clients`, `/leads/:id/pursue`, `/leads/:id/suppress`) must remain consistently available with corresponding contract structures.
