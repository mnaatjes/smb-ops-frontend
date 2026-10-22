import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LogWorkModal from '@/features/client-maintenance/LogWorkModal.vue'

describe('LogWorkModal Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })
  it('renders modal with client title and input fields', () => {
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

  it('disables retainer option and shows notice when client has no active care plan', () => {
    mount(LogWorkModal, {
      props: {
        show: true,
        clientName: 'Harbor Bakery',
        hasActiveCarePlan: false
      },
      attachTo: document.body
    })

    expect(document.body.textContent).toContain('Client has no active care plan retainer')
    const select = document.body.querySelector('#log-work-category') as HTMLSelectElement
    const retainerOption = select.querySelector('option[value="retainer_maintenance"]') as HTMLOptionElement
    expect(retainerOption.disabled).toBe(true)
  })

  it('emits save event with populated timecard payload', async () => {
    const wrapper = mount(LogWorkModal, {
      props: {
        show: true,
        clientName: 'Harbor Bakery',
        hasActiveCarePlan: true
      },
      attachTo: document.body
    })

    const textarea = document.body.querySelector('#log-work-description') as HTMLTextAreaElement
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
