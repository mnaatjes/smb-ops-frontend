import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseBadge from '@/shared/ui/BaseBadge.vue'

describe('BaseBadge Component Matrix', () => {
  // Tier 1: Slot Content Invariants
  it('Invariant 1: Renders slot content with default neutral variant and md size', () => {
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

  // Tier 2: Prop Reflection & Semantic Variant Invariants
  it('Invariant 2: Maps color variant props to semantic variant classes', () => {
    const variants = [
      'emerald',
      'amber',
      'rose',
      'indigo',
      'slate',
      'primary',
      'success',
      'warning',
      'danger'
    ] as const

    for (const variant of variants) {
      const wrapper = mount(BaseBadge, {
        props: { variant },
        slots: { default: variant }
      })
      expect(wrapper.classes()).toContain(`badge-${variant}`)
    }
  })

  it('Invariant 3: Maps size variant props to corresponding sizing classes', () => {
    const wrapperSm = mount(BaseBadge, {
      props: { size: 'sm' },
      slots: { default: 'Small Badge' }
    })
    expect(wrapperSm.classes()).toContain('badge-sm')

    const wrapperMd = mount(BaseBadge, {
      props: { size: 'md' },
      slots: { default: 'Medium Badge' }
    })
    expect(wrapperMd.classes()).toContain('badge-md')
  })
})
