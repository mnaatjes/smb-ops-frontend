---
title: "Gherkin Specification Reference: Purpose, Syntax, and Meaning"
tags: ["testing", "gherkin", "bdd", "architecture", "quick-reference"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# Gherkin Specification Reference: Purpose, Syntax, and Meaning

A fast, no-fluff guide to understanding Gherkin `.feature` files in `smb-ops-frontend`.

---

## 1. The 30-Second Summary (WHY Gherkin?)

* **Problem:** Developers build what they *think* was asked; human testers guess what buttons to click; code and tests drift apart.
* **Solution:** Gherkin writes business scenarios in plain English using strict trigger words (`Given`, `When`, `Then`).
* **Twin Superpower:**
  1. **Zero Guesswork for Humans:** Anyone can read it and manually test the flow.
  2. **Automated for Machines:** Test runners (Playwright / Cypress) execute the exact same file line-by-line.

---

## 2. Core Keywords & Their Plain Meanings

| Keyword | What It Means (Plain English) | Concrete Example |
| :--- | :--- | :--- |
| **`Feature:`** | The overarching business capability. One per file. | `Feature: Client Onboarding and Contracts` |
| **`Background:`** | Setup steps that run before *every* scenario in this file. | `Given the operator is logged into the dashboard` |
| **`Scenario:`** | One single, isolated user workflow or edge case. | `Scenario: Successfully onboard a new client` |
| **`Given`** | **Initial State / Context.** What must be true before clicking anything. | `Given the operator is viewing the "clients" workspace` |
| **`When`** | **User Action.** The physical trigger (click, type, select). | `When the operator clicks "+ Onboard Client"` |
| **`Then`** | **Expected Result.** What must appear or change on screen. | `Then the client appears in the active accounts table` |
| **`And`** | Joins multiple `Given`, `When`, or `Then` statements without repetition. | `And enters website "https://acme.com"` |
| **`But`** | Negative assertion / exception expectation. | `But no contract is attached yet` |

---

## 3. Formatting & Indentation Rules

Our repo enforces strict `gherkin-lint` rules (`.gherkin-lintrc`):

```gherkin
Feature: Feature Title (0 spaces indent)
  As a role
  I want a capability
  So that I get a benefit

  Background: (2 spaces indent)
    Given initial system state (4 spaces indent)

  Scenario: Scenario Title (2 spaces indent)
    Given starting condition (4 spaces indent)
    When the user performs an action (4 spaces indent)
    And enters another input (4 spaces indent)
    Then observable result occurs (4 spaces indent)
    And database state changes (4 spaces indent)
```

* **Rules to avoid lint errors:**
  * 0 spaces for `Feature:`
  * 2 spaces for `Background:` and `Scenario:`
  * 4 spaces for `Given`, `When`, `Then`, `And`, `But`
  * Exactly one blank line between scenarios
  * No duplicate scenario names in the same file

---

## 4. Real-World Annotated Example

File: `tests/e2e/specs/04_client_workspace_and_contracts.feature`

```gherkin
Feature: Client Accounts Workspace, Care Plans, and Secret Vault
  As an SMB account manager
  I want to inspect client dossiers, attach care plans, and manage credentials
  So that I maintain SLA continuity and track contract deliverables

  Background:
    Given the operator is viewing the "clients" workspace

  Scenario: Attach an add-on Care Plan to client
    Given the Client Dossier workspace is open
    When the operator clicks "+ Attach Care Plan"
    And selects care plan tier "CARE_PLAN_30" with monthly rate "150"
    And clicks "Attach Contract"
    Then the new care plan appears under Active Service Contracts
    And the Maintenance Retainer gauge updates with a 30-minute monthly allocation
```

---

## 5. Do's and Don'ts

| Do ✅ | Don't ❌ |
| :--- | :--- |
| **Do** state exact button labels: `clicks "+ Onboard Client"` | **Don't** write vague actions: `When the user interacts with the UI` |
| **Do** use concrete quotes for inputs: `enters "Acme HVAC"` | **Don't** mix multiple independent flows into one scenario |
| **Do** verify observable outcomes: `Then the modal closes` | **Don't** write internal code details: `Then Vue store updates ref` |
| **Do** run `pnpm run lint:gherkin` before pushing | **Don't** ignore indentation spaces (CI will fail) |
