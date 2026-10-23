<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'info' | 'success' | 'warning' | 'danger'
    title?: string
    dismissible?: boolean
  }>(),
  {
    variant: 'info',
    title: undefined,
    dismissible: false
  }
)

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

const iconMap: Record<string, string> = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠️',
  danger: '✕'
}
</script>

<template>
  <div
    class="base-alert"
    :class="`alert-${variant}`"
    role="alert"
  >
    <div class="alert-icon" aria-hidden="true">
      <slot name="icon">
        <span>{{ iconMap[variant] }}</span>
      </slot>
    </div>

    <div class="alert-content">
      <h5 v-if="title || $slots.title" class="alert-title">
        <slot name="title">{{ title }}</slot>
      </h5>
      <div class="alert-message">
        <slot />
      </div>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="alert-dismiss-btn"
      aria-label="Dismiss alert"
      @click="emit('dismiss')"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.base-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.4;
  border: 1px solid transparent;
  transition: opacity 0.2s ease;
}

.alert-icon {
  font-size: 1rem;
  line-height: 1.2;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.alert-title {
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0;
}

.alert-message {
  color: inherit;
}

.alert-dismiss-btn {
  background: transparent;
  border: none;
  font-size: 0.85rem;
  line-height: 1;
  color: inherit;
  opacity: 0.65;
  cursor: pointer;
  padding: 0.15rem;
  border-radius: 4px;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.alert-dismiss-btn:hover {
  opacity: 1;
}

/* Variant Palettes */
.alert-info {
  background-color: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.25);
  color: #3b82f6;
}

.alert-success {
  background-color: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.25);
  color: #10b981;
}

.alert-warning {
  background-color: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.25);
  color: #f59e0b;
}

.alert-danger {
  background-color: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.25);
  color: #ef4444;
}
</style>
