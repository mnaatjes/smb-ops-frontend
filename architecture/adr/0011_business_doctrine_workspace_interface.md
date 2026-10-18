---
title: "ADR-0011: Business Doctrine Workspace Interface"
tags: ["adr", "fsd", "ui", "doctrine", "markdown", "administration"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# ADR-0011: Business Doctrine Workspace Interface

## Context
Operators require continuous visibility into business doctrine (pricing mechanics, legal contracts, business insurance, strategy explanations) directly from the application dashboard. However, hardcoding static markdown documents into frontend bundles violates plane boundary decoupling and creates dual-source drift with server-side persistent data.

## Decision
1. **Vertical Rail Navigation:**
   - Add a "Business Doctrine" navigation entry under the "Administration" section in `AsideNavRail.vue` with tab identifier `'doctrine'`.
2. **Feature Module Architecture (`src/features/business-doctrine/`):**
   - Create `DoctrineWorkspace.vue` as a master-detail split layout:
     - Left pane: Category accordion / document list grouped by `Explanation` and `Reference`.
     - Right pane: Structured Markdown viewer styled with governed theme tokens (`--text-primary`, `--bg-surface`, `--accent-primary`), declaring document metadata badges (category, creation date, tags) and rendered body.
3. **Data Entity Store (`src/entities/doctrine/`):**
   - Expose `useDoctrineStore` handling asynchronous fetching of the category index (`GET /api/doctrine`) and on-demand loading of individual document contents (`GET /api/doctrine/{category}/{slug}`).

## Consequences
* **Positive:** Clean Diataxis doctrine browsing within the dashboard without bloating client-side JavaScript bundles. Respects light/dark design token system and supports live operator updates.
