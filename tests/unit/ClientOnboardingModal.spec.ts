import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientOnboardingModal from '@/features/client-onboarding/ClientOnboardingModal.vue'
import type { RankedLead, ServiceCatalogItem, OnboardClientPayload } from '@/shared/types/lead'

describe('ClientOnboardingModal Component Matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  const mockLead: RankedLead = {
    prospect: {
      id: 'lead-test-01',
      business_name: 'Apex Dental Care',
      website_url: 'https://apexdental.example.com',
      phone: '555-0100',
      address: '123 Main St',
      source: 'manual',
      status: 'QUALIFIED',
      disqualification_reason: null,
      created_at: '2026-10-20T00:00:00Z',
      updated_at: '2026-10-20T00:00:00Z'
    },
    audit: null
  }

  const mockServices: ServiceCatalogItem[] = [
    {
      id: 'svc-1',
      code: 'SVC-SEO',
      name: 'Technical SEO Audit',
      description: 'Audit and speed remediation',
      minimum_opportunity_score: 50,
      audit_parameters: ['ssl_active'],
      created_at: '2026-10-20T00:00:00Z'
    },
    {
      id: 'svc-2',
      code: 'SVC-HOST',
      name: 'Managed Hosting & Backups',
      description: 'Automated snapshots and uptime probes',
      minimum_opportunity_score: 60,
      audit_parameters: ['uptime'],
      created_at: '2026-10-20T00:00:00Z'
    }
  ]

  // Tier 1: DOM Lifecycle Invariants
  it('Invariant 1: Does not render in DOM when show is false', () => {
    mount(ClientOnboardingModal, {
      props: {
        show: false,
        lead: mockLead,
        services: mockServices
      }
    })
    expect(document.body.querySelector('.modal-backdrop')).toBeNull()
  })

  it('Invariant 2: Teleports to body and renders business name in header when show is true', () => {
    mount(ClientOnboardingModal, {
      props: {
        show: true,
        lead: mockLead,
        services: mockServices
      }
    })
    const backdrop = document.body.querySelector('.modal-backdrop')
    expect(backdrop).not.toBeNull()
    expect(document.body.querySelector('.modal-title')?.textContent).toContain('Onboard Client — Apex Dental Care')
  })

  // Tier 3: Wizard Progression and Stepper Navigation
  it('Invariant 3: Progresses through the 3 wizard steps via Next/Back buttons', async () => {
    const wrapper = mount(ClientOnboardingModal, {
      props: {
        show: true,
        lead: mockLead,
        services: mockServices
      }
    })

    // Step 1: Contact
    expect(document.body.innerHTML).toContain('Primary Account Representative')
    expect(document.body.innerHTML).toContain('Continue')

    // Find Continue button in footer
    const continueBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Continue'
    )
    expect(continueBtn).toBeDefined()
    continueBtn?.click()
    await wrapper.vm.$nextTick()

    // Step 2: Services
    expect(document.body.innerHTML).toContain('Select Contracted Offerings')
    expect(document.body.innerHTML).toContain('Technical SEO Audit')

    // Advance to Step 3
    const step2ContinueBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Continue'
    )
    step2ContinueBtn?.click()
    await wrapper.vm.$nextTick()

    // Step 3: Vault & Dispatch
    expect(document.body.textContent).toContain('Initial Vault Infrastructure Secret')
    expect(document.body.textContent).toContain('Dispatch & Onboard')

    // Click Back button
    const backBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Back'
    )
    expect(backBtn).toBeDefined()
    backBtn?.click()
    await wrapper.vm.$nextTick()

    // Returned to Step 2
    expect(document.body.innerHTML).toContain('Select Contracted Offerings')
  })

  // Tier 3 & 5: Event Emission & Payload Integrity
  it('Invariant 4: Emits @onboard with constructed payload upon final step dispatch', async () => {
    const wrapper = mount(ClientOnboardingModal, {
      props: {
        show: true,
        lead: mockLead,
        services: mockServices
      }
    })

    // Advance to Step 3
    const continueBtn1 = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Continue'
    )
    continueBtn1?.click()
    await wrapper.vm.$nextTick()

    const continueBtn2 = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Continue'
    )
    continueBtn2?.click()
    await wrapper.vm.$nextTick()

    // Click Dispatch & Onboard
    const dispatchBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Dispatch & Onboard'
    )
    expect(dispatchBtn).toBeDefined()
    dispatchBtn?.click()
    await wrapper.vm.$nextTick()

    const emits = wrapper.emitted('onboard')
    expect(emits).toHaveLength(1)
    const payload = emits?.[0][0] as OnboardClientPayload
    expect(payload.lead_id).toBe('lead-test-01')
    expect(payload.contact_name).toBe('Primary Contact')
  })

  // Tier 4: Cancel Dismissal
  it('Invariant 5: Emits @close event when Cancel button is clicked', async () => {
    const wrapper = mount(ClientOnboardingModal, {
      props: {
        show: true,
        lead: mockLead,
        services: mockServices
      }
    })

    const cancelBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Cancel'
    )
    expect(cancelBtn).toBeDefined()
    cancelBtn?.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
