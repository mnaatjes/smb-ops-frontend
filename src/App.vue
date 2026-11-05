<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import BaseSiteLayout from '@/app/layout/BaseSiteLayout.vue'
import '@/shared/styles/theme.css'

const route = useRoute()
const isIsolated = computed(() => route.meta.layout === 'isolated')
</script>

<template>
  <div id="app-root" :class="{ 'isolated-workspace': isIsolated }">
    <RouterView v-if="isIsolated" />
    <BaseSiteLayout v-else />

    <!-- Teleport Sinks Mounted at Root Body Level (per SDD-0014) -->
    <div id="drawer-portal" />
    <div id="modal-portal" />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  background-color: var(--bg-app);
  color: var(--text-primary);
  min-height: 100vh;
  font-family: var(--font-sans);
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

/* Base App Root */
#app-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Isolated Dev Workspace */
#app-root.isolated-workspace {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
