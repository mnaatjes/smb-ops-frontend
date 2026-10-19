---
title: "SDD-0006: Pursued Opportunity Dossier Drawer Design"
status: "approved"
authors: ["@mnaatjes"]
reviewers: ["Systems Engineering Team"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
related_adrs: ["architecture/adr/0016_pursued_opportunity_dossier_drawer.md", "architecture/adr/0013_client_accounts_workspace_and_onboarding_lifecycle.md"]
related_rfcs: []
---

# SDD-0006: Pursued Opportunity Dossier Drawer Design

## 1. Executive Summary & Skeptic Justification

In the **Pursued Pipeline**, operators frequently inspect claimed business opportunities to review contact info, evaluate why a prospect received high opportunity scores, and select matching service packages. Replacing modal popups with a persistent right-aligned slide drawer matches the operator ergonomics established in the Client Accounts workspace.

## 2. Structural Component Model

```mermaid
classDiagram
    class HomeView {
        +RankedLead activeOpportunityLead
        +boolean showOpportunityDrawer
        +handleOpenOpportunityDossier(lead)
        +handleConvertFromDrawer(lead)
        +handleDisqualifyFromDrawer(lead)
    }

    class OpportunityDossierDrawer {
        +boolean show
        +RankedLead lead
        +ServiceCatalogItem[] services
        +close()
        +convertToClient()
        +disqualify()
    }

    class ClientOnboardingModal {
        +boolean show
        +RankedLead lead
    }

    class DisqualifyModal {
        +boolean show
        +RankedLead lead
    }

    HomeView *-- OpportunityDossierDrawer
    HomeView ..> ClientOnboardingModal : opens from drawer action
    HomeView ..> DisqualifyModal : opens from drawer action
```

## 3. Dynamic Interaction Flow

```mermaid
sequenceDiagram
    autonumber
    actor Operator
    participant View as HomeView (Pipeline Tab)
    participant Drawer as OpportunityDossierDrawer
    participant OnboardModal as ClientOnboardingModal

    Operator->>View: Clicks Pursued Opportunity Card
    View->>Drawer: sets activeOpportunityLead = lead, showOpportunityDrawer = true
    Drawer->>Drawer: Computes matching service offerings & deficit factors
    Drawer->>Operator: Slides in from right displaying Opportunity Dossier
    
    alt Operator clicks "Convert to Client"
        Operator->>Drawer: Clicks "Convert to Client"
        Drawer->>View: emits 'convert', lead
        View->>Drawer: sets showOpportunityDrawer = false
        View->>OnboardModal: sets selectedLead = lead, showOnboardingModal = true
        OnboardModal->>Operator: Displays Onboarding Pipeline Wizard
    else Operator clicks "Close" or Backdrop
        Operator->>Drawer: Clicks "✕" or outside drawer
        Drawer->>View: emits 'close'
        View->>Drawer: sets showOpportunityDrawer = false
    end
```

## 4. Layout Specifications

* **Drawer Container:** Identical CSS structure to `ClientDossierDrawer` (`.drawer-overlay`, `.dossier-drawer`, `.drawer-header`, `.drawer-body`).
* **Header:** Tracking UID badge (`UID: 8-char`), business name, status badge (`PURSUED`), close button (`✕`).
* **Section 1 (Business Profile):** Website link, direct phone, geographic address.
* **Section 2 (Opportunity Score Card):** Calculated score (0-100), audit timestamp, deficit bullet points (+25 SSL, +30 unreadable PDF menus, etc.).
* **Section 3 (Best-Fit Service Offerings):** Matched service offerings with pricing badges, scope preview, and minimum score indicators.
* **Footer Action Bar:** Prominent "Convert to Client" (primary) and "Disqualify Lead" (danger).
