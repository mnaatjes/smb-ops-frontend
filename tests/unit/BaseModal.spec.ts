import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseModal from '@/shared/ui/BaseModal.vue'

describe('BaseModal Component Matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('Test 1: Does not render in DOM when show is false', () => {
    mount(BaseModal, {
      props: {
        show: false,
        title: 'Hidden Modal'
      },
      slots: {
        default: '<p>Hidden Content</p>'
      }
    })

    expect(document.body.querySelector('.modal-backdrop')).toBeNull()
  })

  it('Test 2: Renders card, title, and slot content into body when show is true', () => {
    mount(BaseModal, {
      props: {
        show: true,
        title: 'Active Modal'
      },
      slots: {
        default: '<p id="modal-test-content">Modal Body Content</p>',
        footer: '<button id="footer-btn">Submit</button>'
      }
    })

    const backdrop = document.body.querySelector('.modal-backdrop')
    expect(backdrop).not.toBeNull()
    expect(document.body.querySelector('.modal-title')?.textContent).toBe('Active Modal')
    expect(document.body.querySelector('#modal-test-content')?.textContent).toBe('Modal Body Content')
    expect(document.body.querySelector('#footer-btn')).not.toBeNull()
  })

  it('Test 3: Emits @close event on close button (✕) click', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        show: true,
        title: 'Closable Modal'
      }
    })

    const closeBtn = document.body.querySelector('.close-btn') as HTMLButtonElement
    expect(closeBtn).not.toBeNull()
    closeBtn.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('Test 4: Emits @close event on backdrop click', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        show: true,
        title: 'Backdrop Click Modal'
      }
    })

    const backdrop = document.body.querySelector('.modal-backdrop') as HTMLElement
    expect(backdrop).not.toBeNull()
    backdrop.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('Test 5: Emits @close event when Escape key is triggered on window', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        show: true,
        title: 'Escape Key Modal'
      }
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('Test 6: Does NOT emit @close when inner modal card is clicked', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        show: true,
        title: 'Stop Propagation Modal'
      },
      slots: {
        default: '<div id="inner-click-target">Click inside</div>'
      }
    })

    const innerTarget = document.body.querySelector('#inner-click-target') as HTMLElement
    innerTarget.click()

    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('Test 7: Locks and unlocks body scroll', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        show: true,
        title: 'Scroll Lock Modal'
      }
    })

    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ show: false })
    expect(document.body.style.overflow).toBe('')
  })
})
