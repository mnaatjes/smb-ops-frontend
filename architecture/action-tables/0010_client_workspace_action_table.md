---
title: "Action Table: Client Account Full-Canvas Workspace"
tags: ["action-table", "client-accounts", "interactions"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# Action Table: Client Account Full-Canvas Workspace

## Overview

This table enumerates user-initiated operational triggers within the full-canvas client account workspace (`ClientDossierDrawer.vue`).

| Component / Trigger | Event / User Action | Pre-conditions | Resulting State & Side Effects |
| :--- | :--- | :--- | :--- |
| **Close Button / Esc** | Click `✕` or press `Esc` | Workspace visible | Emits `close` event; clears active timers; closes overlay. |
| **Log Work Button** | Click `+ Log Work` | Client loaded | Emits `log-work` event with current client payload; launches work logging modal. |
| **Diagnostics Ping Button**| Click `Run Diagnostics Ping` | Not currently pinging | Sets `pingingContinuity = true`; invokes `pingContinuity()`; updates SLA status bullets. |
| **Add Secret Button** | Click `+ Add Secret` | None | Opens `BaseModal` credential form with auto-filled WordPress URL if applicable. |
| **Save Secret Submit** | Click `Save Credential` | Valid label & password | Sets `savingSecret = true`; encrypts payload; appends new metadata to `secrets` list. |
| **Audit Reveal Password** | Click `Reveal (Eye)` | Inactive reveal | Fetches decrypted secret; sets 15s interval countdown; displays plaintext. |
| **Hide Password** | Click `Hide` | Active reveal | Clears timer; resets secret display to masked dots `••••••••`. |
| **Purge Secret** | Click `Delete (Trash)` | Confirmed prompt | Invokes `deleteClientSecret()`; removes item from `secrets` list. |
