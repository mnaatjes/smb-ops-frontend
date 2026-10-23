---
title: "Headless Assertion Matrix in Vitest: Procedure & Reference Guide"
tags: ["diataxis", "reference", "testing", "vitest", "headless", "invariants", "procedure"]
created_at: "2026-10-23"
last_updated_at: "2026-10-23"
---

# Headless Assertion Matrix in Vitest: Procedure & Reference Guide

This reference guide establishes the canonical authoring procedure, invariant taxonomy, archetype matrices, and copy-paste templates for writing **Headless Assertion Matrices in Vitest** (`tests/unit/*.spec.ts`) as mandated by **ADR-0029** and **SDD-0012**.

---

## 1. Core Principles & Plane Boundaries

Component testing in `smb-ops-frontend` adheres to strict plane separation:

1. **Behavior & Structural Invariants (Vitest):**
   - Headless DOM execution via JSDOM and `@vue/test-utils`.
   - Runs in milliseconds; strictly decoupled from pixel rendering.
   - Asserts DOM presence, input/output contracts, typed payloads, keyboard triggers, and event suppression.
2. **Visual Layout & Theme Presentation (Living Workbench):**
   - Live browser execution via `/dev/components` (`DevComponentsView.vue`).
   - Verifies scoped CSS variables, margins, flexbox alignment, and theme switches.
3. **End-to-End User Journeys (Gherkin & Playwright):**
   - High-level business acceptance criteria in `tests/e2e/specs/`.
   - Exercises multi-screen business flows; never targeted at individual UI components.

> [!IMPORTANT]
> **Unit Test Invariant Rule:** Never assert computed CSS styles (hex colors, padding, margins, font sizes) in Vitest. JSDOM does not compute a layout cascade. Only assert semantic state classes (e.g., `.input-error`, `.is-active`), HTML attributes (`disabled`, `type="submit"`), and DOM insertion/removal.

---

## 2. The 5-Tier Invariant Taxonomy

When authoring a headless assertion matrix for any component, evaluate the following five structural tiers:

1. **Tier 1: DOM Lifecycle Invariants**
   - Does the component mount conditionally (`v-if`)?
   - Does it attach to `document.body` via `<Teleport>`?
   - Does it clean up DOM attachments and global listeners on unmount?
2. **Tier 2: Prop Reflection & Attribute Invariants**
   - Do props reflect to expected native attributes (`disabled`, `type`, `id`, `aria-*`)?
   - Do props apply semantic state classes without throwing runtime warnings?
3. **Tier 3: Event Emission & Payload Invariants**
   - Do user interactions (clicks, inputs, form submits) trigger custom events?
   - Is the emitted payload strictly adhering to the TypeScript interface contract?
4. **Tier 4: Keyboard & Accessibility Invariants**
   - Does pressing `Escape` dismiss dialogs or popovers?
   - Does the component manage body scroll lock (`overflow = 'hidden'`) while active?
   - Are native button types properly configured for form submission?
5. **Tier 5: Boundary & Error Suppression Invariants**
   - Are actions blocked when the component is `disabled` or `loading`?
   - Are error message strings and visual error indicators rendered when validation fails?

---

## 3. Archetype Testing Matrices & Copy-Paste Templates

### Archetype A: Primitives (`BaseButton`, `BaseBadge`, `BaseInput`)

Primitives require verification of HTML attributes, prop-to-class binding, event emission, and suppression rules.

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/shared/ui/BaseButton.vue'

