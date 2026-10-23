import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseAside from '@/shared/ui/BaseAside.vue'

describe('BaseAside.vue Headless Assertion Matrix', () => {
  it('renders in expanded mode with default width 240px and brand text', () => {
    const wrapper = mount(BaseAside, {
      props: {
        collapsed: false,
        brandTitle: 'Ops Engine',
        brandSubtitle: 'Production'
      }
    })

    expect(wrapper.classes()).not.toContain('is-collapsed')
    expect(wrapper.attributes('style')).toContain('width: 240px')
    expect(wrapper.find('.brand-title').text()).toBe('Ops Engine')
    expect(wrapper.find('.brand-subtitle').text()).toBe('Production')
  })

  it('renders in collapsed mode with collapsedWidth 64px and hides text', () => {
    const wrapper = mount(BaseAside, {
      props: {
        collapsed: true,
        collapsedWidth: '64px'
      }
    })

    expect(wrapper.classes()).toContain('is-collapsed')
    expect(wrapper.attributes('style')).toContain('width: 64px')
    expect(wrapper.find('.brand-text').exists()).toBe(false)
  })

  it('emits toggle-collapse when collapse toggle button is clicked', async () => {
    const wrapper = mount(BaseAside, {
      props: {
        collapsed: false
      }
    })

    const btn = wrapper.find('.collapse-toggle-btn')
    await btn.trigger('click')

    expect(wrapper.emitted('toggle-collapse')).toHaveLength(1)
  })

  it('renders default navigation body and footer slot content', () => {
    const wrapper = mount(BaseAside, {
      slots: {
        default: '<a href="#" class="test-nav-link">Dashboard</a>',
        footer: '<div class="test-footer-profile">User Profile</div>'
      }
    })

    expect(wrapper.find('.test-nav-link').exists()).toBe(true)
    expect(wrapper.find('.test-footer-profile').exists()).toBe(true)
  })
})
