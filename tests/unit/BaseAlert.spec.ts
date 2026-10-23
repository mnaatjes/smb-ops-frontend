import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseAlert from '@/shared/ui/BaseAlert.vue'

describe('BaseAlert.vue', () => {
  it('renders with default info variant and body content', () => {
    const wrapper = mount(BaseAlert, {
      slots: {
        default: 'System operational status is nominal.'
      }
    })

    expect(wrapper.classes()).toContain('alert-info')
    expect(wrapper.text()).toContain('System operational status is nominal.')
    expect(wrapper.attributes('role')).toBe('alert')
  })

  it('renders title and variant classes appropriately', () => {
    const wrapper = mount(BaseAlert, {
      props: {
        variant: 'danger',
        title: 'Connection Dropped'
      },
      slots: {
        default: 'Failed to synchronize with upstream cluster.'
      }
    })

    expect(wrapper.classes()).toContain('alert-danger')
    expect(wrapper.find('.alert-title').text()).toBe('Connection Dropped')
  })

  it('emits dismiss when dismiss button is clicked', async () => {
    const wrapper = mount(BaseAlert, {
      props: {
        dismissible: true
      },
      slots: {
        default: 'Notice message'
      }
    })

    const dismissBtn = wrapper.find('.alert-dismiss-btn')
    expect(dismissBtn.exists()).toBe(true)

    await dismissBtn.trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })
})
