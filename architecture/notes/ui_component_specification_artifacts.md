---
title: "Industry Standard Artifacts for UI Component Specification"
tags: ["frontend", "architecture", "ui", "testing", "governance", "standards"]
created_at: "2026-10-22"
last_updated_at: "2026-10-22"
---

# Industry Standard Artifacts for UI Component Specification

This reference note articulates how component-level features, ergonomics, and layouts are formally documented and verified across modern frontend engineering organizations without introducing Gherkin testing anti-patterns.

---

## 1. Executive Summary & Plane Separation

While business workflows and user journeys are articulated through high-level acceptance criteria (e.g. Gherkin or UAT checklists), discrete UI components (primitives, frames, compound controls, and transactional feature modals) must **never** be specified using Gherkin. 

Component engineering decouples **Contract & Layout Declaration** from **Behavioral Invariant Verification** across four industry-standard artifacts:

| # | Artifact | Governing Layer | Standard / Tooling | Primary Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Component Story Format (CSF 3.0)** | Living Visual Catalog | Storybook / Workbench (`/dev/components`) | Visual ergonomics, edge-case variant preview, isolated play-function tests |
| **2** | **Interface Boundary Contracts** | Compile-Time AST | TypeScript `Props`, `Emits`, `Slots` | Strict structural input/output typing, payload schema validation |
| **3** | **Behavioral Assertion Matrices** | Headless Testing | Vitest / Jest + Testing Library | Ergonomic invariants (DOM lifecycle, keyboard traps, event bubbling) |
| **4** | **Diataxis Reference Ledgers** | Human Architecture | Markdown in `docs/reference/` | Anatomy diagrams, CSS token dictionaries, explicit anti-patterns |

---

## 2. Artifact 1: Component Story Format (CSF 3.0 & Living Workbenches)

### 2.1 The Standard
The OpenJS Foundation's **Component Story Format (CSF)** is the canonical industry standard for expressing component states outside the context of a production application. In stacks without a standalone Storybook build pipeline, an in-app developer workbench (such as `http://localhost:8090/dev/components`) fulfills this role.

### 2.2 Concrete Manifestation
A component story or workbench entry formally enumerates all discrete visual states:
* **Default State:** Nominal props with standard theme variables.
* **Loading State:** Active spinner transitions, button text masking, and click suppression.
* **Disabled State:** Opacity reduction, cursor override, and event termination.
* **Overflow / Boundary State:** Extreme string lengths, zero-item empty states, or maximum viewport constraints.

```typescript
// Example: Component Story Format (CSF 3.0)
import type { Meta, StoryObj } from '@storybook/vue3'
import BaseButton from '@/shared/ui/BaseButton.vue'

const meta: Meta<typeof BaseButton> = {
  title: 'Primitives/BaseButton',
  component: BaseButton,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    buttonType: { control: 'select', options: ['button', 'submit', 'reset'] }
  }
}
export default meta

export const LoadingState: StoryObj<typeof BaseButton> = {
  args: {
    label: 'Saving Changes',
    loading: true,
    variant: 'primary'
  }
}
```

---

## 3. Artifact 2: Interface Boundary Contracts (TypeScript AST)

### 3.1 The Standard
Modern UI architecture uses strict, compile-time AST interface definitions to govern component data ingress and egress. Runtime errors and silent schema divergences are prevented entirely at build time.

### 3.2 Concrete Manifestation
Every component must formally declare its boundary interfaces:
1. **Props (`defineProps`):** Explicit data types, mandatory vs. optional flags, and sensible defaults (`withDefaults`).
2. **Emits (`defineEmits`):** Strongly typed event names paired with strictly typed payload schemas.
3. **Slots (`$slots`):** Documented template injection points (header, body, footer actions).

```typescript
// Example: Strict Component Interface Contract
export interface ContractAgreementModalProps {
  show: boolean
  services: ServiceCatalogItem[]
  clientId?: string
  clientName?: string
  initialServiceCode?: string
  isSaving?: boolean
}

export interface ContractAgreementModalEmits {
  (e: 'close'): void
  (e: 'save', payload: AttachContractPayload): void
}
```

---

## 4. Artifact 3: Behavioral Assertion Matrices (Unit Specs)

### 4.1 The Standard
Unit specs written in Vitest / Vue Test Utils / Testing Library represent the technical counterpart to Gherkin, operating at the component level with millisecond execution speed.

### 4.2 Concrete Manifestation
Instead of testing business logic, the assertion matrix validates **ergonomic and structural invariants**:
* **DOM Presence:** Component renders nothing when `show: false`; injects into `<body>` via `<Teleport>` when `show: true`.
* **Keyboard Ergonomics:** Triggering `Escape` on `window` dispatches `@close`.
* **Event Propagation:** Clicking the backdrop emits `@close`; clicking inside the inner card stops propagation.
* **Body Scroll Locking:** Modals toggle `document.body.style.overflow = 'hidden'` on mount and restore it on teardown.
* **Geometric Invariants:** Max-width constraints ($\le 640$px) and centered flexbox layouts.

```typescript
// Example: Behavioral Assertion Matrix
describe('BaseModal Component Matrix', () => {
  it('Invariant 1: Does not render in DOM when show is false', () => { ... })
  it('Invariant 2: Emits @close event on Escape key trigger', () => { ... })
  it('Invariant 3: Does NOT emit @close when clicking inner card', () => { ... })
  it('Invariant 4: Enforces document.body scroll lock while active', () => { ... })
})
```

---

## 5. Artifact 4: Diataxis Component Reference Ledgers

### 5.1 The Standard
Authoring human-facing architecture ledgers under `docs/reference/` (following the Diataxis documentation framework).

### 5.2 Concrete Manifestation
Reference ledgers record design decisions and explicit boundaries that cannot be captured in code alone:
* **Token Dictionaries:** Mapping semantic states to CSS variables (`--bg-surface`, `--accent-primary`).
* **Anatomy Breakdown:** Structural diagrams detailing container margins, padding tiers, and flex directions.
* **What a Component IS vs. What a Component is NOT (Anti-Patterns):**
  * *Example (Modal IS):* Transactional single-focus dialog, centered, $\le 640$px, dismissible.
  * *Example (Modal is NOT):* Persistent dashboard, full-canvas workspace drawer (`calc(100vw - 260px)`), or nested child container.

---

## 6. Anti-Pattern Warning: Gherkin at the Component Level

Applying Gherkin (`Given I see button "Cancel" / When I click button...`) to discrete UI components creates severe engineering dysfunction:
1. **High Fragility / Low Value:** Minor CSS adjustments or internal refactors break Gherkin selectors without signifying business regressions.
2. **False Sense of Coverage:** Gherkin excels at validating user goals, but fails to test edge cases like focus traps, DOM cleanup, event bubbling, and keyboard listeners.
3. **Execution Latency:** End-to-end browser runners (Playwright/Cypress) take seconds per scenario, whereas headless unit matrices run in milliseconds.
