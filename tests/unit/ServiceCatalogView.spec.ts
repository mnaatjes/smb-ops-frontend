import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ServiceCatalogView from '@/pages/ServiceCatalogView.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { ServiceCatalogItem } from '@/shared/types/lead'

describe('ServiceCatalogView.vue Headless Assertion Matrix (UAT-0003)', () => {
  let store: ReturnType<typeof useLeadStore>

  const mockCoreServices: ServiceCatalogItem[] = [
    {
      id: 'svc-1',
      code: 'SVC-1A',
      name: 'Site Performance & Security Fix',
      description: 'CMS Door-Opener fix',
      rank: 'Rank 1A',
      pricing_model: 'FLAT_FEE',
      price_min: 150,
      price_max: 150,
      target_profile: 'WordPress SMBs',
      scope: ['Full backup', 'SSL install'],
      deliverables: ['1-page report', 'Secured site'],
      exclusions: ['No redesign'],
      audit_parameters: ['ssl_active', 'status_code'],
      minimum_opportunity_score: 50,
      created_at: '2026-11-05T00:00:00Z'
    },
    {
      id: 'svc-2',
      code: 'SVC-1B',
      name: 'Static Modernization',
      description: 'Edge migration',
      rank: 'Rank 1B',
      pricing_model: 'FLAT_FEE',
      price_min: 350,
      price_max: 350,
      target_profile: 'Legacy static sites',
      scope: ['Asset optimization'],
      deliverables: ['Cloudflare deployment'],
      exclusions: ['Content writing'],
      audit_parameters: ['response_time_ms'],
      minimum_opportunity_score: 40,
      created_at: '2026-11-05T00:00:00Z'
    },
    {
      id: 'svc-3',
      code: 'CARE-PLAN-1',
      name: 'Care Plan 30',
      description: 'Decoupled Add-on Plan',
      rank: 'Rank 2',
      pricing_model: 'MONTHLY_RETAINER',
      price_min: 99,
      price_max: 99,
      target_profile: 'Retainer clients',
      scope: ['Backups'],
      deliverables: ['Report'],
      exclusions: ['New features'],
      audit_parameters: ['ssl_active'],
      minimum_opportunity_score: 30,
      created_at: '2026-11-05T00:00:00Z'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLeadStore()
    store.services = [...mockCoreServices]
  })

  it('renders BasePageHeader and excludes decoupled Rank 2 add-on services (Scenario 1)', () => {
    const wrapper = mount(ServiceCatalogView)

    const header = wrapper.find('.base-page-header')
    expect(header.exists()).toBe(true)
    expect(wrapper.find('h1.page-title').text()).toBe('Core Service Catalog')
    expect(wrapper.text()).toContain('Consulting Offerings, Fixed Scopes & Ingestion')

    // Expect exactly 2 core services visible (Rank 1A, Rank 1B), excluding Rank 2
    const cards = wrapper.findAll('.service-catalog-card')
    expect(cards).toHaveLength(2)
    expect(wrapper.text()).toContain('Site Performance & Security Fix')
    expect(wrapper.text()).toContain('Static Modernization')
    expect(wrapper.text()).not.toContain('Care Plan 30')
  })

  it('filters visible core offerings by commercial rank pill (Scenario 2)', async () => {
    const wrapper = mount(ServiceCatalogView)

    const pills = wrapper.findAll('.ribbon-pill')
    const rank1BPill = pills.find((p) => p.text().includes('Rank 1B'))
    expect(rank1BPill).toBeDefined()

    await rank1BPill!.trigger('click')

    const cards = wrapper.findAll('.service-catalog-card')
    expect(cards).toHaveLength(1)
    expect(wrapper.text()).toContain('Static Modernization')
    expect(wrapper.text()).not.toContain('Site Performance & Security Fix')

    // Click ALL pill to restore
    const allPill = pills.find((p) => p.text().includes('All Services'))
    await allPill!.trigger('click')
    expect(wrapper.findAll('.service-catalog-card')).toHaveLength(2)
  })

  it('opens ServiceDetailsDrawer on card click and closes on dismiss (Scenario 3)', async () => {
    const wrapper = mount(ServiceCatalogView)

    const firstCard = wrapper.findAll('.service-catalog-card')[0]
    await firstCard.trigger('click')

    const drawer = wrapper.findComponent({ name: 'ServiceDetailsDrawer' })
    expect(drawer.exists()).toBe(true)
    expect(drawer.props('show')).toBe(true)
    expect(drawer.props('service')?.name).toBe('Site Performance & Security Fix')

    // Emitting close on the drawer resets selectedService
    await drawer.vm.$emit('close')
    expect(drawer.props('show')).toBe(false)
  })

  it('opens ingestion modal on + New Core Service click and dispatches create (Scenario 4)', async () => {
    const wrapper = mount(ServiceCatalogView)
    const createSpy = vi.spyOn(store, 'createServiceOffering').mockResolvedValue()

    const openBtn = wrapper.findAll('.base-button').find((b) => b.text().includes('+ New Core Service'))
    expect(openBtn).toBeDefined()
    await openBtn!.trigger('click')

    const modal = wrapper.findComponent({ name: 'BaseModal' })
    expect(modal.exists()).toBe(true)
    expect(modal.props('show')).toBe(true)

    const form = wrapper.findComponent({ name: 'CreateCoreServiceForm' })
    expect(form.exists()).toBe(true)

    // Trigger form submit
    await form.vm.$emit('submit', {
      code: 'SEC-EXPRESS',
      name: 'Express Security Audit',
      description: 'Rapid scan',
      rank: 'Rank 1A',
      pricing_model: 'FLAT_FEE',
      price_min: 150,
      price_max: 150,
      target_profile: 'Retailers',
      scope: ['Scan'],
      deliverables: ['Report'],
      exclusions: ['Remediation'],
      audit_parameters: ['ssl_active'],
      minimum_opportunity_score: 50
    })
    await flushPromises()

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'SEC-EXPRESS',
        name: 'Express Security Audit'
      })
    )
    expect(modal.props('show')).toBe(false)
  })
})
