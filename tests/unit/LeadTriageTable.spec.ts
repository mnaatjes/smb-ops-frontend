import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LeadTriageTable from '@/features/lead-triage/LeadTriageTable.vue'
import type { RankedLead } from '@/entities/lead/model'

describe('LeadTriageTable', () => {
  const dummyLeads: RankedLead[] = [
    {
      prospect: {
        id: '101',
        business_name: 'Downtown Grill',
        website_url: 'http://downtowngrill.test',
        phone: '555-1111',
        address: '100 Center St',
        source: 'MANUAL',
        status: 'AUDITED',
        disqualification_reason: null,
        created_at: '2026-10-17T00:00:00Z',
        updated_at: '2026-10-17T00:00:00Z'
      },
      audit: {
        id: 'a101',
        prospect_id: '101',
        target_url: 'http://downtowngrill.test',
        status_code: 200,
        response_time_ms: 150,
        ssl_active: false,
        cms_detected: 'WordPress',
        mobile_viewport_present: false,
        menu_format: 'PDF',
        pdf_menu_count: 3,
        pos_integrations: ['toast'],
        tel_link_present: false,
        critical_issues: ['NO_SSL', 'PDF_MENUS'],
        opportunity_score: 85,
        audited_at: '2026-10-17T00:00:00Z'
      }
    }
  ]

  it('renders lead details and score badge', () => {
    const wrapper = mount(LeadTriageTable, {
      props: {
        leads: dummyLeads,
        loading: false
      }
    })

    expect(wrapper.text()).toContain('Downtown Grill')
    expect(wrapper.text()).toContain('85 / 100')
    expect(wrapper.text()).toContain('No SSL')
    expect(wrapper.text()).toContain('3 PDF Menu(s)')
    expect(wrapper.text()).toContain('POS: toast')
  })

  it('renders empty message when no leads exist', () => {
    const wrapper = mount(LeadTriageTable, {
      props: {
        leads: [],
        loading: false
      }
    })

    expect(wrapper.text()).toContain('No leads available')
  })

  it('emits qualify event when Qualify button is clicked', async () => {
    const wrapper = mount(LeadTriageTable, {
      props: {
        leads: dummyLeads,
        loading: false
      }
    })

    const buttons = wrapper.findAllComponents({ name: 'BaseButton' })
    const qualifyBtn = buttons.find((btn) => btn.props('label') === 'Qualify')
    expect(qualifyBtn).toBeDefined()
    await qualifyBtn?.trigger('click')

    expect(wrapper.emitted('qualify')).toBeTruthy()
    expect(wrapper.emitted('qualify')?.[0]).toEqual([dummyLeads[0]])
  })

  it('emits disqualify event when Disqualify button is clicked', async () => {
    const wrapper = mount(LeadTriageTable, {
      props: {
        leads: dummyLeads,
        loading: false
      }
    })

    const buttons = wrapper.findAllComponents({ name: 'BaseButton' })
    const disqualifyBtn = buttons.find((btn) => btn.props('label') === 'Disqualify')
    expect(disqualifyBtn).toBeDefined()
    await disqualifyBtn?.trigger('click')

    expect(wrapper.emitted('disqualify')).toBeTruthy()
    expect(wrapper.emitted('disqualify')?.[0]).toEqual([dummyLeads[0]])
  })

  it('emits pursue event when Add to List button is clicked', async () => {
    const wrapper = mount(LeadTriageTable, {
      props: {
        leads: dummyLeads,
        loading: false
      }
    })

    const buttons = wrapper.findAllComponents({ name: 'BaseButton' })
    const pursueBtn = buttons.find((btn) => btn.props('label') === 'Add to List')
    expect(pursueBtn).toBeDefined()
    await pursueBtn?.trigger('click')

    expect(wrapper.emitted('pursue')).toBeTruthy()
    expect(wrapper.emitted('pursue')?.[0]).toEqual([dummyLeads[0]])
  })

  it('emits suppress event when suppress icon button is clicked', async () => {
    const wrapper = mount(LeadTriageTable, {
      props: {
        leads: dummyLeads,
        loading: false
      }
    })

    const suppressBtn = wrapper.find('.icon-btn-suppress')
    expect(suppressBtn.exists()).toBe(true)
    await suppressBtn.trigger('click')

    expect(wrapper.emitted('suppress')).toBeTruthy()
    expect(wrapper.emitted('suppress')?.[0]).toEqual([dummyLeads[0]])
  })

  it('emits inspectScore event when score cell is clicked', async () => {
    const wrapper = mount(LeadTriageTable, {
      props: {
        leads: dummyLeads,
        loading: false
      }
    })

    const scoreCell = wrapper.find('.cursor-pointer')
    expect(scoreCell.exists()).toBe(true)
    await scoreCell.trigger('click')

    expect(wrapper.emitted('inspectScore')).toBeTruthy()
    expect(wrapper.emitted('inspectScore')?.[0]).toEqual([dummyLeads[0]])
  })
})

