import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceFilterDropdown from '@/features/service-catalog/ServiceFilterDropdown.vue'
import type { ServiceCatalogItem } from '@/entities/lead/model'

describe('ServiceFilterDropdown Component Matrix', () => {
  const mockServices: ServiceCatalogItem[] = [
    {
      id: 'svc-1',
      code: 'SVC-SPEED',
      name: 'Speed Optimization',
      description: 'Page speed improvements',
      minimum_opportunity_score: 50,
      audit_parameters: ['ssl_active'],
      created_at: '2026-10-18T00:00:00Z',
      rank: 'Tier 1'
    },
    {
      id: 'svc-2',
      code: 'SVC-SECURITY',
      name: 'Security Hardening',
      description: 'SSL and security patching',
      minimum_opportunity_score: 60,
      audit_parameters: ['ssl_active'],
      created_at: '2026-10-18T00:00:00Z',
      rank: 'Tier 2'
    }
  ]

  // Tier 1 & 2: Prop Reflection & Inactive Label
  it('Invariant 1: Renders "All Services" label when no filters are selected', () => {
    const wrapper = mount(ServiceFilterDropdown, {
      props: {
        services: mockServices,
        modelValue: []
      }
    })

    expect(wrapper.find('.trigger-text').text()).toBe('All Services')
    expect(wrapper.find('.selection-badge').exists()).toBe(false)
  })

  // Tier 2: Prop Reflection with Active Selection
  it('Invariant 2: Renders active filter badge and count when services are selected', () => {
    const wrapper = mount(ServiceFilterDropdown, {
      props: {
        services: mockServices,
        modelValue: ['SVC-SPEED', 'SVC-SECURITY']
      }
    })

    expect(wrapper.find('.selection-badge').text()).toBe('2 active')
    expect(wrapper.find('.trigger-text').text()).toBe('2 Services Selected')
  })

  // Tier 3: Event Emission & Immutability
  it('Invariant 3: Emits updated selection array when toggling a service checkbox', async () => {
    const wrapper = mount(ServiceFilterDropdown, {
      props: {
        services: mockServices,
        modelValue: []
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    expect(wrapper.find('.dropdown-popover').exists()).toBe(true)

    const checkboxes = wrapper.findAll('.service-checkbox')
    expect(checkboxes.length).toBe(2)

    await checkboxes[0].setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['SVC-SPEED']])
  })

  // Tier 5: Boundary & Reset State
  it('Invariant 4: Resets selection to empty array on Reset link click', async () => {
    const wrapper = mount(ServiceFilterDropdown, {
      props: {
        services: mockServices,
        modelValue: ['SVC-SPEED']
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    const resetBtn = wrapper.findAll('.action-link').find((b) => b.text() === 'Reset')
    expect(resetBtn).toBeDefined()
    await resetBtn?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })
})
