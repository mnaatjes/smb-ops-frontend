<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    fluid?: boolean
    maxWidth?: string
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    fluid: false,
    maxWidth: '1280px'
  }
)
</script>

<template>
  <main class="base-page-container" aria-label="Main Page Content Stage">
    <div
      class="page-stage-wrapper"
      :class="{ 'is-fluid': fluid }"
      :style="{ maxWidth: fluid ? '100%' : maxWidth }"
    >
      <!-- Page Header Cluster -->
      <header v-if="$slots.header || title" class="stage-header">
        <slot name="header">
          <div class="header-titles">
            <h1 v-if="title" class="stage-title">{{ title }}</h1>
            <p v-if="subtitle" class="stage-subtitle">{{ subtitle }}</p>
          </div>
        </slot>

        <!-- Header Actions Slot -->
        <div v-if="$slots.actions" class="stage-actions">
          <slot name="actions" />
        </div>
      </header>

      <!-- Toolbar / Filter Bar Slot -->
      <section v-if="$slots.toolbar" class="stage-toolbar">
        <slot name="toolbar" />
      </section>

      <!-- Primary Content Body Slot -->
      <div class="stage-body">
        <slot />
      </div>
    </div>
  </main>
</template>

<style scoped>
.base-page-container {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--bg-app);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.page-stage-wrapper {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stage-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

@media (min-width: 768px) {
  .stage-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stage-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0;
  color: var(--text-primary);
}

.stage-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.stage-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stage-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.stage-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
