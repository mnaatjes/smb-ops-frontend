---
title: "SDD-0007: Opportunity Contacts and Activity Ledger UI Design"
status: "approved"
authors: ["@mnaatjes"]
reviewers: ["Systems Engineering Team"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
related_adrs: ["architecture/adr/0017_pursued_opportunity_contacts_and_activity_ledger.md", "architecture/adr/0016_pursued_opportunity_dossier_drawer.md"]
related_rfcs: []
---

# SDD-0007: Opportunity Contacts and Activity Ledger UI Design

## 1. Executive Summary & Skeptic Justification

Sales conversion requires multiple touches with multiple people inside an organization. This design implements contacts management, interaction tracking, appointment scheduling, and stage progression directly within `OpportunityDossierDrawer.vue`.

## 2. Component Architecture

```mermaid
classDiagram
    class OpportunityDossierDrawer {
        +RankedLead lead
        +ContactPerson[] contacts
        +OutreachActivity[] activities
        +OpportunityStage currentStage
        +loadContacts()
        +loadActivities()
        +handleAddContact(payload)
        +handleLogActivity(payload)
        +handleUpdateStage(stage)
    }

    class AddContactModal {
        +boolean show
        +string name
        +string roleTitle
        +string phone
        +string email
        +boolean isPrimary
        +submit()
    }

    class LogActivityForm {
        +string selectedContactId
        +ActivityChannel channel
        +string summary
        +string scheduledAt
        +submit()
    }

    class ActivityTimeline {
        +OutreachActivity[] activities
        +formatTime()
        +renderBadge()
    }

    OpportunityDossierDrawer *-- AddContactModal
    OpportunityDossierDrawer *-- LogActivityForm
    OpportunityDossierDrawer *-- ActivityTimeline
```

## 3. Interaction Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Operator
    participant Drawer as OpportunityDossierDrawer
    participant Store as LeadStore (Pinia)
    participant API as Backend REST API

    Operator->>Drawer: Opens Opportunity Dossier
    Drawer->>Store: fetchOpportunityContacts(lead.id)
    Drawer->>Store: fetchOpportunityActivities(lead.id)
    API-->>Store: Returns contacts & activities
    Store-->>Drawer: Populates Contacts Directory & Activity Timeline

    Operator->>Drawer: Fills "Log Touchpoint / Schedule Appointment"
    Note over Operator,Drawer: Selects contact, chooses "APPOINTMENT", sets datetime
    Operator->>Drawer: Clicks "Record Activity"
    Drawer->>Store: logOpportunityActivity(lead.id, payload)
    Store->>API: POST /api/leads/:id/activities
    API-->>Store: Created Activity (+ auto-updates stage to APPOINTMENT_SCHEDULED)
    Store-->>Drawer: Appends activity; updates stage pill-bar
```
