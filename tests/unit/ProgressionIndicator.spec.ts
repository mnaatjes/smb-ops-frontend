import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressionIndicator from '@/shared/ui/ProgressionIndicator.vue'

describe('ProgressionIndicator Component Matrix', () => {
  const mockSteps = [
    { number: 1, label: 'Contact' },
    { number: 2, label: 'Services' },
    { number: 3, label: 'Vault & Launch' }
  ]

  // Tier 1 & 2: Prop Reflection & Attributes
  it('Invariant 1: Renders all steps with labels and ARIA progress attributes', () => {
    const wrapper = mount(ProgressionIndicator, {
      props: {
        steps: mockSteps,
        currentStep: 1
      }
    })

    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('1')
    expect(wrapper.attributes('aria-valuemax')).toBe('3')
    expect(wrapper.findAll('.step-label')).toHaveLength(3)
    expect(wrapper.text()).toContain('Contact')
    expect(wrapper.text()).toContain('Services')
    expect(wrapper.text()).toContain('Vault & Launch')
  })

  // Tier 2: Dynamic State Mapping (Active, Completed, Upcoming)
  it('Invariant 2: Applies active, completed, and upcoming classes correctly based on currentStep', () => {
    const wrapper = mount(ProgressionIndicator, {
      props: {
        steps: mockSteps,
        currentStep: 2
      }
    })

    const circles = wrapper.findAll('.step-circle')
    // Step 1 is completed -> check icon rendered
    expect(circles[0].classes()).toContain('step-completed')
    expect(circles[0].find('.check-icon').exists()).toBe(true)

    // Step 2 is active -> step-active class applied
    expect(circles[1].classes()).toContain('step-active')
    expect(circles[1].find('.step-number').text()).toBe('2')

    // Step 3 is upcoming -> step-upcoming class applied
    expect(circles[2].classes()).toContain('step-upcoming')
    expect(circles[2].find('.step-number').text()).toBe('3')
  })

  // Tier 1: Connector Line Invariants
  it('Invariant 3: Renders connector lines between steps with active styling on completed transitions', () => {
    const wrapper = mount(ProgressionIndicator, {
      props: {
        steps: mockSteps,
        currentStep: 2
      }
    })

    const connectors = wrapper.findAll('.step-connector')
    expect(connectors).toHaveLength(2)
    // First connector is completed
    expect(connectors[0].classes()).toContain('connector-completed')
    // Second connector is not completed
    expect(connectors[1].classes()).not.toContain('connector-completed')
  })
})
