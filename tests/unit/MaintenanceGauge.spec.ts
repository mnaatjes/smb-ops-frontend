import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MaintenanceGauge from '@/shared/ui/MaintenanceGauge.vue'

describe('MaintenanceGauge Component', () => {
  it('renders normal emerald state under 76% of cap (<= 22m for 30m cap)', () => {
    const wrapper = mount(MaintenanceGauge, {
      props: {
        totalMinutes: 15,
        capMinutes: 30
      }
    })

    const fill = wrapper.find('.progress-fill')
    expect(fill.classes()).toContain('normal')
    expect(wrapper.text()).toContain('15 / 30 mins')
    expect(wrapper.find('.warning-badge').exists()).toBe(false)
    expect(wrapper.find('.out-of-scope-badge').exists()).toBe(false)
  })

  it('renders amber warning state between 76% and 100% of cap (23m - 30m for 30m cap)', () => {
    const wrapper = mount(MaintenanceGauge, {
      props: {
        totalMinutes: 28,
        capMinutes: 30
      }
    })

    const fill = wrapper.find('.progress-fill')
    expect(fill.classes()).toContain('warning')
    expect(wrapper.find('.warning-badge').exists()).toBe(true)
    expect(wrapper.text()).toContain('2 mins remaining')
  })

  it('renders rose danger state when exceeding cap (> 30m) or outOfScope prop is true', () => {
    const wrapperExceeding = mount(MaintenanceGauge, {
      props: {
        totalMinutes: 35,
        capMinutes: 30
      }
    })

    const fillExceeding = wrapperExceeding.find('.progress-fill')
    expect(fillExceeding.classes()).toContain('danger')
    expect(wrapperExceeding.find('.out-of-scope-badge').exists()).toBe(true)
    expect(wrapperExceeding.text()).toContain('Out-of-Scope')

    const wrapperFlagged = mount(MaintenanceGauge, {
      props: {
        totalMinutes: 10,
        capMinutes: 30,
        outOfScope: true
      }
    })
    expect(wrapperFlagged.find('.progress-fill').classes()).toContain('danger')
  })

  it('renders neutral state for client with no active care plan (0 cap)', () => {
    const wrapper = mount(MaintenanceGauge, {
      props: {
        totalMinutes: 0,
        capMinutes: 0
      }
    })

    expect(wrapper.text()).toContain('No Active Care Plan')
    expect(wrapper.find('.progress-bar-container').exists()).toBe(false)
  })

  it('renders ad-hoc badge when minutes are logged without active care plan', () => {
    const wrapper = mount(MaintenanceGauge, {
      props: {
        totalMinutes: 45,
        capMinutes: 0
      }
    })

    expect(wrapper.text()).toContain('No Active Care Plan')
    expect(wrapper.text()).toContain('45m Logged (Ad-Hoc / Out-of-Scope)')
  })
})
