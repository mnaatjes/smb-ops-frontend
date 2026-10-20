---
title: "ADR-0024: Contract Discrete Actions Checklist Accordion and Commit UUID Tracking"
tags: ["frontend", "client-accounts", "contracts", "deliverables", "verification"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# ADR-0024: Contract Discrete Actions Checklist Accordion and Commit UUID Tracking

## Context
In `ClientDossierDrawer.vue`, under **Active Service Contracts**, each contract previously rendered only high-level summary cards (Code, Status, Rate, Type, Start Date). Operators had no direct in-app visibility into the discrete technical actions, deliverables, or execution milestones required for that service. Furthermore, operators require an observable tracking mechanism to mark completed actions and associate deliverables with verified Git commit UUIDs.

## Decision
1. **Interactive Contract Card Accordion:**
   - Make each contract card interactive (toggle on click or chevron trigger) maintaining an `expandedContractIds: Record<string, boolean>` state.
2. **Dynamic Deliverable Resolution:**
   - Resolve contract scope actions dynamically from `leadStore.services` by matching `c.service_code === service.code`.
   - Provide default structured checklists for care plans (`CARE_PLAN_30`, `CARE_PLAN_60`, `CARE_PLAN_90`) covering standard monthly audits, plugin patching, uptime validation, and backup checks.
3. **Discrete Action Checklists & Git Commit UUID Tagging:**
   - Each discrete item renders a toggle checkbox and an optional Git Commit UUID tag input/display.
   - Persist checklist completion and commit UUID references in browser `localStorage` keyed by `smb_contract_actions:${clientId}:${contractId}`, preserving status across reloads until backend schema persistence is adopted.

## Consequences
- **Positive:** Clear, granular visibility into contracted service deliverables; verifiable engineering audit trail with Git commit UUID tracking; zero backend schema migrations required during feature freeze.
- **Negative:** Checklist status stored in client localStorage until database entity persistence is introduced in post-revenue milestones.
