---
title: "ADR-0006: Dedicated Service Catalog Management View and Dynamic Ingestion"
tags: ["frontend", "vue3", "fsd", "adr", "service-catalog", "navigation"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# ADR-0006: Dedicated Service Catalog Management View and Dynamic Ingestion

## Status
Accepted

## Context and Problem Statement
In ADR-0005, the Service Catalog was accessible via a lightweight modal drawer from the vertical aside navigation rail. However, the consulting practice requires a full-fledged administrative workspace allowing operators to:
1. View all active service catalog offerings with their associated audit rules, deliverable descriptions, and score qualification thresholds in a dedicated workspace tab.
2. Dynamically define and register new consulting services via a dedicated modal dialog (`CreateServiceModal.vue`).
3. Reflect new services immediately across the entire dashboard—including Discovery Pool filter pills and Opportunity Score calculation rubrics—without page reloads.

## Decision Drivers
* Feature-Sliced Design (FSD) modularity (`shared/api` $\rightarrow$ `entities/lead` $\rightarrow$ `features/service-catalog` $\rightarrow$ `pages/HomeView`).
* Operator efficiency: Clean separation between discovery/prospect evaluation and business service definition.
* Immediate reactive synchronization: Registered services persist to backend and reactively update Pinia store collections.

## Decision Outcome
Chosen Option: **Dedicated Workspace Tab with Modal Ingestion Form**.

### Implementation Structure:
1. **API Client (`src/shared/api/leads.ts`):** Expose `createService(payload: CreateServicePayload) -> Promise<ServiceCatalogItem>`.
2. **Entity Store (`src/entities/lead/store.ts`):** Add `createServiceOffering(payload)` action that invokes the API and appends to `services.value`.
3. **Workspace View (`src/pages/HomeView.vue`):** Add `'services'` workspace tab to `AsideNavRail`, presenting a high-density management matrix with "+ Add Service Offering" header trigger.
4. **Modal Component (`src/features/service-catalog/CreateServiceModal.vue`):** Captures Code, Name, Description, Audit Parameters, and Minimum Opportunity Score with form validation.

## Consequences
### Positive
* Delivers complete CRUD parity for the consulting firm's service catalog.
* Decouples administrative service definition from day-to-day lead triage.
* Newly created services immediately function as active filter pills in the Discovery Pool.
