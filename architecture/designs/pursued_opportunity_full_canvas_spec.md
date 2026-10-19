---
title: "Pursued Opportunity Full-Canvas Workspace Specification"
tags: ["design", "ui", "dossier", "maps", "playbook", "specification"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# Pursued Opportunity Full-Canvas Workspace Specification

## 1. Canvas Boundary & Sizing

* **Container Width:** `w-full max-w-[calc(100vw-260px)]` (leaving the 260px vertical navigation rail visible on the left).
* **Container Height:** `h-screen`, `overflow-hidden` at the root with dual independent scroll zones for Column 1 and Column 2.
* **Breakpoint Fallback:**
  * Screen width $\ge 1280px$: Dual column side-by-side (`grid grid-cols-12 gap-6`, Col 1 = 5 cols, Col 2 = 7 cols).
  * Screen width $< 1280px$: Stacked single column with tab switcher or vertical cascade.

## 2. Component Hierarchy

```
OpportunityDossierDrawer (Overlay Modal: w-[calc(100vw-260px)])
├── Workspace Header (Sticky Top)
│   ├── Breadcrumb ("Pursued Pipeline / {Business Name}")
│   ├── Opportunity Score Badge & Status
│   └── Actions ("Convert to Client", "Close [Esc]")
│
├── Workspace Body (Dual-Column Flex/Grid)
│   ├── Left Column (Vitals & Playbook - 42%)
│   │   ├── Section: Location & Google Maps Card
│   │   │   ├── Address, Phone, Website Link
│   │   │   └── Responsive Map Iframe (or direct Google Maps embed link)
│   │   ├── Section: Audit Deficits & Rubric
│   │   └── Section: Aligned Services & Pitch Scripts
│   │       └── Card Accordion: Phone Pitch, Cold Email, Objection Handlers
│   │
│   └── Right Column (Engagement Hub - 58%)
│       ├── Section: Stage Stepper Bar
│       ├── Section: Stakeholder Contacts Hub
│       │   ├── "+ Add Contact" & "⚡ Discover Contacts (Enrichment)"
│       │   └── Contact Cards with Target Selection
│       └── Section: Outreach Activity Feed & Logger
│           ├── Fast Touchpoint Logger Form
│           └── Chronological Activity & Appointment Timeline
```

## 3. Data Integration & Contracts

* **Maps URL Generator:** `https://maps.google.com/maps?q=${encodeURIComponent(address || business_name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
* **Playbook API Contract:** `GET /api/leads/{id}/playbook` returning matched services with pre-computed phone/email/objection scripts.
* **Contact Discovery Contract:** `POST /api/leads/{id}/contacts/discover` initiating background OSINT lookup.
