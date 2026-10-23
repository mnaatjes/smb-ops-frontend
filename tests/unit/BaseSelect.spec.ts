import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelect from '@/shared/ui/BaseSelect.vue'

describe('BaseSelect Component Matrix', () => {
  const mockOptions = [
    { value: 'opt-1', label: 'Option One' },
    { value: 'opt-2', label: 'Option Two' },
    { value: 'opt-3', label: 'Option Three (Disabled)', disabled: true }
  ]

  // Tier 1 & 2: Prop Reflection & Attributes
  it('Invariant 1: Renders label, select input, and option items', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        modelValue: 'opt-1',
        label: 'Select Service',
        id: 'test-select',
        options: mockOptions
      }
    })

    expect(wrapper.find('label').text()).toBe('Select Service')
    const select = wrapper.find('select')
    expect(select.attributes('id')).toBe('test-select')
    expect(select.element.value).toBe('opt-1')
    expect(wrapper.findAll('option')).toHaveLength(3)
  })

  // Tier 3: Event Emission
  it('Invariant 2: Emits update:modelValue and change on selection', async () => {
    const wrapper = mount(BaseSelect, {
      props: {
        modelValue: 'opt-1',
        options: mockOptions
      }
    })

    const select = wrapper.find('select')
    await select.setValue('opt-2')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['opt-2'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['opt-2'])
  })

  // Tier 5: Boundary & Disabled State
  it('Invariant 3: Disables select element when disabled prop is active', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        modelValue: 'opt-1',
        disabled: true,
        options: mockOptions
      }
    })

    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })

  // Tier 5: Boundary & Error State
  it('Invariant 4: Renders error styling and error message text', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        modelValue: '',
        error: 'Please choose an option',
        options: mockOptions
      }
    })

    expect(wrapper.find('select').classes()).toContain('select-error')
    expect(wrapper.find('.select-error-msg').text()).toBe('Please choose an option')
  })
})
