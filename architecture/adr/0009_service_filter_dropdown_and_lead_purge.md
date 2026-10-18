---
title: "ADR-0009: Service Filter Dropdown and Lead Findings Purge UI"
tags: ["adr", "fsd", "ui", "filter", "purge"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# ADR-0009: Service Filter Dropdown and Lead Findings Purge UI

## Context
1. The horizontal service pills container (`.service-pills-container`) consumed excessive vertical space and only allowed single selection or all services. As the service catalog expands across 4 tiers, a compact multi-select dropdown is needed.
2. Operators need an explicit action to clear discovery findings and reset the lead triage table without purging active/pursued clients.

## Decision
1. **Compact Multi-Select Dropdown:**
   - Create `ServiceFilterDropdown.vue` under `src/features/service-catalog/`.
   - Replaces horizontal pill buttons with a compact trigger button displaying selected count badge and an accessible popover containing service checkboxes.
   - Defaults to "All Services" (`modelValue.length === 0`).
2. **Multi-Service Filter Logic:**
   - Expose `activeServiceFilters: ref<string[]>([])` in `useLeadStore`.
   - Update `filteredLeads` computed property to match leads against selected service profiles (evaluating `minimum_opportunity_score` and identified audit issues).
3. **Clear Lead Findings Button:**
   - Add "Clear Findings" button next to "Discover & Audit Leads" in `DiscoveryBar.vue`.
   - Calls `clearLeads()` action which executes `DELETE /leads` and refreshes the ranked triage list.

## Consequences
* **Positive:** Compact UI layout improves viewport real estate on lead triage workflows; operators can filter leads across multiple service offerings simultaneously and purge test/scratch prospect results safely.
