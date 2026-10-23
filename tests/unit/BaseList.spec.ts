import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseList from '@/shared/ui/BaseList.vue'

describe('BaseList.vue Headless Assertion Matrix', () => {
  const sampleItems = ['Architecture Sign-off', 'Automated CI/CD Verification', 'Production Rollout']

  it('renders default bullet list items correctly', () => {
    const wrapper = mount(BaseList, {
      props: {
        items: sampleItems
      }
    })

    expect(wrapper.element.tagName.toLowerCase()).toBe('ul')
    expect(wrapper.classes()).toContain('variant-bullet')
    const listItems = wrapper.findAll('li')
    expect(listItems).toHaveLength(3)
    expect(listItems[0].text()).toContain('Architecture Sign-off')
    expect(wrapper.find('.list-bullet').exists()).toBe(true)
  })

  it('renders checkmark variant with check icons', () => {
    const wrapper = mount(BaseList, {
      props: {
        items: sampleItems,
        variant: 'checkmark'
      }
    })

    expect(wrapper.classes()).toContain('variant-checkmark')
    const icons = wrapper.findAll('.list-icon')
    expect(icons).toHaveLength(3)
    expect(icons[0].text()).toBe('✓')
  })

  it('renders numbered variant using <ol> and index labels', () => {
    const wrapper = mount(BaseList, {
      props: {
        items: sampleItems,
        variant: 'numbered'
      }
    })

    expect(wrapper.element.tagName.toLowerCase()).toBe('ol')
    expect(wrapper.classes()).toContain('variant-numbered')
    const numbers = wrapper.findAll('.list-number')
    expect(numbers).toHaveLength(3)
    expect(numbers[0].text()).toBe('1.')
    expect(numbers[1].text()).toBe('2.')
    expect(numbers[2].text()).toBe('3.')
  })

  it('applies dense class when prop is set', () => {
    const wrapper = mount(BaseList, {
      props: {
        items: sampleItems,
        dense: true
      }
    })

    expect(wrapper.classes()).toContain('is-dense')
  })

  it('supports custom slot override', () => {
    const wrapper = mount(BaseList, {
      slots: {
        default: '<li class="custom-item">Custom Slot Item</li>'
      }
    })

    expect(wrapper.find('.custom-item').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom Slot Item')
  })
})
