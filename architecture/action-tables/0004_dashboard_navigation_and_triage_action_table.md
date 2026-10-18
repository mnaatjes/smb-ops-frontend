---
title: "0004: Dashboard Navigation & Triage Action Table"
tags: ["architecture", "action-tables", "navigation", "triage", "to-be"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# 0004: Dashboard Navigation & Triage Action Table

## 1. Overview & Context

This deterministic action table defines the interactive behavior for:
1. **Vertical Aside Navigation Rail:** Distinguishes major dashboard workspaces (`Discovery Pool`, `Pursued Pipeline`, `Client Accounts`) from administrative meta-processes (`Service Catalog`, `System Settings`).
2. **Interactive Button Hover Tooltips:** Contextual UI explanations on hover for all primary pipeline trigger controls (`Run Batch Audit`, `Discover Leads`).
3. **Simplified Table Columns:** Elimination of redundant columns (`Discovered / Source`, `Status`) in favor of maximized horizontal width for primary business identity, score rubric breakdowns, and actions.
4. **Unified Disqualify & Suppress Workflow:** Single entry point via "Disqualify", displaying a dialog with an optional "Permanently Suppress" checkbox.
5. **Deterministic Lead Qualification:** Clicking "Qualify" immediately claims the lead into the Pursued Pipeline (`status = 'PURSUED'`), updating tab counts in real-time.

---

## 2. Navigation Rail Action Table

| UI Element / Trigger | Target Area / View | Precondition / State | Resulting Action & Side Effect |
| :--- | :--- | :--- | :--- |
| **Nav Item: "Discovery Pool"** | Main Workspace | Always available | Displays Discovery Bar, Service Catalog pills, and un-pursued leads table. |
| **Nav Item: "Pursued Pipeline"** | Main Workspace | Always available | Displays active claimed leads undergoing Stage 2 contact discovery and outreach. |
| **Nav Item: "Client Accounts"** | Main Workspace | Always available | Displays contracted client records, active engagements, and meeting rosters. |
| **Nav Item: "Service Catalog"** | Aside Drawer / Modal | Always available | Opens Service Catalog Management panel (`GET /services`); displays offerings, audit rules, and delivery scopes. |
| **Nav Item: "Settings"** | Aside Drawer / Modal | Always available | Opens system configuration (API endpoints, theme toggles, environment state). |

---

## 3. Operations Action Table (Triage, Auditing & Disqualification)

| Component / Trigger | Operator Event | Visual Feedback & Pre-condition | Executed API / Store Action | Post-Condition & Transition |
| :--- | :--- | :--- | :--- | :--- |
| **"Run Batch Audit" Button** | Hover | Tooltip displays: *"Executes technical infrastructure audit (SSL, performance, mobile/PDF, POS) across unscored leads."* | None | UI cursor indicator updated. |
| **"Run Batch Audit" Button** | Click | Button state becomes `loading = true`, text: *"Auditing Batch..."* | `POST /leads/audit` with batch limit | Audit records saved; leads updated to scored; banner notifies completion. |
| **"Discover Leads" Button** | Hover | Tooltip displays: *"Queries geographic providers (OSM/Overpass) for business candidates matching target location."* | None | UI cursor indicator updated. |
| **"Qualify" Button** | Click | Row action button enters pending state | Store invokes `pursueLead(id)` (`POST /leads/:id/pursue`) | Lead status set to `PURSUED`. Lead moves from Discovery Pool to Pursued Pipeline; counters increment immediately. |
| **"Disqualify" Button** | Click | Dialog opens; confirms intent | None | Opens `DisqualifyModal` with reason select and "Permanently Suppress" checkbox. |
| **Disqualify Modal: "Confirm"** | Click (Suppress unchecked) | Submitting state | `POST /leads/:id/disqualify` `{ reason, notes }` | Lead status set to `DISQUALIFIED`; row removed from Discovery Pool. |
| **Disqualify Modal: "Confirm"** | Click (Suppress checked) | Submitting state | `POST /leads/:id/disqualify` + `POST /leads/:id/suppress` | Lead status set to `SUPPRESSED`; permanently excluded from future discovery. Row removed from table. |
| **Score Cell** | Click | Pointer hover | Opens `ScoreRubricModal` | Displays 0–100 calculation breakdown with qualifying service deficit tags. |
