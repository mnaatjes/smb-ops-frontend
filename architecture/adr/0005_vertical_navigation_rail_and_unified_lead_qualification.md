---
title: "ADR-0005: Vertical Navigation Rail, Interactive Tooltips, and Unified Lead Qualification"
tags: ["frontend", "vue3", "fsd", "adr", "navigation", "triage", "qualification"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# ADR-0005: Vertical Navigation Rail, Interactive Tooltips, and Unified Lead Qualification

## Status
Accepted

## Context and Problem Statement
Feedback on the initial service-driven operations dashboard highlighted three areas of operational friction and cognitive overload:
1. **Conflated Navigation Hierarchy:** Workspace workflows (`Discovery Pool`, `Pursued Pipeline`, `Client Accounts`) were visually coupled with meta-administrative tasks (e.g., viewing and configuring the Service Catalog, system telemetry), crowding top horizontal header space.
2. **Ambiguous Process Actions:** Buttons such as `Run Batch Audit` and `Discover Leads` lacked inline context, forcing operators to infer pipeline side-effects without explanatory tooltips.
3. **Table Space Inefficiency & State Ambiguity:**
   * The `Discovered / Source` and `Status` columns consumed significant table width without conveying actionable value.
   * "Add to List" and "Qualify" operated as competing, disjoint actions. The "Qualify" action removed leads from the store instead of transitioning them to the Pursued Pipeline (`status = 'PURSUED'`), preventing the Pursued Pipeline badge count from updating.
   * Disqualification and suppression were split into two separate UI actions (a button and an icon), rather than a single unified rejection workflow.

## Decision Drivers
* Clean visual hierarchy separating operational workspaces from administrative meta-processes.
* ADHD-friendly, self-documenting interface with contextual hover tooltips for non-obvious batch processes.
* Elimination of non-essential table columns to maximize space for technical audit findings and decision badges.
* Deterministic 1-click qualification transitioning leads directly into the Pursued Pipeline.
* Single, unified rejection workflow combining disqualification and optional permanent suppression.

## Considered Options
1. **Maintain Horizontal Tab Bar with Nested Dropdowns:** Retain top horizontal tabs, placing meta-processes in a dropdown menu.
2. **Dual-Axis Navigation (Vertical Aside Rail + Clean Triage Table):**
   * Introduce a compact vertical aside navigation rail hosting operational workspaces and administrative entries (`Service Catalog`, `Settings`).
   * Remove redundant columns (`Discovered / Source`, `Status`) from the triage table.
   * Add hover explanation tooltips on batch/discovery triggers.
   * Consolidate "Qualify" to execute `pursueLead(id)` so the lead transitions directly into the Pursued Pipeline and increments counters.
   * Embed permanent suppression as a checkbox inside the Disqualification dialog.

## Decision Outcome
Chosen Option: **Dual-Axis Navigation with Unified Qualification** (Option 2).

### Architectural Implementation:
1. **Navigation Structure (`src/features/navigation/AsideNavRail.vue` & `src/pages/HomeView.vue`):**
   * Left-hand vertical rail hosts primary workspaces (`Discovery Pool`, `Pursued Pipeline`, `Client Accounts`) and meta-administrative controls (`Service Catalog`, `System Settings`).
   * Service Catalog opens an inspection drawer / modal displaying catalog items, audit rules, and delivery scopes.
2. **Triage Table Layout (`src/features/lead-triage/LeadTriageTable.vue`):**
   * Columns restricted to: `Business & Contact`, `Opportunity Score`, `Audited Findings & Tech`, and `Actions`.
   * Action buttons simplified to primary `Qualify` (which triggers pipeline pursuit) and `Disqualify`.
3. **Contextual Tooltips:**
   * Buttons (`Run Batch Audit`, `Discover Leads`) include descriptive hover elements explaining technical checks and provider queries.
4. **Unified Disqualification Dialog (`src/features/lead-triage/DisqualifyModal.vue`):**
   * Captures disqualification reason with a "Permanently Suppress" checkbox.
   * If checked, invokes `POST /leads/:id/disqualify` followed by `POST /leads/:id/suppress`, removing the row from the Discovery Pool.
5. **State Invariant Alignment (`src/entities/lead/store.ts`):**
   * `qualifyLead(id)` marks `prospect.status = 'PURSUED'`, keeping the entity in `pursuedLeads` and immediately updating the badge counter.

## Consequences

### Positive
* **Zero Cognitive Guesswork:** Hover tooltips eliminate operator confusion regarding batch actions.
* **Streamlined Pipeline Ingress:** Clicking "Qualify" visibly populates the Pursued Pipeline and updates counts immediately.
* **Maximized Audit Visibility:** Removing 2 redundant columns expands space for technical findings, CMS detection, and POS tags.
* **Unified Rejection Flow:** Suppress is accessible during disqualification without cluttering rows with extra icon buttons.

### Negative / Trade-offs
* Layout shift: Requires horizontal content margin to accommodate the left-hand navigation rail.
