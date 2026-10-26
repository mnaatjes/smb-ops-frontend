<script setup lang="ts">
withDefaults(
  defineProps<{
    fluid?: boolean
    maxWidth?: string
  }>(),
  {
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
      <slot />
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
  box-sizing: border-box;
}

@media (max-width: 640px) {
  .page-stage-wrapper {
    padding: 1rem;
    gap: 1rem;
  }
}
</style>
