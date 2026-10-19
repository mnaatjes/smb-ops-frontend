---
title: "ADR-0019: Full-Canvas Dual-Column Split Client Account Workspace"
tags: ["ui", "workspace", "clients", "dossier", "timecards", "credentials"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# ADR-0019: Full-Canvas Dual-Column Split Client Account Workspace

## Context and Problem Statement

`ClientDossierDrawer.vue` previously used a fixed 540px right-sliding panel. As client accounts grew to incorporate telemetry probes, uptime monitoring, monthly maintenance retainer gauges, work log histories, contract summaries, and multi-credential encrypted vaults, the single-column drawer created excessive vertical scroll fatigue and restricted the space available for timecard entries and operational management.

Following the successful ergonomics pattern introduced in ADR-0018 (`OpportunityDossierDrawer.vue`), the Client Account dossier requires alignment to a full-canvas dual-column workspace.

## Decision Drivers

* **Ergonomic Maintenance & Operations:** Operators need immediate visibility into client identity, health status, and active contracts on one side while managing timecard work logs and accessing credentials on the other.
* **Canvas Maximization:** Occupy the entire canvas (`calc(100vw - 260px)`) while maintaining the 260px navigation rail for consistent global context.
* **Topic-Grouped Hierarchy:** Clear demarcation between Client Telemetry/Identity and Active Operations/Credentials.

## Decision Outcome

Chosen option: **Option A (Full-Canvas Dual-Column Split Client Workspace)**.

The drawer width is expanded from 540px to `w-full max-w-[calc(100vw-260px)]` with a responsive two-column layout:

### Column 1 (Left - 44% width): Account Context & Continuity Telemetry
1. **Account Profile & Identity:** Client ID, business name, state badge, primary contact details (name, email, phone), and direct website link.
2. **Continuity & SLA Health:** Live SSL certificate status, endpoint uptime indicator, automated backup bucket, last probe ping timestamp, and manual "Run Diagnostics Ping" trigger.
3. **Active Service Contracts:** Summary cards for active contracts, billing frequency, service code, and rate.

### Column 2 (Right - 56% width): Operations, Retainer Timecard & Secret Vault
1. **Monthly Retainer Timecard Widget:** Visual `MaintenanceGauge` (minutes logged vs. monthly cap, out-of-scope flag), "+ Log Work" action trigger, and chronological recent maintenance entries list.
2. **Credentials & Access Vault:** Multi-secret encrypted credential cards, "+ Add Secret" workflow, and timed 15-second decrypted password audit reveals with clipboard copy.

### Positive Consequences

* Ample visual space for complex timecard log tables without horizontal clipping.
* Clear cognitive separation between read-only account telemetry and active operational tasks.
* Visual and architectural parity between the Pursued Opportunity Pipeline and Client Accounts workspaces.
