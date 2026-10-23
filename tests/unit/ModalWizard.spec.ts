import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ModalWizard from '@/shared/ui/ModalWizard.vue'

describe('ModalWizard Component Matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  const mockSteps = [
    { number: 1, label: 'Info' },
    { number: 2, label: 'Review' }
  ]

  // Tier 1: DOM Lifecycle & Modal Shell Integration
  it('Invariant 1: Renders in DOM when show is true and mounts BaseWizard inside BaseModal', () => {
    mount(ModalWizard, {
      props: {
        show: true,
        title: 'Wizard Dialog',
        steps: mockSteps
      },
      slots: {
        'step-1': '<p id="wizard-slot-content">Wizard Content</p>'
      }
    })

    const backdrop = document.body.querySelector('.modal-backdrop')
    expect(backdrop).not.toBeNull()
    expect(document.body.querySelector('.modal-title')?.textContent).toBe('Wizard Dialog')
    expect(document.body.querySelector('#wizard-slot-content')?.textContent).toBe('Wizard Content')
  })

  // Tier 3: Event Forwarding
  it('Invariant 2: Forwards submit event when final step is confirmed', async () => {
    const wrapper = mount(ModalWizard, {
      props: {
        show: true,
        steps: mockSteps,
        currentStep: 2,
        submitLabel: 'Complete Setup'
      }
    })

    const submitBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Complete Setup'
    )
    expect(submitBtn).toBeDefined()
    submitBtn?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  // Tier 4: Cancel Dismissal
  it('Invariant 3: Emits close event when cancel is clicked on step 1', async () => {
    const wrapper = mount(ModalWizard, {
      props: {
        show: true,
        steps: mockSteps,
        currentStep: 1,
        requireConfirmOnDismiss: false
      }
    })

    const cancelBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Cancel'
    )
    expect(cancelBtn).toBeDefined()
    cancelBtn?.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
