<script setup lang="ts">
import BaseBreadcrumb, { type BreadcrumbItem } from './BaseBreadcrumb.vue'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    breadcrumbs?: BreadcrumbItem[]
  }>(),
  {
    subtitle: undefined,
    breadcrumbs: undefined
  }
)

defineEmits<{
  (e: 'navigate-breadcrumb', item: BreadcrumbItem): void
}>()
</script>

<template>
  <header class="base-page-header" aria-label="Page Title and Context">
    <!-- Breadcrumb Orientation Line -->
    <div v-if="breadcrumbs && breadcrumbs.length > 0" class="page-header-breadcrumbs">
      <BaseBreadcrumb
        :items="breadcrumbs"
        @navigate="$emit('navigate-breadcrumb', $event)"
      />
    </div>

    <!-- Main Title & Action Bar Row -->
    <div class="page-header-main-row">
      <div class="title-cluster">
        <h1 class="page-title">{{ title }}</h1>
        <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
      </div>

      <!-- Action Cluster Slot -->
      <div v-if="$slots.actions" class="page-actions-cluster">
        <slot name="actions" />
      </div>
    </div>

    <!-- Optional Context / Filter Slot Below Title -->
    <div v-if="$slots.context" class="page-header-context">
      <slot name="context" />
    </div>
  </header>
</template>

<style scoped>
.base-page-header {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.page-header-breadcrumbs {
  display: flex;
  align-items: center;
}

.page-header-main-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.title-cluster {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  font-family: var(--font-sans);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.page-actions-cluster {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.page-header-context {
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .page-header-main-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .page-actions-cluster {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
