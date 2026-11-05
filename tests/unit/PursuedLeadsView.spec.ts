import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PursuedLeadsView from '@/pages/PursuedLeadsView.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { RankedLead } from '@/shared/types/lead'

describe('PursuedLeadsView.vue Headless Assertion Matrix (UAT-0006)', () => {
  let store: ReturnType<typeof useLeadStore>

  const mockPursuedLeads: RankedLead[] = [
    {
      prospect: {
        id: 'pursued-1',
        business_name: 'Grand Rapids Bakery',
        website_url: 'https://grbakery.example.com',
        phone: '616-555-0101',
        address: '100 Main St, Grand Rapids, MI',
        source: 'osm',
        status: 'PURSUED',
        disqualification_reason: null,
        opportunity_stage: 'claimed',
        created_at: '2026-11-05T00:00:00Z',
        updated_at: '2026-11-05T00:00:00Z'
      },
      audit: {
        id: 'audit-1',
        prospect_id: 'pursued-1',
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
        critical_issues: ['Missing SSL'],
        opportunity_score: 82,
        audited_at: '2026-11-05T00:00:00Z'
      }
    },
    {
      prospect: {
        id: 'pursued-2',
        business_name: 'Lakeside Auto Repair',
        website_url: 'https://lakesideauto.example.com',
        phone: '616-555-0102',
        address: '200 Lake Dr, Grand Rapids, MI',
        source: 'osm',
        status: 'PURSUED',
        disqualification_reason: null,
        opportunity_stage: 'engaged',
        created_at: '2026-11-05T00:00:00Z',
        updated_at: '2026-11-05T00:00:00Z'
      },
      audit: {
        id: 'audit-2',
        prospect_id: 'pursued-2',
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
        critical_issues: [],
        opportunity_score: 65,
        audited_at: '2026-11-05T00:00:00Z'
      }
    },
    {
      prospect: {
        id: 'pursued-3',
        business_name: 'Alpine Dental Care',
        website_url: 'https://alpinedental.example.com',
        phone: '616-555-0103',
        address: '300 Alpine Ave, Grand Rapids, MI',
        source: 'osm',
        status: 'PURSUED',
        disqualification_reason: null,
        opportunity_stage: 'proposal_presented',
        created_at: '2026-11-05T00:00:00Z',
        updated_at: '2026-11-05T00:00:00Z'
      },
      audit: {
        id: 'audit-3',
        prospect_id: 'pursued-3',
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
        opportunity_score: 55,
        audited_at: '2026-11-05T00:00:00Z'
      }
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLeadStore()
    store.leads = JSON.parse(JSON.stringify(mockPursuedLeads))
    store.services = []
    store.clients = []

    vi.spyOn(store, 'loadRankedLeads').mockResolvedValue()
    vi.spyOn(store, 'loadServices').mockResolvedValue()
    vi.spyOn(store, 'loadClients').mockResolvedValue()
  })

  // =========================================================================
  // SCENARIO 1: WORKSPACE MOUNTING & BASECARD GRID RENDERING
  // =========================================================================
  it('renders BasePageHeader, 4 BaseMetricCards, and BaseCard grid with pursued opportunities (Scenario 1)', () => {
    const wrapper = mount(PursuedLeadsView, {
      global: {
        stubs: {
          OpportunityDossierDrawer: true,
          ClientOnboardingModal: true
        }
      }
    })

    const header = wrapper.find('.base-page-header')
    expect(header.exists()).toBe(true)
    expect(wrapper.find('h1.page-title').text()).toBe('Pursued Opportunity Pipeline')
    expect(wrapper.text()).toContain('Engage Qualified Prospects & Assemble Proposals')
    expect(wrapper.text()).toContain('3 Pursued Deals')

    // 4 KPI Metric cards
    const metricCards = wrapper.findAll('.base-metric-card')
    expect(metricCards.length).toBe(4)
    expect(metricCards[0].text()).toContain('Active Pursued Deals')
    expect(metricCards[0].text()).toContain('3')
    expect(metricCards[1].text()).toContain('Engaged / In Discussion')
    expect(metricCards[1].text()).toContain('1')
    expect(metricCards[2].text()).toContain('Proposals Out')
    expect(metricCards[2].text()).toContain('1')
    expect(metricCards[3].text()).toContain('Average Opp Score')
    expect(metricCards[3].text()).toContain('67.3')

    // Opportunity cards in BaseCard grid
    const cards = wrapper.findAll('.opportunity-card')
    expect(cards.length).toBe(3)
    expect(cards[0].text()).toContain('Grand Rapids Bakery')
    expect(cards[0].text()).toContain('CLAIMED')
    expect(cards[0].text()).toContain('82')
    expect(cards[0].text()).toContain('Dossier')
    expect(cards[0].text()).toContain('Advance Stage')
    expect(cards[0].text()).toContain('Convert to Client')
  })

  // =========================================================================
  // SCENARIO 2: FILTERING OPPORTUNITIES BY PIPELINE STAGE
  // =========================================================================
  it('filters opportunities by engagement stage pills (Scenario 2)', async () => {
    const wrapper = mount(PursuedLeadsView, {
      global: {
        stubs: {
          OpportunityDossierDrawer: true,
          ClientOnboardingModal: true
        }
      }
    })

    expect(wrapper.findAll('.opportunity-card').length).toBe(3)

    // Click "Engaged" pill
    const pills = wrapper.findAll('.stage-pill')
    const engagedPill = pills.find((p) => p.text() === 'Engaged')
    expect(engagedPill).toBeDefined()
    await engagedPill!.trigger('click')
    await wrapper.vm.$nextTick()

    // Grid should now only show Lakeside Auto Repair
    const filteredCards = wrapper.findAll('.opportunity-card')
    expect(filteredCards.length).toBe(1)
    expect(filteredCards[0].text()).toContain('Lakeside Auto Repair')

    // Click "Proposal Presented" pill
    const proposalPill = pills.find((p) => p.text() === 'Proposal Presented')
    expect(proposalPill).toBeDefined()
    await proposalPill!.trigger('click')
    await wrapper.vm.$nextTick()

    const proposalCards = wrapper.findAll('.opportunity-card')
    expect(proposalCards.length).toBe(1)
    expect(proposalCards[0].text()).toContain('Alpine Dental Care')
  })

  // =========================================================================
  // SCENARIO 3: OPPORTUNITY STAGE STEPPING & ADVANCEMENT
  // =========================================================================
  it('advances opportunity stage to next pipeline state on click (Scenario 3)', async () => {
    vi.spyOn(store, 'setOpportunityStage').mockImplementation(async (id: string, stage: string) => {
      const target = store.leads.find((l) => l.prospect.id === id)
      if (target) {
        target.prospect.opportunity_stage = stage
      }
    })

    const wrapper = mount(PursuedLeadsView, {
      global: {
        stubs: {
          OpportunityDossierDrawer: true,
          ClientOnboardingModal: true
        }
      }
    })

    // Click Advance Stage on first card (Grand Rapids Bakery at 'claimed')
    const advanceBtn = wrapper.find('.opportunity-card .action-btn-advance')
    expect(advanceBtn.exists()).toBe(true)
    await advanceBtn.trigger('click')
    await flushPromises()

    expect(store.setOpportunityStage).toHaveBeenCalledWith('pursued-1', 'contact_attempted')
    expect(wrapper.text()).toContain('Updated opportunity stage: contact_attempted')
  })

  // =========================================================================
  // SCENARIO 4: DEEP OPPORTUNITY DOSSIER DRAWER INSPECTION
  // =========================================================================
  it('opens OpportunityDossierDrawer when clicking an opportunity card (Scenario 4)', async () => {
    const wrapper = mount(PursuedLeadsView, {
      global: {
        stubs: {
          ClientOnboardingModal: true
        }
      }
    })

    // Click card 1 (Grand Rapids Bakery)
    const cards = wrapper.findAll('.opportunity-card')
    await cards[0].trigger('click')
    await wrapper.vm.$nextTick()

    const dossier = wrapper.findComponent({ name: 'OpportunityDossierDrawer' })
    expect(dossier.exists()).toBe(true)
    expect(dossier.props('show')).toBe(true)
    expect(dossier.props('lead')?.prospect.business_name).toBe('Grand Rapids Bakery')
  })

  // =========================================================================
  // SCENARIO 5: CONVERTING PURSUED OPPORTUNITY TO CLIENT ACCOUNT
  // =========================================================================
  it('opens ClientOnboardingModal and onboards opportunity as client account (Scenario 5)', async () => {
    vi.spyOn(store, 'onboardClient').mockImplementation(async (payload) => {
      store.leads = store.leads.filter((l) => l.prospect.id !== payload.lead_id)
      store.clients.push({
        id: 'client-1',
        source_lead_id: payload.lead_id,
        business_name: 'Alpine Dental Care',
        website_url: 'https://alpinedental.example.com',
        phone: '616-555-0103',
        state: 'active',
        created_at: '2026-11-05T00:00:00Z',
        updated_at: '2026-11-05T00:00:00Z'
      })
      return store.clients[0]
    })

    const wrapper = mount(PursuedLeadsView, {
      global: {
        stubs: {
          OpportunityDossierDrawer: true
        }
      }
    })

    // Click Convert to Client on row 3 (Alpine Dental Care)
    const convertButtons = wrapper.findAll('.action-btn-convert')
    expect(convertButtons.length).toBe(3)
    await convertButtons[2].trigger('click')
    await wrapper.vm.$nextTick()

    const convertModal = wrapper.findComponent({ name: 'ClientOnboardingModal' })
    expect(convertModal.exists()).toBe(true)
    expect(convertModal.props('show')).toBe(true)
    expect(convertModal.props('lead')?.prospect.business_name).toBe('Alpine Dental Care')

    // Emit onboard event from modal
    await convertModal.vm.$emit('onboard', {
      lead_id: 'pursued-3',
      contact_name: 'Dr. Alpine',
      contact_email: 'dr@alpinedental.example.com',
      contact_phone: '616-555-0103',
      service_codes: ['SEC_SPEED_FIX'],
      agreed_billing_rate: 150
    })
    await flushPromises()

    expect(store.onboardClient).toHaveBeenCalledWith(
      expect.objectContaining({ lead_id: 'pursued-3' })
    )
    expect(convertModal.props('show')).toBe(false)
    expect(wrapper.text()).toContain('Successfully converted to active client!')
    expect(store.pursuedLeads.length).toBe(2)
    expect(store.clients.length).toBe(1)
  })
})
