---
title: "0003: Client Accounts Workspace Information Architecture"
tags: ["architecture", "information-architecture", "client-accounts", "to-be"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# 0003: Client Accounts Workspace Information Architecture

## 1. View Purpose & Operator Intent

* **Target View:** `/clients` (`HomeView.vue` `tab=clients`)
* **Operator Job-to-be-Done (JTBD):** "When I review my contracted SMB clients, I want to see their active contract type, recent continuity health (backups & uptime), and logged maintenance minutes, so I can ensure service delivery stays within agreed SLA boundaries."

## 2. Information Architecture Matrix

| View Component | Field / Data Point | Priority | Operational Rationale | Backend Source |
| :--- | :--- | :--- | :--- | :--- |
| **Client Grid Card** | Business Title | P0 | Primary identification of account | `client.business_name` |
| **Client Grid Card** | Lifecycle State Badge | P0 | `ONBOARDING`, `ACTIVE_RETAINER`, `FIXED_PROJECT`, `DORMANT` | `client.state` |
| **Client Grid Card** | Website / Domain | P0 | Production client target URL | `client.website_url` |
| **Client Grid Card** | Primary Contact | P1 | Direct client phone / email | `client.primary_contact_name` |
| **Client Grid Card** | Continuity Health Dot | P0 | Green (All Healthy), Amber (Overdue Backup), Red (Down) | `client.continuity_health.status` |
| **Client Grid Card** | Monthly Mins Used | P1 | Progress bar against 30-min retainer cap | `client.maintenance.used_minutes` |
| **Dossier Drawer** | Contract SOW / MSA | P0 | Legal contract links & service tier | `client.contracts[]` |
| **Dossier Drawer** | Billing Model | P0 | Rate ($99/mo or Fixed Fee) & Billing Cycle | `contract.billing_rate` |
| **Dossier Drawer** | Maintenance Log List | P1 | Historical audit trail of changes performed | `client.maintenance_logs[]` |
| **Dossier Drawer** | Continuity Diagnostics | P0 | Last backup timestamp, S3 bucket, SSL expiry | `client.continuity_health` |
