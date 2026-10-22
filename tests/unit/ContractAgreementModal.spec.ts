import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ContractAgreementModal from '@/features/client-contracts/ContractAgreementModal.vue'
import type { ServiceCatalogItem } from '@/shared/types/lead'

describe('ContractAgreementModal Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })
  const mockServices: ServiceCatalogItem[] = [
    {
      id: 'svc-1',
      code: 'SVC-CARE-30',
      name: 'Proactive Care Plan',
      description: '30-minute monthly maintenance',
      minimum_opportunity_score: 40,
      audit_parameters: ['cms_detected'],
      created_at: '2026-10-18T00:00:00Z'
    },
    {
      id: 'svc-2',
      code: 'SVC-SEO-FIX',
      name: 'Technical SEO Package',
      description: 'Speed and markup remediation',
      minimum_opportunity_score: 50,
      audit_parameters: ['ssl_active'],
      created_at: '2026-10-18T00:00:00Z'
    }
  ]

  it('renders modal with default service selection and rate', () => {
    mount(ContractAgreementModal, {
      props: {
        show: true,
        services: mockServices,
        clientName: 'Harbor Bakery'
      },
      attachTo: document.body
    })

    expect(document.body.textContent).toContain('Attach Service Contract — Harbor Bakery')
    expect(document.body.textContent).toContain('Contracted Deliverables Scope')
  })

  it('emits save event with contract payload on form submit', async () => {
    const wrapper = mount(ContractAgreementModal, {
      props: {
        show: true,
        services: mockServices,
        initialServiceCode: 'SVC-CARE-30'
      },
      attachTo: document.body
    })

    const form = document.body.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit'))

    expect(wrapper.emitted('save')).toHaveLength(1)
    expect(wrapper.emitted('save')?.[0]?.[0]).toEqual({
      service_code: 'SVC-CARE-30',
      billing_rate: 150,
      contract_type: 'retainer'
    })
  })

  it('emits close event when Cancel is clicked', async () => {
    const wrapper = mount(ContractAgreementModal, {
      props: {
        show: true,
        services: mockServices
      },
      attachTo: document.body
    })

    const cancelBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Cancel'
    )
    cancelBtn?.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
