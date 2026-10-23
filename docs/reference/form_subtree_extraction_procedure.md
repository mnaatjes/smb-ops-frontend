---
title: "Form Sub-Tree Extraction Procedure (FEP)"
tags: ["diataxis", "reference", "procedures", "forms", "modals", "wizards"]
created_at: "2026-10-23"
last_updated_at: "2026-10-23"
---

# Form Sub-Tree Extraction Procedure (FEP)

A quick-scan operator runbook for deterministically extracting form sub-trees from modal shells into reusable pure primitives suitable for modal wrappers, multi-step wizards, and full-canvas workspaces.

---

## 1. Quick Decision Matrix

| Requirement | Correct Implementation | Prohibited Anti-Pattern |
|---|---|---|
| Reuse modal fields in a wizard | Extract to `*Form.vue` and import into `#step-N` slot | Duplicating raw inputs inside the wizard |
| Validate wizard step progression | Bind form `@valid-change` to wizard `:can-advance` | Coupling wizard state directly into modal logic |
| Trigger form submission | Form emits `@submit` upon form element submit event | Invoking DOM query selectors across modal shells |
| Inspect payload in Dev Workbench | Sanitize secrets to `***MASKED***` prior to display | Dumping raw password strings to stdout/UI |

---

## 2. Extraction Checklist

- [ ] **Step 1: Identify Invariants**
  - Extract: inputs, select dropdowns, labels, error states, layouts (`.modal-form-layout`, `.form-row-2col`).
  - Leave behind in modal: `BaseModal` shell, modal title, backdrop clicks, Escape listeners, footer action buttons.
- [ ] **Step 2: Create Pure Form (`[Feature]Form.vue`)**
  - Accept `modelValue?: Partial<PayloadType>` prop.
  - Define emits: `update:modelValue`, `valid-change`, `submit`.
  - Calculate `isValid` computed property based on required fields.
  - Emit initial validity on mount (`onMounted(() => emit('valid-change', isValid.value))`).
- [ ] **Step 3: Recompose Modal Wrapper**
  - Mount `<[Feature]Form>` inside `<BaseModal>`.
  - Pass form data via `v-model`.
  - Trigger form submit from footer button or emit save payload directly.
- [ ] **Step 4: Integrate with Wizard**
  - Mount `<[Feature]Form>` in wizard slot `<template #step-N>`.
  - Set `:can-advance="isStepValid"` based on `@valid-change`.
- [ ] **Step 5: Write Headless Assertion Suite**
  - Create `tests/unit/[Feature]Form.spec.ts`.
  - Test required field checks, valid emission, and submit emission.
