---
title: "0018: Client Dossier Overlay Action Table"
status: "accepted"
date: "2026-11-05"
tags: ["architecture", "action-table", "interactions", "client-dossier", "overlay", "timecards", "vault"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# 0018: Client Dossier Overlay Action Table

## 1. Overview & Action Contracts

This action table specifies every user and programmatic action within the Client Dossier Overlay (`ClientDossierDrawer.vue`), defining user triggers, UI controls, preconditions, state modifications, and asynchronous Pinia/API dispatches.

---

## 2. Exhaustive Interaction Table

| Action ID | Trigger / Element | UI Component | Precondition | State Mutation / Store Call | Expected Visual Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ACT-DOSSIER-01` | Mount drawer overlay | `props.show === true` | `client !== null` | `loadTelemetry()` (`getTimecard`, `getContinuity`, `getClientSecrets`) | Slideout mounts across `calc(100vw - 260px)`; displays loader then cards |
| `ACT-DOSSIER-02` | Click "Run Diagnostics Ping" | `BaseButton` in continuity panel | Diagnostics not in progress | `pingingContinuity = true; store.pingContinuity(client.id)` | Button disables with loading state; health bullets update with timestamps |
| `ACT-DOSSIER-03` | Toggle contract accordion | Click contract card header | Target contract exists | `expandedContractIds[c.id] = !expandedContractIds[c.id]` | Accordion chevron rotates; discrete deliverables checklist expands/collapses |
| `ACT-DOSSIER-04` | Toggle deliverable completion | Checkbox on action item | Contract expanded | `contractActionStates[c.id][idx].completed = !state` | Checkbox toggles; counter increments; state persists to `localStorage` |
| `ACT-DOSSIER-05` | Click "+ Tag Commit UUID" | Button on action item | Target deliverable exists | `editingCommitContractId = c.id; editingCommitActionIdx = idx` | Text input opens inline with "Save" and "Cancel" buttons |
| `ACT-DOSSIER-06` | Save git commit SHA | Click "Save" on commit row | Valid SHA string | `contractActionStates[c.id][idx].commitUuid = val` | Input closes; commit SHA badge appears with link icon |
| `ACT-DOSSIER-07` | Click "+ Log Work" button | `BaseButton` in header or timecard | Client account active | `emit('log-work', client, hasActiveCarePlan)` | Event emitted to workspace; `LogWorkModal` opens centered |
| `ACT-DOSSIER-08` | Click "+ Attach Care Plan" button | `BaseButton` in contracts panel | Client account active | `emit('attach-contract', client)` | Event emitted to workspace; `ContractAgreementModal` opens centered |
| `ACT-DOSSIER-09` | Click "+ Add Secret" button | `BaseButton` in vault panel | Client account active | `emit('add-secret', client)` | Event emitted to workspace; `VaultSecretModal` opens centered |
| `ACT-DOSSIER-10` | Click "Reveal (15s)" button | Button on secret card | Secret masked | `activeReveals[sec.id] = { plaintext, 15 }` | Plaintext replaces masked dots; 15s badge countdown decrements to 0 |
| `ACT-DOSSIER-11` | Click "Copy" on revealed secret | Button on secret card | Plaintext revealed | `navigator.clipboard.writeText(plaintext)` | Copy button displays checkmark confirmation |
| `ACT-DOSSIER-12` | Click "Purge Secret" icon | Button on secret card | Target secret exists | `store.deleteSecret(client.id, sec.id)` | Secret purged from vault; removed from credentials list |
| `ACT-DOSSIER-13` | Click close button / Press `Escape` | Header `✕` button or `Escape` key | Drawer open | `emit('close')` | Interval timers cleared; drawer slides out cleanly |
