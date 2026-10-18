---
title: "0003: Client Accounts Workspace and Dossier Design"
status: "draft"
date: "2026-10-18"
tags: ["design", "frontend", "client-accounts", "fsd", "ui-design", "onboarding"]
---

# 0003: Client Accounts Workspace and Dossier Design

## 1. Executive Summary

This Software Design Document details the UI components, Feature-Sliced Design (FSD) structure, and interaction patterns for the **Client Accounts Workspace** (`tab=clients`) and the integrated **Client Onboarding Pipeline** in `smb-ops-frontend`.

```mermaid
flowchart TD
    A["HomeView (tab=clients)"] --> B{"Has Clients?"}
    B -- Yes --> C["ClientsGrid.vue"]
    B -- No --> D["EmptyClients.vue"]
    
    C -->|Click Client Card| E["ClientDossierDrawer.vue"]
    
    subgraph Drawer ["Client Dossier Drawer"]
        E --> F["Contract Summary & SOW"]
        E --> G["Maintenance Minute Bar"]
        E --> H["Digital Continuity Telemetry"]
        E --> I["Timecard & Maintenance Work Log"]
    end

    E -->|Click '+ Log Work'| J["LogMaintenanceModal.vue"]
```

---

## 2. Client Onboarding Pipeline Workflow

Promoting a Pursued Lead into a contracted Client Account initiates the structured **Client Onboarding Pipeline**.

```mermaid
sequenceDiagram
    autonumber
    actor Operator
    participant UI as Pursued Pipeline UI
    participant Onboard as Onboarding Wizard Modal
    participant API as Backend Service
    participant Mail as Email / Documenso Gateway
    actor Client as Business Owner

    Operator->>UI: Clicks "Convert to Client" on Pursued Lead
    UI->>Onboard: Opens Client Onboarding Wizard
    
    Note over Operator,Onboard: Step 1: Verify & Enrich Contact Information
    Operator->>Onboard: Confirms Owner Name, Direct Phone, Decision-Maker Email
    
    Note over Operator,Onboard: Step 2: Select Service Offering(s)
    Operator->>Onboard: Selects Service(s) (e.g. SVC-RANK-2 Digital Continuity Retainer)
    
    Note over Operator,Onboard: Step 3: Articulate Scope & Deliverables
    Operator->>Onboard: Verifies auto-populated Scope, Deliverables, SLA terms
    
    Note over Operator,Onboard: Step 4: Contract Generation & Delivery
    Operator->>Onboard: Clicks "Generate & Send Contract"
    Onboard->>API: POST /api/clients/onboard { contact, services, pricing, terms }
    API->>Mail: Sends Contract Package / E-Sign Request to Client Email
    API-->>UI: 201 Created (Client instantiated in ONBOARDING state)
    
    Client->>Mail: Reviews SOW and e-signs document
    Mail-->>API: Webhook (Contract signed)
    API-->>UI: Transitions Client State: ONBOARDING -> ACTIVE_RETAINER
```

---

## 3. Onboarding & Client Architecture Class Diagram

```mermaid
classDiagram
    direction TB

    class PursuedLead {
        +UUID prospect_id
        +String business_name
        +String website_url
        +String phone
        +AuditResult audit
        +ProspectStatus status
    }

    class OnboardingSession {
        +UUID id
        +UUID source_lead_id
        +OnboardingStep current_step
        +ContactPayload contact_info
        +List~String~ selected_service_codes
        +String custom_notes
        +DateTime initiated_at
        +complete()
    }

    class ClientAccount {
        +UUID id
        +UUID source_lead_id
        +String business_name
        +String website_url
        +String primary_contact_name
        +String primary_contact_email
        +String phone
        +ClientLifecycleState state
        +DateTime created_at
        +DateTime updated_at
    }

    class ContractAgreement {
        +UUID id
        +UUID client_id
        +String service_code
        +String contract_type
        +Decimal billing_rate
        +String billing_frequency
        +String signature_document_url
        +ContractStatus status
        +Date start_date
        +Date renewal_date
    }

    class Timecard {
        +UUID id
        +UUID client_id
        +UUID contract_id
        +Int billing_month
        +Int billing_year
        +Int total_minutes_logged
        +Int monthly_retainer_cap_minutes
        +Boolean out_of_scope_flag
        +logWork(TimecardEntry)
    }

    class TimecardEntry {
        +UUID id
        +UUID timecard_id
        +String task_description
        +Int minutes_spent
        +DateTime performed_at
        +String author
    }

    class ContinuityHealth {
        +UUID id
        +UUID client_id
        +Boolean ssl_monitored
        +Boolean uptime_healthy
        +DateTime last_backup_at
        +String backup_bucket
        +DateTime last_ping_at
    }

    PursuedLead --> OnboardingSession : initiates
    OnboardingSession --> ClientAccount : provisions
    ClientAccount "1" *-- "many" ContractAgreement : governs
    ClientAccount "1" *-- "1" Timecard : tracks time on
    Timecard "1" *-- "many" TimecardEntry : contains
    ClientAccount "1" *-- "1" ContinuityHealth : monitors
```

