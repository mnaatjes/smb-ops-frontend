import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CreateCoreServiceForm from '@/shared/ui/CreateCoreServiceForm.vue'
import type { CreateCoreServicePayload } from '@/shared/types/lead'

describe('CreateCoreServiceForm.vue Headless Assertion Matrix (ADR-0029)', () => {
  it('renders input elements with default values', () => {
    const wrapper = mount(CreateCoreServiceForm, {
      props: {
        modelValue: {
          code: 'SVC-RANK-1A',
          name: 'Site Performance & Security Audit + Fix',
          description: 'Door-opener CMS performance pack',
          price_min: 150,
          price_max: 150
        }
      }
    })

    const codeInput = wrapper.find('input#create-core-service-code')
    expect(codeInput.exists()).toBe(true)
    expect((codeInput.element as HTMLInputElement).value).toBe('SVC-RANK-1A')

    const nameInput = wrapper.find('input#create-core-service-name')
    expect(nameInput.exists()).toBe(true)
    expect((nameInput.element as HTMLInputElement).value).toBe('Site Performance & Security Audit + Fix')
  })

  it('validates required fields and automatically maps price from rank tier', async () => {
    const wrapper = mount(CreateCoreServiceForm)

    const vm = wrapper.vm as unknown as { isValid: boolean; mappedPrice: number; pricingModel: string }
    expect(vm.isValid).toBe(false)
    expect(vm.mappedPrice).toBe(150)
    expect(vm.pricingModel).toBe('FLAT_FEE')

    // Set code, name, description
    await wrapper.find('input#create-core-service-code').setValue('SVC-TEST')
    await wrapper.find('input#create-core-service-name').setValue('Test Service')
    await wrapper.find('textarea#create-core-service-description').setValue('Test description')

    // Rank 1A defaults to $150 and FLAT_FEE
    expect(vm.isValid).toBe(true)
    expect(wrapper.find('.pricing-banner').text()).toContain('$150.00')
    expect(wrapper.find('.pricing-banner').text()).toContain('FLAT_FEE')

    // Switch rank to Rank 1B -> automatically maps to $350
    await wrapper.find('select#create-core-service-rank').setValue('Rank 1B')
    expect(vm.mappedPrice).toBe(350)
    expect(wrapper.find('.pricing-banner').text()).toContain('$350.00')

    // Switch rank to Rank 3 -> automatically maps to $300 and HYBRID
    await wrapper.find('select#create-core-service-rank').setValue('Rank 3')
    expect(vm.mappedPrice).toBe(300)
    expect(vm.pricingModel).toBe('HYBRID')
    expect(wrapper.find('.pricing-banner').text()).toContain('$300.00')
    expect(wrapper.find('.pricing-banner').text()).toContain('HYBRID')
  })

  it('emits submit event with automatically mapped pricing payload', async () => {
    const wrapper = mount(CreateCoreServiceForm, {
      props: {
        modelValue: {
          code: 'SVC-STATIC',
          name: 'Static Edge Pipeline',
          description: 'Fast edge hosting',
          rank: 'Rank 1B',
          minimum_opportunity_score: 60,
          scope: ['Edge CDN deploy', 'Automated SSL']
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
    const payload = wrapper.emitted('submit')![0][0] as CreateCoreServicePayload
    expect(payload.code).toBe('SVC-STATIC')
    expect(payload.rank).toBe('Rank 1B')
    expect(payload.price_min).toBe(350)
    expect(payload.price_max).toBe(350)
    expect(payload.pricing_model).toBe('FLAT_FEE')
    expect(payload.minimum_opportunity_score).toBe(60)
    expect(payload.scope).toEqual(['Edge CDN deploy', 'Automated SSL'])
  })
})
