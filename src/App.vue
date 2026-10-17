<script setup lang="ts">
import { RouterView } from 'vue-router'
import '@/shared/styles/theme.css'
</script>

<template>
  <RouterView />
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-app);
  color: var(--text-primary);
  min-height: 100vh;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
</style>
