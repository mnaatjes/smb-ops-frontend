<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  to?: string | Record<string, unknown>
  current?: boolean
}

withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    separator?: string
  }>(),
  {
    separator: '/'
  }
)

const emit = defineEmits<{
  (e: 'navigate', item: BreadcrumbItem): void
}>()

function handleClick(item: BreadcrumbItem, event: MouseEvent): void {
  if (item.current || !item.to) {
    event.preventDefault()
    return
  }
  emit('navigate', item)
}
</script>

<template>
  <nav aria-label="Breadcrumb navigation" class="base-breadcrumb">
    <ol class="breadcrumb-list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
        :class="{ 'is-current': item.current }"
      >
        <component
          :is="item.to && !item.current ? 'RouterLink' : 'span'"
          :to="item.to && !item.current ? item.to : undefined"
          class="breadcrumb-node"
          :aria-current="item.current ? 'page' : undefined"
          @click="handleClick(item, $event)"
        >
          {{ item.label }}
        </component>

        <span
          v-if="index < items.length - 1"
          class="breadcrumb-separator"
          aria-hidden="true"
        >
          {{ separator }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.base-breadcrumb {
  display: flex;
  align-items: center;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--text-muted);
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.375rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.breadcrumb-node {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}

a.breadcrumb-node:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

.breadcrumb-item.is-current .breadcrumb-node {
  color: var(--text-primary);
  font-weight: 600;
  cursor: default;
  pointer-events: none;
}

.breadcrumb-separator {
  color: var(--text-muted);
  user-select: none;
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>
