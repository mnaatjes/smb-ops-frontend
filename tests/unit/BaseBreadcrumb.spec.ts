import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseBreadcrumb from '@/shared/ui/BaseBreadcrumb.vue'

describe('BaseBreadcrumb', () => {
  it('renders all breadcrumb items with default separator', () => {
    const items = [
      { label: 'Home', to: '/' },
      { label: 'Leads', to: '/leads' },
      { label: 'Acme Corp', current: true }
    ]

    const wrapper = mount(BaseBreadcrumb, {
      props: { items }
    })

    const renderedNodes = wrapper.findAll('.breadcrumb-node')
    expect(renderedNodes).toHaveLength(3)
    expect(renderedNodes[0].text()).toBe('Home')
    expect(renderedNodes[1].text()).toBe('Leads')
    expect(renderedNodes[2].text()).toBe('Acme Corp')

    const separators = wrapper.findAll('.breadcrumb-separator')
    expect(separators).toHaveLength(2)
    expect(separators[0].text()).toBe('/')
  })

  it('marks the current item with aria-current="page" and non-clickable class', () => {
    const items = [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Settings', current: true }
    ]

    const wrapper = mount(BaseBreadcrumb, {
      props: { items }
    })

    const currentItem = wrapper.find('.breadcrumb-item.is-current')
    expect(currentItem.exists()).toBe(true)
    const node = currentItem.find('.breadcrumb-node')
    expect(node.attributes('aria-current')).toBe('page')
  })

  it('emits navigate event when a non-current item is clicked', async () => {
    const items = [
      { label: 'Client Accounts', to: '/clients' },
      { label: 'Overview', current: true }
    ]

    const wrapper = mount(BaseBreadcrumb, {
      props: { items }
    })

    const firstNode = wrapper.find('.breadcrumb-node')
    await firstNode.trigger('click')

    expect(wrapper.emitted('navigate')).toBeTruthy()
    expect(wrapper.emitted('navigate')?.[0]).toEqual([items[0]])
  })

  it('customizes separator token when prop is provided', () => {
    const items = [
      { label: 'Stage', to: '/stage' },
      { label: 'Detail', current: true }
    ]

    const wrapper = mount(BaseBreadcrumb, {
      props: { items, separator: '›' }
    })

    const separator = wrapper.find('.breadcrumb-separator')
    expect(separator.text()).toBe('›')
  })
})
