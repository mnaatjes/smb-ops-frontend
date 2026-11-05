import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CreateAddOnForm from '@/shared/ui/CreateAddOnForm.vue'
import type { CreateAddOnPayload } from '@/shared/types/lead'

describe('CreateAddOnForm.vue Headless Assertion Matrix (ADR-0029)', () => {
  it('renders input elements with default values', () => {
    const wrapper = mount(CreateAddOnForm, {
      props: {
        modelValue: {
          code: 'CARE_PLAN_30',
          name: 'Essential Website Care',
          description: 'Recurring monthly maintenance',
          monthly_rate: 99,
          monthly_retainer_cap_minutes: 30
        }
      }
    })

    const codeInput = wrapper.find('input#create-add-on-code')
    expect(codeInput.exists()).toBe(true)
    expect((codeInput.element as HTMLInputElement).value).toBe('CARE_PLAN_30')

    const nameInput = wrapper.find('input#create-add-on-name')
    expect(nameInput.exists()).toBe(true)
    expect((nameInput.element as HTMLInputElement).value).toBe('Essential Website Care')
  })

  it('validates required fields and monthly rates', async () => {
    const wrapper = mount(CreateAddOnForm)

    const vm = wrapper.vm as unknown as { isValid: boolean }
    expect(vm.isValid).toBe(false)

    // Fill in required fields
    await wrapper.find('input#create-add-on-code').setValue('CARE_PLAN_60')
    await wrapper.find('input#create-add-on-name').setValue('Professional Digital Care')
    await wrapper.find('textarea#create-add-on-description').setValue('Priority maintenance tier')

    expect(vm.isValid).toBe(true)

    // Negative monthly rate invalidates
    await wrapper.find('input#create-add-on-monthly-rate').setValue(-50)
    expect(vm.isValid).toBe(false)

    // Positive rate restores validity
    await wrapper.find('input#create-add-on-monthly-rate').setValue(199)
    expect(vm.isValid).toBe(true)
  })

  it('emits submit event with formatted payload', async () => {
    const wrapper = mount(CreateAddOnForm, {
      props: {
        modelValue: {
          code: 'CARE_PLAN_90',
          name: 'Priority Operations Care',
          description: 'Top-tier maintenance plan',
          monthly_rate: 299,
          monthly_retainer_cap_minutes: 90,
          scope: ['Monthly POS sync', 'Google Business Profile audit']
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
    const payload = wrapper.emitted('submit')![0][0] as CreateAddOnPayload
    expect(payload.code).toBe('CARE_PLAN_90')
    expect(payload.monthly_rate).toBe(299)
    expect(payload.monthly_retainer_cap_minutes).toBe(90)
    expect(payload.pricing_model).toBe('MONTHLY_RETAINER')
    expect(payload.rank).toBe('Rank 2')
    expect(payload.scope).toEqual(['Monthly POS sync', 'Google Business Profile audit'])
  })
})
