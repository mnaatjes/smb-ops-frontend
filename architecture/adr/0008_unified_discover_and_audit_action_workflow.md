---
title: "ADR-0008: Unified Discover and Audit Action Workflow"
tags: ["frontend", "vue3", "fsd", "adr", "workflow", "triage"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# ADR-0008: Unified Discover and Audit Action Workflow

## Status
Accepted

## Context and Problem Statement
Operators currently encounter two disconnected controls above the triage dashboard: "Discover Leads" and "Run Batch Audit". Triggering "Discover Leads" displays a toast stating prospects were discovered, yet leaves the Lead Triage Table empty because un-audited prospects lack an Opportunity Score. The operator was forced to execute a second action ("Run Batch Audit") to make leads visible.

## Decision Drivers
* Cognitive load reduction and streamlined single-action lead acquisition.
* Direct immediate table population upon lead discovery.
* Adherence to Feature-Sliced Design (FSD).

## Decision Outcome
1. **Consolidated Trigger Component (`DiscoverAndAuditBar.vue`):**
   * Replaces `DiscoveryBar.vue` and `BatchAuditTrigger.vue` with a single unified component: `DiscoverAndAuditBar.vue`.
   * Clear, high-contrast action button: **"Discover & Audit Leads"**.
   * Tooltip and description explaining: *"Discovers local SMB prospects from web directories and immediately inspects their sites to calculate Opportunity Scores."*
2. **Store Action Simplification (`useLeadStore`):**
   * `discoverLeads(location, limit)` now triggers the unified endpoint, updating status to *"Discovering and auditing leads for {location}..."*, and immediately reloads the ranked triage table upon completion.
3. **Workspace Layout Refinement:**
   * Removes redundant Batch Audit button from the triage action toolbar.

## Consequences
### Positive
* Single intuitive control populates the table immediately.
* Zero cognitive friction between discovery and technical scoring.
