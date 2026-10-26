import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import BaseSiteLayout from '@/app/layout/BaseSiteLayout.vue'
import BaseAside from '@/shared/ui/BaseAside.vue'
import LeadsView from '@/pages/LeadsView.vue'
import PlaceholderWorkspaceView from '@/pages/PlaceholderWorkspaceView.vue'

describe('BaseSiteLayout.vue Headless Assertion Matrix (UAT-0002)', () => {
  let router: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    localStorage.clear()

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', redirect: '/leads' },
        { path: '/leads', component: LeadsView },
        {
          path: '/clients',
          component: PlaceholderWorkspaceView,
          props: { title: 'Client Accounts', subtitle: 'Ledger', sectionName: 'Client Accounts' }
        },
        {
          path: '/services',
          component: PlaceholderWorkspaceView,
          props: { title: 'Service Catalog', subtitle: 'Offerings', sectionName: 'Service Catalog' }
        }
      ]
    })

    await router.push('/leads')
    await router.isReady()
  })

  it('renders default desktop shell layout with 240px rail and 3 navigation tiers (Scenario 1)', () => {
    const wrapper = mount(BaseSiteLayout, {
      global: {
        plugins: [router]
      }
    })

    const aside = wrapper.find('.base-aside')
    expect(aside.exists()).toBe(true)
    expect(aside.attributes('style')).toContain('width: 240px')
    expect(wrapper.find('.brand-title').text()).toBe('SMB Ops')

    const sections = wrapper.findAll('.nav-tier-section')
    expect(sections).toHaveLength(3)

    // Primary funnel has 3 items
    const primaryItems = sections[0].findAll('.nav-link-btn')
    expect(primaryItems).toHaveLength(3)
    expect(primaryItems[0].text()).toContain('Leads')
    expect(primaryItems[1].text()).toContain('Pursued')
    expect(primaryItems[2].text()).toContain('Accounts')

    // No modal or drawer mounted by default (Pure Stage Invariant)
    expect(wrapper.find('.base-modal').exists()).toBe(false)
    expect(wrapper.find('.base-drawer').exists()).toBe(false)
  })

  it('strictly performs pure route navigation without opening modals (Scenario 2)', async () => {
    const wrapper = mount(BaseSiteLayout, {
      global: {
        plugins: [router]
      }
    })

    const asideComponent = wrapper.findComponent(BaseAside)
    expect(asideComponent.exists()).toBe(true)

    // Trigger select-item for accounts
    const accountsItem = { id: 'accounts', label: 'Accounts', icon: '💼', to: '/clients' }
    await asideComponent.vm.$emit('select-item', accountsItem)
    await router.push('/clients')
    await wrapper.vm.$nextTick()
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/clients')

    // Invariant: No modal mounted
    expect(wrapper.find('.base-modal').exists()).toBe(false)
    expect(wrapper.find('.base-drawer').exists()).toBe(false)

    // Stage contains BasePageHeader
    expect(wrapper.find('.base-page-header').exists()).toBe(true)
    expect(wrapper.find('.page-title').text()).toBe('Client Accounts')
  })

  it('collapses and expands the rail and persists state to localStorage (Scenario 4)', async () => {
    const wrapper = mount(BaseSiteLayout, {
      global: {
        plugins: [router]
      }
    })

    const collapseBtn = wrapper.find('.collapse-toggle-btn')
    await collapseBtn.trigger('click')

    const aside = wrapper.find('.base-aside')
    expect(aside.classes()).toContain('is-collapsed')
    expect(aside.attributes('style')).toContain('width: 64px')
    expect(localStorage.getItem('smb_ops_rail_collapsed')).toBe('true')

    // Click expand strip
    const expandBtn = wrapper.find('.expand-rail-btn')
    await expandBtn.trigger('click')

    expect(aside.classes()).not.toContain('is-collapsed')
    expect(aside.attributes('style')).toContain('width: 240px')
    expect(localStorage.getItem('smb_ops_rail_collapsed')).toBe('false')
  })

  it('toggles mobile drawer sheet on hamburger tap and dismisses on item click (Scenario 5)', async () => {
    const wrapper = mount(BaseSiteLayout, {
      global: {
        plugins: [router]
      }
    })

    const hamburger = wrapper.find('.mobile-hamburger-btn')
    expect(hamburger.exists()).toBe(true)

    // Open mobile navigation
    await hamburger.trigger('click')
    expect(wrapper.find('.aside-viewport-boundary').classes()).toContain('mobile-open')
    expect(wrapper.find('.mobile-backdrop').exists()).toBe(true)

    // Click Services via aside emit
    const asideComponent = wrapper.findComponent(BaseAside)
    const servicesItem = { id: 'services', label: 'Service Catalog', icon: '📋', to: '/services' }
    await asideComponent.vm.$emit('select-item', servicesItem)
    await router.push('/services')
    await wrapper.vm.$nextTick()
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/services')
    expect(wrapper.find('.aside-viewport-boundary').classes()).not.toContain('mobile-open')
    expect(wrapper.find('.mobile-backdrop').exists()).toBe(false)
  })
})
