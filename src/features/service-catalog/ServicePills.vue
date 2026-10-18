<script setup lang="ts">
import type { ServiceCatalogItem } from '@/entities/lead/model'

defineProps<{
  services: ServiceCatalogItem[]
  activeCode: string | null
}>()

defineEmits<{
  (e: 'select', code: string | null): void
}>()
</script>

<template>
  <div class="service-pills-container">
    <span class="pills-label">Service Focus:</span>
    <button
      type="button"
      :class="['service-pill', { active: activeCode === null }]"
      @click="$emit('select', null)"
    >
      All Services
    </button>
    <button
      v-for="svc in services"
      :key="svc.code"
      type="button"
      :class="['service-pill', { active: activeCode === svc.code }]"
      @click="$emit('select', svc.code)"
    >
      {{ svc.name }}
    </button>
  </div>
</template>

<style scoped>
.service-pills-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.pills-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.service-pill {
  padding: 0.3rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.service-pill:hover {
  background: var(--bg-surface-hover);
  color: var(--text-primary);
}

.service-pill.active {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}
</style>
