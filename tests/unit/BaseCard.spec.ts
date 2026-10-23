import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCard from '@/shared/ui/BaseCard.vue'

describe('BaseCard.vue Headless Assertion Matrix', () => {
  it('renders default slot content with nominal border and padding', () => {
    const wrapper = mount(BaseCard, {
      slots: {
        default: '<p class="test-body">Card Body Content</p>'
      }
    })

    expect(wrapper.find('.test-body').exists()).toBe(true)
    expect(wrapper.classes()).toContain('is-bordered')
    expect(wrapper.classes()).toContain('padding-md')
    expect(wrapper.find('.card-header').exists()).toBe(false)
  })

  it('renders title and subtitle when props are supplied', () => {
    const wrapper = mount(BaseCard, {
      props: {
        title: 'Cluster Health Assessment',
        subtitle: '24 nodes active and nominal'
      }
    })

    expect(wrapper.find('.card-title').text()).toBe('Cluster Health Assessment')
    expect(wrapper.find('.card-subtitle').text()).toBe('24 nodes active and nominal')
  })

  it('renders header and footer slots when provided', () => {
    const wrapper = mount(BaseCard, {
      slots: {
        header: '<span class="custom-header">Header Badge</span>',
        default: 'Content',
        footer: '<button class="custom-footer-btn">Submit</button>'
      }
    })

    expect(wrapper.find('.custom-header').exists()).toBe(true)
    expect(wrapper.find('.custom-footer-btn').exists()).toBe(true)
  })

  it('applies elevated and custom padding classes', () => {
    const wrapper = mount(BaseCard, {
      props: {
        elevated: true,
        padding: 'lg'
      }
    })

    expect(wrapper.classes()).toContain('is-elevated')
    expect(wrapper.classes()).toContain('padding-lg')
  })
})
