<script setup lang="ts">
import { useTheme } from '@/shared/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :title="isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'"
    :aria-label="isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'"
    @click="toggleTheme"
  >
    <span v-if="isDark" class="icon">☀️</span>
    <span v-else class="icon">🌙</span>
    <span class="label">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.theme-toggle:hover {
  background-color: var(--bg-surface-hover);
}

.icon {
  font-size: 1rem;
  line-height: 1;
}

.label {
  user-select: none;
}
</style>
