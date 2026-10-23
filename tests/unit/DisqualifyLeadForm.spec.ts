import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DisqualifyLeadForm from '@/shared/ui/DisqualifyLeadForm.vue'

describe('DisqualifyLeadForm.vue', () => {
  it('renders reason select options and notes textarea', () => {
    const wrapper = mount(DisqualifyLeadForm, {
      props: {
        modelValue: {
          reason: 'Enterprise / Non-SMB',
          notes: 'Company has 500+ employees',
          suppress: true
        }
      }
    })

    const reasonSelect = wrapper.find('select#disqualify-lead-reason')
    expect(reasonSelect.exists()).toBe(true)
    expect((reasonSelect.element as HTMLSelectElement).value).toBe('Enterprise / Non-SMB')

    const notesInput = wrapper.find('textarea#disqualify-lead-notes')
    expect(notesInput.exists()).toBe(true)
    expect((notesInput.element as HTMLTextAreaElement).value).toBe('Company has 500+ employees')

    const suppressCheckbox = wrapper.find('input#disqualify-lead-suppress')
    expect(suppressCheckbox.exists()).toBe(true)
    expect((suppressCheckbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('validates required reason on mount', () => {
    const wrapper = mount(DisqualifyLeadForm)

    const vm = wrapper.vm as unknown as { isValid: boolean }
    expect(vm.isValid).toBe(true)
  })

  it('emits submit event with formatted disqualification payload', async () => {
    const wrapper = mount(DisqualifyLeadForm, {
      props: {
        modelValue: {
          reason: 'Out of Business',
          notes: 'Phone disconnected and domain expired',
          suppress: true
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([
      {
        reason: 'Out of Business',
        notes: 'Phone disconnected and domain expired',
        suppress: true
      }
    ])
  })
})
