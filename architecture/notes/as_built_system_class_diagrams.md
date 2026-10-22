---
title: "As-Built System Architecture & Domain Relationships"
tags: ["architecture", "mermaid", "class-diagram", "domain-model", "as-built", "bounded-contexts"]
created_at: "2026-10-22"
last_updated_at: "2026-10-22"
---

# As-Built System Architecture & Domain Relationships

This document visualizes the exact as-built composition, data schemas, and structural relationships across the 5 core systems in `smb-ops-frontend`. Rather than a single entangled view, systems are partitioned into their **3 distinct, decoupled Bounded Contexts**.

---

## 1. High-Level Bounded Context Map

The three systems are loosely coupled via string identifiers (`service_code` and `lead_id`):

```mermaid
flowchart LR
    SC["Service Catalog Context\n(Static Service Offerings)"] -->|"References service_code"| CA["Client Account Context\n(Contracts, Vault, Timecards)"]
    OB["Onboarding Context\n(Lead Conversion Pipeline)"] -->|"Provisions New Client"| CA
    OB -.->|"Selects initial service_codes"| SC
```

---

## 2. Diagram 1: Service Catalog System (Isolated Aggregate)

The Service Catalog is completely self-contained. It defines standard operational offerings, pricing boundaries, and technical audit parameters.

```mermaid
classDiagram
    direction TB

    class ServiceCatalogItem {
        +string id
        +string code
        +string name
        +string description
        +string rank
        +string pricing_model
        +number price_min
        +number price_max
        +string[] scope
        +string[] deliverables
        +string[] exclusions
        +string[] audit_parameters
        +number minimum_opportunity_score
        +string created_at
    }

    class CreateServicePayload {
        +string code
        +string name
        +string description
        +string rank
        +number price_min
        +number price_max
        +string[] audit_parameters
        +number minimum_opportunity_score
    }

    class ServiceFilterDropdown {
        +ServiceCatalogItem[] services
        +string[] modelValue
        +toggleService(code)
        +selectAll()
    }

    ServiceCatalogItem ..> CreateServicePayload : authored via
    ServiceFilterDropdown o-- ServiceCatalogItem : filters by
```

---

## 3. Diagram 2: Onboarding Pipeline & Conversion Flow

The Onboarding system is a transient pipeline that captures operator input and provisions a new client account from an existing prospect.

```mermaid
classDiagram
    direction TB

    class Prospect {
        +string id
        +string business_name
        +string website_url
        +string phone
        +string status
        +string opportunity_stage
    }

    class ClientOnboardingModal {
        +number currentStep
        +boolean show
        +startOnboarding(prospect)
        +submitOnboarding()
    }

    class OnboardClientPayload {
        +string lead_id
        +string contact_name
        +string contact_email
        +string contact_phone
        +string[] service_codes
        +string custom_scope_notes
        +ClientSecretPayload[] secrets
    }

    class ClientSecretPayload {
        +string secret_type
        +string label
        +string username
        +string password
        +string login_url
    }

    ClientOnboardingModal ..> Prospect : converts
    ClientOnboardingModal ..> OnboardClientPayload : constructs
    OnboardClientPayload *-- ClientSecretPayload : bundles initial secrets
```

---

## 4. Diagram 3: Client Account, Contracts, Vault & Timecards (Core Cluster)

The Client Account is the primary operational Aggregate Root. It directly owns continuity telemetry, secret credentials, active service contracts, and monthly work timecards.

```mermaid
classDiagram
    direction TB

    class ClientAccount {
        +string id
        +string source_lead_id
        +string business_name
        +string website_url
        +string primary_contact_name
        +string primary_contact_email
        +string phone
        +string state
        +string created_at
        +string updated_at
    }

    class ContinuityHealth {
        +string id
        +string client_id
        +boolean ssl_monitored
        +boolean uptime_healthy
        +string last_backup_at
        +string backup_bucket
        +string last_ping_at
    }

    class ClientSecretMetadata {
        +string id
        +string client_id
        +string secret_type
        +string label
        +string username
        +string login_url
        +string key_version
        +string created_at
    }

    class ContractAgreement {
        +string id
        +string client_id
        +string service_code
        +string contract_type
        +number billing_rate
        +string billing_frequency
        +string status
        +string start_date
        +string renewal_date
        +string created_at
    }

    class DiscreteDeliverableChecklist {
        +string contractId
        +number actionIndex
        +string description
        +boolean completed
        +string commitUuid
    }

    class Timecard {
        +string id
        +string client_id
        +string contract_id
        +number billing_month
        +number billing_year
        +number total_minutes_logged
        +number monthly_retainer_cap_minutes
        +boolean out_of_scope_flag
    }

    class TimecardEntry {
        +string id
        +string timecard_id
        +string description
        +number minutes_spent
        +TimecardEntryType entry_type
        +string performed_at
        +string author
    }

    %% COMPOSITION & LIFECYCLE
    ClientAccount "1" *-- "1" ContinuityHealth : telemetry monitored by
    ClientAccount "1" *-- "0..*" ClientSecretMetadata : credentials vault
    ClientAccount "1" *-- "0..*" ContractAgreement : active contracts
    ClientAccount "1" *-- "1" Timecard : current month ledger

    ContractAgreement "1" *-- "0..*" DiscreteDeliverableChecklist : expands deliverables
    ContractAgreement ..> Timecard : drives monthly_retainer_cap_minutes

    Timecard "1" *-- "0..*" TimecardEntry : contains logged entries
```

---

## 5. Architectural Invariants & Coupling Rules

1. **Service Catalog Decoupling:**
   * The Service Catalog has **zero foreign keys** to clients, contracts, or leads.
   * `ContractAgreement` stores a snapshot string `service_code` (e.g. `"CARE_PLAN_30"`), ensuring contract terms remain immutable even if catalog pricing changes later.
2. **Onboarding Pipeline Decoupling:**
   * The onboarding modal is purely a presentation pipeline. Once `POST /clients` succeeds, the modal is destroyed and the resulting `ClientAccount` is self-governing.
3. **Timecard & Retainer Cohesion:**
   * A `ClientAccount` has one active `Timecard` per billing cycle.
   * Only contracts with `contract_type === 'retainer'` increase `Timecard.monthly_retainer_cap_minutes`.
   * Only `TimecardEntry` items with `entry_type === 'retainer_maintenance'` consume the monthly allowance; `billable_extra` and `internal_non_billable` entries are recorded in the ledger without deducting from the cap.