---

## 4. Industry Reference Analysis: Client Onboarding & Dashboards

### 4.1 Common Workflows in Leading Client Dashboards
* **Agencies & Managed Services (e.g. HubSpot, Productive, ManyRequests):**
  * **Intake & Scope Confirmation:** Pre-populating verified prospect technical audit data (missing SSL, slow TTFB, PDF menu problems) directly into the client dossier.
  * **Contract & Scope Governance:** Explicitly itemizing deliverables and exclusions in the contract summary so client requests exceeding scope can be flagged transparently.
  * **Timecard & Retainer Consumption:** Real-time visibility into support time (e.g., 30-minute monthly maintenance limit) preventing profit margin leakage.
  * **Continuity & SLA Status:** Single-pane-of-glass status indicator showing uptime and backup health for all active client domains.

### 4.2 Application to Small Business Operations Stack
* **Onboarding Wizard:** Instead of an instant, bare-bones database insert, clicking "Convert to Client" opens a focused 4-step wizard:
  1. **Contact Verification:** Confirm owner name, email, phone, and billing address.
  2. **Service Package Selection:** Select from registered Service Catalog tiers (e.g. `SVC-RANK-1A`, `SVC-RANK-2`).
  3. **Work Scope & Terms:** Review deliverables, standard SLA support hours (Mon-Fri 9-5 EST), and emergency response limits.
  4. **Contract Dispatch:** Generate contract and dispatch to client for review and signature (via email or Documenso/Dropbox Sign).
* **Future Timecard Integration:**
  * When a client account is created, a default `Timecard` is provisioned for the current billing cycle.
  * Operators log ad-hoc client requests against specific contracts, tracking work against the 30-minute retainer boundary.

---

## 5. Component Hierarchy & FSD Slices

* **`widgets/client-accounts/`**:
  * `ClientsGrid.vue`: Responsive CSS grid hosting individual client cards.
  * `ClientCard.vue`: Card displaying business name, primary contact, contract type badge, and continuity status.
* **`features/client-onboarding/`**:
  * `ClientOnboardingModal.vue`: Multi-step onboarding pipeline wizard (Contact -> Services -> Scope -> Contract Dispatch).
* **`features/client-dossier/`**:
  * `ClientDossierDrawer.vue`: Side drawer providing deep inspection of contracts, billing rate, signed document links, timecards, and maintenance entries.
* **`features/client-maintenance/`**:
  * `LogMaintenanceModal.vue`: Modal allowing operators to log minutes spent and task description against the client's timecard.
  * `MaintenanceGauge.vue`: Progress indicator displaying used minutes vs remaining monthly allowance.
* **`entities/client/`**:
  * `model.ts`: TypeScript contracts for `ClientAccount`, `ContractAgreement`, `Timecard`, `TimecardEntry`, `ContinuityHealth`.
  * `store.ts`: Pinia client store managing state, API queries, and onboarding mutations.

---

## 6. Visual & Interaction Design Specifications

### 6.1 Maintenance Gauge Invariant
* Under 25 minutes: Green progress bar (`var(--color-success)`).
* 25–30 minutes: Amber warning progress bar (`var(--color-warning)`).
* >30 minutes: Red overflow progress bar (`var(--color-danger)`) with badge: `Out-of-Scope (Additional SOW Required)`.

### 6.2 Continuity Health Indicator
* `All Systems Green`: Active SSL, successful weekly S3 backup within last 7 days, uptime check passing.
* `Warning`: Overdue backup (>7 days) or SSL expiring within 14 days.
* `Critical`: Website endpoint offline / HTTP error.
