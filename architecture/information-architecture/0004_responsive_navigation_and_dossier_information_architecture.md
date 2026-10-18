---
title: "0004: Responsive Navigation and Dossier Information Architecture"
tags: ["architecture", "information-architecture", "mobile", "navigation", "dossier"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# 0004: Responsive Navigation and Dossier Information Architecture

## 1. View Purpose & Operator Intent

* **Target View:** All Workspaces (`/pool`, `/pipeline`, `/clients`, `/services`, `/doctrine`) across mobile (< 768px), tablet (768px–1023px), and desktop ($\ge$ 1024px).
* **Operator Job-to-be-Done (JTBD):** "When I inspect the SMB Ops dashboard in the field on my phone or tablet, I want immediate one-thumb access to all workspaces via a mobile hamburger drawer, an uncluttered icon rail on tablet, and a full-screen optimized client dossier, so that I can triage leads and inspect client maintenance without horizontal distortion."

## 2. Information Architecture & Priority Matrix

| View Component | Element / Field | Mobile (< 768px) | Tablet (768px-1023px) | Desktop ($\ge$ 1024px) | Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Top Mobile Header** | Hamburger Trigger `☰` | P0 (Visible, fixed top) | Hidden | Hidden | One-touch trigger for navigation drawer |
| **Top Mobile Header** | Brand Title & Icon | P0 (Compact inline) | Hidden | Hidden | Brand orientation |
| **Top Mobile Header** | Theme Toggle | P1 (Header action) | In Aside Rail | In Aside Rail | Quick dark mode switch |
| **Aside Nav Rail** | Brand Banner | In Flyout Drawer | Icon Only | Full (Icon + Text) | Space conservation |
| **Aside Nav Rail** | Nav Links (Workspaces) | Full in Flyout Drawer | Icon + Tooltip | Full Label + Badge | Touch friendly in drawer |
| **Aside Nav Rail** | Badges (Counts) | Visible in Drawer | Floating Badge Dot | Full Pill Badge | Quick glance metrics |
| **Dossier Drawer** | Container Width | 100vw (Full Screen) | 480px / 75vw | 540px | Elimination of horizontal cutoff |
| **Dossier Drawer** | Header Close Button | P0 (Enlarged 44px target) | Standard Button | Standard Button | Mobile touch target standard |
| **Dossier Drawer** | Maintenance Gauge | P0 (Full width bar) | P0 (Full width bar) | P0 (Full width bar) | Essential monthly SLA quota |
| **Dossier Drawer** | Telemetry Grid | P0 (Single column stack) | 2-Column Grid | 2-Column Grid | Prevents text wrapping breaks |
| **Triage / Grids** | Discovery Cards / Rows | Responsive Card Stack | Responsive Card Stack | Full Table / Grid | Touch-friendly row tap |
