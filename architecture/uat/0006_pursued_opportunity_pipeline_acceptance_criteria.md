---
title: "UAT Acceptance Criteria: Pursued Opportunity Pipeline Workspace"
status: "accepted"
date: "2026-11-05"
tags: ["uat", "gherkin", "acceptance-criteria", "pursued", "pipeline", "base-table", "conversion"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# UAT Acceptance Criteria: Pursued Opportunity Pipeline Workspace

## 1. Architectural Invariants (Core Rules)

* **Invariant 1.1 (Pure Route Stage Navigation):** The Pursued Opportunity Pipeline workspace must mount as a top-level stage route (`/pursued`) inside `BasePageContainer.vue` and oriented with `BasePageHeader.vue`. No modal or drawer may open automatically on route load.
* **Invariant 1.2 (Responsive Opportunity Card Invariant):** Pursued opportunities must appear in structured, high-density cards powered by `BaseCard.vue` within a responsive grid (`minmax(360px, 1fr)`), preventing horizontal clipping and comfortably accommodating stage, contact, and action elements.
* **Invariant 1.3 (Pipeline Stage Invariant):** Each opportunity card must render the current engagement stage (`claimed`, `contact_attempted`, `engaged`, `appointment_scheduled`, `proposal_presented`) with semantic badges and allow single-click advancement.
* **Invariant 1.4 (Client Conversion Invariant):** Successful conversion of an opportunity via `ClientOnboardingModal.vue` must transition the prospect to `status = 'CONVERTED'`, remove it from the pursued table, and increment the Client Accounts counter badge.

---

## 2. Gherkin Acceptance Scenarios

```gherkin
Feature: Pursued Opportunity Pipeline Progression, Dossier Inspection, and Client Conversion

  Background:
    Given the operator accesses the SMB Ops application
    And the Pinia lead store contains active pursued opportunities with status "PURSUED"
    And the backend service catalog and client account registries are initialized

  # =========================================================================
  # SCENARIO 1: WORKSPACE MOUNTING & OPPORTUNITY CARDS RENDERING
  # =========================================================================
  Scenario: Mounting the Pursued Opportunity Pipeline workspace route
    When the operator navigates to "/pursued"
    Then the stage should display a BasePageHeader with:
      | Field       | Expected Value                                               |
      | Breadcrumb  | Home / Pursued Pipeline                                      |
      | Title       | Pursued Opportunity Pipeline                                 |
      | Subtitle    | Engage Qualified Prospects & Assemble Proposals              |
    And the stage should display an executive KPI ribbon with 4 BaseMetricCards
    And the pursued opportunities should render inside responsive BaseCards
    And each opportunity card should render business name, stage badge, opportunity score, and actions

  # =========================================================================
  # SCENARIO 2: FILTERING OPPORTUNITIES BY PIPELINE STAGE
  # =========================================================================
  Scenario: Filtering opportunities by engagement stage
    Given the pursued table displays 6 total pursued opportunities
    When the operator clicks the "Engaged" stage filter pill
    Then the table should update to display only opportunities with stage "engaged"
    And the table row count should re-slice smoothly without layout flicker

  # =========================================================================
  # SCENARIO 3: OPPORTUNITY STAGE STEPPING & ADVANCEMENT
  # =========================================================================
  Scenario: Advancing an opportunity to the next pipeline stage
    Given the table displays an opportunity "Grand Rapids Bakery" at stage "claimed"
    When the operator clicks "Advance Stage" on the "Grand Rapids Bakery" row
    Then the opportunity stage should update to "contact_attempted"
    And a confirmation alert should display "Updated opportunity stage: contact_attempted"

  # =========================================================================
  # SCENARIO 4: DEEP OPPORTUNITY DOSSIER DRAWER INSPECTION
  # =========================================================================
  Scenario: Inspecting pursued opportunity dossier drawer
    Given the pursued table displays an opportunity "Lakeside Auto Repair"
    When the operator clicks on the "Lakeside Auto Repair" row
    Then BaseDrawer (#drawer-portal) should slide open with size "lg"
    And the drawer should display OpportunityDossierDrawer with stakeholder contacts and activity feed
    When the operator presses "Escape"
    Then BaseDrawer should close cleanly

  # =========================================================================
  # SCENARIO 5: CONVERTING PURSUED OPPORTUNITY TO CLIENT ACCOUNT
  # =========================================================================
  Scenario: Converting a proposal-presented opportunity to an active client
    Given the table displays an opportunity "Alpine Dental Care" at stage "proposal_presented"
    When the operator clicks "Convert to Client" on the "Alpine Dental Care" row
    Then ClientOnboardingModal should open centered via #modal-portal
    When the operator submits the onboarding form with contract agreement details
    Then the modal should close
    And the opportunity should be removed from the Pursued Pipeline table
    And the Aside navigation "Clients" badge counter should increment by 1
```
