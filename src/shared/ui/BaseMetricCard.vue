<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string | number
    variant?: 'nominal' | 'alert' | 'success' | 'warning'
    clickable?: boolean
    subtext?: string
  }>(),
  {
    variant: 'nominal',
    clickable: false,
    subtext: undefined
  }
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick(): void {
  emit('click')
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click')
  }
}
</script>

<template>
  <div
    class="base-metric-card"
    :class="[
      `variant-${variant}`,
      { 'is-clickable': clickable }
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="clickable ? handleClick() : undefined"
    @keydown="clickable ? handleKeyDown($event) : undefined"
  >
    <div class="metric-header">
      <span class="metric-label">{{ label }}</span>
      <div v-if="$slots.badge" class="metric-badge-slot">
        <slot name="badge" />
      </div>
    </div>

    <div class="metric-value-row">
      <span class="metric-value">{{ value }}</span>
      <div v-if="$slots.delta" class="metric-delta-slot">
        <slot name="delta" />
      </div>
    </div>

    <div v-if="subtext || $slots.subtext" class="metric-subtext">
      <slot name="subtext">
        <span>{{ subtext }}</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.base-metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.25rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  user-select: none;
}

.base-metric-card.is-clickable {
  cursor: pointer;
}

.base-metric-card.is-clickable:hover {
  transform: translateY(-2px);
  border-color: var(--accent-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.base-metric-card.is-clickable:active {
  transform: scale(0.99);
}

.metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.metric-value {
  font-size: 1.85rem;
  font-weight: 800;
  line-height: 1.1;
  font-feature-settings: 'tnum';
  color: var(--text-primary);
}

.metric-subtext {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Variant Styles */
.variant-alert {
  border-color: var(--accent-danger, #ef4444);
  background-color: rgba(239, 68, 68, 0.05);
}

.variant-alert .metric-value {
  color: var(--accent-danger, #ef4444);
}

.variant-success {
  border-color: var(--accent-primary, #10b981);
  background-color: rgba(16, 185, 129, 0.05);
}

.variant-success .metric-value {
  color: var(--accent-primary, #10b981);
}

.variant-warning {
  border-color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.05);
}

.variant-warning .metric-value {
  color: #f59e0b;
}
</style>
