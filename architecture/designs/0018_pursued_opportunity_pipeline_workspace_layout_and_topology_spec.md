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
4. **Primary Opportunity Data Table (`BaseTable.vue`):** Standardized, sortable, responsive data table with custom column slot renders:
   - `business_name`: Business name with external website link, contact telephone link, and street address.
   - `opportunity_stage`: Semantic stage progression badge with stage stepper or dropdown indicator (`claimed` $\rightarrow$ `proposal_presented`).
   - `opportunity_score`: `ScoreBadge.vue` with semantic variant mapping (70+ `danger`, 40–69 `warning`, <40 `success`).
   - `primary_contact`: Name, role, and phone/email of identified primary stakeholder.
   - `last_activity`: Date and channel badge (`Call`, `Email`, `Meeting`) of the most recent touchpoint.
   - `actions`: Quick-action button cluster including "Open Dossier" (launches slideout drawer), "Advance Stage" (steps opportunity to next pipeline stage), and "Convert to Client" (triggers client onboarding).
5. **Contextual Overlay Portals:**
   - **Full-Depth Opportunity Dossier Drawer (`OpportunityDossierDrawer.vue`, `BaseDrawer size="lg"`, 960px):** Slideout mounted via `#drawer-portal` upon row click or action button click, hosting the dual-column engagement hub, Google Maps telemetry, pitch scripts, contact discovery, and activity timeline.
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
|                                             |  * PURSUED PIPELINE DATA TABLE (BaseTable.vue):                     |
|                                             |    +--------------------------------------------------------------+ |
|                                             |    | Business Name  | Stage    | Score | Primary Contact | Actions    | |
|                                             |    |----------------|----------|-------|-----------------|------------| |
|                                             |    | Grand Rapids B.| Engaged  | 82/100| John Doe (Owner)| [Dossier]  | |
|                                             |    | Lakeside Auto  | Proposal | 65/100| Jane Smith (Mgr)| [Convert]  | |
|                                             |    +--------------------------------------------------------------+ |
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
* **Table Rows:** Standardized `BaseTable.vue` layout. Card grids and multi-column tile decks are strictly prohibited for pursued opportunity rows to preserve information density and scanning ergonomics.
* **Drawer Portaling:** `OpportunityDossierDrawer.vue` mounts to `#drawer-portal` with `size="lg"` (960px) and slideout transition.
* **Modal Portaling:** `ClientOnboardingModal.vue` mounts to `#modal-portal` without nested modal inception.
