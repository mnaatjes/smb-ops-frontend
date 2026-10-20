---
title: "Architecture UAT Manual: Principles, Lifecycle, and Checklists"
tags: ["uat", "testing", "standards", "manual", "checklist"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# Architecture UAT Manual: Principles, Lifecycle, and Checklists

## 1. Purpose (WHY)
The `architecture/uat/` directory is the canonical home for human-in-the-loop User Acceptance Testing (UAT) audit plans and release sign-offs. It serves as an immutable engineering verification ledger to guarantee zero guesswork, catch visual/data defects, and verify features against business objectives before deployment.

## 2. Triggering Events (WHEN)
A UAT plan document must be authored:
- **Major Feature Merges:** Prior to merging PRs that introduce new business workflows, modal forms, or navigation patterns.
- **Sprint/Milestone Releases:** Before tagging release candidates.
- **Breaking Layout Refactors:** Following responsive adjustments or full-canvas layout updates.

## 3. Authoring Standards (HOW)
- Use standard four-digit numbering: `0001_<feature_slug>_uat_plan.md`.
- Keep steps discrete, atomic, and numbered.
- Limit jargon; state the exact button label, input value, and observable visual result.
- Every test item must feature a Markdown checkbox (`- [ ]`).

## 4. Mandatory YAML Frontmatter Schema

```yaml
---
title: "UAT Plan: [Feature Name]"
tags: ["uat", "[feature-tag]", "release-gate"]
created_at: "YYYY-MM-DD"
last_updated_at: "YYYY-MM-DD"
author: "Engineer / Operator Name"
target_environment: "http://localhost:8090"
status: "draft" # draft | in_review | passed | failed
---
```

## 5. Standard UAT Document Template

```markdown
# UAT Plan: [Feature Name]

## 1. Test Environment & Pre-Conditions
- **URL:** `http://localhost:8090`
- **Prerequisites:** Clean stack refresh (`scripts/refresh_stack.sh`), sample seed data active.
- **Tester:** [Name]
- **Date Tested:** [YYYY-MM-DD]

## 2. Test Execution Checklist

### Flow 1: [Primary Business Action]
- [ ] **Step 1: Navigation**
  - **Action:** Click "Client Accounts" in the left navigation rail.
  - **Expected:** Client accounts workspace renders showing client grid.
- [ ] **Step 2: Modal Trigger**
  - **Action:** Click "+ Onboard Client" button in header.
  - **Expected:** Modal opens with 3-step progress stepper and clean inputs.
- [ ] **Step 3: Submission & State Verification**
  - **Action:** Enter Name: "Acme HVAC", Website: "https://acmehvac.com", click "Next".
  - **Expected:** Step 2 (Service Contracts) activates.

## 3. Defect & Regression Log
| # | Step | Observed Behavior | Expected Behavior | Severity | Status |
|---|---|---|---|---|---|
| 1 | Flow 1.2 | Button text truncated on 1024px | Text wraps or shrinks | Low | Open |

## 4. Sign-off
- **Result:** [Pass / Fail]
- **Verified Commit UUID:** [Git Commit Hash]
- **Sign-off By:** [Signature / Handle]
```
