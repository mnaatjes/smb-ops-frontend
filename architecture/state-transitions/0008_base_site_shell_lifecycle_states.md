---
title: "State Transitions: Base Site Shell Lifecycle and Navigation States"
status: "accepted"
date: "2026-10-26"
tags: ["state-machine", "architecture", "navigation", "base-site-shell", "responsive"]
---

# State Transitions: Base Site Shell Lifecycle and Navigation States

## 1. Overview & Scope

This document specifies the Finite State Machine (FSM) governing the universal application shell (`BaseSiteLayout.vue`) and its coordination with the navigation rail (`BaseAside.vue`), mobile overlay sheet, theme toggling (`useTheme.ts`), and Pinia funnel telemetry.

```
+---------------------------------------------------------------------------------------+
|                              BASE SITE SHELL FSM DOMAINS                              |
|  1. Viewport Rail Domain:    EXPANDED (240px) <---------> COLLAPSED (64px)            |
|  2. Mobile Sheet Domain:     SHEET_CLOSED     <---------> SHEET_OPEN                  |
|  3. Theme Palette Domain:    THEME_LIGHT      <---------> THEME_DARK                  |
|  4. Funnel Telemetry Domain: COUNTS_LOADING   <---------> COUNTS_HYDRATED             |
+---------------------------------------------------------------------------------------+
```

---

## 2. Desktop Rail State Machine (Viewport >= 768px)

Governs horizontal rail width, text rendering, icon centering, and popover tooltip visibility.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Storage |
| :--- | :--- | :--- | :--- | :--- |
| `INIT_DESKTOP` | Mount on Viewport &ge; 1024px | `RAIL_EXPANDED` | Width 240px; brand text visible; labels and live badges shown. | Read `localStorage.getItem('smb_ops_rail_collapsed')`; defaults to `false`. |
| `INIT_DESKTOP` | Mount on Viewport 768px&ndash;1023px | `RAIL_COLLAPSED` | Width 64px; brand text hidden; icons centered; expand strip visible. | Read `localStorage`; defaults to `true` on tablet. |
| `RAIL_EXPANDED` | Click Collapse Button (`◀`) | `RAIL_COLLAPSED` | Animate width to 64px (0.2s cubic-bezier); show expand strip (`▶`); enable `data-tooltip`. | `localStorage.setItem('smb_ops_rail_collapsed', 'true')` |
| `RAIL_COLLAPSED` | Click Expand Button (`▶`) | `RAIL_EXPANDED` | Animate width to 240px; hide expand strip; display labels and badge counters. | `localStorage.setItem('smb_ops_rail_collapsed', 'false')` |
| `RAIL_COLLAPSED` | Hover Rail Item | `TOOLTIP_HOVER` | Floating popover tooltip appears to the right of the icon with pointer callout triangle. | Zero layout shift; unclipped via `overflow: visible`. |

---

## 3. Mobile Sheet State Machine (Viewport < 768px)

Governs off-canvas navigation and backdrop overlay on narrow screens.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Guard |
| :--- | :--- | :--- | :--- | :--- |
| `INIT_MOBILE` | Mount on Viewport &lt; 768px | `SHEET_CLOSED` | Left rail hidden off-canvas (`translateX(-100%)`); top bar (56px) displayed with hamburger toggle. | Set `isMobileOpen = false`. |
| `SHEET_CLOSED` | Tap Hamburger Button (`☰`) | `SHEET_OPEN` | Darkened backdrop fades in; `BaseAside` slides in to 280px width; stage scroll locked. | Trap focus inside drawer; add `aria-modal="true"`. |
| `SHEET_OPEN` | Tap Backdrop Overlay | `SHEET_CLOSED` | Backdrop fades out; `BaseAside` translates off-canvas; stage scroll restored. | Return focus to hamburger trigger. |
| `SHEET_OPEN` | Select Navigation Item | `SHEET_CLOSED` | Sheet dismisses immediately; router navigates to selected route. | Emit `select-item`; set `isMobileOpen = false`. |
| `SHEET_OPEN` | Press `Escape` Key | `SHEET_CLOSED` | Sheet dismisses immediately; backdrop removed. | Keyboard accessibility listener. |

---

## 4. Primary Funnel Telemetry State Machine

Governs reactive counter badges on primary acquisition funnel routes (`Leads`, `Pursued`, `Accounts`).

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Store Action |
| :--- | :--- | :--- | :--- | :--- |
| `COUNTS_IDLE` | Shell Mount | `COUNTS_LOADING` | Badge counter hidden or displays subtle neutral pulse. | Trigger initial background hydration `leadStore.fetchLeads()`. |
| `COUNTS_LOADING` | Store Hydrated | `COUNTS_HYDRATED` | Display live numeric values: Leads (`badge-primary`), Pursued (`badge-warning`), Accounts (`badge-emerald`). | Reactive Pinia getters: `poolCount`, `pursuedCount`, `clientsCount`. |
| `COUNTS_HYDRATED` | Lead Triaged / Pursued | `COUNTS_HYDRATED` | Counters update reactively without page reload. | Reactive computed state update in `BaseAside`. |
| `COUNTS_LOADING` | Network Error / Offline | `COUNTS_DEGRADED` | Badges gracefully hidden; rail links remain fully clickable. | Fallback to cached counts if present. |

---

## 5. Theme Palette State Machine

Governs dark/light mode toggle and document root styling.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Storage |
| :--- | :--- | :--- | :--- | :--- |
| `INIT_THEME` | Application Mount | `THEME_SYNCED` | Apply tokens from `theme.css`. | Read `localStorage.getItem('smb_ops_theme')` or system preference `prefers-color-scheme`. |
| `THEME_LIGHT` | Click `ThemeToggle.vue` | `THEME_DARK` | Document `<html data-theme="dark">` set; icon flips to 🌙. | `localStorage.setItem('smb_ops_theme', 'dark')` |
| `THEME_DARK` | Click `ThemeToggle.vue` | `THEME_LIGHT` | Document `data-theme` removed; icon flips to ☀️. | `localStorage.setItem('smb_ops_theme', 'light')` |

---

## 6. Route Navigation State Machine

Governs top-level view transitions inside `BasePageContainer`.

| Current State | Event / Trigger | Target State | UI Rendering Output | Side Effects / Router |
| :--- | :--- | :--- | :--- | :--- |
| `ROUTE_ACTIVE` | Click Nav Item (different route) | `NAVIGATING` | Active indicator shifts immediately to clicked nav item. | `router.push(item.to)` |
| `NAVIGATING` | Route Resolved | `ROUTE_ACTIVE` | New page component mounts inside `<RouterView />` wrapped in `BasePageContainer`. | Scroll stage container to top (`scrollTop = 0`). |
| `ROUTE_ACTIVE` | Click Nav Item (same route) | `NO_OP` | No transition or reload. | Prevent default redundant navigation. |
