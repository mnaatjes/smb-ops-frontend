import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/shared/ui/BaseInput.vue'

describe('BaseInput Component Matrix', () => {
  // Tier 1 & 3: Two-way binding & Event Emission
  it('Invariant 1: Renders value and emits update:modelValue on input change', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: 'Initial text',
        label: 'Client Name',
        id: 'client-name'
      }
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('Initial text')
    expect(wrapper.find('label').text()).toBe('Client Name')

    await input.setValue('Updated text')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Updated text'])
  })

  // Tier 2: Prop Reflection to HTML Attributes
  it('Invariant 2: Reflects input type attribute correctly', () => {
    const types = ['text', 'number', 'email', 'password']
    for (const type of types) {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          type
        }
      })
      expect(wrapper.find('input').attributes('type')).toBe(type)
    }
  })

  // Tier 5: Boundary & Disabled State
  it('Invariant 3: Binds disabled attribute when disabled prop is active', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: 'Disabled text',
        disabled: true
      }
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  // Tier 5: Boundary & Error State
  it('Invariant 4: Displays error styling class and helper message text', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        error: 'Field is required'
      }
    })

    expect(wrapper.find('input').classes()).toContain('input-error')
    expect(wrapper.find('.input-error-msg').text()).toBe('Field is required')
  })
})
