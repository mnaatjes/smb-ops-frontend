---
title: "UAT Acceptance Criteria: Client Dossier Overlay"
status: "accepted"
date: "2026-11-05"
tags: ["uat", "gherkin", "acceptance-criteria", "client-dossier", "overlay", "timecards", "vault", "theme-tokens"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# UAT Acceptance Criteria: Client Dossier Overlay

## 1. Architectural Invariants (Core Rules)

* **Invariant 1.1 (Full-Canvas Viewport Invariant):** The Client Dossier Overlay must expand across the primary stage canvas minus the 260px navigation rail (`calc(100vw - 260px)`), providing a dual-column layout with 44% width for Column 1 (Context, Telemetry & Contracts) and 56% width for Column 2 (Operations, Retainer Timecard & Vault).
* **Invariant 1.2 (Theme Token Independence Invariant):** The overlay must strictly respect both Light and Dark application themes using semantic design tokens (`--bg-surface`, `--bg-app`, `--bg-surface-subtle`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border-color`, `--accent-primary`) with zero hardcoded dark-only canvas hex codes.
* **Invariant 1.3 (15-Second Secret Reveal Invariant):** Revealing an encrypted credential from the vault must render plaintext alongside a live 15-second countdown badge, automatically reverting to masked dots (`••••••••••••••••`) once the timer expires.
* **Invariant 1.4 (Clean Modal Delegation Invariant):** Triggering "+ Log Work", "+ Attach Care Plan", or "+ Add Secret" from inside the dossier must emit typed events to the parent workspace without nested modal stacking inside the drawer canvas.

---

## 2. Gherkin Acceptance Scenarios

```gherkin
Feature: Client Dossier Overlay Lifecycle, Telemetry Probes, Retainer Timecards, and Credential Vault

  Background:
    Given the operator accesses the SMB Ops application
    And an active client account "Grand Rapids Bakery" exists in the registry
    And the client has an active care plan contract "CARE_PLAN_60"

  # =========================================================================
  # SCENARIO 1: OVERLAY MOUNTING & DUAL-COLUMN LAYOUT
  # =========================================================================
  Scenario: Mounting the Client Dossier Overlay
    When the operator opens the dossier drawer for "Grand Rapids Bakery"
    Then the overlay should mount with width "calc(100vw - 260px)"
    And the header should display "Grand Rapids Bakery" and the "ACTIVE" state badge
    And the body should render Column 1 (44% width) with Account Profile, Continuity Health, and Active Contracts
    And the body should render Column 2 (56% width) with Retainer Timecard MaintenanceGauge and Credential Vault

  # =========================================================================
  # SCENARIO 2: LIGHT & DARK MODE THEME TOKEN ADAPTATION
  # =========================================================================
  Scenario: Adapting overlay styling across light and dark theme modes
    Given the client dossier overlay is mounted
    When the application theme switches between light mode and dark mode
    Then the overlay canvas should dynamically bind semantic tokens:
      | Token                  | Role                                  |
      | --bg-app               | Primary canvas background             |
      | --bg-surface           | Header and panel card background      |
      | --bg-surface-subtle    | Secondary tag and badge background    |
      | --text-primary         | Headings and primary vitals text      |
      | --text-secondary       | Field labels and secondary metadata   |
      | --border-color         | Panel card and column split borders   |
    And no hardcoded dark hex colors should override the active theme tokens

  # =========================================================================
  # SCENARIO 3: CONTRACT ACCORDION & DISCRETE DELIVERABLES CHECKLIST
  # =========================================================================
  Scenario: Inspecting contract deliverables and checklist items
    Given the client dossier displays active contract "CARE_PLAN_60"
    When the operator clicks on the "CARE_PLAN_60" contract card
    Then the deliverables accordion should expand
    And the discrete deliverables checklist should be visible
    When the operator toggles a deliverable checkbox
    Then the completed counter should update accordingly

  # =========================================================================
  # SCENARIO 4: 15-SECOND SECRET REVEAL COUNTDOWN
  # =========================================================================
  Scenario: Revealing an encrypted credential from the vault
    Given the credential vault displays a secret "WordPress Admin"
    When the operator clicks "Reveal (15s)" on the "WordPress Admin" card
    Then the masked dots should be replaced by plaintext "secretPassword123!"
    And a countdown badge should display "15s"
    When 15 seconds elapse
    Then the plaintext should be purged
    And the credential should revert to masked dots "••••••••••••••••"

  # =========================================================================
  # SCENARIO 5: MODAL DELEGATION EVENTS
  # =========================================================================
  Scenario: Delegating creation actions to parent workspace modals
    Given the client dossier overlay is mounted
    When the operator clicks "+ Log Work"
    Then the component should emit the "log-work" event with the client payload
    When the operator clicks "+ Attach Care Plan"
    Then the component should emit the "attach-contract" event with the client payload
    When the operator clicks "+ Add Secret"
    Then the component should emit the "add-secret" event with the client payload
```
