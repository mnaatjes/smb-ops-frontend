import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseWizard from '@/shared/ui/BaseWizard.vue'

describe('BaseWizard Component Matrix', () => {
  const mockSteps = [
    { number: 1, label: 'Profile' },
    { number: 2, label: 'Settings' },
    { number: 3, label: 'Confirm' }
  ]

  // Tier 1 & 2: Prop Reflection & Header Stepper Rendering
  it('Invariant 1: Renders step indicator and initial step slot content', () => {
    const wrapper = mount(BaseWizard, {
      props: {
        steps: mockSteps,
        currentStep: 1
      },
      slots: {
        'step-1': '<p id="step-1-content">Step 1 Body</p>'
      }
    })

    expect(wrapper.find('.wizard-header').exists()).toBe(true)
    expect(wrapper.find('#step-1-content').text()).toBe('Step 1 Body')
    expect(wrapper.text()).toContain('Continue')
    expect(wrapper.text()).not.toContain('Back')
  })

  // Tier 3: Sequential Progression & Navigation Events
  it('Invariant 2: Navigates forward on Continue and emits update:currentStep and step-change', async () => {
    const wrapper = mount(BaseWizard, {
      props: {
        steps: mockSteps,
        currentStep: 1
      }
    })

    const continueBtn = wrapper.findAll('button').find((b) => b.text() === 'Continue')
    expect(continueBtn).toBeDefined()
    await continueBtn?.trigger('click')

    expect(wrapper.emitted('update:currentStep')?.[0]).toEqual([2])
    expect(wrapper.emitted('step-change')?.[0]).toEqual([2])
  })

  // Tier 3: Backward Navigation
  it('Invariant 3: Displays Back button on step 2 and navigates backward on click', async () => {
    const wrapper = mount(BaseWizard, {
      props: {
        steps: mockSteps,
        currentStep: 2
      }
    })

    const backBtn = wrapper.findAll('button').find((b) => b.text() === 'Back')
    expect(backBtn).toBeDefined()
    await backBtn?.trigger('click')

    expect(wrapper.emitted('update:currentStep')?.[0]).toEqual([1])
    expect(wrapper.emitted('step-change')?.[0]).toEqual([1])
  })

  // Tier 3: Final Step Submission
  it('Invariant 4: Replaces Continue with submit button on final step and emits submit', async () => {
    const wrapper = mount(BaseWizard, {
      props: {
        steps: mockSteps,
        currentStep: 3,
        submitLabel: 'Deploy Environment'
      }
    })

    expect(wrapper.text()).not.toContain('Continue')
    const submitBtn = wrapper.findAll('button').find((b) => b.text() === 'Deploy Environment')
    expect(submitBtn).toBeDefined()
    await submitBtn?.trigger('click')

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  // Tier 5: Boundary & Validation Gate
  it('Invariant 5: Disables forward navigation when canAdvance is false', async () => {
    const wrapper = mount(BaseWizard, {
      props: {
        steps: mockSteps,
        currentStep: 1,
        canAdvance: false
      }
    })

    const continueBtn = wrapper.findAll('button').find((b) => b.text() === 'Continue')
    expect(continueBtn?.attributes('disabled')).toBeDefined()
    await continueBtn?.trigger('click')

    expect(wrapper.emitted('update:currentStep')).toBeUndefined()
  })
})
