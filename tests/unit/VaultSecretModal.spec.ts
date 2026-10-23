import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VaultSecretModal from '@/features/client-vault/VaultSecretModal.vue'

describe('VaultSecretModal Component Matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  // Tier 1 & 2: DOM Lifecycle & Prop Reflection
  it('Invariant 1: Renders modal with default secret labels and target client name', () => {
    mount(VaultSecretModal, {
      props: {
        show: true,
        clientName: 'Harbor Bakery'
      },
      attachTo: document.body
    })

    expect(document.body.textContent).toContain('Store Infrastructure Secret — Harbor Bakery')
    expect(document.body.textContent).toContain('Secret Category *')
  })

  // Tier 3: Event Emission & Payload Integrity
  it('Invariant 2: Emits @save event with typed secret payload on form submission', async () => {
    const wrapper = mount(VaultSecretModal, {
      props: {
        show: true
      },
      attachTo: document.body
    })

    const usernameInput = document.body.querySelector('#vault-modal-secret-username') as HTMLInputElement
    const passwordInput = document.body.querySelector('#vault-modal-secret-password') as HTMLInputElement

    usernameInput.value = 'wp_operator'
    usernameInput.dispatchEvent(new Event('input'))

    passwordInput.value = 'secure_secret_pass_999'
    passwordInput.dispatchEvent(new Event('input'))
    await wrapper.vm.$nextTick()

    const saveBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Store Credential'
    )
    expect(saveBtn).toBeDefined()
    saveBtn?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('save')).toHaveLength(1)
    expect(wrapper.emitted('save')?.[0]?.[0]).toEqual({
      secret_type: 'wordpress_admin',
      label: 'WordPress Admin',
      username: 'wp_operator',
      password: 'secure_secret_pass_999',
      login_url: null
    })
  })

  // Tier 4: Cancel Dismissal
  it('Invariant 3: Emits @close event when close action is triggered', async () => {
    const wrapper = mount(VaultSecretModal, {
      props: {
        show: true
      },
      attachTo: document.body
    })

    const cancelBtn = Array.from(document.body.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Cancel'
    )
    expect(cancelBtn).toBeDefined()
    cancelBtn?.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
