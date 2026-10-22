import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useLeadStore } from '@/entities/lead/store'
import MaintenanceGauge from '@/shared/ui/MaintenanceGauge.vue'
import ClientOnboardingModal from '@/features/client-onboarding/ClientOnboardingModal.vue'
import type {
  RankedLead,
  ServiceCatalogItem,
  ClientAccount,
  OnboardClientPayload
} from '@/shared/types/lead'
import * as api from '@/shared/api/leads'

describe('Client Accounts Workspace & Onboarding Pipeline', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('MaintenanceGauge displays green normal state under 25 minutes', () => {
    const wrapper = mount(MaintenanceGauge, {
      props: {
        totalMinutes: 15,
        capMinutes: 30,
        outOfScope: false
      }
    })

    const fill = wrapper.find('.progress-fill')
    expect(fill.classes()).toContain('normal')
    expect(wrapper.text()).toContain('15 / 30 mins')
    expect(wrapper.find('.out-of-scope-badge').exists()).toBe(false)
  })

  it('MaintenanceGauge displays amber warning state between 25 and 30 minutes', () => {
    const wrapper = mount(MaintenanceGauge, {
      props: {
        totalMinutes: 28,
        capMinutes: 30,
        outOfScope: false
      }
    })

    const fill = wrapper.find('.progress-fill')
    expect(fill.classes()).toContain('warning')
    expect(wrapper.find('.warning-badge').exists()).toBe(true)
    expect(wrapper.text()).toContain('2 mins remaining')
  })

  it('MaintenanceGauge displays red out-of-scope state when exceeding cap', () => {
    const wrapper = mount(MaintenanceGauge, {
      props: {
        totalMinutes: 35,
        capMinutes: 30,
        outOfScope: true
      }
    })

    const fill = wrapper.find('.progress-fill')
    expect(fill.classes()).toContain('danger')
    expect(wrapper.find('.out-of-scope-badge').exists()).toBe(true)
    expect(wrapper.text()).toContain('Out-of-Scope (Additional SOW Required)')
  })

  it('ClientOnboardingModal advances through 3 steps and emits payload', async () => {
    const mockLead: RankedLead = {
      prospect: {
        id: 'lead-test-123',
        business_name: 'Harbor Bakery',
        website_url: 'https://harborbakery.com',
        phone: '555-1234',
        address: '123 Main St',
        source: 'DISCOVERY',
        status: 'PURSUED',
        disqualification_reason: null,
        created_at: '2026-10-18T00:00:00Z',
        updated_at: '2026-10-18T00:00:00Z'
      },
      audit: null
    }

    const mockServices: ServiceCatalogItem[] = [
      {
        id: 'svc-1',
        code: 'SVC-RANK-1A',
        name: 'Technical SEO & Speed Pack',
        description: 'Core web vitals fix',
        minimum_opportunity_score: 50,
        audit_parameters: ['ssl_active'],
        created_at: '2026-10-18T00:00:00Z'
      }
    ]

    const wrapper = mount(ClientOnboardingModal, {
      props: {
        show: true,
        lead: mockLead,
        services: mockServices
      },
      attachTo: document.body
    })

    // Step 1: Contact
    expect(document.body.textContent).toContain('Primary Account Representative')
    const emailInput = document.body.querySelector('#onboard-contact-email') as HTMLInputElement
    emailInput.value = 'owner@harborbakery.com'
    emailInput.dispatchEvent(new Event('input'))

    const getButtons = () => Array.from(document.body.querySelectorAll('button'))
    getButtons().find((b) => b.textContent?.trim() === 'Continue')?.click()
    await wrapper.vm.$nextTick()

    // Step 2: Services
    expect(document.body.textContent).toContain('Select Contracted Offerings')
    getButtons().find((b) => b.textContent?.trim() === 'Continue')?.click()
    await wrapper.vm.$nextTick()

    // Step 3: Vault & Launch
    expect(document.body.textContent).toContain('Initial Vault Infrastructure Secret')
    const userInput = document.body.querySelector('#onboard-vault-user') as HTMLInputElement
    const passInput = document.body.querySelector('#onboard-vault-pass') as HTMLInputElement
    userInput.value = 'admin_user'
    userInput.dispatchEvent(new Event('input'))
    passInput.value = 'dynamically_generated_mock_pass_123'
    passInput.dispatchEvent(new Event('input'))
    await wrapper.vm.$nextTick()

    const dispatchBtn = getButtons().find((b) => b.textContent?.trim() === 'Dispatch & Onboard')
    expect(dispatchBtn).toBeDefined()
    dispatchBtn?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('onboard')).toHaveLength(1)
    const emittedPayload = wrapper.emitted('onboard')?.[0]?.[0] as OnboardClientPayload
    expect(emittedPayload.lead_id).toBe('lead-test-123')
    expect(emittedPayload.contact_email).toBe('owner@harborbakery.com')
    expect(emittedPayload.secrets).toBeDefined()
    expect(emittedPayload.secrets?.length).toBe(1)
    expect(emittedPayload.secrets?.[0].username).toBe('admin_user')
  })

  it('Pinia store handles onboardClient and updates client list and state', async () => {
    const store = useLeadStore()
    const mockCreatedClient: ClientAccount = {
      id: 'client-999',
      source_lead_id: 'lead-test-123',
      business_name: 'Harbor Bakery',
      website_url: 'https://harborbakery.com',
      state: 'active',
      created_at: '2026-10-18T00:00:00Z',
      contracts: [
        {
          id: 'ct-1',
          client_id: 'client-999',
          service_code: 'SVC-RANK-1A',
          contract_type: 'retainer',
          billing_rate: 99.0,
          billing_frequency: 'monthly',
          signature_document_url: null,
          status: 'active',
          start_date: '2026-10-18',
          renewal_date: null,
          created_at: '2026-10-18T00:00:00Z'
        }
      ]
    }

    vi.spyOn(api, 'onboardClientApi').mockResolvedValue(mockCreatedClient)

    const result = await store.onboardClient({
      lead_id: 'lead-test-123',
      contact_name: 'Jane Harbor',
      contact_email: 'jane@harborbakery.com',
      service_codes: ['SVC-RANK-1A']
    })

    expect(result.id).toBe('client-999')
    expect(store.clients).toHaveLength(1)
    expect(store.clients[0].business_name).toBe('Harbor Bakery')
    expect(store.clients[0].state).toBe('active')
  })
})
