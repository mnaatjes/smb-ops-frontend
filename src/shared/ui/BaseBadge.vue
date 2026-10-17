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
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.badge-primary {
  background-color: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.badge-success {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.badge-warning {
  background-color: #fef9c3;
  color: #854d0e;
  border: 1px solid #fef08a;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
</style>
