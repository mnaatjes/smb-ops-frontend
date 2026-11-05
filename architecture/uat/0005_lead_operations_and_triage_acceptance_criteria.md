---
title: "UAT Acceptance Criteria: Lead Operations and Triage Workspace"
status: "accepted"
date: "2026-11-05"
tags: ["uat", "gherkin", "acceptance-criteria", "leads", "triage", "base-table", "qualification"]
---

# UAT Acceptance Criteria: Lead Operations and Triage Workspace

## 1. Architectural Invariants (Core Rules)

* **Invariant 1.1 (Pure Route Stage Navigation):** The Lead Operations & Triage workspace must mount as a top-level stage route (`/leads`) inside `BasePageContainer.vue` and oriented with `BasePageHeader.vue`. No modal or drawer may open automatically on route load.
* **Invariant 1.2 (Standardized Table Invariant):** Lead presentation must be driven strictly by `BaseTable.vue`, rendering customized slots for `business_name`, `opportunity_score` (`ScoreBadge.vue`), `audit_findings` (`IssueChips.vue`), and `actions` (Qualify/Disqualify button cluster). Ad-hoc or raw HTML `<table>` implementations are prohibited.
* **Invariant 1.3 (Unified 1-Click Qualification Invariant):** Clicking "Qualify" on a lead row must immediately transition the lead to the Pursued Pipeline (`status = 'PURSUED'`), remove it from the Discovery Pool table, and increment the Aside navigation "Pursued" counter badge by +1.
* **Invariant 1.4 (Deep Ingestion Drawer Invariant):** Manual prospect ingress must be executed via `BaseDrawer.vue` (`size="lg"`, 960px) utilizing `ManualLeadForm.vue`.

---

## 2. Gherkin Acceptance Scenarios

```gherkin
Feature: Lead Operations & Triage Workspace Discovery, Inspection, and Qualification

  Background:
    Given the operator accesses the SMB Ops application
    And the Pinia lead store contains active discovered leads
    And the backend audit parameter registry is initialized

  # =========================================================================
  # SCENARIO 1: WORKSPACE MOUNTING & BASETABLE RENDERING
  # =========================================================================
  Scenario: Mounting the Lead Operations and Triage workspace route
    When the operator navigates to "/leads"
    Then the stage should display a BasePageHeader with:
      | Field       | Expected Value                                               |
      | Breadcrumb  | Home / Leads                                                 |
      | Title       | Lead Operations & Triage                                     |
      | Subtitle    | Discover, Audit, and Qualify Business Opportunities          |
      | Action 1    | + Manual Lead                                                |
    And the stage should display an executive KPI ribbon with 4 BaseMetricCards
    And the discovery pool should render leads inside BaseTable
    And each table row should render ScoreBadge, IssueChips, and action buttons

  # =========================================================================
  # SCENARIO 2: FILTERING LEADS BY SERVICE CATALOG DEFICIT
  # =========================================================================
  Scenario: Filtering leads by matching service deficit criteria
    Given the triage table displays 10 populated leads
    When the operator selects "Site Performance & Security Audit + Fix" in ServiceFilterDropdown
    Then the table should update to show only leads matching the service audit parameters
    And the table row count should re-slice without layout flicker

  # =========================================================================
  # SCENARIO 3: UNIFIED 1-CLICK LEAD QUALIFICATION
  # =========================================================================
  Scenario: Qualifying a lead from the triage table
    Given the triage table displays a lead "Grand Rapids Bakery" with score "82 / 100"
    When the operator clicks the "Qualify" button on the "Grand Rapids Bakery" row
    Then the row should immediately be removed from the discovery pool table
    And the Aside navigation "Pursued" badge counter should increment by 1
    And a success notification banner should display "Qualified Grand Rapids Bakery for outreach"

  # =========================================================================
  # SCENARIO 4: DEEP AUDIT INSPECTION DOSSIER DRAWER
  # =========================================================================
  Scenario: Inspecting lead technical audit telemetry via slideout drawer
    Given the triage table displays a lead "Lakeside Auto Repair"
    When the operator clicks on the "Lakeside Auto Repair" table row
    Then the BaseDrawer (#drawer-portal) should slide open with size "lg"
    And the drawer should display OpportunityDossierDrawer with deficit breakdown
    When the operator presses "Escape"
    Then the BaseDrawer should close immediately

  # =========================================================================
  # SCENARIO 5: MANUAL PROSPECT INGESTION VIA DEEP DRAWER
  # =========================================================================
  Scenario: Ingesting a one-off business prospect manually
    Given the operator is on "/leads"
    When the operator clicks "+ Manual Lead"
    Then the BaseDrawer (#drawer-portal) should open with size "lg" containing ManualLeadForm
    When the operator enters "Heritage Coffee Roasters" in the business name field
    And the operator clicks "Ingest Prospect"
    Then the drawer should submit and slide closed
    And the triage table should prepend "Heritage Coffee Roasters" to the top of the dataset
```
