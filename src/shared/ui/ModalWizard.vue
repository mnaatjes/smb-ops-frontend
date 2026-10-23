<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseWizard from '@/shared/ui/BaseWizard.vue'
import type { ProgressionStep } from '@/shared/ui/ProgressionIndicator.vue'

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    steps: ProgressionStep[]
    currentStep?: number
    canAdvance?: boolean
    isSubmitting?: boolean
    submitLabel?: string
    continueLabel?: string
    cancelLabel?: string
    requireConfirmOnDismiss?: boolean
  }>(),
  {
    title: '',
    currentStep: 1,
    canAdvance: true,
    isSubmitting: false,
    submitLabel: 'Finish',
    continueLabel: 'Continue',
    cancelLabel: 'Cancel',
    requireConfirmOnDismiss: true
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
  (e: 'step-change', step: number): void
  (e: 'update:currentStep', step: number): void
}>()

const activeStep = ref(props.currentStep)

watch(
  () => props.currentStep,
  (val) => {
    activeStep.value = val
  }
)

function handleStepChange(step: number): void {
  activeStep.value = step
  emit('update:currentStep', step)
  emit('step-change', step)
}

function handleDismiss(): void {
  if (props.requireConfirmOnDismiss && activeStep.value > 1) {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to exit? Any unsaved progress will be lost.')
      if (!confirmed) return
    }
  }
  emit('close')
}

function handleSubmit(): void {
  emit('submit')
}
</script>

<template>
  <BaseModal :show="show" :title="title" @close="handleDismiss">
    <BaseWizard
      :steps="steps"
      :current-step="activeStep"
      :can-advance="canAdvance"
      :is-submitting="isSubmitting"
      :submit-label="submitLabel"
      :continue-label="continueLabel"
      :cancel-label="cancelLabel"
      @update:current-step="handleStepChange"
      @cancel="handleDismiss"
      @submit="handleSubmit"
    >
      <template #header="headerProps">
        <slot name="header" v-bind="headerProps" />
      </template>

      <!-- Dynamically expose step slots for up to 10 steps or default -->
      <template v-for="step in steps.length" :key="step" #[`step-${step}`]="slotProps">
        <slot :name="`step-${step}`" v-bind="slotProps" />
      </template>

      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>

      <template #footer="footerProps">
        <slot name="footer" v-bind="footerProps" />
      </template>
    </BaseWizard>
  </BaseModal>
</template>
