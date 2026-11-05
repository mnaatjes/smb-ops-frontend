---
title: "SDD-0018: Pursued Opportunity Pipeline Workspace Layout and Topology Specification"
status: "accepted"
date: "2026-11-05"
tags: ["design", "architecture", "layout", "topology", "pursued", "pipeline", "base-table", "drawers"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# SDD-0018: Pursued Opportunity Pipeline Workspace Layout and Topology Specification

## 1. Visual Topology & Spatial Architecture

The Pursued Opportunity Pipeline Workspace (`PursuedLeadsView.vue`) resides within the application shell (`BaseSiteLayout.vue`) mounted inside the stage canvas (`BasePageContainer.vue`) under route `/pursued`. It serves as the primary stage 2 high-touch conversion engine for qualified SMB leads (`status = 'PURSUED' | 'QUALIFIED'`), tracking deal progression through engagement stages, managing stakeholder contacts, logging outreach touches, and converting prospects into active client accounts (`/clients`):

1. **Header Orientation Strip:** Standardized `BasePageHeader.vue` with breadcrumbs (`Home / Pursued Pipeline`), active pursued opportunity count badge, and a primary action trigger (`Log Touchpoint` / `Discover Contacts`).
2. **Pipeline Velocity & Engagement KPI Ribbon:** 4-column metric ribbon powered by `BaseMetricCard.vue` presenting:
   - Total Active Pursued Opportunities (`store.pursuedLeads.length`).
   - Engaged & In Discussion Deals (`stage in ['engaged', 'appointment_scheduled']`).
   - Proposals Out / Closing Tier (`stage === 'proposal_presented'`).
   - Pipeline Win Rate / Conversion Velocity.
3. **Stage Filter & Search Control Deck:** High-density filter bar featuring:
   - Stage Filter Pills: `All Stages`, `Claimed`, `Contact Attempted`, `Engaged`, `Appointment Scheduled`, `Proposal Presented`.
   - Opportunity Search & Keyword Filter (`business_name`, address, phone).
   - Opportunity Score Filter / Quick Sort (Score descending, Created at descending).
4. **Primary Opportunity Presentation (`BaseCard.vue` Grid):** Responsive, high-density opportunity card deck (`grid-template-columns: repeat(auto-fill, minmax(360px, 1fr))`):
   - **Card Header:** Business name with external website link, phone, and opportunity score badge (`ScoreBadge.vue`).
   - **Card Stage Ribbon:** Current milestone badge (`Claimed` to `Proposal Presented`) with visual indicator.
   - **Card Body Vitals:** Address, CMS platform badge, primary stakeholder contact, and last activity touchpoint.
   - **Card Actions Footer:** Full-width action button cluster: "Dossier" (drawer inspection), "Advance Stage" (steps pipeline), and "Convert to Client" (client onboarding).
5. **Contextual Overlay Portals:**
   - **Full-Depth Opportunity Dossier Drawer (`OpportunityDossierDrawer.vue`, `BaseDrawer size="lg"`, 960px):** Slideout mounted via `#drawer-portal` upon card or action button click, hosting the dual-column engagement hub, Google Maps telemetry, pitch scripts, contact discovery, and activity timeline.
   - **Client Onboarding Modal (`ClientOnboardingModal.vue`, `BaseModal.vue`):** Mounted via `#modal-portal` upon clicking "Convert to Client", establishing retainer contract terms and transitioning prospect to active client account.
   - **Disqualification Modal (`BaseModal.vue` wrapping `DisqualifyLeadForm.vue`):** Accessible for dropping pursued opportunities from the pipeline with structured loss reasoning.

```
+===================================================================================================================+
|                                           VIEWPORT (100vw x 100vh)                                                |
+=============================================+=====================================================================+
|  LEFT NAV RAIL (BaseAside.vue)              |  MAIN STAGE VIEWPORT (BasePageContainer.vue)                        |
|  [width: 240px (expanded) / 64px (rail)]    |  [flex: 1, height: 100%, overflow-y: auto, max-width: 1440px]       |
|                                             |                                                                     |
|  * 3-TIER NAVIGATION:                       |  * PAGE ORIENTATION (BasePageHeader.vue):                           |
|    - Leads (/leads)                         |    - Breadcrumbs: Home / Pursued Pipeline                           |
|    - Pursued (/pursued) [ACTIVE]            |    - Title: "Pursued Opportunity Pipeline"                          |
|    - Accounts (/clients)                    |    - Subtitle: "Engage Qualified Prospects & Assemble Proposals"   |
|    - Service Catalog (/services)            |    - Badges: [8 Pursued Deals]                                      |
|    - Add-ons & Subs (/addons)               |    - Actions: [ Convert Deal ]                                      |
|                                             |                                                                     |
|                                             |  * KPI METRIC RIBBON (4 Columns):                                   |
|                                             |    +----------------+ +----------------+ +------------------------+ |
|                                             |    | BaseMetricCard | | BaseMetricCard | | BaseMetricCard ...       | |
|                                             |    | Active Deals: 8| | Engaged: 3     | | Proposals Out: 2         | |
|                                             |    +----------------+ +----------------+ +------------------------+ |
|                                             |                                                                     |
|                                             |  * STAGE FILTER & SEARCH CONTROLS DECK:                             |
|                                             |    [ All ] [ Claimed ] [ Contact Attempted ] [ Engaged ] [ Proposal ] |
|                                             |    [ Search Business Name... ] [ Min Score Slider ]                 |
|                                             |                                                                     |
|                                             |  * PURSUED OPPORTUNITY CARDS GRID (BaseCard.vue):                   |
|                                             |    +----------------------------+  +----------------------------+   |
|                                             |    | [Score: 82] Grand Rapids B.|  | [Score: 65] Lakeside Auto  |   |
|                                             |    | Stage: [ ENGAGED ]         |  | Stage: [ PROPOSAL SENT ]   |   |
|                                             |    | 📍 100 Main St             |  | 📍 200 Lake Dr             |   |
|                                             |    | 👤 John Doe (Owner)        |  | 👤 Jane Smith (Manager)    |   |
|                                             |    | [Dossier] [Advance] [Onboard]| | [Dossier] [Advance] [Onboard]|   |
|                                             |    +----------------------------+  +----------------------------+   |
|                                             |                                                                     |
+=============================================+=====================================================================+
|  OVERLAYS (Portaled):                                                                                             |
|  - #drawer-portal: OpportunityDossierDrawer.vue (BaseDrawer size="lg", 960px)                                     |
|  - #modal-portal:  ClientOnboardingModal.vue (Convert to Client)                                                  |
|  - #modal-portal:  DisqualifyLeadModal (DisqualifyLeadForm.vue)                                                   |
+===================================================================================================================+
```

---

## 2. Invariant Layout Geometry

* **Stage Canvas Width:** Occupies `100%` width of stage viewport up to `max-width: 1440px`.
* **Card Grid Architecture:** Driven by `BaseCard.vue` in a responsive auto-fill grid (`minmax(360px, 1fr)`), eliminating horizontal squishing and accommodating multi-dimensional opportunity metadata comfortably.
* **Drawer Portaling:** `OpportunityDossierDrawer.vue` mounts to `#drawer-portal` with `size="lg"` (960px) and slideout transition.
* **Modal Portaling:** `ClientOnboardingModal.vue` mounts to `#modal-portal` without nested modal inception.
