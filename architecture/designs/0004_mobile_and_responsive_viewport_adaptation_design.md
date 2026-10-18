---
title: "SDD-0004: Mobile and Responsive Viewport Adaptation Design"
status: "approved"
authors: ["@mnaatjes"]
reviewers: ["Systems Engineering Team"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
related_adrs: ["architecture/adr/0014_mobile_and_responsive_viewport_adaptation.md", "architecture/adr/0005_vertical_navigation_rail_and_unified_lead_qualification.md"]
related_rfcs: []
---

# SDD-0004: Mobile and Responsive Viewport Adaptation Design

## 1. Executive Summary & Skeptic Justification

As field operations scale, operators evaluate and triage leads, inspect client telemetry, and record maintenance hours directly on mobile phones and tablets at client physical locations or on transit. Currently, the dashboard desktop layout hardcodes a 240px wide sidebar and a 540px drawer, making mobile usage non-viable.

Building separate mobile endpoints would introduce code drift and maintenance overhead. This design achieves complete mobile ergonomics by adapting existing Feature-Sliced Design components via responsive CSS custom properties, an off-canvas mobile flyout drawer, and collapsible icon-rail states.

## 2. Structural Component Model

```mermaid
classDiagram
    class HomeView {
        +boolean isMobileNavOpen
        +boolean isRailCollapsed
        +toggleMobileNav()
        +closeMobileNav()
    }
    class AsideNavRail {
        +string activeTab
        +boolean collapsed
        +boolean mobileOpen
        +event selectTab
        +event toggleCollapse
        +event closeMobile
    }
    class MobileTopBar {
        +string title
        +event toggleNav
    }
    class ClientDossierDrawer {
        +boolean show
        +ClientAccount client
        +event close
    }

    HomeView *-- MobileTopBar : renders when width < 768px
    HomeView *-- AsideNavRail : responsive rail or flyout
    HomeView *-- ClientDossierDrawer : responsive slide-over
```

## 3. Dynamic Interaction Flow

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Field Operator (Mobile)
    participant Bar as MobileTopBar (HomeView)
    participant Rail as AsideNavRail (Drawer)
    participant View as Workspace Content
    participant Dossier as ClientDossierDrawer

    Operator->>Bar: Taps Hamburger Menu (☰)
    Bar->>Rail: Emits 'toggle-mobile-nav' (mobileOpen = true)
    Rail->>Operator: Displays full-height 280px flyout nav over backdrop
    Operator->>Rail: Taps "Client Accounts" link
    Rail->>Bar: Emits 'select-tab' ("clients") & 'close-mobile'
    Bar->>View: Renders Client Accounts Grid
    Operator->>View: Taps Client Account Card
    View->>Dossier: Emits 'inspect-client' (show = true)
    Dossier->>Operator: Slides in 100vw full-screen dossier view
    Operator->>Dossier: Taps 'Close' (✕)
    Dossier->>View: Emits 'close'
```

## 4. Phased Implementation Plan & Verification

* **Phase 1: `AsideNavRail.vue` Responsiveness & Icon Collapse:**
  * Add `collapsed` prop and local toggle to support compact 64px icon-only rail.
  * Add mobile flyout drawer mode with backdrop overlay.
* **Phase 2: `HomeView.vue` Top Mobile App Bar:**
  * Render a sticky mobile header bar with hamburger button `☰`, title, and ThemeToggle when `max-width: 768px`.
* **Phase 3: `ClientDossierDrawer.vue` Mobile Layout:**
  * Adjust `.dossier-drawer` to `width: 100vw; max-width: 100%` on mobile.
  * Stack telemetry items and action buttons vertically with touch padding.
* **Phase 4: Workspace Grids & Tables Touch Ergonomics:**
  * Ensure horizontal scrolling wrappers on `LeadTriageTable.vue` and wrapping grids on `ClientsGrid` / `pipeline-grid`.
