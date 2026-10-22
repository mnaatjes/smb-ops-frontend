---
title: "As-Built System Architecture & Domain Relationships"
tags: ["architecture", "mermaid", "class-diagram", "domain-model", "as-built"]
created_at: "2026-10-22"
last_updated_at: "2026-10-22"
---

# As-Built System Architecture & Domain Relationships

This document visualizes the exact as-built composition, data schemas, and structural relationships across the 5 core systems in `smb-ops-frontend`:
1. **Client Account System**
2. **Onboarding Pipeline**
3. **Service Catalog**
4. **Add-ons & Recurring Contracts**
5. **Timecards & Retainer Maintenance**

---

## 1. Unified As-Built System Class Diagram

```mermaid
classDiagram
    direction TB

    %% 1. CLIENT ACCOUNT SYSTEM
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

    %% 2. ONBOARDING SYSTEM
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

    class Prospect {
        +string id
        +string business_name
        +string website_url
        +string status
        +string opportunity_stage
    }

    %% 3. SERVICE CATALOG SYSTEM
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

    %% 4. ADD-ONS & RECURRING CONTRACTS
    class ContractAgreement {
        +string id
        +string client_id
        +string service_code
        +string contract_type
        +number billing_rate
        +string billing_frequency
        +string signature_document_url
        +string status
        +string start_date
        +string renewal_date
        +string created_at
    }

    class AttachContractPayload {
        +string service_code
        +number billing_rate
        +string contract_type
    }

    class DiscreteDeliverableChecklist {
        +string contractId
        +number actionIndex
        +string description
        +boolean completed
        +string commitUuid
    }

    %% 5. TIMECARDS & RETAINER SYSTEM
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

    class LogTimecardPayload {
        +string description
        +number minutes_spent
        +TimecardEntryType entry_type
        +string author
    }

    %% RELATIONSHIPS & COMPOSITION
    ClientAccount "1" *-- "0..*" ContractAgreement : holds contracts
    ClientAccount "1" *-- "1" ContinuityHealth : monitored by
    ClientAccount "1" *-- "0..*" ClientSecretMetadata : stores secrets in vault
    ClientAccount "1" *-- "1" Timecard : tracks monthly work

    Timecard "1" *-- "0..*" TimecardEntry : records log entries
    Timecard ..> LogTimecardPayload : appends via

    ContractAgreement "0..*" ..> "1" ServiceCatalogItem : references service_code
    ContractAgreement "1" *-- "0..*" DiscreteDeliverableChecklist : expands deliverables
    ContractAgreement ..> AttachContractPayload : created via
    ContractAgreement ..> Timecard : drives monthly_retainer_cap_minutes

    ClientOnboardingModal ..> OnboardClientPayload : constructs
    OnboardClientPayload ..> Prospect : converts lead
    OnboardClientPayload ..> ClientAccount : provisions new
    OnboardClientPayload "1" o-- "0..*" ServiceCatalogItem : selects initial services
    ServiceCatalogItem ..> CreateServicePayload : authored via
```

---

## 2. Detailed Subsystem Breakdowns

### 1. Client Account Subsystem
* **Core Entity:** `ClientAccount` represents an active business client converted from a `Prospect`.
* **Telemetry & Security:**
  - `ContinuityHealth`: Real-time probe telemetry (SSL, HTTP uptime, backup bucket, last ping).
  - `ClientSecretMetadata`: Vault-stored credentials encrypted at rest with masked view and 15s reveal countdown.

### 2. Onboarding Pipeline Subsystem
* **Flow:** `Prospect` (Status: `PURSUED`, Stage: `converted`) $\rightarrow$ `ClientOnboardingModal` (4-step stepper) $\rightarrow$ `OnboardClientPayload` $\rightarrow$ `POST /clients`.
* **Provisioning:** Creates the `ClientAccount`, initializes `ContinuityHealth`, provisions selected initial service contracts, and injects first vault credentials.

### 3. Service Catalog Subsystem
* **Entity:** `ServiceCatalogItem` defines standard operational offerings with codes (`WEB_HOSTING`, `CARE_PLAN_30`, `LOCAL_SEO`).
* **Governance Invariants:**
  - Contains pricing bounds (`price_min`, `price_max`).
  - Contains `audit_parameters` and `minimum_opportunity_score` used by `ServiceFilterDropdown` to qualify prospects in triage.
  - Contains `deliverables[]` and `scope[]` lists.

### 4. Add-ons & Recurring Contracts Subsystem
* **Entity:** `ContractAgreement` links a `ClientAccount` to a `ServiceCatalogItem.code`.
* **Types:**
  - `retainer`: Recurring monthly plans (`CARE_PLAN_30`, `CARE_PLAN_60`, `CARE_PLAN_90`) that inject monthly allowance minutes into `Timecard.monthly_retainer_cap_minutes`.
  - `fixed_fee`: One-time setup or project deliverables.
* **Deliverables Accordion:** Each contract expands in the dossier to render interactive deliverable checkboxes with Git commit UUID tags (`localStorage` persistence).

### 5. Timecards & Retainer Subsystem
* **Entity:** `Timecard` tracks the current billing cycle's logged work for a client.
* **Entries:** `TimecardEntry` records individual work bursts tagged with `TimecardEntryType`:
  1. `retainer_maintenance`: Consumes monthly retainer cap (e.g. 30m/mo).
  2. `billable_extra`: Logged beyond or outside retainer scope (billed separately).
  3. `internal_non_billable`: Pro-bono or diagnostic triage work.
* **Gauge:** `MaintenanceGauge.vue` calculates percentage consumption ($MinutesLogged / CapMinutes$) and signals green, warning amber, or overage rose.
