<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    totalMinutes: number
    capMinutes?: number
    outOfScope?: boolean
  }>(),
  {
    capMinutes: 30,
    outOfScope: false
  }
)

const hasPlan = computed(() => (props.capMinutes ?? 0) > 0)

const percentage = computed(() => {
  if (!hasPlan.value || props.capMinutes! <= 0) return 0
  return Math.min(100, Math.round((props.totalMinutes / props.capMinutes!) * 100))
})

const gaugeStatus = computed<'normal' | 'warning' | 'danger' | 'none'>(() => {
  if (!hasPlan.value) return 'none'
  if (props.outOfScope || props.totalMinutes > props.capMinutes!) return 'danger'
  if (props.totalMinutes >= props.capMinutes! * 0.8) return 'warning'
  return 'normal'
})
</script>

<template>
  <div class="maintenance-gauge">
    <div class="gauge-labels">
      <span class="gauge-title">Monthly Maintenance (Retainer)</span>
      <span v-if="hasPlan" class="gauge-metrics">
        <strong>{{ totalMinutes }}</strong> / {{ capMinutes }} mins
      </span>
      <span v-else class="gauge-metrics no-plan">
        No Active Care Plan
      </span>
    </div>

    <div v-if="hasPlan" class="progress-bar-container">
      <div
        class="progress-fill"
        :class="gaugeStatus"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <div v-if="!hasPlan && totalMinutes > 0" class="out-of-scope-badge">
      ℹ️ {{ totalMinutes }}m Logged (Ad-Hoc / Out-of-Scope)
    </div>
    <div v-else-if="gaugeStatus === 'danger'" class="out-of-scope-badge">
      ⚠️ Out-of-Scope (Additional SOW Required)
    </div>
    <div v-else-if="gaugeStatus === 'warning'" class="warning-badge">
      ⚡ Near Cap ({{ (capMinutes ?? 0) - totalMinutes }} mins remaining)
    </div>
  </div>
</template>

<style scoped>
.maintenance-gauge {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.gauge-title {
  color: var(--color-text-muted, #94a3b8);
  font-weight: 500;
}

.gauge-metrics {
  color: var(--color-text, #f1f5f9);
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: var(--color-surface-muted, #1e293b);
  border-radius: 9999px;
  overflow: hidden;
  border: 1px solid var(--color-border, #334155);
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 9999px;
}

.progress-fill.normal {
  background-color: var(--color-success, #10b981);
}

.progress-fill.warning {
  background-color: var(--color-warning, #f59e0b);
}

.progress-fill.danger {
  background-color: var(--color-danger, #ef4444);
}

.out-of-scope-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-danger, #ef4444);
  background-color: rgba(239, 68, 68, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.warning-badge {
  font-size: 0.7rem;
  color: var(--color-warning, #f59e0b);
  background-color: rgba(245, 158, 11, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
</style>
