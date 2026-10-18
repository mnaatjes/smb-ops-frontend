---
title: "0006: Responsive Navigation and Dossier Action Table"
tags: ["architecture", "action-tables", "mobile", "navigation", "dossier"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# 0006: Responsive Navigation and Dossier Action Table

## 1. Flow Scope
This action table establishes deterministic interaction behaviors for responsive mobile navigation, hamburger triggers, icon minimization, and mobile dossier drawer gestures.

## 2. Deterministic Action Table

| Source View | Control / Trigger | Event / Intent | State Mutation | UI Feedback / Animation | Success Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Mobile Top Bar | Tap Hamburger `☰` | `OPEN_MOBILE_NAV` | `isMobileNavOpen = true` | Slide in `AsideNavRail` from left (0.2s cubic-bezier); darken backdrop overlay | Flyout nav drawer displayed |
| Mobile Nav Drawer | Tap Backdrop Overlay | `DISMISS_MOBILE_NAV` | `isMobileNavOpen = false` | Slide out nav rail to left (-100%); fade out backdrop | Nav drawer dismissed |
| Mobile Nav Drawer | Tap Nav Link Item | `SELECT_TAB_MOBILE` | `activeTab = tab`, `isMobileNavOpen = false` | Nav drawer slides out immediately; page scrolls to top | Workspace switched; nav closed |
| Desktop / Tablet | Click Nav Collapse Toggle | `TOGGLE_RAIL_MINIMIZE` | `isRailCollapsed = !isRailCollapsed` | Animate rail width (240px $\leftrightarrow$ 68px); fade out text labels | Rail toggled between full and icon-only mode |
| Client Card | Click / Tap Client Card | `INSPECT_CLIENT` | `activeDossierClient = client`, `showDossierDrawer = true` | Slide in `<ClientDossierDrawer>`: 100vw on mobile, 540px on desktop | Dossier opened |
| Dossier Drawer | Tap Close `✕` or Back Button | `CLOSE_DOSSIER` | `showDossierDrawer = false` | Slide out drawer to right (0.25s ease-out) | Dossier closed |
| Dossier Drawer | Tap "+ Log Work" Button | `OPEN_LOG_WORK` | `showLogMaintenanceModal = true` | Displays maintenance work modal (responsive full-width modal on mobile) | Maintenance modal opened |