describe('BaseButton Component Matrix', () => {
  // Tier 1 & 2: Prop Reflection & Attributes
  it('Invariant 1: Binds native buttonType and renders label', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Submit Form', buttonType: 'submit', variant: 'primary' }
    })
    expect(wrapper.attributes('type')).toBe('submit')
    expect(wrapper.classes()).toContain('btn-primary')
    expect(wrapper.text()).toContain('Submit Form')
  })

  // Tier 3: Event Emission
  it('Invariant 2: Emits click event on nominal user interaction', async () => {
    const wrapper = mount(BaseButton, { props: { label: 'Clickable' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  // Tier 5: Boundary Suppression
  it('Invariant 3: Suppresses clicks when disabled', async () => {
    const wrapper = mount(BaseButton, { props: { label: 'Disabled', disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('Invariant 4: Suppresses clicks and displays spinner when loading', async () => {
    const wrapper = mount(BaseButton, { props: { label: 'Loading', loading: true } })
    expect(wrapper.find('.btn-spinner').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
```

---

### Archetype B: Structural Shells & Modals (`BaseModal`)

Modals require DOM setup/teardown, `<Teleport>` inspection on `document.body`, scroll lock assertions, and backdrop click propagation tests.

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseModal from '@/shared/ui/BaseModal.vue'

describe('BaseModal Component Matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  // Tier 1: DOM Lifecycle & Teleport
  it('Invariant 1: Does not render in DOM when show is false', () => {
    mount(BaseModal, { props: { show: false, title: 'Hidden' } })
    expect(document.body.querySelector('.modal-backdrop')).toBeNull()
  })

  it('Invariant 2: Teleports to body and sets scroll lock when show is true', () => {
    mount(BaseModal, { props: { show: true, title: 'Active' } })
    expect(document.body.querySelector('.modal-backdrop')).not.toBeNull()
    expect(document.body.style.overflow).toBe('hidden')
  })

  // Tier 3 & 4: Propagation & Keyboard Interception
  it('Invariant 3: Dispatches @close on Escape key', async () => {
    const wrapper = mount(BaseModal, { props: { show: true, title: 'Closable' } })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('Invariant 4: Backdrop click emits close, inner card click stops propagation', async () => {
    const wrapper = mount(BaseModal, { props: { show: true, title: 'Click Test' } })
    const backdrop = document.body.querySelector('.modal-backdrop') as HTMLElement
    const card = document.body.querySelector('.modal-card') as HTMLElement

    card.click()
    expect(wrapper.emitted('close')).toBeUndefined()

    backdrop.click()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
```

---

### Archetype C: Compound Controls (`MaintenanceGauge`, `ServiceFilterDropdown`)

Controls require verification of mathematical calculation thresholds, multi-select state management, and outside click listeners.

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceFilterDropdown from '@/features/service-catalog/ServiceFilterDropdown.vue'

describe('ServiceFilterDropdown Component Matrix', () => {
  const mockServices = [
    { code: 'SVC-SEO', name: 'SEO Audit' },
    { code: 'SVC-HOST', name: 'Cloud Hosting' }
  ] as any

  it('Invariant 1: Toggles selection array immutably on item click', async () => {
    const wrapper = mount(ServiceFilterDropdown, {
      props: { services: mockServices, modelValue: ['SVC-SEO'] }
    })

    // Simulate clicking second service item
    await wrapper.find('.service-item[data-code="SVC-HOST"]').trigger('click')
    const emits = wrapper.emitted('update:modelValue')
    expect(emits?.[0][0]).toEqual(['SVC-SEO', 'SVC-HOST'])
  })

  it('Invariant 2: Closes popover when clicking outside document element', async () => {
    const wrapper = mount(ServiceFilterDropdown, {
      props: { services: mockServices, modelValue: [] }
    })
    await wrapper.find('.dropdown-trigger').trigger('click')
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true)

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false)
  })
})
```

---

### Archetype D: Transactional Feature Modals (`ContractAgreementModal`, `ClientOnboardingModal`)

Feature modals require verification of form validation rules, multi-step stepper navigation, and typed payload creation.

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientOnboardingModal from '@/features/client-onboarding/ClientOnboardingModal.vue'

describe('ClientOnboardingModal Component Matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('Invariant 1: Mounts wizard and advances through 3 steps', async () => {
    const wrapper = mount(ClientOnboardingModal, {
      props: { show: true, lead: { prospect: { business_name: 'Acme Corp' } } as any, services: [] }
    })

    expect(document.body.querySelector('.modal-title')?.textContent).toContain('Onboard Acme Corp')
    expect(document.body.querySelector('.step-badge')?.textContent).toContain('Step 1')

    // Navigate to Step 2
    const nextBtn = document.body.querySelector('#btn-wizard-next') as HTMLButtonElement
    nextBtn.click()
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.step-badge')?.textContent).toContain('Step 2')
  })

  it('Invariant 2: Emits @onboard with constructed payload upon final step dispatch', async () => {
    const wrapper = mount(ClientOnboardingModal, {
      props: { show: true, lead: { prospect: { business_name: 'Acme Corp' } } as any, services: [] }
    })
    // Progress to Step 3 and trigger dispatch
    // Assert wrapper.emitted('onboard')?.[0][0] contains business_name and secrets
  })
})
```

---

## 4. Pre-Commit Execution Command

Before committing or opening a PR, all component matrices must be validated in the containerized test harness:

```bash
docker run --rm -v $(pwd):/app -w /app node:20-alpine sh -c "corepack enable && pnpm test"
```
