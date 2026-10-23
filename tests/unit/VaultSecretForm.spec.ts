import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VaultSecretForm from '@/shared/ui/VaultSecretForm.vue'
import type { ClientSecretPayload } from '@/shared/types/lead'

describe('VaultSecretForm.vue Headless Assertion Matrix', () => {
  it('renders all secret input fields and default values correctly', () => {
    const wrapper = mount(VaultSecretForm)

    expect(wrapper.find('select').exists()).toBe(true)
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(4) // label, url, username, password

    const labelInput = wrapper.find('input#vault-secret-label')
    expect((labelInput.element as HTMLInputElement).value).toBe('WordPress Admin')
  })

  it('emits valid-change false initially when required fields are empty', () => {
    const wrapper = mount(VaultSecretForm)

    const validEvents = wrapper.emitted('valid-change')
    expect(validEvents).toBeTruthy()
    expect(validEvents![0]).toEqual([false])
  })

  it('updates label on secret category change', async () => {
    const wrapper = mount(VaultSecretForm)

    const select = wrapper.find('select')
    await select.setValue('database_direct')
    await select.trigger('change')

    const labelInput = wrapper.find('input#vault-secret-label')
    expect((labelInput.element as HTMLInputElement).value).toBe('MySQL / Database')
  })

  it('emits update:modelValue and valid-change true when all required fields are filled', async () => {
    const wrapper = mount(VaultSecretForm)

    await wrapper.find('input#vault-secret-username').setValue('operator@example.com')
    await wrapper.find('input#vault-secret-password').setValue('SuperSecret123!')

    const validEvents = wrapper.emitted('valid-change')
    expect(validEvents).toBeTruthy()
    const lastValid = validEvents![validEvents!.length - 1]
    expect(lastValid).toEqual([true])

    const updateEvents = wrapper.emitted('update:modelValue')
    expect(updateEvents).toBeTruthy()
    const lastPayload = updateEvents![updateEvents!.length - 1][0] as ClientSecretPayload
    expect(lastPayload.username).toBe('operator@example.com')
    expect(lastPayload.password).toBe('SuperSecret123!')
    expect(lastPayload.secret_type).toBe('wordpress_admin')
  })

  it('emits submit event when form is submitted and valid', async () => {
    const wrapper = mount(VaultSecretForm)

    await wrapper.find('input#vault-secret-username').setValue('admin')
    await wrapper.find('input#vault-secret-password').setValue('pass')
    await wrapper.find('form').trigger('submit')

    const submitEvents = wrapper.emitted('submit')
    expect(submitEvents).toBeTruthy()
    expect(submitEvents![0][0]).toMatchObject({
      username: 'admin',
      password: 'pass',
      secret_type: 'wordpress_admin'
    })
  })
})
