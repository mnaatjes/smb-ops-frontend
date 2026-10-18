<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useLeadStore } from '@/entities/lead/store'

const leadStore = useLeadStore()
const location = ref('Kalamazoo, MI')
const limit = ref(15)

async function handleDiscover() {
  if (!location.value.trim()) return
  await leadStore.discoverLeads(location.value.trim(), Number(limit.value) || 15)
}
</script>

<template>
  <div class="discovery-bar">
    <div class="input-controls">
      <BaseInput
        v-model="location"
        placeholder="Enter location (e.g. Kalamazoo, MI)"
        :disabled="leadStore.loading"
        class="location-field"
      />
      <BaseInput
        v-model="limit"
        type="number"
        placeholder="Limit"
        :disabled="leadStore.loading"
        class="limit-field"
      />
    </div>
    <div class="discover-btn-wrapper" title="Discovers candidates and immediately runs technical inspection audits">
      <BaseButton
        label="Discover & Audit Leads"
        :disabled="leadStore.loading || !location.trim()"
        @click="handleDiscover"
      />
      <div class="hover-tooltip">
        Discovers local prospects from web directories and immediately inspects their sites to calculate Opportunity Scores
      </div>
    </div>
  </div>
</template>

<style scoped>
.discovery-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--bg-surface);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.input-controls {
  display: flex;
  flex: 1;
  gap: 0.5rem;
}

.location-field {
  flex: 1;
}

.limit-field {
  width: 90px;
}

.discover-btn-wrapper {
  position: relative;
  display: inline-flex;
}

.hover-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 115%;
  right: 0;
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
  font-size: 0.75rem;
  padding: 0.4rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  pointer-events: none;
  z-index: 50;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.discover-btn-wrapper:hover .hover-tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
