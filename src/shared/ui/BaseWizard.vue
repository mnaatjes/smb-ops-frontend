<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import ProgressionIndicator, { type ProgressionStep } from '@/shared/ui/ProgressionIndicator.vue'

const props = withDefaults(
  defineProps<{
    steps: ProgressionStep[]
    currentStep?: number
    canAdvance?: boolean
    isSubmitting?: boolean
    submitLabel?: string
    continueLabel?: string
    cancelLabel?: string
  }>(),
  {
    currentStep: 1,
    canAdvance: true,
    isSubmitting: false,
    submitLabel: 'Finish',
    continueLabel: 'Continue',
    cancelLabel: 'Cancel'
  }
)

const emit = defineEmits<{
  (e: 'update:currentStep', step: number): void
  (e: 'step-change', step: number): void
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const activeStep = ref(props.currentStep)

watch(
  () => props.currentStep,
  (newStep) => {
    activeStep.value = newStep
  }
)

function goToStep(step: number): void {
  if (step < 1 || step > props.steps.length) return
  activeStep.value = step
  emit('update:currentStep', step)
  emit('step-change', step)
}

function handleNext(): void {
  if (!props.canAdvance) return
  if (activeStep.value < props.steps.length) {
    goToStep(activeStep.value + 1)
  }
}

function handleBack(): void {
  if (activeStep.value > 1) {
    goToStep(activeStep.value - 1)
  }
}

function handleCancel(): void {
  emit('cancel')
}

function handleSubmit(): void {
  emit('submit')
}
</script>

<template>
  <div class="base-wizard">
    <!-- Header Step Indicator -->
    <header class="wizard-header">
      <slot name="header" :current-step="activeStep" :steps="steps">
        <ProgressionIndicator :steps="steps" :current-step="activeStep" />
      </slot>
    </header>

    <!-- Step Body Content Slot -->
    <div class="wizard-body">
      <slot :name="`step-${activeStep}`" :step="activeStep">
        <slot :step="activeStep" />
      </slot>
    </div>

    <!-- Standardized Wizard Navigation Footer -->
    <footer class="wizard-footer">
      <slot
        name="footer"
        :current-step="activeStep"
        :total-steps="steps.length"
        :handle-back="handleBack"
        :handle-next="handleNext"
        :handle-submit="handleSubmit"
        :handle-cancel="handleCancel"
      >
        <div class="wizard-footer-cluster">
          <div class="footer-left">
            <BaseButton
              v-if="activeStep > 1"
              label="Back"
              variant="secondary"
              @click="handleBack"
            />
          </div>

          <div class="footer-right">
            <BaseButton
              :label="cancelLabel"
              variant="secondary"
              @click="handleCancel"
            />
            <BaseButton
              v-if="activeStep < steps.length"
              :label="continueLabel"
              variant="primary"
              :disabled="!canAdvance"
              @click="handleNext"
            />
            <BaseButton
              v-else
              :label="submitLabel"
              variant="primary"
              :loading="isSubmitting"
              :disabled="!canAdvance"
              @click="handleSubmit"
            />
          </div>
        </div>
      </slot>
    </footer>
  </div>
</template>

<style scoped>
.base-wizard {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.wizard-header {
  width: 100%;
}

.wizard-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wizard-footer {
  width: 100%;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.wizard-footer-cluster {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.footer-left {
  display: flex;
  align-items: center;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
