---
title: "UAT Acceptance Criteria: Add-ons and Recurring Subscriptions Workspace"
status: "accepted"
date: "2026-11-05"
tags: ["uat", "gherkin", "acceptance-criteria", "addons", "subscriptions", "care-plans", "ingestion"]
---

# UAT Acceptance Criteria: Add-ons and Recurring Subscriptions Workspace

## 1. Architectural Invariants (Core Rules)

* **Invariant 1.1 (Pure Route Stage Navigation):** The Add-ons & Recurring Subscriptions workspace must mount as a top-level stage route (`/addons`) inside `BasePageContainer.vue` and oriented with `BasePageHeader.vue`. No modal or drawer may open automatically on route load.
* **Invariant 1.2 (Strict Offering Decoupling):** The Add-ons workspace is strictly reserved for recurring Care Plans (Rank 2, pricing model `MONTHLY_RETAINER`). One-off core consulting packages (Ranks 1A, 1B, 3, 4) reside strictly under `/services` and are excluded from this workspace.
* **Invariant 1.3 (Retainer Cap Badging):** Every Care Plan card must visibly communicate its allocated monthly support minutes cap (e.g., `0m Cap`, `30m Cap`, `60m Cap`, `90m Cap`).
* **Invariant 1.4 (Deep Drawer Ingestion Invariant):** Registering a new Care Plan must be executed via `BaseDrawer.vue` (`size="lg"`, 960px) utilizing `CreateAddOnForm.vue` and `BaseRepeater.vue` dynamic array inputs.

---

## 2. Gherkin Acceptance Scenarios

```gherkin
Feature: Add-ons and Recurring Subscriptions Workspace Browsing, Deep Inspection, and Dynamic Ingestion

  Background:
    Given the operator accesses the SMB Ops application
    And the backend service catalog contains active recurring Care Plans
    And the backend audit parameter registry is initialized

  # =========================================================================
  # SCENARIO 1: WORKSPACE ROUTE MOUNTING & EXCLUSION OF CORE PACKAGES
  # =========================================================================
  Scenario: Mounting the Add-ons and Recurring Subscriptions workspace route
    When the operator navigates to "/addons"
    Then the stage should display a BasePageHeader with:
      | Field       | Expected Value                                               |
      | Breadcrumb  | Home / Catalogs / Add-ons & Subs                             |
      | Title       | Add-ons & Recurring Subscriptions                            |
      | Subtitle    | Monthly Digital Care Plans, Retainer Support Caps & SLAs     |
      | Action 1    | + New Care Plan                                              |
    And the subscriptions grid should render all active recurring care plans as clickable BaseCard components
    And each card should display a monthly rate tag (e.g. "$99 / mo") and a support cap badge
    And no one-off core consulting packages (Ranks 1A, 1B, 3, or 4) should be visible in this grid

  # =========================================================================
  # SCENARIO 2: RETAINER CAP FILTERING
  # =========================================================================
  Scenario: Filtering care plans by monthly support cap
    Given the workspace displays 3 active care plans (0m, 30m, and 60m caps)
    When the operator clicks on the "30m Cap" filter pill
    Then the grid should update to display only the 30-minute support care plan
    And the "30m Cap" filter pill should display the active highlight state
    When the operator clicks the "All Plans" filter pill
    Then all 3 care plans should be displayed again

  # =========================================================================
  # SCENARIO 3: DEEP CARE PLAN INSPECTION DRAWER OVERLAY
  # =========================================================================
  Scenario: Opening the deep inspection flyout drawer for a care plan
    Given the workspace displays the "Essential Website Care" care plan card
    When the operator clicks on the "Essential Website Care" card
    Then the BaseDrawer (#drawer-portal) should slide open with size "md"
    And the drawer header should display "Essential Website Care"
    And the deliverables section should display a BaseList with checkmark variant
    And the support cap and recurring scope items should be rendered
    When the operator presses the "Escape" key
    Then the BaseDrawer should close immediately

  # =========================================================================
  # SCENARIO 4: DYNAMIC CARE PLAN INGESTION VIA DEEP WORKSPACE DRAWER
  # =========================================================================
  Scenario: Ingesting a new recurring digital care plan
    Given the operator is on "/addons"
    When the operator clicks "+ New Care Plan"
    Then the BaseDrawer (#drawer-portal) should open with size "lg" containing CreateAddOnForm
    When the operator fills in the form fields:
      | Field                        | Value                              |
      | Code                         | CARE_PLAN_120                      |
      | Name                         | Enterprise Continuity Plan         |
      | Description                  | Dedicated monthly operational care |
      | Monthly Rate                 | 399                                |
      | Monthly Retainer Cap Minutes | 120                                |
    And the operator adds items using the BaseRepeater for deliverables
    And the operator clicks "Create Care Plan"
    Then the drawer should submit and slide closed
    And the subscriptions grid should optimistically display "Enterprise Continuity Plan"
    And the total count badge should increment by 1
```
