---
title: "0005: Client Accounts Action Table"
tags: ["architecture", "action-tables", "client-accounts", "to-be"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# 0005: Client Accounts Action Table

## 1. Flow Scope
This action table governs all operator interactions within the Client Accounts workspace tab (`tab=clients`), dossier drawer, and maintenance logging workflows.

## 2. Deterministic Action Table

| Source View | Control / Trigger | Event / Intent | Backend Mutation | In-Flight State | Success Outcome | Error Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `tab=pipeline` | Click "Convert to Client" | `CONVERT_LEAD` | `POST /api/leads/:id/convert` | Button spinner | Lead removed from pipeline; client instantiated in `ONBOARDING` state; navigates to `tab=clients` | Toast: "Conversion failed" |
| `tab=clients` | Click Client Card | `INSPECT_CLIENT` | `GET /api/clients/:id` | Drawer loading spinner | Opens `<ClientDossierDrawer>` with contracts, SLA status, and maintenance logs | Toast: "Failed to load client details" |
| Dossier Drawer | Click "+ Log Work" | `OPEN_MAINTENANCE_MODAL` | None | None | Opens `<LogMaintenanceModal>` with minute counter | None |
| `<LogMaintenanceModal>` | Submit Work Form | `RECORD_MAINTENANCE` | `POST /api/clients/:id/maintenance` `{ minutes, description }` | Submit button spinner | Appends log entry, updates monthly minutes progress gauge, closes modal | Inline form error alert |
| Dossier Drawer | Click "Add Contract SOW" | `OPEN_ADD_CONTRACT_MODAL` | None | None | Opens `<AddContractModal>` | None |
| Dossier Drawer | Click "Trigger Health Ping" | `TRIGGER_CONTINUITY_CHECK`| `POST /api/clients/:id/health-check` | Refresh spinner | Updates SSL and uptime status badges | Toast: "Continuity check timed out" |
