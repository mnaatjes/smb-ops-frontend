---
title: "UAT Acceptance Criteria: Core Service Catalog Workspace and Ingestion"
status: "accepted"
date: "2026-11-05"
tags: ["uat", "gherkin", "acceptance-criteria", "service-catalog", "core-services", "ingestion", "inspection"]
---

# UAT Acceptance Criteria: Core Service Catalog Workspace and Ingestion

## 1. Architectural Invariants (Core Rules)

* **Invariant 1.1 (Pure Route Stage Navigation):** The Core Service Catalog workspace must mount as a top-level stage route (`/services`) inside `BasePageContainer.vue` and oriented with `BasePageHeader.vue`. No modal or drawer may open automatically on route load.
* **Invariant 1.2 (Decoupled Offering Taxonomy):** The Service Catalog workspace is exclusively designated for Core Services (Rank 1A Door-Opener, Rank 1B Specialized, Rank 3 Operational Efficiency, Rank 4 Digital Transformation). Recurring Add-on Digital Care Plans and retainer subscriptions reside strictly under the dedicated `/addons` workspace.
* **Invariant 1.3 (Parameter Registry Strictness):** All audit parameters selectable during service creation must originate strictly from the backend parameter registry (`GET /api/services/audit-parameters`). Free-text manual entry of parameters is strictly prohibited.
* **Invariant 1.4 (Canonical Rank Pricing Presets):** Core service creation must automatically reflect standard firm pricing when a Rank is selected ($150 for Rank 1A, $350 for Rank 1B, $300 for Rank 3, $250 for Rank 4).
* **Invariant 1.5 (Array Input Repeater Standard):** Scope, deliverables, and exclusions must be managed via `BaseRepeater.vue` dynamic string arrays, never unstructured newline-delimited textareas.

---

## 2. Gherkin Acceptance Scenarios

```gherkin
Feature: Core Service Catalog Workspace Browsing, Deep Inspection, and Dynamic Ingestion

  Background:
    Given the operator accesses the SMB Ops application
    And the backend service catalog contains active core consulting offerings
    And the backend audit parameter registry is initialized

  # =========================================================================
  # SCENARIO 1: WORKSPACE ROUTE MOUNTING & ORIENTATION
  # =========================================================================
  Scenario: Mounting the Core Service Catalog workspace route
    When the operator navigates to "/services"
    Then the stage should display a BasePageHeader with:
      | Field       | Expected Value                                             |
      | Breadcrumb  | Home / Catalogs / Service Catalog                          |
      | Title       | Core Service Catalog                                       |
      | Subtitle    | Consulting Offerings, Fixed Scopes & Ingestion             |
      | Action 1    | + New Core Service                                         |
    And the catalog grid should render all active core offerings as clickable BaseCard components
    And each card should display a Rank badge (1A, 1B, 3, or 4), a pricing tag, and active audit chips
    And no recurring Rank 2 Add-On offerings should be visible in this grid

  # =========================================================================
  # SCENARIO 2: CORE TIER FILTERING
  # =========================================================================
  Scenario: Filtering offerings by commercial rank
    Given the catalog displays 6 total core offerings across Ranks 1A, 1B, 3, and 4
    When the operator clicks on the "Rank 1A" filter pill
    Then the catalog grid should update to display only Rank 1A offerings
    And the "Rank 1A" filter pill should display the active highlight state
    When the operator clicks the "All" filter pill
    Then all 6 core offerings should be displayed again

  # =========================================================================
  # SCENARIO 3: DEEP INSPECTION DRAWER OVERLAY
  # =========================================================================
  Scenario: Opening the deep inspection flyout drawer for a core service offering
    Given the catalog displays the "Core Audit Bundle" service card
    When the operator clicks on the "Core Audit Bundle" card
    Then the BaseDrawer (#drawer-portal) should slide open with size "md"
    And the drawer header should display "Core Audit Bundle (Rank 1A)"
    And the deliverables section should display a BaseList with checkmark variant
    And the scope and exclusions sections should be rendered
    When the operator presses the "Escape" key
    Then the BaseDrawer should close immediately

  # =========================================================================
  # SCENARIO 4: DYNAMIC CORE SERVICE INGESTION VIA DEEP WORKSPACE DRAWER
  # =========================================================================
  Scenario: Ingesting a new core consulting service
    Given the operator is on "/services"
    When the operator clicks "+ New Core Service"
    Then the BaseDrawer (#drawer-portal) should open with size "lg" containing CreateCoreServiceForm
    When the operator selects Rank "Rank 1A"
    Then the read-only price preview should display "$150.00 Flat Fee"
    When the operator fills in the form fields:
      | Field       | Value                    |
      | Code        | SEC_AUDIT_EXPRESS        |
      | Name        | Express Security Audit   |
      | Description | Rapid perimeter security |
    And the operator adds 2 items using the BaseRepeater for deliverables
    And the operator checks "ssl_validity" and "security_headers" from the registry
    And the operator clicks "Create Service Offering"
    Then the drawer should submit and slide closed
    And the catalog grid should optimistically display "Express Security Audit"
    And the total count badge should increment by 1
```
