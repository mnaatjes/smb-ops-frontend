import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LogWorkModal from '@/features/client-maintenance/LogWorkModal.vue'

describe('LogWorkModal Component Matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  // Tier 1 & 2: DOM Lifecycle & Prop Reflection
  it('Invariant 1: Renders modal with target client title and nominal fields', () => {
    mount(LogWorkModal, {
      props: {
        show: true,
        clientName: 'Harbor Bakery',
        hasActiveCarePlan: true
      },
      attachTo: document.body
    })

    expect(document.body.textContent).toContain('Log Maintenance Work — Harbor Bakery')
    expect(document.body.textContent).toContain('Minutes Spent *')
  })

  // Tier 5: Boundary & Option Disablement
  it('Invariant 2: Disables retainer category option when client has no active care plan', () => {
    mount(LogWorkModal, {
      props: {
        show: true,
        clientName: 'Harbor Bakery',
        hasActiveCarePlan: false
      },
      attachTo: document.body
    })

    expect(document.body.textContent).toContain('Client has no active care plan retainer')
    const select = document.body.querySelector('#log-work-modal-category') as HTMLSelectElement
    const retainerOption = select.querySelector('option[value="retainer_maintenance"]') as HTMLOptionElement
    expect(retainerOption.disabled).toBe(true)
  })

  // Tier 3: Event Emission & Payload Integrity
  it('Invariant 3: Emits @save event with typed timecard payload on form submission', async () => {
    const wrapper = mount(LogWorkModal, {
      props: {
        show: true,
        clientName: 'Harbor Bakery',
        hasActiveCarePlan: true
      },
      attachTo: document.body
    })

    const textarea = document.body.querySelector('#log-work-modal-description') as HTMLTextAreaElement
    textarea.value = 'Core web vitals fix and image compression'
    textarea.dispatchEvent(new Event('input'))

    const form = document.body.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit'))

    expect(wrapper.emitted('save')).toHaveLength(1)
    expect(wrapper.emitted('save')?.[0]?.[0]).toEqual({
      minutes_spent: 15,
      entry_type: 'retainer_maintenance',
      description: 'Core web vitals fix and image compression',
      author: 'lead_operator'
    })
  })
})
