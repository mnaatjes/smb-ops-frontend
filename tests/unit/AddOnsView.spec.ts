import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AddOnsView from '@/pages/AddOnsView.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { ServiceCatalogItem } from '@/shared/types/lead'

describe('AddOnsView.vue Headless Assertion Matrix (UAT-0004)', () => {
  let store: ReturnType<typeof useLeadStore>

  const mockCatalogServices: ServiceCatalogItem[] = [
    {
      id: 'plan-1',
      code: 'CARE_PLAN_30',
      name: 'Essential Website Care',
      description: 'Core recurring digital continuity',
      rank: 'Rank 2',
      pricing_model: 'MONTHLY_RETAINER',
      price_min: 99,
      price_max: 99,
      monthly_retainer_cap_minutes: 30,
      target_profile: 'Independent establishments',
      scope: ['Weekly backups', '5m probe'],
      deliverables: ['Monthly report'],
      exclusions: ['No design rework'],
      audit_parameters: ['ssl_active', 'status_code'],
      minimum_opportunity_score: 40,
      created_at: '2026-11-05T00:00:00Z'
    },
    {
      id: 'plan-2',
      code: 'CARE_PLAN_60',
      name: 'Professional Continuity Care',
      description: 'Priority operations tier',
      rank: 'Rank 2',
      pricing_model: 'MONTHLY_RETAINER',
      price_min: 199,
      price_max: 199,
      monthly_retainer_cap_minutes: 60,
      target_profile: 'E-commerce operations',
      scope: ['Daily backups', 'Incident dispatch'],
      deliverables: ['SLA dashboard'],
      exclusions: ['Custom development'],
      audit_parameters: ['uptime_check'],
      minimum_opportunity_score: 45,
      created_at: '2026-11-05T00:00:00Z'
    },
    {
      id: 'plan-3',
      code: 'CARE_PLAN_0',
      name: 'Automated Shield Probe',
      description: 'Zero ad-hoc support tier',
      rank: 'Rank 2',
      pricing_model: 'MONTHLY_RETAINER',
      price_min: 49,
      price_max: 49,
      monthly_retainer_cap_minutes: 0,
      target_profile: 'Hands-off sites',
      scope: ['Automated monitoring'],
      deliverables: ['Weekly ping ledger'],
      exclusions: ['Zero ad-hoc time'],
      audit_parameters: ['ping_check'],
      minimum_opportunity_score: 30,
      created_at: '2026-11-05T00:00:00Z'
    },
    {
      id: 'core-svc-1',
      code: 'SVC-1A',
      name: 'Site Performance & Security Fix',
      description: 'One-off consulting package',
      rank: 'Rank 1A',
      pricing_model: 'FLAT_FEE',
      price_min: 150,
      price_max: 150,
      target_profile: 'WordPress SMBs',
      scope: ['Full backup'],
      deliverables: ['1-page report'],
      exclusions: ['No redesign'],
      audit_parameters: ['ssl_active'],
      minimum_opportunity_score: 50,
      created_at: '2026-11-05T00:00:00Z'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLeadStore()
    store.services = [...mockCatalogServices]
  })

  it('renders BasePageHeader and excludes one-off core consulting packages (Scenario 1)', () => {
    const wrapper = mount(AddOnsView)

    const header = wrapper.find('.base-page-header')
    expect(header.exists()).toBe(true)
    expect(wrapper.find('h1.page-title').text()).toBe('Add-ons & Recurring Subscriptions')
    expect(wrapper.text()).toContain('Monthly Digital Care Plans, Retainer Support Caps & SLAs')

    // Expect exactly 3 recurring plans visible, excluding one-off Rank 1A core service
    const cards = wrapper.findAll('.care-plan-card')
    expect(cards).toHaveLength(3)
    expect(wrapper.text()).toContain('Essential Website Care')
    expect(wrapper.text()).toContain('Professional Continuity Care')
    expect(wrapper.text()).toContain('Automated Shield Probe')
    expect(wrapper.text()).not.toContain('Site Performance & Security Fix')
  })

  it('filters visible care plans by retainer cap pill (Scenario 2)', async () => {
    const wrapper = mount(AddOnsView)

    const pills = wrapper.findAll('.ribbon-pill')
    const cap30Pill = pills.find((p) => p.text().includes('30m Cap'))
    expect(cap30Pill).toBeDefined()

    await cap30Pill!.trigger('click')

    const cards = wrapper.findAll('.care-plan-card')
    expect(cards).toHaveLength(1)
    expect(wrapper.text()).toContain('Essential Website Care')
    expect(wrapper.text()).not.toContain('Professional Continuity Care')

    // Click All Plans pill to restore
    const allPill = pills.find((p) => p.text().includes('All Care Plans'))
    await allPill!.trigger('click')
    expect(wrapper.findAll('.care-plan-card')).toHaveLength(3)
  })

  it('opens AddOnDetailsDrawer on care plan card click and closes on dismiss (Scenario 3)', async () => {
    const wrapper = mount(AddOnsView)

    const firstCard = wrapper.findAll('.care-plan-card')[0]
    await firstCard.trigger('click')

    const drawer = wrapper.findComponent({ name: 'AddOnDetailsDrawer' })
    expect(drawer.exists()).toBe(true)
    expect(drawer.props('show')).toBe(true)
    expect(drawer.props('plan')?.name).toBe('Essential Website Care')

    // Emitting close on the drawer resets selectedPlan
    await drawer.vm.$emit('close')
    expect(drawer.props('show')).toBe(false)
  })

  it('opens ingestion deep drawer on + New Care Plan click and dispatches create (Scenario 4)', async () => {
    const wrapper = mount(AddOnsView)
    const createSpy = vi.spyOn(store, 'createServiceOffering').mockResolvedValue()

    const openBtn = wrapper.findAll('.base-button').find((b) => b.text().includes('+ New Care Plan'))
    expect(openBtn).toBeDefined()
    await openBtn!.trigger('click')

    const drawers = wrapper.findAllComponents({ name: 'BaseDrawer' })
    const createDrawer = drawers.find((d) => d.props('size') === 'lg')
    expect(createDrawer).toBeDefined()
    expect(createDrawer!.props('show')).toBe(true)

    const form = wrapper.findComponent({ name: 'CreateAddOnForm' })
    expect(form.exists()).toBe(true)

    // Trigger form submit
    await form.vm.$emit('submit', {
      code: 'CARE_PLAN_120',
      name: 'Enterprise Care Plan',
      description: 'Dedicated 24/7 SLA care',
      rank: 'Rank 2',
      pricing_model: 'MONTHLY_RETAINER',
      monthly_rate: 399,
      monthly_retainer_cap_minutes: 120,
      target_profile: 'Enterprise clients',
      scope: ['24/7 incident probe'],
      deliverables: ['Weekly executive SLA review'],
      exclusions: ['Graphic re-theming'],
      audit_parameters: ['ssl_active'],
      minimum_opportunity_score: 50
    })
    await flushPromises()

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'CARE_PLAN_120',
        name: 'Enterprise Care Plan',
        price_min: 399
      })
    )
    expect(createDrawer!.props('show')).toBe(false)
  })
})
