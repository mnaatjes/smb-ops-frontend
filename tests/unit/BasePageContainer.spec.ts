import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BasePageContainer from '@/shared/ui/BasePageContainer.vue'

describe('BasePageContainer.vue Headless Assertion Matrix', () => {
  it('renders default body content with nominal max-width and background', () => {
    const wrapper = mount(BasePageContainer, {
      slots: {
        default: '<div class="test-content">Dashboard Table Content</div>'
      }
    })

    expect(wrapper.find('.test-content').exists()).toBe(true)
    const stageWrapper = wrapper.find('.page-stage-wrapper')
    expect(stageWrapper.attributes('style')).toContain('max-width: 1280px')
    expect(stageWrapper.classes()).not.toContain('is-fluid')
  })

  it('renders title, subtitle, and action buttons when provided', () => {
    const wrapper = mount(BasePageContainer, {
      props: {
        title: 'Lead Operations & Triage',
        subtitle: 'Region: North America'
      },
      slots: {
        actions: '<button class="action-btn">Export Data</button>'
      }
    })

    expect(wrapper.find('.stage-title').text()).toBe('Lead Operations & Triage')
    expect(wrapper.find('.stage-subtitle').text()).toBe('Region: North America')
    expect(wrapper.find('.action-btn').exists()).toBe(true)
  })

  it('renders toolbar slot when supplied', () => {
    const wrapper = mount(BasePageContainer, {
      slots: {
        toolbar: '<input class="search-input" placeholder="Search..." />'
      }
    })

    expect(wrapper.find('.stage-toolbar').exists()).toBe(true)
    expect(wrapper.find('.search-input').exists()).toBe(true)
  })

  it('supports fluid 100% width mode', () => {
    const wrapper = mount(BasePageContainer, {
      props: {
        fluid: true
      }
    })

    const stageWrapper = wrapper.find('.page-stage-wrapper')
    expect(stageWrapper.classes()).toContain('is-fluid')
    expect(stageWrapper.attributes('style')).toContain('max-width: 100%')
  })
})
