---
title: "0017: Client Accounts and Retainers Action Table"
status: "accepted"
date: "2026-11-05"
tags: ["architecture", "action-table", "interactions", "client-accounts", "retainers", "timecards", "drawers"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# 0017: Client Accounts and Retainers Action Table

## 1. Overview & Action Contracts

This action table specifies every user and programmatic action within the Client Accounts & Retainers workspace (`ClientAccountsView.vue`), defining user triggers, UI controls, preconditions, state modifications, and asynchronous Pinia/API dispatches.

---

## 2. Exhaustive Interaction Table

| Action ID | Trigger / Element | UI Component | Precondition | State Mutation / Store Call | Expected Visual Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ACT-CLIENTS-01` | Mount workspace route | Route navigation `/clients` | None | `store.loadClients()`, `store.loadServices()` | Stage renders with 4 KPI cards, filter pills, and client card deck |
| `ACT-CLIENTS-02` | Click state filter pill | Filter button group | Filter selected | `activeStateFilter = selected` | Deck filters to show only client accounts matching selected state |
| `ACT-CLIENTS-03` | Type in search input | Text input | User typing | `searchQuery = input.value` | Deck filters cards in real time by business name or contact |
| `ACT-CLIENTS-04` | Click client card | `BaseCard` `@click` | Target card exists | `selectedClient = client`, `isDossierOpen = true` | Slideout `ClientDossierDrawer` opens to 960px with profile, contracts, and vault |
| `ACT-CLIENTS-05` | Click "Open Dossier" button | `BaseButton` in card footer | Target card exists | `selectedClient = client`, `isDossierOpen = true` | `ClientDossierDrawer` opens displaying full client ledger |
| `ACT-CLIENTS-06` | Click "+ Log Work" button | `BaseButton` in card footer or dossier | Target client exists | `clientForLogWork = client`, `isLogWorkModalOpen = true` | `LogWorkModal` opens centered via `#modal-portal` |
| `ACT-CLIENTS-07` | Submit work log form | Submit in `LogWorkModal` | Minutes > 0 and desc present | `store.logWork(client.id, payload)` | Maintenance minutes logged; gauge updates; success banner displays |
| `ACT-CLIENTS-08` | Click "+ Attach Care Plan" button | `BaseButton` in card footer or dossier | Target client exists | `clientForContract = client`, `isAttachModalOpen = true` | `ContractAgreementModal` opens centered via `#modal-portal` |
| `ACT-CLIENTS-09` | Submit care plan contract form | Submit in `ContractAgreementModal` | Service code and rate valid | `store.attachContract(client.id, payload)` | Contract attached; card and dossier contract lists update |
| `ACT-CLIENTS-10` | Click "+ Add Secret" button | `BaseButton` in dossier header | Dossier open | `isAddSecretModalOpen = true` | `VaultSecretModal` opens for credential ingestion |
| `ACT-CLIENTS-11` | Submit vault secret form | Submit in `VaultSecretModal` | Valid credentials | `store.storeSecret(client.id, payload)` | Secret securely encrypted; appears masked in vault list |
| `ACT-CLIENTS-12` | Click "Run Diagnostics Ping" | `BaseButton` in dossier health panel | Dossier open | `store.pingContinuity(client.id)` | Health bullets refresh probe timestamps and uptime status |
| `ACT-CLIENTS-13` | Close client dossier drawer | Click overlay / Close button / `Escape` | Drawer open | `isDossierOpen = false`, `selectedClient = null` | Drawer slides closed with clean transition |
| `ACT-CLIENTS-14` | Dismiss alert banner | Click dismiss icon on `BaseAlert` | Alert banner visible | `successBanner = null` | Banner dismissed cleanly without layout shift |
