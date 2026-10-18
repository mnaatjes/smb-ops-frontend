---
title: "0014: Mobile and Responsive Viewport Adaptation"
status: "accepted"
date: "2026-10-18"
tags: ["adr", "frontend", "mobile", "responsive", "navigation", "dossier"]
---

# 0014: Mobile and Responsive Viewport Adaptation

## Context and Problem Statement
When operators access the SMB Ops dashboard in the field (e.g. via mobile browsers over Tailscale/WireGuard), the current layout exhibits severe usability deficits:
1. The left vertical aside navigation rail (`AsideNavRail.vue`) occupies a fixed 240px width and is sticky, forcing the entire page container into an unreadable squished layout or horizontal overflow on screens under 768px.
2. The `ClientDossierDrawer.vue` is constrained to a fixed 540px width with desktop paddings, cutting off text and telemetry metrics on mobile devices (e.g. 375px - 414px viewports).
3. Operators lack a standard hamburger menu trigger or collapsible navigation rail to reclaim horizontal workspace real estate.

## Decision Drivers
* Mobile-first ergonomic touch interaction in the field (minimum 44px touch targets).
* Clean collapsible rail supporting both icon-only minimization on tablet and off-canvas slide-out on mobile.
* Zero external CSS frameworks: leverage CSS custom properties, modern Flexbox/Grid, and media queries (`@media (max-width: 768px)`).
* Full-width responsive transition for the Client Dossier Drawer.

## Considered Options
1. **Separate Mobile App / PWA View:** Build a separate mobile-only page tree.
   * *Rejected:* High maintenance duplication and diverges from single responsive codebase.
2. **Responsive CSS Media Queries + Hamburger Drawer + Collapsible Aside Rail:**
   * Introduce a mobile app bar with a hamburger trigger `☰`.
   * Make `AsideNavRail.vue` responsive: support an off-canvas mobile drawer with backdrop overlay, and an icon-only minimized mode (`collapsed`).
   * Adapt `ClientDossierDrawer.vue` to dynamically expand to `100vw` on screens $< 768px$.
   * Adjust grid layouts (`pipeline-grid`, `clients-grid`, `metrics-ribbon`) to stack cleanly.

## Decision Outcome
Chosen Option: **Option 2 (Responsive CSS Media Queries + Mobile Hamburger Drawer + Icon-Only Collapse)**.

### Architectural Invariants:
1. Breakpoint Boundaries:
   * **Mobile (`max-width: 768px`):** Top mobile navigation bar appears with hamburger toggle and brand icon. `AsideNavRail` transforms into an off-canvas sliding modal drawer (`z-index: 100`).
   * **Tablet / Minimized (`768px - 1024px`):** Aside rail supports icon-only mode with centered badges.
   * **Desktop (`min-width: 1024px`):** Full 240px aside rail.
2. Dossier Drawer:
   * On mobile viewports ($< 768px$), `dossier-drawer` width is `100vw`, headers and telemetry cards stack vertically with enlarged touch targets.
3. Zero Layout Shift:
   * Body scrolling is locked when mobile navigation drawer is active.
