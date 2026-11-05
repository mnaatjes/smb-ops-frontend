import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LeadsView from '@/pages/LeadsView.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { RankedLead, ServiceCatalogItem } from '@/shared/types/lead'

describe('LeadsView.vue Headless Assertion Matrix (UAT-0005)', () => {
  let store: ReturnType<typeof useLeadStore>

  const mockLeads: RankedLead[] = [
    {
      prospect: {
        id: 'lead-1',
        business_name: 'Grand Rapids Bakery',
        website_url: 'https://grbakery.example.com',
        phone: '616-555-0101',
        address: '100 Main St, Grand Rapids, MI',
        source: 'osm',
        status: 'PENDING',
        disqualification_reason: null,
        created_at: '2026-11-05T00:00:00Z',
        updated_at: '2026-11-05T00:00:00Z'
      },
      audit: {
        id: 'audit-1',
        prospect_id: 'lead-1',
        target_url: 'https://grbakery.example.com',
        status_code: 200,
        response_time_ms: 3200,
        ssl_active: false,
        cms_detected: 'WordPress 5.8',
        mobile_viewport_present: false,
        menu_format: 'pdf',
        pdf_menu_count: 2,
        pos_integrations: ['Toast'],
        tel_link_present: false,
        critical_issues: ['Missing SSL Certificate', 'Slow Server Response (>2s)', 'Viewport Meta Missing'],
        opportunity_score: 82,
        audited_at: '2026-11-05T00:00:00Z'
      }
    },
    {
      prospect: {
        id: 'lead-2',
        business_name: 'Lakeside Auto Repair',
        website_url: 'https://lakesideauto.example.com',
        phone: '616-555-0102',
        address: '200 Lake Dr, Grand Rapids, MI',
        source: 'osm',
        status: 'PENDING',
        disqualification_reason: null,
        created_at: '2026-11-05T00:00:00Z',
        updated_at: '2026-11-05T00:00:00Z'
      },
      audit: {
        id: 'audit-2',
        prospect_id: 'lead-2',
        target_url: 'https://lakesideauto.example.com',
        status_code: 200,
        response_time_ms: 1200,
        ssl_active: true,
        cms_detected: 'Wix',
        mobile_viewport_present: true,
        menu_format: 'none',
        pdf_menu_count: 0,
        pos_integrations: [],
        tel_link_present: false,
        critical_issues: ['No direct telephone call link'],
        opportunity_score: 45,
        audited_at: '2026-11-05T00:00:00Z'
      }
    },
    {
      prospect: {
        id: 'lead-3',
        business_name: 'Alpine Dental Care',
        website_url: 'https://alpinedental.example.com',
        phone: '616-555-0103',
        address: '300 Alpine Ave, Grand Rapids, MI',
        source: 'osm',
        status: 'PENDING',
        disqualification_reason: null,
        created_at: '2026-11-05T00:00:00Z',
        updated_at: '2026-11-05T00:00:00Z'
      },
      audit: {
        id: 'audit-3',
        prospect_id: 'lead-3',
        target_url: 'https://alpinedental.example.com',
        status_code: 200,
        response_time_ms: 450,
        ssl_active: true,
        cms_detected: 'Custom',
        mobile_viewport_present: true,
        menu_format: 'none',
        pdf_menu_count: 0,
        pos_integrations: [],
        tel_link_present: true,
        critical_issues: [],
        opportunity_score: 15,
        audited_at: '2026-11-05T00:00:00Z'
      }
    }
  ]

  const mockServices: ServiceCatalogItem[] = [
    {
      id: 'svc-1',
      code: 'SEC_SPEED_FIX',
      name: 'Site Performance & Security Fix',
      description: 'Audit and repair slow servers and SSL certificates',
      rank: 'Rank 1A',
      pricing_model: 'FLAT_FEE',
      price_min: 150,
      price_max: 300,
      target_profile: 'Independent SMBs',
      scope: ['SSL configuration', 'Cache optimization'],
      deliverables: ['Audit signoff'],
      exclusions: ['Full redesign'],
      audit_parameters: ['ssl_active', 'response_time_ms'],
      minimum_opportunity_score: 40,
      created_at: '2026-11-05T00:00:00Z'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLeadStore()
    store.leads = JSON.parse(JSON.stringify(mockLeads))
    store.services = JSON.parse(JSON.stringify(mockServices))
    store.minScore = 0
    store.activeServiceFilters = []

    // Mock API methods on store
    vi.spyOn(store, 'loadRankedLeads').mockResolvedValue()
    vi.spyOn(store, 'loadServices').mockResolvedValue()
  })

  // =========================================================================
  // SCENARIO 1: WORKSPACE MOUNTING & BASETABLE RENDERING
  // =========================================================================
  it('renders BasePageHeader, 4 BaseMetricCards, and BaseTable with lead rows (Scenario 1)', async () => {
    const wrapper = mount(LeadsView, {
      global: {
        stubs: {
          OpportunityDossierDrawer: true,
          DiscoveryBar: true
        }
      }
    })

    // Header assertions
    const header = wrapper.find('.base-page-header')
    expect(header.exists()).toBe(true)
    expect(wrapper.find('h1.page-title').text()).toBe('Lead Operations & Triage')
    expect(wrapper.text()).toContain('Discover, Audit, and Qualify Business Opportunities')
    expect(wrapper.text()).toContain('+ Manual Lead')
    expect(wrapper.text()).toContain('3 Pool Leads')

    // 4 KPI Metric cards
    const metricCards = wrapper.findAll('.base-metric-card')
    expect(metricCards.length).toBe(4)
    expect(metricCards[0].text()).toContain('Discovery Pool')
    expect(metricCards[0].text()).toContain('3')
    expect(metricCards[1].text()).toContain('High Risk (70+)')
    expect(metricCards[1].text()).toContain('1')
    expect(metricCards[2].text()).toContain('Moderate Deficit (40-69)')
    expect(metricCards[2].text()).toContain('1')
    expect(metricCards[3].text()).toContain('Average Opp Score')
    expect(metricCards[3].text()).toContain('47.3')

    // BaseTable rows
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(3)
    expect(rows[0].text()).toContain('Grand Rapids Bakery')
    expect(rows[0].text()).toContain('82')
    expect(rows[0].text()).toContain('Qualify')
    expect(rows[0].text()).toContain('Disqualify')
  })

  // =========================================================================
  // SCENARIO 2: FILTERING LEADS BY SERVICE DEFICIT & SCORE
  // =========================================================================
  it('filters leads by minimum opportunity score and service criteria (Scenario 2)', async () => {
    const wrapper = mount(LeadsView, {
      global: {
        stubs: {
          OpportunityDossierDrawer: true,
          DiscoveryBar: true
        }
      }
    })

    expect(wrapper.findAll('tbody tr').length).toBe(3)

    // Increase minScore to 50 via store
    store.setMinScore(50)
    await wrapper.vm.$nextTick()

    // Only Grand Rapids Bakery has score 82 >= 50
    const filteredRows = wrapper.findAll('tbody tr')
    expect(filteredRows.length).toBe(1)
    expect(filteredRows[0].text()).toContain('Grand Rapids Bakery')

    // Reset minScore and apply service filter
    store.setMinScore(0)
    store.activeServiceFilters = ['SEC_SPEED_FIX']
    await wrapper.vm.$nextTick()

    // SEC_SPEED_FIX matches score >= 40 and ssl_active / response_time_ms issues
    const serviceFilteredRows = wrapper.findAll('tbody tr')
    expect(serviceFilteredRows.length).toBe(1)
    expect(serviceFilteredRows[0].text()).toContain('Grand Rapids Bakery')
  })

  // =========================================================================
  // SCENARIO 3: UNIFIED 1-CLICK LEAD QUALIFICATION
  // =========================================================================
  it('qualifies a lead immediately, transitions status to PURSUED, and increments counter (Scenario 3)', async () => {
    vi.spyOn(store, 'qualifyLead').mockImplementation(async (id: string) => {
      const target = store.leads.find((l) => l.prospect.id === id)
      if (target) {
        target.prospect.status = 'PURSUED'
      }
    })

    const wrapper = mount(LeadsView, {
      global: {
        stubs: {
          OpportunityDossierDrawer: true,
          DiscoveryBar: true
        }
      }
    })

    expect(store.pursuedLeads.length).toBe(0)
    expect(wrapper.findAll('tbody tr').length).toBe(3)

    // Click Qualify on first row (Grand Rapids Bakery)
    const qualifyBtn = wrapper.find('tbody tr .action-btn-qualify')
    expect(qualifyBtn.exists()).toBe(true)
    await qualifyBtn.trigger('click')
    await flushPromises()

    expect(store.qualifyLead).toHaveBeenCalledWith('lead-1')
    expect(store.pursuedLeads.length).toBe(1)
    expect(store.poolLeads.length).toBe(2)

    // Table now displays remaining 2 leads
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('tbody tr').length).toBe(2)
    expect(wrapper.text()).toContain('Qualified Grand Rapids Bakery for outreach pipeline!')
  })

  // =========================================================================
  // SCENARIO 4: DEEP AUDIT INSPECTION DOSSIER DRAWER
  // =========================================================================
  it('opens OpportunityDossierDrawer when clicking a table row (Scenario 4)', async () => {
    const wrapper = mount(LeadsView, {
      global: {
        stubs: {
          DiscoveryBar: true
        }
      }
    })

    // Click the second row (Lakeside Auto Repair)
    const rows = wrapper.findAll('tbody tr')
    await rows[1].trigger('click')
    await wrapper.vm.$nextTick()

    const dossier = wrapper.findComponent({ name: 'OpportunityDossierDrawer' })
    expect(dossier.exists()).toBe(true)
    expect(dossier.props('show')).toBe(true)
    expect(dossier.props('lead')?.prospect.business_name).toBe('Lakeside Auto Repair')
  })

  // =========================================================================
  // SCENARIO 5: MANUAL PROSPECT INGESTION VIA DEEP DRAWER
  // =========================================================================
  it('opens BaseDrawer lg with ManualLeadForm and ingests a manual prospect (Scenario 5)', async () => {
    vi.spyOn(store, 'addManualLead').mockImplementation(async (payload) => {
      store.leads.unshift({
        prospect: {
          id: 'lead-new',
          business_name: payload.business_name,
          website_url: payload.website_url || null,
          phone: payload.phone || null,
          address: payload.address || null,
          source: 'manual',
          status: 'PENDING',
          disqualification_reason: null,
          created_at: '2026-11-05T00:00:00Z',
          updated_at: '2026-11-05T00:00:00Z'
        },
        audit: null
      })
    })

    const wrapper = mount(LeadsView, {
      global: {
        stubs: {
          OpportunityDossierDrawer: true,
          DiscoveryBar: true
        }
      }
    })

    // Click + Manual Lead button in header actions
    const manualBtn = wrapper.findAll('button').find((b) => b.text().includes('+ Manual Lead'))
    expect(manualBtn).toBeDefined()
    await manualBtn!.trigger('click')
    await wrapper.vm.$nextTick()

    // Locate BaseDrawer
    const drawers = wrapper.findAllComponents({ name: 'BaseDrawer' })
    const manualDrawer = drawers.find((d) => d.props('title') === 'Create Manual Lead')
    expect(manualDrawer?.exists()).toBe(true)
    expect(manualDrawer?.props('show')).toBe(true)
    expect(manualDrawer?.props('size')).toBe('lg')

    // Submit ManualLeadForm inside drawer
    const manualForm = manualDrawer!.findComponent({ name: 'ManualLeadForm' })
    expect(manualForm.exists()).toBe(true)

    await manualForm.vm.$emit('submit', {
      business_name: 'Heritage Coffee Roasters',
      website_url: 'https://heritagecoffee.example.com',
      phone: '616-555-9988',
      address: '400 Bridge St'
    })
    await flushPromises()

    expect(store.addManualLead).toHaveBeenCalledWith(
      expect.objectContaining({ business_name: 'Heritage Coffee Roasters' })
    )
    expect(manualDrawer?.props('show')).toBe(false)
    expect(wrapper.text()).toContain('Added prospect: Heritage Coffee Roasters')
  })
})
