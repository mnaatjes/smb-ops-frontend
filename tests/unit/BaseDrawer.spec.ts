import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseDrawer from '@/shared/ui/BaseDrawer.vue'

describe('BaseDrawer.vue Headless Assertion Matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render when show is false', () => {
    mount(BaseDrawer, {
      props: {
        show: false
      }
    })

    expect(document.body.querySelector('.base-drawer-overlay')).toBeNull()
  })

  it('teleports to body and renders title when show is true', () => {
    mount(BaseDrawer, {
      props: {
        show: true,
        title: 'Opportunity Dossier',
        subtitle: 'Lead: Harbor Bakery',
        asideWidth: '240px'
      }
    })

    const overlay = document.body.querySelector('.base-drawer-overlay') as HTMLElement
    expect(overlay).not.toBeNull()
    expect(overlay.style.left).toBe('240px')
    expect(overlay.style.width).toBe('calc(100vw - 240px)')
    expect(document.body.textContent).toContain('Opportunity Dossier')
    expect(document.body.textContent).toContain('Lead: Harbor Bakery')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(BaseDrawer, {
      props: {
        show: true
      }
    })

    const closeBtn = document.body.querySelector('.drawer-close-btn') as HTMLButtonElement
    expect(closeBtn).not.toBeNull()
    closeBtn.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close event when backdrop is clicked', async () => {
    const wrapper = mount(BaseDrawer, {
      props: {
        show: true
      }
    })

    const backdrop = document.body.querySelector('.drawer-backdrop') as HTMLElement
    expect(backdrop).not.toBeNull()
    backdrop.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close event when Escape key is pressed', async () => {
    const wrapper = mount(BaseDrawer, {
      props: {
        show: true
      }
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('applies custom size classes correctly', () => {
    mount(BaseDrawer, {
      props: {
        show: true,
        size: 'sm'
      }
    })

    const canvasSm = document.body.querySelector('.drawer-canvas')
    expect(canvasSm?.classList.contains('size-sm')).toBe(true)

    document.body.innerHTML = ''
    mount(BaseDrawer, {
      props: {
        show: true,
        size: 'full'
      }
    })

    const canvasFull = document.body.querySelector('.drawer-canvas')
    expect(canvasFull?.classList.contains('size-full')).toBe(true)
  })
})
