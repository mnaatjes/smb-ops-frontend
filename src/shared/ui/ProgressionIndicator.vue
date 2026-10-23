<script setup lang="ts">
export interface ProgressionStep {
  number?: number
  label: string
}

withDefaults(
  defineProps<{
    steps: ProgressionStep[]
    currentStep: number
  }>(),
  {
    steps: () => []
  }
)
</script>

<template>
  <div class="progression-indicator" role="progressbar" :aria-valuenow="currentStep" :aria-valuemax="steps.length">
    <div
      v-for="(step, idx) in steps"
      :key="idx"
      class="step-cluster"
    >
      <div class="step-item">
        <div
          :class="[
            'step-circle',
            {
              'step-active': currentStep === (step.number ?? idx + 1),
              'step-completed': currentStep > (step.number ?? idx + 1),
              'step-upcoming': currentStep < (step.number ?? idx + 1)
            }
          ]"
        >
          <span v-if="currentStep > (step.number ?? idx + 1)" class="check-icon">✓</span>
          <span v-else class="step-number">{{ step.number ?? idx + 1 }}</span>
        </div>
        <span
          :class="[
            'step-label',
            {
              'label-active': currentStep === (step.number ?? idx + 1),
              'label-completed': currentStep > (step.number ?? idx + 1),
              'label-upcoming': currentStep < (step.number ?? idx + 1)
            }
          ]"
        >
          {{ step.label }}
        </span>
      </div>

      <!-- Connector line between steps -->
      <div
        v-if="idx < steps.length - 1"
        :class="[
          'step-connector',
          { 'connector-completed': currentStep > (step.number ?? idx + 1) }
        ]"
      />
    </div>
  </div>
</template>

<style scoped>
.progression-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--border-color);
}

.step-cluster {
  display: flex;
  align-items: center;
  flex: 1;
}

.step-cluster:last-child {
  flex: 0 0 auto;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.step-circle {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.2s ease-in-out;
}

.step-active {
  background-color: var(--accent-primary, #3b82f6);
  color: #ffffff;
  box-shadow: 0 0 0 3px var(--focus-ring, rgba(59, 130, 246, 0.25));
}

.step-completed {
  background-color: var(--accent-hover, #2563eb);
  color: #ffffff;
}

.step-upcoming {
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
}

.step-number {
  line-height: 1;
}

.check-icon {
  font-size: 0.85rem;
  line-height: 1;
}

.step-label {
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.label-active {
  color: var(--text-primary);
  font-weight: 600;
}

.label-completed {
  color: var(--text-secondary);
}

.label-upcoming {
  color: var(--text-muted);
}

.step-connector {
  flex: 1;
  height: 2px;
  background-color: var(--border-color);
  margin: 0 0.85rem;
  border-radius: 1px;
  transition: background-color 0.2s ease;
}

.connector-completed {
  background-color: var(--accent-primary, #3b82f6);
}
</style>
