import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseBadge from '@/shared/ui/BaseBadge.vue'

describe('BaseBadge Component', () => {
  it('renders default neutral badge', () => {
    const wrapper = mount(BaseBadge, {
      slots: {
        default: 'Active Status'
      }
    })
    expect(wrapper.text()).toBe('Active Status')
    expect(wrapper.classes()).toContain('base-badge')
    expect(wrapper.classes()).toContain('badge-neutral')
    expect(wrapper.classes()).toContain('badge-md')
  })

  it('renders tokenized color variants', () => {
    const variants = ['emerald', 'amber', 'rose', 'indigo', 'slate', 'primary', 'success', 'warning', 'danger'] as const
    for (const variant of variants) {
      const wrapper = mount(BaseBadge, {
        props: { variant },
        slots: { default: variant }
      })
      expect(wrapper.classes()).toContain(`badge-${variant}`)
    }
  })

  it('renders size variants (sm and md)', () => {
    const wrapperSm = mount(BaseBadge, {
      props: { size: 'sm' },
      slots: { default: 'Small' }
    })
    expect(wrapperSm.classes()).toContain('badge-sm')

    const wrapperMd = mount(BaseBadge, {
      props: { size: 'md' },
      slots: { default: 'Medium' }
    })
    expect(wrapperMd.classes()).toContain('badge-md')
  })
})
