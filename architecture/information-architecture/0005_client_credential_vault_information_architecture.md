---
title: "0005: Client Credential Vault Information Architecture"
tags: ["architecture", "information-architecture", "credentials", "vault", "secrets"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# 0005: Client Credential Vault Information Architecture

## 1. View Purpose & Operator Intent

* **Target Views:**
  * `ClientOnboardingModal.vue`: Step 4 "Access & Infrastructure Credentials".
  * `ClientDossierDrawer.vue`: "Infrastructure & Secret Vault" section.
* **Operator Job-to-be-Done (JTBD):** "When I manage a client's digital presence, I want to securely access their WordPress admin, hosting panel, and registrar logins without searching through unsecured emails or text files, so that I can perform maintenance rapidly and confidentially."

## 2. Information Architecture Matrix

| View Component | Field / Data Point | Priority | Privacy / Security Rule | Backend Source |
| :--- | :--- | :--- | :--- | :--- |
| **Dossier Vault Card** | Secret Category Icon & Label | P0 | Public metadata (e.g. `WordPress Admin`, `cPanel`) | `secret.secret_type` |
| **Dossier Vault Card** | Login URL / Endpoint | P0 | Formatted clickable external link | `secret.endpoint_url` |
| **Dossier Vault Card** | Username / Identifier | P0 | Visible in plain text (e.g. `admin@smb.com`) | `secret.username` |
| **Dossier Vault Card** | Password Value | P0 | **Masked by default (`••••••••`)**; only exposed on audited reveal | `POST /api/clients/:id/secrets/:key/reveal` |
| **Dossier Vault Card** | Copy Button | P0 | Copies decrypted password directly to clipboard | Client-side transient clipboard API |
| **Dossier Vault Card** | Last Updated Timestamp | P1 | Audit trail (e.g. `Updated 3 days ago`) | `secret.updated_at` |
| **Onboarding Step** | Credential Input Form | P0 | Password fields use `type="password"` with show/hide toggle | Submitted via TLS POST |
| **Onboarding Step** | Scope Guidance Note | P1 | Clarifies why credentials are encrypted at rest | Static documentation banner |
