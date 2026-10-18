---
title: "ADR-0007: Service Catalog Tier Hierarchy, Deep Inspection, and Parameter Registry"
tags: ["frontend", "vue3", "fsd", "adr", "service-catalog", "pricing"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# ADR-0007: Service Catalog Tier Hierarchy, Deep Inspection, and Parameter Registry

## Status
Accepted

## Context and Problem Statement
The current frontend Service Catalog view displays basic cards with `code`, `name`, `description`, `audit_parameters`, and `minimum_opportunity_score`. However:
1. `minimum_opportunity_score` clutters cards without providing business value to operators.
2. The cards lack commercial context (Rank tiers, pricing models, flat vs retainer fees).
3. Clicking on a card does not surface scope details, deliverables, target profiles, or exclusions as detailed in `docs/reference/service_catalog.md`.
4. Creation modal allows free-text entry of audit parameters, which violates systems governance because unsupported parameters cannot be matched by backend audit probes.

## Decision Drivers
* Feature-Sliced Design (FSD) architecture principles.
* Visual presentation aligned with the 4-tier business catalog (Rank 1A, 1B, 2, 3, 4).
* Constrained creation workflow requiring selection from backend-supported audit parameters.
* Accessible, modal-based deep inspection for services.

## Decision Outcome
1. **Service Card Display Refinement:**
   * Remove `minimum_opportunity_score` from visible card badges.
   * Add prominent **Rank Badge** (e.g. `Rank 1A • Door-Opener`, `Rank 2 • Recurring Retainer`) and **Pricing Tag** (e.g. `$150.00 Flat` or `$49–$99 / mo`).
   * Make entire card clickable with hover affordance to trigger inspection modal.
2. **Deep Inspection Modal (`ServiceDetailsModal.vue`):**
   * Displays full commercial profile:
     * Classification & Target Profile
     * Pricing Model & Fee Schedule
     * Tangible Deliverables
     * Scope Checklist
     * Exclusions
     * Active Audit Parameters & Thresholds
3. **Creation Form Validation & Parameter Registry (`CreateServiceModal.vue`):**
   * Fetches supported parameters dynamically via `GET /api/services/audit-parameters`.
   * Requires selecting a canonical Rank (1A, 1B, 2, 3, 4) with automated pricing defaults.
   * Replaces free-text audit parameters with interactive multi-select pills/checkboxes strictly drawn from the active registry.

## Consequences
### Positive
* Operator workflow is guarded against anti-patterns (no uninstrumented parameters).
* Complete commercial clarity directly inside the operational dashboard.
