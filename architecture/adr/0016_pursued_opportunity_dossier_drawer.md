---
title: "ADR-0016: Pursued Opportunity Dossier Drawer"
status: "accepted"
date: "2026-10-19"
deciders: ["@mnaatjes", "Systems Engineering Team"]
consulted: ["Frontend Guild"]
informed: ["Operations Guild"]
---

# ADR-0016: Pursued Opportunity Dossier Drawer

## Context and Problem Statement

When operators review claimed leads in the **Pursued Pipeline** workspace, selecting an opportunity card currently opens a modal window (`ScoreRubricModal.vue`). This creates workflow dissonance with the **Client Accounts** workspace, which uses a side-sliding drawer (`ClientDossierDrawer.vue`) to preserve spatial context and offer high-density diagnostic inspection. Operators require a consistent dossier-drawer UX across pipeline stages to review business contacts, deficit rubric breakdowns, best-fit service catalog items, and initiate conversion workflows without disruptive modal overlays.

## Decision Drivers

* **Ergonomic Consistency:** Operators should experience a uniform side-panel dossier interface across all lifecycle workspaces (Pipeline Opportunities and Active Clients).
* **Information Density:** Slide-over drawers provide ample vertical real estate to display opportunity scoring, full technical deficit breakdowns, matching service packages, and action triggers side-by-side.
* **Non-Blocking Context:** Operators can maintain continuous awareness of the broader opportunity grid while inspecting an individual lead dossier.

## Considered Options

1. **Retain Central Modal Window (`ScoreRubricModal.vue`):** Minimal code modification, but perpetuates UI inconsistency between Stage 2 (Pipeline) and Stage 3 (Clients).
2. **Dedicated Opportunity Dossier Drawer (`OpportunityDossierDrawer.vue`):** Component aligned to the drawer design tokens, housing business metadata, audit opportunity score, service deficit items, qualified catalog recommendations, and action triggers.

## Decision Outcome

Chosen option: **Option 2 (Dedicated Opportunity Dossier Drawer)**.

We will introduce `OpportunityDossierDrawer.vue` in `src/features/opportunity-dossier/`. Selecting a claimed opportunity card in the Pursued Pipeline workspace will open this slide-over drawer, displaying full audit details, business profile, and actions ("Convert to Client", "Disqualify").

### Positive Consequences

* Unifies drawer patterns across Pursued Pipeline and Client Accounts.
* Enhances responsive capability via existing slide-over drawer responsive styles.
* Direct action handoff: "Convert to Client" button inside drawer cleanly dispatches to `ClientOnboardingModal.vue`.

### Negative Consequences / Mitigations

* Slight DOM layout duplication between rubric modal and drawer; mitigated by keeping rubric modal isolated for Discovery Pool triage while drawer serves Stage 2 deep dive.

## Pros and Cons of the Options

### Option 1: Retain Central Modal Window
* Good: No component refactoring required.
* Bad: Disruptive UX modal pattern; inconsistent with client dossier inspection.

### Option 2: Dedicated Opportunity Dossier Drawer
* Good: Consistent slide-over drawer layout with sliding animations and full viewport coverage on mobile.
* Good: Provides dedicated action zone for Stage 2 pipeline conversion and disqualification.
* Bad: Requires authoring tests and documentation.
