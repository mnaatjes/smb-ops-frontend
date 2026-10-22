import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/shared/ui/BaseInput.vue'

describe('BaseInput Component', () => {
  it('renders input with value and emits update event on change', async () => {
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

  it('renders supported input types', () => {
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

  it('renders disabled state correctly', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: 'Disabled text',
        disabled: true
      }
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('renders error state and message', () => {
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
