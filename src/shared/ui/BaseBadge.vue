<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'slate'
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'neutral',
    size: 'md'
  }
)
</script>

<template>
  <span :class="['base-badge', `badge-${variant}`, `badge-${size}`]">
    <slot />
  </span>
</template>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.badge-sm {
  padding: 0.15rem 0.4rem;
  font-size: 0.7rem;
}

.badge-md {
  padding: 0.25rem 0.55rem;
  font-size: 0.75rem;
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

.badge-emerald {
  background-color: var(--badge-emerald-bg);
  color: var(--badge-emerald-text);
  border: 1px solid var(--badge-emerald-border);
}

.badge-amber {
  background-color: var(--badge-amber-bg);
  color: var(--badge-amber-text);
  border: 1px solid var(--badge-amber-border);
}

.badge-rose {
  background-color: var(--badge-rose-bg);
  color: var(--badge-rose-text);
  border: 1px solid var(--badge-rose-border);
}

.badge-indigo {
  background-color: var(--badge-indigo-bg);
  color: var(--badge-indigo-text);
  border: 1px solid var(--badge-indigo-border);
}

.badge-slate {
  background-color: var(--badge-slate-bg);
  color: var(--badge-slate-text);
  border: 1px solid var(--badge-slate-border);
}
</style>
