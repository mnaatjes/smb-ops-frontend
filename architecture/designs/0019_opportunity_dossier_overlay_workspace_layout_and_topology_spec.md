---
title: "SDD-0019: Opportunity Dossier Overlay Workspace Layout and Topology Specification"
status: "accepted"
date: "2026-11-05"
tags: ["design", "architecture", "layout", "topology", "dossier", "overlay", "light-mode", "dark-mode", "theming"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# SDD-0019: Opportunity Dossier Overlay Workspace Layout and Topology Specification

## 1. Visual Topology & Spatial Architecture

The Opportunity Dossier Overlay (`OpportunityDossierDrawer.vue`) serves as the full-depth diagnostic and commercial engagement console for an inspected business opportunity across both `/leads` (Discovery & Triage) and `/pursued` (Pursued Opportunity Pipeline).

Mounted dynamically via `#drawer-portal`, the overlay occupies the full viewport canvas minus the left navigation rail (`w-[calc(100vw-260px)]` on desktop $\ge 1200px$, falling back to `100vw` on mobile/tablet viewports):

1. **Header Orientation & Control Strip:**
   - Breadcrumb orientation: `Pursued Pipeline / {Business Name}`.
   - Lead Tracking UID (`prospect.id`) and Opportunity Score Pill (`audit.opportunity_score / 100`).
   - Action cluster: Primary "Convert to Client" button, secondary "Drop Opportunity" button, and standard close trigger (`✕` or `Escape` key).
2. **Full-Width Stage Stepper Banner:**
   - 5-step sequential milestone stepper: `Claimed` $\rightarrow$ `Contact Attempted` $\rightarrow$ `Engaged` $\rightarrow$ `Appointment Scheduled` $\rightarrow$ `Proposal Presented`.
   - Visual badges for active stage, passed stages (`#34d399`), and upcoming stages.
   - Interactive click-to-advance capability dispatching `store.setOpportunityStage`.
3. **Dual-Column Independent Scroll Body:**
   - **Left Column (44% Width - Diagnostic Vitals & Playbook):**
     - Location & Contact Card: Address, phone, website link, and responsive Google Maps embed preview.
     - Technical Opportunity Deficit Rubric: Breakdown of scored audit factors (Missing TLS/SSL, PDF Menus, Slow Response Time, Viewport issues).
     - Commercial Pitch Scripts & Playbook Accordion: Service match, value hook, telephone script, cold email copy, and common objection handlers with 1-click clipboard copy.
     - Service Catalog Fit Breakdown: Matching catalog offerings with pricing and scope preview.
   - **Right Column (56% Width - Commercial Engagement Hub):**
     - Stakeholder Contacts Ledger: Identified contacts with primary badges, target selector, phone/email channel pills, notes, and "+ Add Contact" modal trigger.
     - Outreach Touchpoint Logger: Channel selector (`phone_call`, `email`, `in_person_visit`, `voicemail`, `meeting`), target contact dropdown, summary input, appointment scheduler timestamp, and submission trigger.
     - Chronological Activity & Appointment Timeline: Ordered historical log of all touchpoints with channel icons, author tags, and appointment markers.

```
+===================================================================================================================+
| OVERLAY BACKDROP (rgba(0,0,0,0.65))                                                                               |
|                                       +---------------------------------------------------------------------------+
|                                       | WORKSPACE CANVAS: w-[calc(100vw-260px)] h-screen                          |
|                                       | Backing: var(--bg-app) | Border: var(--border-color)                      |
|                                       +---------------------------------------------------------------------------+
|                                       | 1. WORKSPACE HEADER:                                                      |
|                                       |    Breadcrumbs: Pursued Pipeline / Grand Rapids Bakery                    |
|                                       |    Score: [ 82 / 100 ] | Actions: [ Convert Deal ] [ Drop ] [ ✕ Close ]   |
|                                       +---------------------------------------------------------------------------+
|                                       | 2. STAGE STEPPER STRIP:                                                   |
|                                       |    [① Claimed] -> [② Contact Attempted] -> [③ Engaged] -> [④ Appt] -> [⑤] |
|                                       +---------------------------------------------------------------------------+
|                                       | 3. DUAL-COLUMN BODY (Independent Scrollzones):                            |
|                                       | +-----------------------------+ +---------------------------------------+ |
|                                       | | COL 1: VITALS (44%)         | | COL 2: ENGAGEMENT HUB (56%)           | |
|                                       | |                             | |                                       | |
|                                       | | * Location & Google Maps    | | * Stakeholder Contacts Grid           | |
|                                       | |   [ Address, Phone, Map ]   | |   [ Contact Card 1 ] [ + Add Contact ]| |
|                                       | |                             | |   [ "✓ Selected Target" ]             | |
|                                       | | * Technical Deficit Rubric  | |                                       | |
|                                       | |   [ Missing SSL: +25 pts ]  | | * Log Outreach Activity Form          | |
|                                       | |   [ PDF Menu: +30 pts ]     | |   [ Channel Select ] [ Contact Drop ] | |
|                                       | |                             | |   [ Notes Textarea ] [ Schedule Date ]| |
|                                       | | * Playbook Scripts          | |   [ Log Activity Button ]             | |
|                                       | |   [ Phone Hook ] [ Copy ]   | |                                       | |
|                                       | |   [ Email Script ] [ Copy ] | | * Chronological Activity Timeline     | |
|                                       | |                             | |   - [Call] Left voicemail (Yesterday) | |
|                                       | | * Matched Catalog Offerings | |   - [Meeting] Scheduled for Monday    | |
|                                       | +-----------------------------+ +---------------------------------------+ |
|                                       +---------------------------------------------------------------------------+
```

---

## 2. Universal Theme Decoupling (Light & Dark Mode)

The legacy overlay utilized hardcoded dark palette hex codes (`#090d16`, `#0f172a`, `#1e293b`, `#f1f5f9`), rendering the drawer illegible or visually incongruous in light mode. SDD-0019 mandates strict binding to semantic design tokens defined in `src/shared/styles/theme.css`:

| Element | Legacy Hardcoded Hex | Semantic Theme Token Binding | Light Mode Value | Dark Mode Value |
| :--- | :--- | :--- | :--- | :--- |
| Canvas Background | `#090d16` | `var(--bg-app)` | `#f9fafb` | `#0f172a` |
| Header & Stepper | `#0f172a` | `var(--bg-surface)` | `#ffffff` | `#1e293b` |
| Panel Cards & Left Col | `#0f172a` / `#1e293b` | `var(--bg-surface)` | `#ffffff` | `#1e293b` |
| Sub-cards & Script Blocks | `#1e293b` / `#0b1120` | `var(--bg-surface-subtle)` | `#f3f4f6` | `#0f172a` |
| Primary Text | `#f1f5f9` / `#ffffff` | `var(--text-primary)` | `#111827` | `#f8fafc` |
| Secondary / Muted Text | `#94a3b8` / `#cbd5e1` | `var(--text-secondary)` / `var(--text-muted)` | `#4b5563` / `#9ca3af` | `#94a3b8` / `#64748b` |
| Structural Borders | `#1e293b` / `#334155` | `var(--border-color)` | `#e5e7eb` | `#334155` |
| Subtle Dividers | `#1e293b` | `var(--border-subtle)` | `#f3f4f6` | `#1e293b` |
| Action Accent | `#3b82f6` | `var(--accent-primary)` | `#3b82f6` | `#3b82f6` |
| Accent Hover | `#2563eb` | `var(--accent-hover)` | `#2563eb` | `#60a5fa` |
| Quote & Code Backing | `rgba(0, 0, 0, 0.3)` | `var(--bg-surface-hover)` | `#f8fafc` | `#334155` |
