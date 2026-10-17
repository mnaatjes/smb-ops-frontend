---
title: "0001: Lead Operations Action Table"
tags: ["architecture", "action-tables", "lead-operations", "as-is"]
created_at: "2026-10-17"
last_updated_at: "2026-10-17"
---

# 0001: Lead Operations Action Table (As-Is)

## 1. Flow Scope

* **Primary Page:** `pages/HomeView.vue` (`/`)
* **Associated Backend Use-Cases:**
  * `0001_discover_prospective_leads.md` (`POST /api/v1/leads/discover`)
  * `0002_audit_prospect_infrastructure.md` (`POST /api/v1/leads/audit`)
  * `0003_list_ranked_leads.md` (`GET /api/v1/leads/ranked`)

## 2. Deterministic Action Table (As-Is)

| Source View | Control / Trigger | Event / Intent | Backend Mutation | In-Flight / Loading State | Success Outcome | Error Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` Header | Click "+ Add Lead" | `OPEN_CREATE_MODAL` | None | Open `CreateLeadModal` | Modal visible, form inputs focused | None |
| `<CreateLeadModal>` | Submit form | `SUBMIT_CREATE_LEAD` | `POST /api/v1/leads` | Store `loading=true` | Close modal, banner "Added lead: {name}", reload ranked leads | Banner error message, keep modal open |
| `/` Discovery Bar | Click "Discover" | `TRIGGER_DISCOVERY` | `POST /api/v1/leads/discover` | Store `loading=true`, banner "Discovering..." | Banner "Discovered N prospects.", reload ranked leads | Banner error "Discovery failed" |
| `/` Batch Audit | Click "Run Technical Audit" | `TRIGGER_BATCH_AUDIT`| `POST /api/v1/leads/audit` | Store `loading=true`, banner "Running batch..." | Banner "Audited X leads (Y failed).", reload ranked leads | Banner error "Audit batch failed" |
| `/` Filter Section | Select Score Dropdown | `FILTER_MIN_SCORE` | None | Instant computed re-filter | Table updates rows instantly (0, 40, 70) | None |
| `/` Table Row | Click row | None | None | None | **No action / Dead row** | None |
| `/` Table Row | External Link | `OPEN_WEBSITE` | None | Open browser new tab | Navigate to restaurant site | None |

## 3. Flow Sequence Diagram (As-Is)

```mermaid
sequenceDiagram
    autonumber
    actor Operator
    participant Home as HomeView.vue
    participant Store as useLeadStore
    participant API as /api/v1/leads

    Note over Operator,Home: Initial Load
    Home->>Store: loadRankedLeads()
    Store->>API: GET /leads/ranked?min_score=0
    API-->>Store: 200 OK (RankedLead[])
    Store-->>Home: render table & metrics

    Note over Operator,Home: Batch Audit Trigger
    Operator->>Home: Click "Run Technical Audit (15)"
    Home->>Store: runBatchAudit(15)
    Store->>API: POST /leads/audit { limit: 15 }
    API-->>Store: 200 OK { audited_count, failed_count }
    Store->>API: GET /leads/ranked?min_score=0
    API-->>Store: 200 OK (updated leads)
    Store-->>Home: update metrics & score badges
```
