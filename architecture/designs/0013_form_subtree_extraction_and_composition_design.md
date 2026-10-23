---
title: "SDD-0013: Form Sub-Tree Extraction and Composition Specification"
status: "approved"
date: "2026-10-23"
tags: ["sdd", "software-design", "forms", "modals", "wizards", "vue", "architecture"]
author: "Engineering Lead"
governs: ["src/features/*/components/*Form.vue", "src/shared/ui/BaseWizard.vue", "src/shared/ui/BaseModal.vue"]
---

# SDD-0013: Form Sub-Tree Extraction and Composition Specification

## 1. Context & Scope

This specification operationalizes the architecture established in **ADR-0030 (Form Sub-Tree Extraction and Wizard/Modal Composition Procedure)**. It defines the component interaction contracts, reactive data flows, validation lifecycle, and headless assertion matrices required to extract form sub-trees from modal shells and compose them across wizards and dialogs.

---

## 2. Structural Decomposition

```
                              +-----------------------+
                              |   TypeScript Types    |
                              |  ClientSecretPayload  |
                              +-----------+-----------+
                                          |
                      +-------------------+-------------------+
                      |                                       |
                      v                                       v
         +-------------------------+             +-------------------------+
         |   VaultSecretModal      |             |  ClientOnboardingModal  |
         |   (BaseModal Shell)     |             |  (ModalWizard Shell)    |
         +------------+------------+             +------------+------------+
                      |                                       |
                      | (Modal Body)                          | (#step-3 Slot)
                      +-------------------+-------------------+
                                          |
                                          v
                              +-----------------------+
                              |   VaultSecretForm     |
                              |  - Category Dropdown  |
                              |  - Label & Login URL  |
                              |  - Username & Password|
                              |  - Reactive Validation|
                              +-----------------------+
```

---

## 3. Formal 5-Step Extraction Lifecycle

### Step 1: Boundary Identification
Identify and decouple structural elements:
- **Shell Invariants:** Title, backdrop, dismiss guards, Escape listener, submit/cancel footer buttons (`BaseModal`).
- **Form Sub-Tree Invariants:** Field models, validation rules, category options, field layout classes (`.modal-form-layout`, `.form-row-2col`).

### Step 2: Form Sub-Tree Extraction (`*Form.vue`)
Create a standalone component in the governing feature folder (e.g. `src/features/client-vault/VaultSecretForm.vue`).
- **Props Interface:**
  ```typescript
  defineProps<{
    modelValue?: Partial<ClientSecretPayload>
    disabled?: boolean
  }>()
  ```
- **Emits Contract:**
  ```typescript
  defineEmits<{
    (e: 'update:modelValue', payload: ClientSecretPayload): void
    (e: 'valid-change', isValid: boolean): void
    (e: 'submit', payload: ClientSecretPayload): void
  }>()
  ```
- **Internal Reactivity & Validation:**
  - Track fields with `ref()` and sync with `props.modelValue`.
  - Provide a computed `isValid = computed(() => Boolean(label.value.trim() && username.value.trim() && password.value.trim()))`.
  - Watch `isValid` and emit `'valid-change'` on state transitions.

### Step 3: Modal Recomposition (`*Modal.vue`)
Replace the modal body markup with the extracted form:
```html
<BaseModal :show="show" :title="modalTitle" @close="$emit('close')">
  <VaultSecretForm
    ref="formRef"
    v-model="formData"
    @valid-change="(valid) => isFormValid = valid"
    @submit="handleSave"
  />

  <template #footer>
    <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
    <BaseButton label="Save Secret" variant="primary" :disabled="!isFormValid" @click="triggerSubmit" />
  </template>
</BaseModal>
```

### Step 4: Wizard Step Integration (`*Wizard.vue`)
In the parent wizard component, bind the form directly into the target step template slot:
```html
<ModalWizard :show="show" :steps="wizardSteps" :can-advance="isCurrentStepValid">
  <template #step-3>
    <VaultSecretForm
      v-model="wizardSecretData"
      @valid-change="handleSecretValidation"
    />
  </template>
</ModalWizard>
```

### Step 5: Payload Contract & Sanitization Boundary
- Dispatched payload retains raw credentials for backend database encryption.
- Telemetry, living workbenches (`/dev/components`), and audit logs must sanitize payloads:
  ```typescript
  function sanitizePayloadForAudit<T extends Record<string, any>>(payload: T): T {
    const copy = JSON.parse(JSON.stringify(payload))
    if (copy.password) copy.password = '***MASKED***'
    if (Array.isArray(copy.secrets)) {
      copy.secrets = copy.secrets.map((s: any) => ({ ...s, password: '***MASKED***' }))
    }
    return copy
  }
  ```

---

## 4. Headless Assertion Matrix Requirements

The extracted form must satisfy an independent headless Vitest suite testing:
1. Nominal rendering of all defined form fields.
2. Initial emit of `'valid-change'` reflecting initial state.
3. Reactivity on input modification (`@update:modelValue` emitted).
4. Validation state transition to `true` when required fields are satisfied.
5. Direct submission emission on Enter or programmatic submit trigger.
