import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseRepeater from '@/shared/ui/BaseRepeater.vue'

describe('BaseRepeater Component Matrix', () => {
  // Tier 1 & 2: Structural Rendering & Prop Reflection
  it('Invariant 1: Renders rows corresponding to modelValue string array', () => {
    const wrapper = mount(BaseRepeater, {
      props: {
        modelValue: ['Scope 1', 'Scope 2', 'Scope 3'],
        label: 'Deliverables List'
      }
    })

    const rows = wrapper.findAll('[data-testid="repeater-row"]')
    expect(rows.length).toBe(3)
    expect(wrapper.find('.repeater-label').text()).toBe('Deliverables List')

    const inputs = wrapper.findAll('[data-testid="repeater-input"]')
    expect((inputs[0].element as HTMLInputElement).value).toBe('Scope 1')
    expect((inputs[1].element as HTMLInputElement).value).toBe('Scope 2')
    expect((inputs[2].element as HTMLInputElement).value).toBe('Scope 3')
  })

  // Tier 1: Empty State
  it('Invariant 2: Renders empty state message when modelValue is empty', () => {
    const wrapper = mount(BaseRepeater, {
      props: {
        modelValue: []
      }
    })

    expect(wrapper.findAll('[data-testid="repeater-row"]').length).toBe(0)
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-text').text()).toBe('No items added yet.')
  })

  // Tier 3: Adding items via Add Another button
  it('Invariant 3: Appends empty string item to array and emits update:modelValue on Add Another click', async () => {
    const wrapper = mount(BaseRepeater, {
      props: {
        modelValue: ['Item A']
      }
    })

    const addBtn = wrapper.find('[data-testid="add-button"]')
    expect(addBtn.exists()).toBe(true)
    await addBtn.trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted?.[0]).toEqual([['Item A', '']])

    const addEmitted = wrapper.emitted('add')
    expect(addEmitted?.[0]).toEqual([1])
  })

  // Tier 3: Removing items via Remove button
  it('Invariant 4: Splices item at specific index on Remove click and emits update:modelValue and remove', async () => {
    const wrapper = mount(BaseRepeater, {
      props: {
        modelValue: ['Alpha', 'Beta', 'Gamma']
      }
    })

    const removeButtons = wrapper.findAll('[data-testid="remove-button"]')
    expect(removeButtons.length).toBe(3)

    // Remove middle item ('Beta' at index 1)
    await removeButtons[1].trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted?.[0]).toEqual([['Alpha', 'Gamma']])

    const removeEmitted = wrapper.emitted('remove')
    expect(removeEmitted?.[0]).toEqual([1])
  })

  // Tier 3: Editing row input text
  it('Invariant 5: Updates item at index on text input change and emits update:modelValue', async () => {
    const wrapper = mount(BaseRepeater, {
      props: {
        modelValue: ['Initial', 'Unchanged']
      }
    })

    const inputs = wrapper.findAll('[data-testid="repeater-input"]')
    await inputs[0].setValue('Updated Initial')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted?.[0]).toEqual([['Updated Initial', 'Unchanged']])
  })

  // Tier 5: Disabled state and boundaries
  it('Invariant 6: Disables inputs and action buttons when disabled prop is active', async () => {
    const wrapper = mount(BaseRepeater, {
      props: {
        modelValue: ['Item 1'],
        disabled: true
      }
    })

    const input = wrapper.find('[data-testid="repeater-input"]')
    expect(input.attributes('disabled')).toBeDefined()

    const removeBtn = wrapper.find('[data-testid="remove-button"]')
    expect(removeBtn.attributes('disabled')).toBeDefined()

    const addBtn = wrapper.find('[data-testid="add-button"]')
    expect(addBtn.attributes('disabled')).toBeDefined()

    await addBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // Tier 5: Max and Min items boundaries
  it('Invariant 7: Respects maxItems and minItems constraints on buttons', async () => {
    const wrapper = mount(BaseRepeater, {
      props: {
        modelValue: ['One', 'Two'],
        maxItems: 2,
        minItems: 2
      }
    })

    // Add button disabled because length >= maxItems
    const addBtn = wrapper.find('[data-testid="add-button"]')
    expect(addBtn.attributes('disabled')).toBeDefined()

    // Remove button disabled because length <= minItems
    const removeBtn = wrapper.find('[data-testid="remove-button"]')
    expect(removeBtn.attributes('disabled')).toBeDefined()
  })
})
