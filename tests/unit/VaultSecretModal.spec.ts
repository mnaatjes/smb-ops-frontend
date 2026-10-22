import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VaultSecretModal from '@/features/client-vault/VaultSecretModal.vue'

describe('VaultSecretModal Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })
  it('renders modal with default secret labels and fields', () => {
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

  it('emits save event with secret payload when submitted', async () => {
    const wrapper = mount(VaultSecretModal, {
      props: {
        show: true
      },
      attachTo: document.body
    })

    const usernameInput = document.body.querySelector('#vault-secret-username') as HTMLInputElement
    const passwordInput = document.body.querySelector('#vault-secret-password') as HTMLInputElement

    usernameInput.value = 'wp_operator'
    usernameInput.dispatchEvent(new Event('input'))

    passwordInput.value = 'secure_secret_pass_999'
    passwordInput.dispatchEvent(new Event('input'))

    const form = document.body.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit'))

    expect(wrapper.emitted('save')).toHaveLength(1)
    expect(wrapper.emitted('save')?.[0]?.[0]).toEqual({
      secret_type: 'wordpress_admin',
      label: 'WordPress Admin',
      username: 'wp_operator',
      password: 'secure_secret_pass_999',
      login_url: null
    })
  })
})
