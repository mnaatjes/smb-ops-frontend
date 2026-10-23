import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ManualLeadForm from '@/shared/ui/ManualLeadForm.vue'

describe('ManualLeadForm.vue', () => {
  it('renders input elements with default values', () => {
    const wrapper = mount(ManualLeadForm, {
      props: {
        modelValue: {
          business_name: 'Harbor Artisanal Bakery'
        }
      }
    })

    const nameInput = wrapper.find('input#manual-lead-business-name')
    expect(nameInput.exists()).toBe(true)
    expect((nameInput.element as HTMLInputElement).value).toBe('Harbor Artisanal Bakery')
  })

  it('validates required business name', async () => {
    const wrapper = mount(ManualLeadForm)

    const vm = wrapper.vm as unknown as { isValid: boolean }
    expect(vm.isValid).toBe(false)

    const nameInput = wrapper.find('input#manual-lead-business-name')
    await nameInput.setValue('Oakwood Craft Brewery')
    expect(vm.isValid).toBe(true)
  })

  it('emits submit event with formatted payload', async () => {
    const wrapper = mount(ManualLeadForm, {
      props: {
        modelValue: {
          business_name: 'Metro Tech Lab',
          website_url: 'https://metrotech.example.com',
          phone: '555-0192',
          address: '456 Tech Parkway'
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([
      {
        business_name: 'Metro Tech Lab',
        website_url: 'https://metrotech.example.com',
        phone: '555-0192',
        address: '456 Tech Parkway',
        source: 'MANUAL'
      }
    ])
  })
})
