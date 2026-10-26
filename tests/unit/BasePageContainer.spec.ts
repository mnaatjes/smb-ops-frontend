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

  it('supports custom maxWidth prop', () => {
    const wrapper = mount(BasePageContainer, {
      props: {
        maxWidth: '1440px'
      },
      slots: {
        default: '<p>Custom max width content</p>'
      }
    })

    const stageWrapper = wrapper.find('.page-stage-wrapper')
    expect(stageWrapper.attributes('style')).toContain('max-width: 1440px')
  })

  it('supports fluid 100% width mode', () => {
    const wrapper = mount(BasePageContainer, {
      props: {
        fluid: true
      },
      slots: {
        default: '<p>Fluid content</p>'
      }
    })

    const stageWrapper = wrapper.find('.page-stage-wrapper')
    expect(stageWrapper.classes()).toContain('is-fluid')
    expect(stageWrapper.attributes('style')).toContain('max-width: 100%')
  })
})
