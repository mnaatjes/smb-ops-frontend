<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  }>(),
  {
    variant: 'neutral'
  }
)
</script>

<template>
  <span :class="['base-badge', `badge-${variant}`]">
    <slot />
  </span>
</template>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

.badge-neutral {
  background-color: var(--badge-neutral-bg);
  color: var(--badge-neutral-text);
  border: 1px solid var(--badge-neutral-border);
}

.badge-primary {
  background-color: var(--badge-primary-bg);
  color: var(--badge-primary-text);
  border: 1px solid var(--badge-primary-border);
}

.badge-success {
  background-color: var(--badge-success-bg);
  color: var(--badge-success-text);
  border: 1px solid var(--badge-success-border);
}

.badge-warning {
  background-color: var(--badge-warning-bg);
  color: var(--badge-warning-text);
  border: 1px solid var(--badge-warning-border);
}

.badge-danger {
  background-color: var(--badge-danger-bg);
  color: var(--badge-danger-text);
  border: 1px solid var(--badge-danger-border);
}
</style>
