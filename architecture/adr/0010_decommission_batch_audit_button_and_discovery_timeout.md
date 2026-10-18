---
title: "ADR-0010: Decommission Batch Audit Button and Increase Discovery Timeout"
tags: ["adr", "fsd", "ui", "timeout", "batch-audit"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# ADR-0010: Decommission Batch Audit Button and Increase Discovery Timeout

## Context
1. Following the unification of discovery and auditing into the automated "Discover & Audit Leads" pipeline (ADR-0008), the standalone "Run Batch Audit" button remained rendered on the discovery actions bar in `HomeView.vue`. This caused operator confusion regarding multi-step actions.
2. The unified discovery and audit endpoint inspects external Overpass directory databases followed by sequential website network probes for up to 15 prospects. Under slow public Overpass nodes or heavy target network latency, execution exceeded Axios's default 10,000ms (10s) timeout threshold, causing client-side abort errors.

## Decision
1. **Decommission BatchAuditTrigger from HomeView:**
   - Remove `BatchAuditTrigger` component import and `<div class="batch-flex">` layout from `HomeView.vue`.
   - Leave `DiscoveryBar` as the sole operational action triggering lead discovery and scoring.
2. **Increase Timeout Thresholds:**
   - Elevate baseline client timeout in `src/shared/api/client.ts` from 10,000ms to 60,000ms.
   - Configure `triggerLeadDiscovery` in `src/shared/api/leads.ts` with explicit `timeout: 120000` (2 minutes) to tolerate directory querying and multi-site HTTP inspection latencies.

## Consequences
* **Positive:** Completely cleans up duplicate audit controls in the UI. Prevents premature timeout errors when auditing batches of newly discovered business prospects.
