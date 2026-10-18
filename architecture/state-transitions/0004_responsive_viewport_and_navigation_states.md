---
title: "0004: Responsive Viewport and Navigation States"
tags: ["architecture", "state-transitions", "mobile", "navigation", "viewport"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# 0004: Responsive Viewport and Navigation States

## 1. Entity Overview

* **Entity Name:** `ViewportNavigationLayout`
* **Primary Identifier:** `viewport_mode`
* **Owning Domain / Slice:** `features/navigation`, `features/client-dossier`, `pages/HomeView`
* **Frontend Scope:** Reactive breakpoint detection (`< 768px`, `768px - 1024px`, `> 1024px`) and navigation/drawer display mode.

## 2. State Definitions

* `DESKTOP_FULL`: Viewport $\ge$ 1024px. Aside rail is sticky with full 240px width displaying icons and text labels. Dossier drawer renders as standard 540px side drawer.
* `TABLET_ICON_RAIL`: Viewport between 768px and 1023px. Aside rail collapses to compact 64px width showing icons only with hover tooltips. Dossier drawer takes 480px or max 80vw.
* `MOBILE_CLOSED`: Viewport < 768px. Aside rail is hidden off-canvas. A sticky top mobile header bar renders a hamburger button and brand badge. Dossier drawer is closed.
* `MOBILE_NAV_OPEN`: Viewport < 768px. Hamburger button toggled. Aside navigation slides in as full-height 280px drawer over a backdrop overlay (`z-index: 100`).
* `MOBILE_DOSSIER_OPEN`: Viewport < 768px. Client dossier drawer opened. Drawer renders as 100% full-width slide-over with touch-friendly header dismiss button and isolated vertical scrolling.

## 3. Transition Matrix

| Source State | Trigger Event | Guard / Precondition | Target State | Side Effect / Action |
| :--- | :--- | :--- | :--- | :--- |
| `*` | `RESIZE_VIEWPORT` | `width >= 1024px` | `DESKTOP_FULL` | Closes mobile overlays; resets nav rail to 240px |
| `*` | `RESIZE_VIEWPORT` | `768px <= width < 1024px` | `TABLET_ICON_RAIL` | Closes mobile overlays; collapses rail to 64px icon mode |
| `*` | `RESIZE_VIEWPORT` | `width < 768px` | `MOBILE_CLOSED` | Hides rail off-canvas; activates hamburger trigger |
| `MOBILE_CLOSED` | `TOGGLE_HAMBURGER` | `is_mobile == true` | `MOBILE_NAV_OPEN` | Opens flyout nav; locks body scroll |
| `MOBILE_NAV_OPEN` | `DISMISS_NAV` / `SELECT_TAB` | None | `MOBILE_CLOSED` | Closes flyout nav; restores body scroll |
| `MOBILE_CLOSED` | `OPEN_CLIENT_DOSSIER` | `is_mobile == true` | `MOBILE_DOSSIER_OPEN` | Opens 100% full-width dossier drawer |
| `MOBILE_DOSSIER_OPEN`| `CLOSE_DOSSIER` | None | `MOBILE_CLOSED` | Slides out dossier drawer |

## 4. State Diagram

```mermaid
stateDiagram-v2
    [*] --> DESKTOP_FULL: Initial Load (width >= 1024px)
    [*] --> TABLET_ICON_RAIL: Initial Load (768px <= width < 1024px)
    [*] --> MOBILE_CLOSED: Initial Load (width < 768px)

    DESKTOP_FULL --> TABLET_ICON_RAIL: RESIZE_VIEWPORT (768px-1023px)
    DESKTOP_FULL --> MOBILE_CLOSED: RESIZE_VIEWPORT (< 768px)

    TABLET_ICON_RAIL --> DESKTOP_FULL: RESIZE_VIEWPORT (>= 1024px)
    TABLET_ICON_RAIL --> MOBILE_CLOSED: RESIZE_VIEWPORT (< 768px)

    MOBILE_CLOSED --> DESKTOP_FULL: RESIZE_VIEWPORT (>= 1024px)
    MOBILE_CLOSED --> TABLET_ICON_RAIL: RESIZE_VIEWPORT (768px-1023px)

    MOBILE_CLOSED --> MOBILE_NAV_OPEN: TOGGLE_HAMBURGER
    MOBILE_NAV_OPEN --> MOBILE_CLOSED: DISMISS_NAV / SELECT_TAB

    MOBILE_CLOSED --> MOBILE_DOSSIER_OPEN: OPEN_CLIENT_DOSSIER
    MOBILE_DOSSIER_OPEN --> MOBILE_CLOSED: CLOSE_DOSSIER
```

## 5. UI Guard Rules

* On Mobile (`width < 768px`):
  * Nav link click must trigger `selectTab` and immediately close the flyout drawer.
  * Backdrop click must trigger `dismiss`.
  * Touch swipe or ESC key triggers dismiss.
  * Dossier drawer must occupy `100vw` without horizontal scroll bleeding.
