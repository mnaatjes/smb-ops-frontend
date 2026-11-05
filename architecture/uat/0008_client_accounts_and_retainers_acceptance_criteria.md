---
title: "UAT Acceptance Criteria: Client Accounts and Retainers Workspace"
status: "accepted"
date: "2026-11-05"
tags: ["uat", "gherkin", "acceptance-criteria", "client-accounts", "retainers", "timecards", "drawers"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# UAT Acceptance Criteria: Client Accounts and Retainers Workspace

## 1. Architectural Invariants (Core Rules)

* **Invariant 1.1 (Pure Route Stage Navigation):** The Client Accounts & Retainers workspace must mount as a top-level stage route (`/clients`) inside `BasePageContainer.vue` and oriented with `BasePageHeader.vue`. No modal or drawer may open automatically on initial route load.
* **Invariant 1.2 (Responsive Account Card Deck Invariant):** Converted client accounts must appear in structured, responsive cards powered by `BaseCard.vue` within an auto-filling grid (`minmax(360px, 1fr)`), preventing cramped row truncations and accommodating contract terms, contact vitals, and maintenance gauges.
* **Invariant 1.3 (State Classification Invariant):** Each client card must render the account state (`active`, `onboarding`, `dormant`) with semantic `BaseBadge.vue` indicators and allow dynamic filtering by account state.
* **Invariant 1.4 (Deep Dossier & Timecard Invariant):** Clicking a client card or "Open Dossier" button must launch `ClientDossierDrawer.vue` (`BaseDrawer size="lg"`, 960px) providing full access to contract management, the maintenance timecard gauge, and the encrypted credential vault.

---

## 2. Gherkin Acceptance Scenarios

```gherkin
Feature: Client Accounts & Retainers Workspace Management, Retainer Governance, and Dossier Access

  Background:
    Given the operator accesses the SMB Ops application
    And the Pinia lead store contains active client accounts
    And the backend service catalog and client account registries are initialized

  # =========================================================================
  # SCENARIO 1: WORKSPACE MOUNTING & CLIENT CARDS RENDERING
  # =========================================================================
  Scenario: Mounting the Client Accounts & Retainers workspace route
    When the operator navigates to "/clients"
    Then the stage should display a BasePageHeader with:
      | Field       | Expected Value                                               |
      | Breadcrumb  | Home / Client Accounts                                       |
      | Title       | Client Accounts & Retainers                                  |
      | Subtitle    | Active Account Ledgers, Retainers, & Vault Access            |
    And the stage should display an executive KPI ribbon with 4 BaseMetricCards
    And the client accounts should render inside responsive BaseCards
    And each client card should render business name, state badge, primary contact, and action buttons

  # =========================================================================
  # SCENARIO 2: FILTERING CLIENT ACCOUNTS BY STATE
  # =========================================================================
  Scenario: Filtering client accounts by account state
    Given the client accounts workspace displays active and onboarding accounts
    When the operator clicks the "Onboarding" state filter pill
    Then the deck should update to display only client accounts with state "onboarding"
    And accounts in "active" or "dormant" state should be excluded from view

  # =========================================================================
  # SCENARIO 3: OPENING CLIENT DOSSIER DRAWER
  # =========================================================================
  Scenario: Inspecting deep client account dossier drawer
    Given the client deck displays an account "Grand Rapids Bakery"
    When the operator clicks on the "Grand Rapids Bakery" card
    Then BaseDrawer (#drawer-portal) should slide open with size "lg"
    And the drawer should display ClientDossierDrawer with account vitals, contracts, and vault
    When the operator presses "Escape"
    Then BaseDrawer should close cleanly

  # =========================================================================
  # SCENARIO 4: LOGGING MAINTENANCE WORK TO CLIENT TIMECARD
  # =========================================================================
  Scenario: Logging maintenance minutes against a client care plan
    Given the client deck displays an account "Lakeside Auto Repair"
    When the operator clicks "+ Log Work" on the "Lakeside Auto Repair" card
    Then LogWorkModal should open centered via #modal-portal
    When the operator submits 30 minutes of "Monthly CMS security updates"
    Then the modal should close
    And a confirmation alert should display "Logged 30m to client timecard"

  # =========================================================================
  # SCENARIO 5: ATTACHING A CARE PLAN CONTRACT TO CLIENT
  # =========================================================================
  Scenario: Attaching a new care plan contract to an account
    Given the client deck displays an account "Alpine Dental Care"
    When the operator clicks "+ Attach Care Plan" on the "Alpine Dental Care" card
    Then ContractAgreementModal should open centered via #modal-portal
    When the operator selects "CARE_PLAN_60" at "$199/month" and submits
    Then the modal should close
    And the account contracts should display the active "CARE_PLAN_60" contract
```
