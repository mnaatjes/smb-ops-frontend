---
title: "UAT Acceptance Criteria: Opportunity Dossier Overlay"
status: "accepted"
date: "2026-11-05"
tags: ["uat", "gherkin", "acceptance-criteria", "dossier", "overlay", "theming", "contacts", "activities"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# UAT Acceptance Criteria: Opportunity Dossier Overlay

## 1. Architectural Invariants (Core Rules)

* **Invariant 1.1 (Portal Encapsulation):** `OpportunityDossierDrawer.vue` must mount as a portal overlay to `#drawer-portal`. No drawer may be nested inside it.
* **Invariant 1.2 (Dual-Theme Compliance):** The overlay must support both Light and Dark themes through semantic token bindings (`var(--bg-app)`, `var(--bg-surface)`, `var(--text-primary)`, `var(--border-color)`). Hardcoded background or text hex codes are prohibited.
* **Invariant 1.3 (Dual-Zone Scrolling):** The Left Column (Vitals & Deficits) and Right Column (Engagement Hub) must scroll independently without causing viewport canvas overflow.
* **Invariant 1.4 (Interactive Stage Progression):** Clicking any stage pill in the Stage Stepper Bar must advance the opportunity stage via `store.setOpportunityStage`.

---

## 2. Gherkin Acceptance Scenarios

```gherkin
Feature: Opportunity Dossier Overlay Diagnostic Inspection, Stakeholder Engagement, and Theme Adaptation

  Background:
    Given the operator is inspecting an opportunity in the application
    And the Pinia lead store contains active opportunity contacts and playbooks

  # =========================================================================
  # SCENARIO 1: OVERLAY MOUNTING & DUAL-COLUMN GEOMETRY
  # =========================================================================
  Scenario: Mounting the Opportunity Dossier overlay on desktop
    When the operator opens the dossier for "Grand Rapids Bakery"
    Then the overlay should mount to "#drawer-portal"
    And the canvas width should occupy "calc(100vw - 260px)"
    And the header should display the business title, tracking UID, and score "82 / 100"
    And the left column (44%) should display Location, Google Map, and Deficit Rubric
    And the right column (56%) should display the Stage Stepper, Contacts Grid, and Activity Logger

  # =========================================================================
  # SCENARIO 2: UNIVERSAL THEME ADAPTATION (LIGHT AND DARK MODE)
  # =========================================================================
  Scenario: Rendering the dossier in both Light and Dark themes
    Given the dossier is open for "Grand Rapids Bakery"
    When the application theme is set to "light"
    Then the drawer canvas background should resolve to "var(--bg-app)" (#f9fafb)
    And panel cards should resolve to "var(--bg-surface)" (#ffffff)
    And title text should resolve to "var(--text-primary)" (#111827)
    When the application theme switches to "dark"
    Then the drawer canvas background should dynamically resolve to "var(--bg-app)" (#0f172a)
    And panel cards should resolve to "var(--bg-surface)" (#1e293b)
    And title text should resolve to "var(--text-primary)" (#f8fafc)

  # =========================================================================
  # SCENARIO 3: INTERACTIVE STAGE STEPPING
  # =========================================================================
  Scenario: Advancing stage from the stepper strip
    Given the opportunity is at stage "claimed"
    When the operator clicks the "Engaged" pill in the stage stepper
    Then the store should dispatch "setOpportunityStage" with "engaged"
    And the "Engaged" pill should display active highlighting

  # =========================================================================
  # SCENARIO 4: STAKEHOLDER CONTACT ADDITION & TARGET SELECTION
  # =========================================================================
  Scenario: Adding a new stakeholder contact
    Given the dossier is open for "Grand Rapids Bakery"
    When the operator clicks "+ Add Contact"
    Then BaseModal (#modal-portal) should open with the contact form
    When the operator enters name "Jane Baker" and role "Owner"
    And clicks "Save Stakeholder"
    Then the contact card for "Jane Baker (Owner)" should appear in the contacts grid
    And clicking the card should select it as the active outreach target

  # =========================================================================
  # SCENARIO 5: CONVERSION AND DISQUALIFICATION DELEGATION
  # =========================================================================
  Scenario: Triggering client conversion from the dossier header
    Given the dossier is open for "Grand Rapids Bakery"
    When the operator clicks "Convert to Client"
    Then the drawer should emit "convert" with the active lead payload
    When the operator clicks "Drop Opportunity"
    Then the drawer should emit "disqualify" with the active lead payload
```
