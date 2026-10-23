import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/shared/ui/BaseButton.vue'

describe('BaseButton Component Matrix', () => {
  // Tier 1 & 2: Prop Reflection & Attributes
  it('Invariant 1: Binds native buttonType and renders label', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Submit Proposal',
        buttonType: 'submit',
        variant: 'primary'
      }
    })
    expect(wrapper.attributes('type')).toBe('submit')
    expect(wrapper.classes()).toContain('variant-primary')
    expect(wrapper.text()).toContain('Submit Proposal')
  })

  it('Invariant 2: Applies semantic variant classes for secondary and danger', () => {
    const secondaryWrapper = mount(BaseButton, {
      props: { label: 'Cancel', variant: 'secondary' }
    })
    expect(secondaryWrapper.classes()).toContain('variant-secondary')

    const dangerWrapper = mount(BaseButton, {
      props: { label: 'Delete', variant: 'danger' }
    })
    expect(dangerWrapper.classes()).toContain('variant-danger')
  })

  // Tier 3: Event Emission
  it('Invariant 3: Emits click event on nominal user interaction', async () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Click Me' }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  // Tier 5: Boundary Suppression
  it('Invariant 4: Disables button and suppresses clicks when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Disabled Action',
        disabled: true
      }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('Invariant 5: Displays loading indicator and suppresses clicks when loading', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Saving Changes',
        loading: true
      }
    })
    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
