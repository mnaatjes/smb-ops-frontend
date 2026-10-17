<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    disabled?: boolean
    loading?: boolean
    variant?: 'primary' | 'secondary' | 'danger'
  }>(),
  {
    disabled: false,
    loading: false,
    variant: 'primary'
  }
)

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    type="button"
    :class="['base-button', `variant-${variant}`]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner"></span>
    <span :class="{ 'text-hidden': loading }">{{ label }}</span>
  </button>
</template>

<style scoped>
.base-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.15s ease, opacity 0.15s ease, border-color 0.15s ease;
}

.variant-primary {
  background-color: var(--accent-primary, #3b82f6);
  color: white;
}
.variant-primary:hover:not(:disabled) {
  background-color: var(--accent-hover, #2563eb);
}

.variant-secondary {
  background-color: var(--bg-surface-hover, #334155);
  color: var(--text-primary, #f8fafc);
  border-color: var(--border-color, #475569);
}
.variant-secondary:hover:not(:disabled) {
  background-color: var(--bg-surface, #1e293b);
}

.variant-danger {
  background-color: #ef4444;
  color: white;
}
.variant-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.text-hidden {
  visibility: hidden;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
