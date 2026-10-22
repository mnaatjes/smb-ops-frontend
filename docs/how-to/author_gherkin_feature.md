---
title: "How-To Guide: Authoring a New Gherkin Feature Workflow"
tags: ["how-to", "testing", "gherkin", "e2e", "diataxis", "workflow"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# How-To Guide: Authoring a New Gherkin Feature Workflow

A step-by-step practical guide to creating, formatting, and verifying a new Gherkin workflow specification in `smb-ops-frontend`.

---

## 1. Prerequisites
- Workspace path: `tests/e2e/specs/`
- Node 20 / container toolchain with `gherkin-lint` installed (`pnpm run lint:gherkin`)
- A clear user workflow (e.g., clicking a button, submitting a form, verifying an outcome)

---

## 2. Step-by-Step Instructions

### Step 1: Create the Feature File
1. Navigate to `tests/e2e/specs/`.
2. Follow the numerical naming convention: `XX_<descriptive_feature_name>.feature`
   - Example: `tests/e2e/specs/06_contract_pipeline_transitions.feature`

### Step 2: Define Feature Header & User Persona
At the top of the file (0 spaces indent), define the user role, capability, and business value:

```gherkin
Feature: Contract Pipeline Stage Transitions
  As an SMB account manager
  I want to transition contracts from Draft to Active
  So that recurring billing and SLA telemetry activate automatically
```

### Step 3: Add Shared Background (If Applicable)
If multiple scenarios share the same starting point, add a `Background:` block (2 spaces indent):

```gherkin
  Background:
    Given the operator is logged into the system
    And the application is viewing the "clients" workspace
```

### Step 4: Write Concrete Scenarios
Author isolated, sequential actions using `Given`, `When`, `Then`, `And`:

```gherkin
  Scenario: Transition a draft contract to active status
    Given a client account exists with a contract in "DRAFT" status
    When the operator opens the client dossier drawer
    And clicks "Activate Contract" on the draft contract card
    Then the contract status badge changes to "ACTIVE"
    And the continuity monitoring probes begin polling
```

### Step 5: Format Check (Indentation Schema)
Verify exact spacing matching repository rules:
* `Feature:` $\rightarrow$ **0 spaces**
* `Background:` / `Scenario:` $\rightarrow$ **2 spaces**
* `Given` / `When` / `Then` / `And` / `But` $\rightarrow$ **4 spaces**

### Step 6: Validate with Linter
Run the automated Gherkin linter locally:

```bash
docker run --rm -v $(pwd):/app -w /app node:20-alpine sh -c "corepack enable && pnpm run lint:gherkin"
```

* If clean: output returns code 0.
* If errors exist: fix reported line numbers and re-run.

---

## 3. Quick Copy-Paste Template

```gherkin
Feature: [Feature Name]
  As an [operator / sales rep / administrator]
  I want to [perform a business action]
  So that [business outcome is achieved]

  Background:
    Given the operator is viewing the "[pool | pipeline | clients | services | doctrine]" workspace

  Scenario: [Happy path description]
    Given [pre-condition or open state]
    When the operator clicks "[Exact Button Label]"
    And enters "[field name]" with "[example value]"
    And clicks "[Submit Button Label]"
    Then [observable visual result occurs]
    And [state or table updates]

  Scenario: [Error or edge case description]
    Given [pre-condition]
    When the operator enters invalid data
    And clicks "[Submit Button Label]"
    Then an error banner displays "[expected error text]"
```
