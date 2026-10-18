---
title: "0015: Client Website Credential and Secret Vault"
status: "accepted"
date: "2026-10-18"
tags: ["adr", "frontend", "security", "vault", "credentials", "dossier", "onboarding"]
---

# 0015: Client Website Credential and Secret Vault

## Context and Problem Statement
When onboarding a client or performing regular retainer maintenance, operators require administrative access to the client's web infrastructure (WordPress Admin, hosting dashboard, SFTP/SSH, domain registrar). Currently, the onboarding workflow captures only contact information and service tier selections; credentials are omitted, leading to fragmented, insecure out-of-band communication.

## Decision Drivers
* Strict end-to-end security: credentials are never logged or persisted in frontend client storage.
* Seamless ingestion during the onboarding wizard flow (`ClientOnboardingModal.vue`).
* High-security inspection panel inside `ClientDossierDrawer.vue` with masked values, audited one-click reveal, and clipboard copying.
* Explicit auto-timeout for revealed passwords to prevent shoulder-surfing in public/field environments.

## Considered Options
1. **Third-Party Password Manager Deep Link (1Password / Bitwarden):**
   * *Rejected:* Requires every client to be provisioned in a secondary enterprise vault before onboarding can complete.
2. **Integrated Zero-Leakage Frontend Vault UI (Integrated with Backend Encrypted Port):**
   * *Chosen:* Provide an integrated credential management tab and onboarding step with masked inputs, immediate backend TLS encryption, and 30-second transient reveal timeouts.

## Decision Outcome
Chosen Option: **Integrated Zero-Leakage Frontend Vault UI (Option 2)**.

### Architectural Invariants:
1. **Onboarding Integration (`features/client-onboarding/ClientOnboardingModal.vue`):**
   * Introduce Step 4: "Infrastructure Access & Credentials" supporting multiple dynamic entries (`secret_type`, `label`, `login_url`, `username`, `password`).
2. **Dossier Inspection (`features/client-dossier/ClientDossierDrawer.vue`):**
   * Add dedicated "Credentials & Secrets Vault" section.
   * Render entries with masked dots (`••••••••••••`).
   * Clicking "Reveal" or "Copy" dispatches an audited call to `POST /api/clients/:id/secrets/:id/reveal`.
   * Plaintext state is stored strictly in transient Vue component `ref` memory and purged after 30 seconds via `setTimeout`.
