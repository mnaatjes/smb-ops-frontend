---
title: "0007: Client Credential Vault Action Table"
tags: ["architecture", "action-tables", "credentials", "vault", "secrets"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# 0007: Client Credential Vault Action Table

## 1. Flow Scope
This action table governs all operator actions when capturing, updating, revealing, and copying encrypted client credentials in the Onboarding Wizard and Client Dossier Drawer.

## 2. Deterministic Action Table

| Source View | Control / Trigger | Event / Intent | Backend Mutation | In-Flight State | Success Outcome | Error Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Onboarding Wizard | Click "Add Credential" | `ADD_CREDENTIAL_FORM` | None | None | Appends empty credential row (type, username, password) | None |
| Onboarding Wizard | Submit Onboarding | `ONBOARD_WITH_SECRETS`| `POST /api/clients/onboard` with `{ secrets: [...] }` | Button spinner | Client account created; secrets encrypted into vault; navigates to Client Accounts tab | Toast: "Failed to store client credentials" |
| Dossier Drawer | Click "Reveal" Eye Icon | `REVEAL_SECRET` | `POST /api/clients/:id/secrets/:id/reveal` | Inline skeleton/spinner | Masked dots replaced by plaintext password; 30s auto-hide countdown begins | Toast: "Failed to decrypt secret" |
| Dossier Drawer | Click "Copy Password" | `COPY_SECRET_TO_CLIPBOARD` | `POST /api/clients/:id/secrets/:id/reveal` (if masked) | Temporary checkmark icon | Plaintext copied to clipboard; toast: "Password copied (clears in 45s)" | Toast: "Clipboard access denied" |
| Dossier Drawer | Click "Hide" Eye Icon | `HIDE_SECRET` | None | None | Plaintext immediately cleared from local component ref; replaced by masked dots | None |
| Dossier Drawer | Click "Add New Secret" | `OPEN_ADD_SECRET_MODAL` | None | None | Opens `<AddSecretModal>` dialog | None |
| `<AddSecretModal>` | Submit New Secret | `SAVE_CLIENT_SECRET` | `POST /api/clients/:id/secrets` | Save button spinner | Secret persisted in vault; appended to dossier secrets list; modal closes | Form validation alert |
| Dossier Drawer | Click "Delete Secret" | `DELETE_SECRET` | `DELETE /api/clients/:id/secrets/:id` | Button spinner | Row removed from vault and dossier list | Toast: "Failed to delete secret" |
