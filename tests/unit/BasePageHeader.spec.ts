import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BasePageHeader from '@/shared/ui/BasePageHeader.vue'

describe('BasePageHeader', () => {
  it('renders title and optional subtitle', () => {
    const wrapper = mount(BasePageHeader, {
      props: {
        title: 'Lead Operations',
        subtitle: 'Triage, rank, and qualify prospective clients'
      }
    })

    expect(wrapper.find('.page-title').text()).toBe('Lead Operations')
    expect(wrapper.find('.page-subtitle').text()).toBe('Triage, rank, and qualify prospective clients')
  })

  it('renders breadcrumbs when breadcrumbs array is provided', () => {
    const breadcrumbs = [
      { label: 'Home', to: '/' },
      { label: 'Leads', current: true }
    ]

    const wrapper = mount(BasePageHeader, {
      props: {
        title: 'Leads',
        breadcrumbs
      }
    })

    expect(wrapper.findComponent({ name: 'BaseBreadcrumb' }).exists()).toBe(true)
    const items = wrapper.findAll('.breadcrumb-node')
    expect(items).toHaveLength(2)
  })

  it('renders slotted actions in the header action cluster', () => {
    const wrapper = mount(BasePageHeader, {
      props: {
        title: 'Client Accounts'
      },
      slots: {
        actions: '<button class="test-action-btn">New Client</button>'
      }
    })

    const actionBtn = wrapper.find('.test-action-btn')
    expect(actionBtn.exists()).toBe(true)
    expect(actionBtn.text()).toBe('New Client')
  })

  it('renders optional context slot beneath title row', () => {
    const wrapper = mount(BasePageHeader, {
      props: {
        title: 'Acme Logistics'
      },
      slots: {
        context: '<div class="test-context-pill">Active Retainer</div>'
      }
    })

    expect(wrapper.find('.test-context-pill').text()).toBe('Active Retainer')
  })
})
