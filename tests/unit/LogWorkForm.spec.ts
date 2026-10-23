import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LogWorkForm from '@/shared/ui/LogWorkForm.vue'

describe('LogWorkForm.vue', () => {
  it('renders inputs with default initial state', () => {
    const wrapper = mount(LogWorkForm, {
      props: {
        hasActiveCarePlan: true,
        initialMinutes: 25
      }
    })

    const minutesInput = wrapper.find('input#log-work-minutes')
    expect(minutesInput.exists()).toBe(true)
    expect((minutesInput.element as HTMLInputElement).value).toBe('25')

    const categorySelect = wrapper.find('select#log-work-category')
    expect(categorySelect.exists()).toBe(true)
    expect((categorySelect.element as HTMLSelectElement).value).toBe('retainer_maintenance')

    const descTextarea = wrapper.find('textarea#log-work-description')
    expect(descTextarea.exists()).toBe(true)
  })

  it('validates required fields (minutes > 0 and description non-empty)', async () => {
    const wrapper = mount(LogWorkForm, {
      props: {
        hasActiveCarePlan: true,
        initialMinutes: 15,
        initialDescription: ''
      }
    })

    const vm = wrapper.vm as unknown as { isValid: boolean }
    expect(vm.isValid).toBe(false)

    const textarea = wrapper.find('textarea#log-work-description')
    await textarea.setValue('Remediated broken SSL certificate.')
    expect(vm.isValid).toBe(true)
  })

  it('emits submit event when submitted with valid fields', async () => {
    const wrapper = mount(LogWorkForm, {
      props: {
        hasActiveCarePlan: true,
        initialMinutes: 30,
        initialDescription: 'Quarterly WP core upgrade',
        author: 'lead_operator'
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([
      {
        minutes_spent: 30,
        entry_type: 'retainer_maintenance',
        description: 'Quarterly WP core upgrade',
        author: 'lead_operator'
      }
    ])
  })

  it('disables retainer option when hasActiveCarePlan is false', () => {
    const wrapper = mount(LogWorkForm, {
      props: {
        hasActiveCarePlan: false
      }
    })

    const retainerOption = wrapper.find('option[value="retainer_maintenance"]')
    expect(retainerOption.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.careplan-notice').exists()).toBe(true)
  })
})
