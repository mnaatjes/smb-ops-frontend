import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLeadStore } from '@/entities/lead/store'
import * as leadApi from '@/shared/api/leads'
import type { RankedLead } from '@/entities/lead/model'

vi.mock('@/shared/api/leads')

describe('useLeadStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockLeads: RankedLead[] = [
    {
      prospect: {
        id: '1',
        business_name: 'Alpha Pizza',
        website_url: 'http://alpha.com',
        phone: '123',
        address: '123 Main St',
        source: 'DISCOVERY',
        status: 'AUDITED',
        disqualification_reason: null,
        created_at: '2026-10-17T00:00:00Z',
        updated_at: '2026-10-17T00:00:00Z'
      },
      audit: {
        id: 'a1',
        prospect_id: '1',
        target_url: 'http://alpha.com',
        status_code: 200,
        response_time_ms: 120,
        ssl_active: false,
        cms_detected: 'WordPress',
        mobile_viewport_present: true,
        menu_format: 'PDF',
        pdf_menu_count: 2,
        pos_integrations: ['toast'],
        tel_link_present: true,
        critical_issues: ['NO_SSL', 'PDF_MENUS'],
        opportunity_score: 85,
        audited_at: '2026-10-17T00:00:00Z'
      }
    },
    {
      prospect: {
        id: '2',
        business_name: 'Beta Cafe',
        website_url: 'https://beta.com',
        phone: '456',
        address: '456 Oak St',
        source: 'MANUAL',
        status: 'AUDITED',
        disqualification_reason: null,
        created_at: '2026-10-17T00:00:00Z',
        updated_at: '2026-10-17T00:00:00Z'
      },
      audit: {
        id: 'a2',
        prospect_id: '2',
        target_url: 'https://beta.com',
        status_code: 200,
        response_time_ms: 80,
        ssl_active: true,
        cms_detected: 'Squarespace',
        mobile_viewport_present: true,
        menu_format: 'HTML',
        pdf_menu_count: 0,
        pos_integrations: ['clover'],
        tel_link_present: true,
        critical_issues: [],
        opportunity_score: 30,
        audited_at: '2026-10-17T00:00:00Z'
      }
    },
    {
      prospect: {
        id: '3',
        business_name: 'Gamma Diner',
        website_url: null,
        phone: null,
        address: null,
        source: 'DISCOVERY',
        status: 'PENDING',
        disqualification_reason: null,
        created_at: '2026-10-17T00:00:00Z',
        updated_at: '2026-10-17T00:00:00Z'
      },
      audit: null
    }
  ]

  function getMockLeads(): RankedLead[] {
    return JSON.parse(JSON.stringify(mockLeads))
  }

  it('computes metrics and filters correctly', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockImplementation(async () => getMockLeads())
    const store = useLeadStore()

    await store.loadRankedLeads()

    expect(store.totalLeadsCount).toBe(3)
    expect(store.auditedCount).toBe(2)
    expect(store.highPriorityCount).toBe(1)
    expect(store.filteredLeads[0].prospect.business_name).toBe('Alpha Pizza')

    store.setMinScore(50)
    expect(store.filteredLeads.length).toBe(1)
    expect(store.filteredLeads[0].prospect.business_name).toBe('Alpha Pizza')
  })

  it('handles discovery and updates triage list', async () => {
    vi.mocked(leadApi.triggerLeadDiscovery).mockResolvedValue([mockLeads[2].prospect])
    vi.mocked(leadApi.fetchRankedLeads).mockImplementation(async () => getMockLeads())
    const store = useLeadStore()

    await store.discoverLeads('Kalamazoo, MI', 10)

    expect(leadApi.triggerLeadDiscovery).toHaveBeenCalledWith({ location: 'Kalamazoo, MI', limit: 10 })
    expect(leadApi.fetchRankedLeads).toHaveBeenCalled()
    expect(store.statusMessage).toContain('Discovered 1 prospects.')
  })

  it('handles batch audit triggering', async () => {
    vi.mocked(leadApi.triggerBatchAudit).mockResolvedValue({
      audited_count: 1,
      failed_count: 0,
      results: [mockLeads[0].audit!]
    })
    vi.mocked(leadApi.fetchRankedLeads).mockImplementation(async () => getMockLeads())
    const store = useLeadStore()

    await store.runBatchAudit(15)

    expect(leadApi.triggerBatchAudit).toHaveBeenCalledWith({ limit: 15 })
    expect(leadApi.fetchRankedLeads).toHaveBeenCalled()
    expect(store.statusMessage).toContain('Audited 1 leads')
  })

  it('qualifies a lead into the Pursued Pipeline', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockImplementation(async () => getMockLeads())
    vi.mocked(leadApi.pursueLead).mockResolvedValue({
      ...mockLeads[0].prospect,
      status: 'PURSUED'
    })
    const store = useLeadStore()
    await store.loadRankedLeads()
    expect(store.totalLeadsCount).toBe(3)
    expect(store.pursuedCount).toBe(0)

    await store.qualifyLead('1')

    expect(store.totalLeadsCount).toBe(2)
    expect(store.pursuedCount).toBe(1)
    expect(store.pursuedLeads[0].prospect.id).toBe('1')
    expect(store.statusMessage).toContain('qualified and claimed into Pursued Pipeline')
  })

  it('disqualifies a lead with reason and removes it from active list', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockImplementation(async () => getMockLeads())
    vi.mocked(leadApi.disqualifyLead).mockResolvedValue({
      ...mockLeads[1].prospect,
      status: 'DISQUALIFIED',
      disqualification_reason: 'Out of Business'
    })
    const store = useLeadStore()
    await store.loadRankedLeads()
    expect(store.totalLeadsCount).toBe(3)

    await store.disqualifyLead('2', { reason: 'Out of Business', notes: 'Permanently closed' })

    expect(store.totalLeadsCount).toBe(2)
    expect(store.leads.find((l) => l.prospect.id === '2')).toBeUndefined()
    expect(store.statusMessage).toContain('Out of Business')
  })

  it('disqualifies and permanently suppresses a lead when suppress flag is set', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockImplementation(async () => getMockLeads())
    vi.mocked(leadApi.disqualifyLead).mockResolvedValue({
      ...mockLeads[0].prospect,
      status: 'DISQUALIFIED',
      disqualification_reason: 'Enterprise / Non-SMB'
    })
    vi.mocked(leadApi.suppressLead).mockResolvedValue({
      ...mockLeads[0].prospect,
      status: 'SUPPRESSED'
    })
    const store = useLeadStore()
    await store.loadRankedLeads()

    await store.disqualifyLead('1', { reason: 'Enterprise / Non-SMB', suppress: true })

    expect(leadApi.disqualifyLead).toHaveBeenCalled()
    expect(leadApi.suppressLead).toHaveBeenCalledWith('1')
    expect(store.totalLeadsCount).toBe(2)
    expect(store.statusMessage).toContain('permanently suppressed')
  })

  it('pursues a lead into the pipeline and filters from pool', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockImplementation(async () => getMockLeads())
    vi.mocked(leadApi.pursueLead).mockResolvedValue({
      ...mockLeads[0].prospect,
      status: 'PURSUED'
    })
    const store = useLeadStore()
    await store.loadRankedLeads()

    expect(store.poolLeads.length).toBe(3)
    expect(store.pursuedLeads.length).toBe(0)

    await store.pursueLead('1')

    expect(store.poolLeads.length).toBe(2)
    expect(store.pursuedLeads.length).toBe(1)
    expect(store.pursuedLeads[0].prospect.id).toBe('1')
    expect(store.statusMessage).toContain('added to Pursued Pipeline')
  })

  it('suppresses a lead from future discovery and pool', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockImplementation(async () => getMockLeads())
    vi.mocked(leadApi.suppressLead).mockResolvedValue({
      ...mockLeads[0].prospect,
      status: 'SUPPRESSED'
    })
    const store = useLeadStore()
    await store.loadRankedLeads()

    await store.suppressLead('1')

    expect(store.totalLeadsCount).toBe(2)
    expect(store.leads.find((l) => l.prospect.id === '1')).toBeUndefined()
    expect(store.statusMessage).toContain('suppressed from future searches')
  })

  it('converts a lead into a client account', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockImplementation(async () => getMockLeads())
    vi.mocked(leadApi.convertLeadToClient).mockResolvedValue({
      id: 'client-101',
      business_name: 'Alpha Pizza',
      source_lead_id: '1',
      state: 'active',
      website_url: 'http://alpha.com',
      created_at: '2026-10-17T00:00:00Z'
    })
    const store = useLeadStore()
    await store.loadRankedLeads()

    await store.convertToClient('1')

    expect(store.clientsCount).toBe(1)
    expect(store.clients[0].business_name).toBe('Alpha Pizza')
    expect(store.leads.find((l) => l.prospect.id === '1')).toBeUndefined()
  })

  it('loads service catalog items', async () => {
    vi.mocked(leadApi.fetchServices).mockResolvedValue([
      {
        id: 'svc-1',
        code: 'SVC-SEO',
        name: 'SEO Optimization',
        description: 'Metadata and speed audit',
        audit_parameters: ['meta_tags', 'ttfb'],
        minimum_opportunity_score: 50,
        created_at: '2026-10-17T00:00:00Z'
      }
    ])
    const store = useLeadStore()

    await store.loadServices()

    expect(store.services.length).toBe(1)
    expect(store.services[0].code).toBe('SVC-SEO')
  })

  it('creates and registers a new service offering', async () => {
    vi.mocked(leadApi.createService).mockResolvedValue({
      id: 'svc-new',
      code: 'SVC-ADA',
      name: 'Accessibility Audit',
      description: 'WCAG 2.1 compliance check',
      audit_parameters: ['aria_labels', 'contrast'],
      minimum_opportunity_score: 60,
      created_at: '2026-10-18T00:00:00Z'
    })
    const store = useLeadStore()

    await store.createServiceOffering({
      code: 'SVC-ADA',
      name: 'Accessibility Audit',
      description: 'WCAG 2.1 compliance check',
      audit_parameters: ['aria_labels', 'contrast'],
      minimum_opportunity_score: 60
    })

    expect(leadApi.createService).toHaveBeenCalled()
    expect(store.services.length).toBe(1)
    expect(store.services[0].code).toBe('SVC-ADA')
    expect(store.statusMessage).toContain('Accessibility Audit')
  })
})

