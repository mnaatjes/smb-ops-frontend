<script setup lang="ts">
export type ListVariant = 'bullet' | 'checkmark' | 'numbered'

withDefaults(
  defineProps<{
    items?: string[]
    variant?: ListVariant
    dense?: boolean
  }>(),
  {
    items: () => [],
    variant: 'bullet',
    dense: false
  }
)
</script>

<template>
  <component
    :is="variant === 'numbered' ? 'ol' : 'ul'"
    class="base-list"
    :class="[`variant-${variant}`, { 'is-dense': dense }]"
  >
    <slot>
      <li v-for="(item, index) in items" :key="index" class="list-item">
        <span v-if="variant === 'checkmark'" class="list-icon" aria-hidden="true">✓</span>
        <span v-else-if="variant === 'bullet'" class="list-bullet" aria-hidden="true">•</span>
        <span v-else-if="variant === 'numbered'" class="list-number" aria-hidden="true">{{ index + 1 }}.</span>
        <span class="list-text">{{ item }}</span>
      </li>
    </slot>
  </component>
</template>

<style scoped>
.base-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.base-list.is-dense {
  gap: 0.35rem;
  font-size: 0.8125rem;
}

.list-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.45;
}

.list-icon {
  color: var(--accent-primary, #10b981);
  font-weight: 700;
  line-height: 1.45;
  flex-shrink: 0;
}

.variant-checkmark .list-icon {
  color: #10b981;
}

.list-bullet {
  color: var(--accent-primary, #3b82f6);
  font-size: 1.1rem;
  line-height: 1.2;
  flex-shrink: 0;
}

.list-number {
  color: var(--text-secondary);
  font-weight: 600;
  font-feature-settings: 'tnum';
  min-width: 1.25rem;
  flex-shrink: 0;
}

.list-text {
  flex: 1;
}
</style>
