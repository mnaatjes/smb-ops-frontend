import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'

describe('BaseTextarea Component Matrix', () => {
  // Tier 1 & 3: Two-way binding & Event Emission
  it('Invariant 1: Renders value and emits update:modelValue on text entry', async () => {
    const wrapper = mount(BaseTextarea, {
      props: {
        modelValue: 'Initial notes',
        label: 'Resolution Notes',
        id: 'notes-field'
      }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe('Initial notes')
    expect(wrapper.find('label').text()).toContain('Resolution Notes')

    await textarea.setValue('Updated resolution log')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Updated resolution log'])
  })

  // Tier 2: Prop Reflection to HTML Attributes
  it('Invariant 2: Reflects rows and placeholder attributes correctly', () => {
    const wrapper = mount(BaseTextarea, {
      props: {
        modelValue: '',
        rows: 5,
        placeholder: 'Enter details...'
      }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('rows')).toBe('5')
    expect(textarea.attributes('placeholder')).toBe('Enter details...')
  })

  // Tier 5: Boundary & Disabled State
  it('Invariant 3: Binds disabled attribute when disabled prop is active', () => {
    const wrapper = mount(BaseTextarea, {
      props: {
        modelValue: 'Disabled text',
        disabled: true
      }
    })

    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
  })

  // Tier 5: Boundary & Error State
  it('Invariant 4: Displays error styling class and helper message text', () => {
    const wrapper = mount(BaseTextarea, {
      props: {
        modelValue: '',
        error: 'Work description cannot be blank'
      }
    })

    expect(wrapper.find('textarea').classes()).toContain('textarea-error')
    expect(wrapper.find('.textarea-error-msg').text()).toBe('Work description cannot be blank')
  })
})
