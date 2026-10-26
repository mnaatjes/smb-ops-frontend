---
title: "UAT Acceptance Criteria: Base Site Shell and Navigation Workflow"
status: "accepted"
date: "2026-10-26"
tags: ["uat", "gherkin", "acceptance-criteria", "navigation", "base-site-shell", "breadcrumbs"]
---

# UAT Acceptance Criteria: Base Site Shell and Navigation Workflow

## 1. Architectural Invariants (Core Rules)

* **Invariant 1.1 (Pure Route Stage Navigation):** No link, button, or UI element selected from the Aside navigation menu may trigger or mount a modal dialog or overlay drawer directly. Every destination clicked from the Aside menu must transition to a full-stage route view enclosed in `BasePageContainer` and oriented with `BasePageHeader`. Modals and drawers are strictly reserved for contextual, secondary intra-page actions initiated from within a page.
* **Invariant 1.2 (Mandatory Orientation Header):** Every top-level page mounted inside the stage viewport must feature `BasePageHeader` displaying a navigable `BaseBreadcrumb` trail, page title, and optional subtitle.
* **Invariant 1.3 (Portal Mount Integrity):** Overlay portals (`#modal-portal` and `#drawer-portal`) reside outside the stage DOM hierarchy and remain dormant until an explicit intra-page action invokes them.

---

## 2. Gherkin Acceptance Scenarios

```gherkin
Feature: Base Site Shell Layout, Navigation Tiering, and Route Orientation

  Background:
    Given the operator accesses the SMB Ops application
    And the Pinia lead store contains initialized funnel records

  # =========================================================================
  # SCENARIO 1: DESKTOP SHELL TOPOLOGY & PURE PAGE TRANSITION INVARIANT
  # =========================================================================
  Scenario: Default Desktop Shell Layout and Navigation Tiering
    Given the viewport width is 1280px
    Then the left BaseAside rail should be visible with width "240px"
    And the brand header should display "SMB Ops" and "Practice Engine"
    And the Primary Funnel section should display:
      | Item            | Route     | Badge Variant |
      | Leads           | /leads    | primary       |
      | Pursued         | /pursued  | warning       |
      | Client Accounts | /clients  | emerald       |
    And the Secondary Catalogs section should display:
      | Item            | Route     |
      | Service Catalog | /services |
      | Add-ons & Subs  | /addons   |
    And the Tertiary Tools section should display:
      | Item              | Route            |
      | Business Doctrine | /doctrine        |
    And the stage viewport should render BasePageContainer
    And no modal (#modal-portal) or drawer (#drawer-portal) should be mounted

  # =========================================================================
  # SCENARIO 2: ASIDE NAVIGATION PURE ROUTING & BREADCRUMB ORIENTATION
  # =========================================================================
  Scenario: Navigation from Aside strictly navigates to BasePageContainer with BasePageHeader
    Given the operator is viewing the "Leads" view
    When the operator clicks on "Client Accounts" in the Aside menu
    Then the router should push to "/clients"
    And no modal dialog or drawer overlay should be opened
    And the active highlight in BaseAside should shift to "Client Accounts"
    And the previous "Leads" highlight should be removed
    And the stage should display a BasePageHeader containing:
      | Element    | Expected Value                         |
      | Breadcrumb | Home / Client Accounts                 |
      | Title      | Client Accounts                        |
    And the leaf breadcrumb node "Client Accounts" should have aria-current="page" and be non-clickable

  # =========================================================================
  # SCENARIO 3: BREADCRUMB ORIENTATION & TRAIL NAVIGATION
  # =========================================================================
  Scenario: Navigating via BaseBreadcrumb links in page header
    Given the operator has navigated to "/clients/acme-logistics"
    And the BasePageHeader renders breadcrumbs: "Home" > "Client Accounts" > "Acme Logistics"
    When the operator clicks on the "Client Accounts" breadcrumb node
    Then the router should navigate back to "/clients"
    And the active aside menu item should be "Client Accounts"
    And the page header title should update to "Client Accounts"

  # =========================================================================
  # SCENARIO 4: COLLAPSING AND EXPANDING THE NAVIGATION RAIL
  # =========================================================================
  Scenario: Collapsing and expanding the navigation rail with state persistence
    Given the navigation rail is expanded at "240px"
    When the operator clicks the collapse button "◀"
    Then the rail width should animate to "64px"
    And the brand subtitle and text labels should be hidden
    And the collapsed expand strip with "▶" should be visible
    And localStorage key "smb_ops_rail_collapsed" should be "true"
    When the operator hovers over the "Leads" icon
    Then a popover tooltip reading "Leads" should appear to the right of the rail
    When the operator clicks the expand button "▶"
    Then the rail width should return to "240px"
    And localStorage key "smb_ops_rail_collapsed" should be "false"

  # =========================================================================
  # SCENARIO 5: MOBILE RESPONSIVE DRAWER ADAPTATION
  # =========================================================================
  Scenario: Mobile viewport navigation sheet and dismissal
    Given the viewport width is 390px (mobile)
    Then the BaseAside rail should be hidden off-canvas
    And a top mobile bar (56px) with a hamburger button "☰" should be visible
    When the operator taps the hamburger button "☰"
    Then the navigation sheet should slide in to 280px width
    And a dark backdrop should mount over the stage
    And document body scrolling should be locked
    When the operator taps on "Service Catalog"
    Then the router should navigate to "/services"
    And the mobile navigation sheet should dismiss immediately
    And the backdrop should be unmounted
    And document body scrolling should be restored
    And the new view should mount BasePageContainer with BasePageHeader

  # =========================================================================
  # SCENARIO 6: GLOBAL THEME TOGGLE SYNCHRONIZATION
  # =========================================================================
  Scenario: Synchronizing light and dark theme from rail footer
    Given the application is loaded with light theme
    When the operator clicks the ThemeToggle in the BaseAside footer
    Then document root <html data-theme="dark"> should be set
    And localStorage key "smb_ops_theme" should be "dark"
    When the operator refreshes the page
    Then the dark theme attribute should remain applied on document root
```
