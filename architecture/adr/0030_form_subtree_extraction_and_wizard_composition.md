---
title: "ADR-0030: Form Sub-Tree Extraction and Wizard/Modal Composition Procedure"
status: "accepted"
date: "2026-10-23"
tags: ["adr", "architecture", "forms", "modals", "wizards", "composition", "security"]
deciders: ["Engineering Lead", "Frontend Architect"]
consulted: ["UX Engineering"]
informed: ["Full Engineering Team"]
---

# ADR-0030: Form Sub-Tree Extraction and Wizard/Modal Composition Procedure

## Context and Problem Statement

In `smb-ops-frontend`, modal dialogs (e.g. `VaultSecretModal.vue`, `ContractAgreementModal.vue`) historically encapsulated their input fields, validation rules, category options, and layouts directly within their modal shell (`BaseModal`).

When multi-step sequential workflow engines (`BaseWizard.vue`, `ModalWizard.vue`, `ClientOnboardingModal.vue`) require the same input sets (e.g., configuring vault credentials during onboarding), engineering faced an architectural dilemma:
1. Nesting the modal directly inside a wizard step breaks UI ergonomics (nested backdrops, conflicting scroll locks, double cancel/submit buttons, layout clipping).
2. Duplicating the inputs directly inside the wizard creates schema drift, divergent validation logic, inconsistent styling, and security maintenance overhead.
3. Emitted wizard payloads displayed in living workbenches or debugging logs leaked plain-text credentials (`password: "..."`).

We require a deterministic, enforced architectural procedure for extracting any modal's form sub-tree into a reusable, pure presentation primitive that can be composed seamlessly into standalone modals, full-page canvases, or wizard steps.

## Decision Drivers

* **Single Source of Truth:** Field definitions, placeholder copy, category schemas, and validation contracts must be defined once.
* **Ergonomic Composition:** Modals must remain pure dialog overlays; wizards must remain pure sequential workflows.
* **Deterministic Procedure:** Any engineer must follow an identical 5-step extraction pipeline to decouple forms without regression.
* **Telemetry & Security Hygiene:** Raw secrets are strictly bounded to encrypted API dispatches; client audit sinks and workbench inspection canvases must deterministically mask credentials (`***MASKED***`).
* **Headless Testability:** Forms must have isolated, headless assertion matrices verified via Vitest without needing to mount entire modal or wizard shells.

## Considered Options

1. **Inline Field Duplication:** Hand-roll separate input fields in wizard steps matching the modal.
2. **Dynamic In-Modal Nesting:** Mount the full modal inside the wizard step with CSS overrides hiding the backdrop.
3. **Deterministic Form Sub-Tree Extraction (FEP):** Decouple dialog shells (`BaseModal`) from input logic by creating standalone, pure form primitives (`*Form.vue`) consumed symmetrically by modals and wizards.

## Decision Outcome

Chosen option: **Option 3: Deterministic Form Sub-Tree Extraction (FEP)**.

### The 5-Step Extraction Procedure

```
+-----------------------------------------------------------------------------------+
|                           1. BOUNDARY IDENTIFICATION                              |
|   Shell Invariants: Title, backdrop, dismiss guards, Escape listener, buttons     |
|   Form Invariants:  Inputs, validation state, layout (.modal-form-layout)         |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        2. SUB-TREE EXTRACTION (*Form.vue)                         |
|   - Expose v-model (reactive payload contract)                                    |
|   - Emit: @update:modelValue, @submit, @valid-change                              |
|   - Encapsulate scoped layout styling (.form-row-2col)                            |
+-----------------------------------------+-----------------------------------------+
                                          |
                     +--------------------+--------------------+
                     v                                         v
+----------------------------------------+ +----------------------------------------+
|        3. MODAL RECOMPOSITION          | |       4. WIZARD STEP INTEGRATION       |
|  - Embed <*Form> in BaseModal body     | |  - Embed <*Form> in Wizard #step-N slot|
|  - Modal footer triggers submit        | |  - Bind canAdvance to form validity    |
+--------------------+-------------------+ +--------------------+-------------------+
                     |                                         |
                     +--------------------+--------------------+
                                          v
+-----------------------------------------------------------------------------------+
|                    5. PAYLOAD CONTRACT & AUDIT HARMONIZATION                      |
|  - Shared TypeScript Interface (e.g. ClientSecretPayload)                         |
|  - Telemetry Sanitization: Mask passwords in client inspection/workbench views    |
+-----------------------------------------------------------------------------------+
```

### Invariants Enforced by FEP

1. **Zero Shell Contamination in Forms:** A `*Form.vue` component must **never** import `BaseModal`, render backdrops, or handle Escape key events.
2. **Two-Way Contract Binding:** Forms must support `v-model` with structured payload objects conforming to `src/shared/types/`.
3. **Reactive Validation Signal:** Forms must compute validity and emit `(e: 'valid-change', isValid: boolean)` to enable step gating in `BaseWizard` (`:can-advance="isStepValid"`).
4. **Client-Side Secret Masking:** Any component or view presenting emitted payloads (`DevComponentsView.vue`, audit ledgers) must apply masking utilities before JSON serialization.

## Consequences

### Positive
* Perfect behavioral and visual parity between modals and wizards.
* Clean headless assertion testing on the form component alone (`tests/unit/VaultSecretForm.spec.ts`).
* Hardened credential protection across visual inspection workbenches.

### Negative
* Requires maintaining separate form and modal wrapper files for each feature dialogue.
