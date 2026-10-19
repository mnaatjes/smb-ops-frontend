---
title: "Software Design Document: Client Account Full-Canvas Workspace UI"
tags: ["design", "ui", "client-accounts", "workspace", "timecard", "vault"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# Software Design Document: Client Account Full-Canvas Workspace UI

## 1. System Overview

`ClientDossierDrawer.vue` is refactored into a full-canvas dual-column workspace overlay that occupies the entire primary viewport area adjacent to the 260px left navigation rail (`calc(100vw - 260px)`).

## 2. Layout & Spatial Architecture

The workspace consists of a fixed top header and two scroll-isolated columns:

```
+-----------------------------------------------------------------------------------------------+
| Header: [Client Accounts / CLIENT-ID]  <Business Name> [State Badge]         [Log Work] [✕]  |
+-------------------------------------------------------+---------------------------------------+
| Column 1: Context & Telemetry (44%)                   | Column 2: Operations & Vault (56%)    |
|                                                       |                                       |
| 1. Account Profile (Contact info, Website)            | 1. Monthly Retainer Timecard          |
| 2. Continuity & SLA Health Probes                     |    - MaintenanceGauge component       |
|    - Diagnostics Ping Trigger                         |    - Recent Maintenance Entries Log   |
|    - SSL / Uptime / Backup status                     | 2. Credentials & Access Vault         |
| 3. Active Service Contracts List                      |    - "+ Add Secret" Modal Trigger     |
|                                                       |    - Encrypted Secret Cards           |
|                                                       |    - 15s Masked / Plaintext Reveal    |
+-------------------------------------------------------+---------------------------------------+
```

## 3. Structural Grid Breakdown

### Column 1 (Left - 44% width)
* **Panel: Account Profile:** Key/value metadata grid for Primary Contact, Email, Phone, and external Website URL.
* **Panel: Continuity & SLA Health:** Telemetry cards displaying health probe bullets (SSL valid, Uptime operational/degraded, Weekly backup bucket), timestamp of last probe, and interactive "Run Diagnostics Ping" action.
* **Panel: Active Service Contracts:** Card list showing contracted service codes, rates, frequency, and active status.

### Column 2 (Right - 56% width)
* **Panel: Monthly Retainer Timecard:** Houses `MaintenanceGauge` illustrating minutes logged vs. contract cap. Displays list of maintenance log entries (author, date, minutes spent, description).
* **Panel: Credentials & Access Vault:** Ingestion interface for client credentials. Each card features secret type badge, label, username, login URL, and password reveal button with automatic 15-second timeout and purge button.

## 4. Theme & Design Token Integration

* Uses standard application design tokens: `var(--color-surface)`, `var(--color-background)`, `var(--color-border)`, `var(--color-text)`, and `var(--color-primary)`.
* Fully responsive with fallback single-column stacking for mobile viewports below 1024px.
