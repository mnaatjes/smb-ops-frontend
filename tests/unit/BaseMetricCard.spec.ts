import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseMetricCard from '@/shared/ui/BaseMetricCard.vue'

describe('BaseMetricCard.vue', () => {
  it('renders label and formatted value', () => {
    const wrapper = mount(BaseMetricCard, {
      props: {
        label: 'Discovery Pool',
        value: 128
      }
    })

    expect(wrapper.find('.metric-label').text()).toBe('Discovery Pool')
    expect(wrapper.find('.metric-value').text()).toBe('128')
    expect(wrapper.classes()).toContain('variant-nominal')
  })

  it('applies variant styling for alert variant', () => {
    const wrapper = mount(BaseMetricCard, {
      props: {
        label: 'High Priority',
        value: 14,
        variant: 'alert'
      }
    })

    expect(wrapper.classes()).toContain('variant-alert')
  })

  it('handles click events and keyboard triggers when clickable is true', async () => {
    const wrapper = mount(BaseMetricCard, {
      props: {
        label: 'Client Accounts',
        value: 6,
        clickable: true
      }
    })

    expect(wrapper.classes()).toContain('is-clickable')
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)

    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('renders slots for badge and subtext', () => {
    const wrapper = mount(BaseMetricCard, {
      props: {
        label: 'Revenue',
        value: '$4,200'
      },
      slots: {
        badge: '<span class="test-badge">+12%</span>',
        subtext: '<span class="test-subtext">Monthly Recurring</span>'
      }
    })

    expect(wrapper.find('.test-badge').exists()).toBe(true)
    expect(wrapper.find('.test-subtext').exists()).toBe(true)
  })
})
