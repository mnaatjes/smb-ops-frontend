import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import OpportunityDossierDrawer from '@/features/opportunity-dossier/OpportunityDossierDrawer.vue'
import type { RankedLead, ServiceCatalogItem } from '@/shared/types/lead'

describe('OpportunityDossierDrawer.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })
  const mockLead: RankedLead = {
    prospect: {
      id: 'lead-test-opp-1',
      business_name: 'Metro Grille',
      website_url: 'https://metrogrille.com',
      phone: '(555) 987-6543',
      address: '100 Downtown Ave, Grand Rapids, MI',
      source: 'manual',
      status: 'PURSUED',
      disqualification_reason: null,
      created_at: '2026-10-18T00:00:00Z',
      updated_at: '2026-10-18T00:00:00Z'
    },
    audit: {
      id: 'audit-test-opp-1',
      prospect_id: 'lead-test-opp-1',
      target_url: 'https://metrogrille.com',
      opportunity_score: 85,
      ssl_active: false,
      mobile_viewport_present: false,
      response_time_ms: 1250,
      status_code: 200,
      cms_detected: 'WordPress',
      pos_integrations: ['Toast'],
      pdf_menu_count: 2,
      tel_link_present: false,
      menu_format: 'HTML',
      critical_issues: [],
      audited_at: '2026-10-18T00:00:00Z'
    }
  }

  const mockServices: ServiceCatalogItem[] = [
    {
      id: 'svc-1',
      code: 'SVC-SEC-1',
      name: 'TLS/SSL Hardening',
      description: 'End-to-end HTTPS certificate provisioning.',
      rank: 'Foundational',
      pricing_model: 'FIXED_FEE',
      price_min: 300,
      price_max: 300,
      target_profile: 'Insecure SMB websites',
      audit_parameters: ['ssl_active'],
      minimum_opportunity_score: 40,
      created_at: '2026-10-18T00:00:00Z'
    },
    {
      id: 'svc-2',
      code: 'SVC-WEB-1',
      name: 'Mobile Menu Modernization',
      description: 'Responsive HTML menu replacement for legacy PDFs.',
      rank: 'High-Value',
      pricing_model: 'FIXED_FEE',
      price_min: 750,
      price_max: 750,
      target_profile: 'Restaurants with PDF menus',
      audit_parameters: ['pdf_menu_count', 'mobile_viewport_present'],
      minimum_opportunity_score: 60,
      created_at: '2026-10-18T00:00:00Z'
    }
  ]

  it('renders opportunity details when visible', () => {
    const wrapper = mount(OpportunityDossierDrawer, {
      props: {
        show: true,
        lead: mockLead,
        services: mockServices
      }
    })

    expect(wrapper.text()).toContain('Metro Grille')
    expect(wrapper.text()).toContain('UID: lead-tes')
    expect(wrapper.text()).toContain('85 / 100')
    expect(wrapper.text()).toContain('https://metrogrille.com')
    expect(wrapper.text()).toContain('(555) 987-6543')
    expect(wrapper.text()).toContain('100 Downtown Ave, Grand Rapids, MI')
    expect(wrapper.text()).toContain('TLS/SSL Hardening')
    expect(wrapper.text()).toContain('Mobile Menu Modernization')
  })

  it('does not render drawer DOM when show is false', () => {
    const wrapper = mount(OpportunityDossierDrawer, {
      props: {
        show: false,
        lead: mockLead,
        services: mockServices
      }
    })

    expect(wrapper.find('.workspace-canvas').exists()).toBe(false)
  })

  it('emits close event on close button click', async () => {
    const wrapper = mount(OpportunityDossierDrawer, {
      props: {
        show: true,
        lead: mockLead,
        services: mockServices
      }
    })

    const closeBtn = wrapper.find('.close-btn')
    expect(closeBtn.exists()).toBe(true)
    await closeBtn.trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits convert event when Convert to Client button is clicked', async () => {
    const wrapper = mount(OpportunityDossierDrawer, {
      props: {
        show: true,
        lead: mockLead,
        services: mockServices
      }
    })

    const convertBtn = wrapper.findAll('button').find((b) => b.text() === 'Convert to Client')
    expect(convertBtn?.exists()).toBe(true)
    await convertBtn?.trigger('click')

    expect(wrapper.emitted('convert')).toHaveLength(1)
    expect(wrapper.emitted('convert')?.[0]?.[0]).toEqual(mockLead)
  })

  it('emits disqualify event when Disqualify Lead button is clicked', async () => {
    const wrapper = mount(OpportunityDossierDrawer, {
      props: {
        show: true,
        lead: mockLead,
        services: mockServices
      }
    })

    const disqualifyBtn = wrapper.findAll('button').find((b) => b.text() === 'Disqualify Lead')
    expect(disqualifyBtn?.exists()).toBe(true)
    await disqualifyBtn?.trigger('click')

    expect(wrapper.emitted('disqualify')).toHaveLength(1)
    expect(wrapper.emitted('disqualify')?.[0]?.[0]).toEqual(mockLead)
  })
})
