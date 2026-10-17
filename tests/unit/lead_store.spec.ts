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

  it('computes metrics and filters correctly', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockResolvedValue(mockLeads)
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
    vi.mocked(leadApi.fetchRankedLeads).mockResolvedValue(mockLeads)
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
    vi.mocked(leadApi.fetchRankedLeads).mockResolvedValue(mockLeads)
    const store = useLeadStore()

    await store.runBatchAudit(15)

    expect(leadApi.triggerBatchAudit).toHaveBeenCalledWith({ limit: 15 })
    expect(leadApi.fetchRankedLeads).toHaveBeenCalled()
    expect(store.statusMessage).toContain('Audited 1 leads')
  })

  it('qualifies a lead and removes it from active list', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockResolvedValue(mockLeads)
    vi.mocked(leadApi.qualifyLead).mockResolvedValue({
      ...mockLeads[0].prospect,
      status: 'QUALIFIED'
    })
    const store = useLeadStore()
    await store.loadRankedLeads()
    expect(store.totalLeadsCount).toBe(3)

    await store.qualifyLead('1')

    expect(store.totalLeadsCount).toBe(2)
    expect(store.leads.find((l) => l.prospect.id === '1')).toBeUndefined()
    expect(store.statusMessage).toContain('QUALIFIED')
  })

  it('disqualifies a lead with reason and removes it from active list', async () => {
    vi.mocked(leadApi.fetchRankedLeads).mockResolvedValue(mockLeads)
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
})
