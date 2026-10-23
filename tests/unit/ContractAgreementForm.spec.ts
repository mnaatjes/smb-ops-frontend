import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContractAgreementForm from '@/shared/ui/ContractAgreementForm.vue'
import type { ServiceCatalogItem } from '@/shared/types/lead'

describe('ContractAgreementForm.vue', () => {
  const dummyServices: ServiceCatalogItem[] = [
    {
      id: 'srv-1',
      code: 'SVC-RETAINER',
      name: 'Monthly WordPress Care Plan',
      description: 'Care plan maintenance',
      minimum_opportunity_score: 50,
      audit_parameters: ['cms_detected'],
      created_at: '2026-10-18T00:00:00Z',
      rank: 'Tier 1'
    },
    {
      id: 'srv-2',
      code: 'SVC-SEO',
      name: 'SEO Optimization Pack',
      description: 'SEO speed and meta',
      minimum_opportunity_score: 40,
      audit_parameters: ['ssl_active'],
      created_at: '2026-10-18T00:00:00Z',
      rank: 'Tier 2'
    }
  ]

  it('renders form inputs with initial defaults', () => {
    const wrapper = mount(ContractAgreementForm, {
      props: {
        services: dummyServices,
        initialServiceCode: 'SVC-RETAINER',
        initialBillingRate: 150
      }
    })

    expect(wrapper.find('select#contract-agreement-service').exists()).toBe(true)
    expect(wrapper.find('select#contract-agreement-type').exists()).toBe(true)
    const rateInput = wrapper.find('input#contract-agreement-rate')
    expect(rateInput.exists()).toBe(true)
    expect((rateInput.element as HTMLInputElement).value).toBe('150')
  })

  it('emits valid-change on mount and updates when rate is valid', async () => {
    const wrapper = mount(ContractAgreementForm, {
      props: {
        services: dummyServices
      }
    })

    expect(wrapper.emitted('valid-change')).toBeTruthy()
    expect(wrapper.emitted('valid-change')![0]).toEqual([true])
  })

  it('emits submit event when form is submitted with valid data', async () => {
    const wrapper = mount(ContractAgreementForm, {
      props: {
        services: dummyServices,
        initialServiceCode: 'SVC-SEO',
        initialBillingRate: 200,
        initialContractType: 'fixed_fee'
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([
      {
        service_code: 'SVC-SEO',
        billing_rate: 200,
        contract_type: 'fixed_fee'
      }
    ])
  })

  it('exposes submit method programmatically', async () => {
    const wrapper = mount(ContractAgreementForm, {
      props: {
        services: dummyServices,
        initialServiceCode: 'SVC-RETAINER',
        initialBillingRate: 175
      }
    })

    const vm = wrapper.vm as unknown as { submit: () => void; isValid: boolean }
    expect(vm.isValid).toBe(true)
    vm.submit()

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0][0]).toMatchObject({
      service_code: 'SVC-RETAINER',
      billing_rate: 175
    })
  })
})
