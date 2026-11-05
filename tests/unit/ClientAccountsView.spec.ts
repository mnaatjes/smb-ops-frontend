import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ClientAccountsView from '@/pages/ClientAccountsView.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { ClientAccount, ServiceCatalogItem } from '@/shared/types/lead'

describe('ClientAccountsView.vue Headless Assertion Matrix (UAT-0008)', () => {
  let store: ReturnType<typeof useLeadStore>

  const mockClients: ClientAccount[] = [
    {
      id: 'client-1',
      source_lead_id: 'lead-1',
      business_name: 'Grand Rapids Bakery',
      website_url: 'https://grbakery.example.com',
      primary_contact_name: 'John Doe',
      primary_contact_email: 'john@grbakery.example.com',
      phone: '616-555-0101',
      state: 'active',
      contracts: [
        {
          id: 'contract-1',
          client_id: 'client-1',
          service_code: 'CARE_PLAN_60',
          contract_type: 'retainer',
          billing_rate: 199,
          billing_frequency: 'monthly',
          signature_document_url: null,
          status: 'active',
          start_date: '2026-11-01',
          renewal_date: null,
          created_at: '2026-11-01T00:00:00Z'
        }
      ],
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-01T00:00:00Z'
    },
    {
      id: 'client-2',
      source_lead_id: 'lead-2',
      business_name: 'Lakeside Auto Repair',
      website_url: 'https://lakesideauto.example.com',
      primary_contact_name: 'Jane Smith',
      primary_contact_email: 'jane@lakesideauto.example.com',
      phone: '616-555-0102',
      state: 'onboarding',
      contracts: [],
      created_at: '2026-11-03T00:00:00Z',
      updated_at: '2026-11-03T00:00:00Z'
    },
    {
      id: 'client-3',
      source_lead_id: 'lead-3',
      business_name: 'Alpine Dental Care',
      website_url: 'https://alpinedental.example.com',
      primary_contact_name: 'Dr. Alpine',
      primary_contact_email: 'dr@alpinedental.example.com',
      phone: '616-555-0103',
      state: 'active',
      contracts: [
        {
          id: 'contract-2',
          client_id: 'client-3',
          service_code: 'CARE_PLAN_30',
          contract_type: 'retainer',
          billing_rate: 99,
          billing_frequency: 'monthly',
          signature_document_url: null,
          status: 'active',
          start_date: '2026-11-02',
          renewal_date: null,
          created_at: '2026-11-02T00:00:00Z'
        }
      ],
      created_at: '2026-11-02T00:00:00Z',
      updated_at: '2026-11-02T00:00:00Z'
    }
  ]

  const mockServices: ServiceCatalogItem[] = [
    {
      id: 'svc-care-30',
      code: 'CARE_PLAN_30',
      name: 'Dynamic Continuity Care Plan (30m Cap)',
      description: 'Monthly security and plugin maintenance with 30m SLA cap.',
      rank: 'Rank 2',
      pricing_model: 'recurring_monthly',
      price_min: 99,
      price_max: 99,
      target_profile: 'Standard SMB',
      audit_parameters: ['ssl_active'],
      minimum_opportunity_score: 50,
      created_at: '2026-11-01T00:00:00Z'
    },
    {
      id: 'svc-care-60',
      code: 'CARE_PLAN_60',
      name: 'Comprehensive Continuity Care Plan (60m Cap)',
      description: 'Monthly maintenance and optimization with 60m SLA cap.',
      rank: 'Rank 2',
      pricing_model: 'recurring_monthly',
      price_min: 199,
      price_max: 199,
      target_profile: 'Established SMB',
      audit_parameters: ['ssl_active', 'response_time_ms'],
      minimum_opportunity_score: 60,
      created_at: '2026-11-01T00:00:00Z'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLeadStore()
    store.clients = JSON.parse(JSON.stringify(mockClients))
    store.services = JSON.parse(JSON.stringify(mockServices))

    vi.spyOn(store, 'loadClients').mockResolvedValue()
    vi.spyOn(store, 'loadServices').mockResolvedValue()
  })

  // =========================================================================
  // SCENARIO 1: WORKSPACE MOUNTING & CLIENT CARDS RENDERING
  // =========================================================================
  it('renders BasePageHeader, 4 BaseMetricCards, and BaseCard grid with client accounts (Scenario 1)', () => {
    const wrapper = mount(ClientAccountsView, {
      global: {
        stubs: {
          ClientDossierDrawer: true,
          LogWorkModal: true,
          ContractAgreementModal: true,
          VaultSecretModal: true
        }
      }
    })

    const header = wrapper.find('.base-page-header')
    expect(header.exists()).toBe(true)
    expect(wrapper.find('h1.page-title').text()).toBe('Client Accounts & Retainers')
    expect(wrapper.text()).toContain('Active Account Ledgers, Retainers, & Vault Access')
    expect(wrapper.text()).toContain('3 Active Accounts')

    // 4 KPI Metric cards
    const metricCards = wrapper.findAll('.base-metric-card')
    expect(metricCards.length).toBe(4)
    expect(metricCards[0].text()).toContain('Total Client Accounts')
    expect(metricCards[0].text()).toContain('3')
    expect(metricCards[1].text()).toContain('Active Retainers')
    expect(metricCards[1].text()).toContain('2')
    expect(metricCards[2].text()).toContain('Onboarding in Progress')
    expect(metricCards[2].text()).toContain('1')
    expect(metricCards[3].text()).toContain('Active Care Plans')
    expect(metricCards[3].text()).toContain('2')

    // Client cards
    const cards = wrapper.findAll('.client-card')
    expect(cards.length).toBe(3)
    expect(cards[0].text()).toContain('Grand Rapids Bakery')
    expect(cards[0].text()).toContain('ACTIVE')
    expect(cards[0].text()).toContain('CARE_PLAN_60 ($199/monthly)')
    expect(cards[0].text()).toContain('Open Dossier')
    expect(cards[0].text()).toContain('+ Log Work')
    expect(cards[0].text()).toContain('+ Attach Care Plan')
  })

  // =========================================================================
  // SCENARIO 2: FILTERING CLIENT ACCOUNTS BY STATE
  // =========================================================================
  it('filters client accounts by state pills (Scenario 2)', async () => {
    const wrapper = mount(ClientAccountsView, {
      global: {
        stubs: {
          ClientDossierDrawer: true,
          LogWorkModal: true,
          ContractAgreementModal: true,
          VaultSecretModal: true
        }
      }
    })

    expect(wrapper.findAll('.client-card').length).toBe(3)

    // Click "Onboarding" pill
    const pills = wrapper.findAll('.state-pill')
    const onboardingPill = pills.find((p) => p.text() === 'Onboarding')
    expect(onboardingPill).toBeDefined()
    await onboardingPill!.trigger('click')
    await wrapper.vm.$nextTick()

    const onboardingCards = wrapper.findAll('.client-card')
    expect(onboardingCards.length).toBe(1)
    expect(onboardingCards[0].text()).toContain('Lakeside Auto Repair')

    // Click "Active Retainers" pill
    const activePill = pills.find((p) => p.text() === 'Active Retainers')
    expect(activePill).toBeDefined()
    await activePill!.trigger('click')
    await wrapper.vm.$nextTick()

    const activeCards = wrapper.findAll('.client-card')
    expect(activeCards.length).toBe(2)
    expect(activeCards[0].text()).toContain('Grand Rapids Bakery')
    expect(activeCards[1].text()).toContain('Alpine Dental Care')
  })

  // =========================================================================
  // SCENARIO 3: OPENING CLIENT DOSSIER DRAWER
  // =========================================================================
  it('opens ClientDossierDrawer when clicking a client card (Scenario 3)', async () => {
    const wrapper = mount(ClientAccountsView, {
      global: {
        stubs: {
          LogWorkModal: true,
          ContractAgreementModal: true,
          VaultSecretModal: true
        }
      }
    })

    // Click card 1 (Grand Rapids Bakery)
    const cards = wrapper.findAll('.client-card')
    await cards[0].trigger('click')
    await wrapper.vm.$nextTick()

    const dossier = wrapper.findComponent({ name: 'ClientDossierDrawer' })
    expect(dossier.exists()).toBe(true)
    expect(dossier.props('show')).toBe(true)
    expect(dossier.props('client')?.business_name).toBe('Grand Rapids Bakery')
  })

  // =========================================================================
  // SCENARIO 4: LOGGING MAINTENANCE WORK TO CLIENT TIMECARD
  // =========================================================================
  it('opens LogWorkModal and logs maintenance work against client (Scenario 4)', async () => {
    vi.spyOn(store, 'logWork').mockResolvedValue({
      id: 'entry-1',
      timecard_id: 'tc-1',
      description: 'Monthly CMS security updates',
      minutes_spent: 30,
      entry_type: 'retainer_maintenance',
      performed_at: '2026-11-05T00:00:00Z',
      author: 'Operator'
    })

    const wrapper = mount(ClientAccountsView, {
      global: {
        stubs: {
          ClientDossierDrawer: true,
          ContractAgreementModal: true,
          VaultSecretModal: true
        }
      }
    })

    // Click "+ Log Work" on card 2 (Lakeside Auto Repair)
    const logButtons = wrapper.findAll('.action-btn-log-work')
    expect(logButtons.length).toBe(3)
    await logButtons[1].trigger('click')
    await wrapper.vm.$nextTick()

    const logModal = wrapper.findComponent({ name: 'LogWorkModal' })
    expect(logModal.exists()).toBe(true)
    expect(logModal.props('show')).toBe(true)
    expect(logModal.props('clientName')).toBe('Lakeside Auto Repair')

    // Emit save from modal
    await logModal.vm.$emit('save', {
      description: 'Monthly CMS security updates',
      minutes_spent: 30,
      entry_type: 'retainer_maintenance'
    })
    await flushPromises()

    expect(store.logWork).toHaveBeenCalledWith('client-2', {
      description: 'Monthly CMS security updates',
      minutes_spent: 30,
      entry_type: 'retainer_maintenance'
    })
    expect(wrapper.text()).toContain('Logged 30m to client timecard')
    expect(logModal.props('show')).toBe(false)
  })

  // =========================================================================
  // SCENARIO 5: ATTACHING A CARE PLAN CONTRACT TO CLIENT
  // =========================================================================
  it('opens ContractAgreementModal and attaches care plan contract (Scenario 5)', async () => {
    vi.spyOn(store, 'attachContract').mockImplementation(async (clientId, payload) => {
      const client = store.clients.find((c) => c.id === clientId)
      const newContract = {
        id: 'new-contract-1',
        client_id: clientId,
        service_code: payload.service_code,
        contract_type: payload.contract_type,
        billing_rate: payload.billing_rate,
        billing_frequency: 'monthly',
        signature_document_url: null,
        status: 'active',
        start_date: '2026-11-05',
        renewal_date: null,
        created_at: '2026-11-05T00:00:00Z'
      }
      if (client) {
        client.contracts = client.contracts || []
        client.contracts.push(newContract)
      }
      return newContract
    })

    const wrapper = mount(ClientAccountsView, {
      global: {
        stubs: {
          ClientDossierDrawer: true,
          LogWorkModal: true,
          VaultSecretModal: true
        }
      }
    })

    // Click "+ Attach Care Plan" on card 2 (Lakeside Auto Repair)
    const attachButtons = wrapper.findAll('.action-btn-attach-contract')
    expect(attachButtons.length).toBe(3)
    await attachButtons[1].trigger('click')
    await wrapper.vm.$nextTick()

    const attachModal = wrapper.findComponent({ name: 'ContractAgreementModal' })
    expect(attachModal.exists()).toBe(true)
    expect(attachModal.props('show')).toBe(true)
    expect(attachModal.props('clientName')).toBe('Lakeside Auto Repair')

    // Emit save from modal
    await attachModal.vm.$emit('save', {
      service_code: 'CARE_PLAN_30',
      billing_rate: 99,
      contract_type: 'retainer'
    })
    await flushPromises()

    expect(store.attachContract).toHaveBeenCalledWith('client-2', {
      service_code: 'CARE_PLAN_30',
      billing_rate: 99,
      contract_type: 'retainer'
    })
    expect(wrapper.text()).toContain('Successfully attached contract: CARE_PLAN_30')
    expect(attachModal.props('show')).toBe(false)
  })
})
