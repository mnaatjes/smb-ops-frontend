---
title: "ADR-0021: Timecard Entry Categorization and History Badging"
tags: ["adr", "ui", "timecard", "billing", "history"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# ADR-0021: Timecard Entry Categorization and History Badging

## Context and Problem Statement

Following backend ADR-0013, `TimecardEntry` now carries an `entry_type` distinguishing between included Care Plan maintenance, out-of-scope billable hours, and internal tracking.

`LogMaintenanceModal.vue` previously only captured a description and duration without categorization. In addition, `ClientDossierDrawer.vue` displayed logged history items without visual cues indicating which entries were billable extra hours.

## Decision Drivers

* **Frictionless Categorization:** Operators must be able to specify the entry category at the time of logging work with a single selector.
* **Invoice Readiness:** When viewing client timecard history, operators need instant visual recognition of billable items for copying onto invoices.

## Decision Outcome

Chosen option: **Option A (Modal Dropdown & Distinct History Badges)**.

1. **`LogMaintenanceModal.vue` Category Selector:**
   * Dropdown with 3 options:
     * `retainer_maintenance`: *"Monthly Care Plan (Retainer)"* (Default)
     * `billable_extra`: *"Extra Billable Work (Invoice Line Item)"*
     * `internal_non_billable`: *"Internal / Non-Billable"*
2. **`ClientDossierDrawer.vue` History Badges:**
   * Entries tagged `billable_extra` display a distinct blue badge: `Billable Extra`.
   * Entries tagged `internal_non_billable` display a muted gray badge: `Internal`.
   * Routine entries display a green badge: `Retainer`.

## Positive Consequences

* Operators can log any time without skewing monthly retainer gauges.
* Preparing client invoices requires zero calculation—billable entries are highlighted immediately.
