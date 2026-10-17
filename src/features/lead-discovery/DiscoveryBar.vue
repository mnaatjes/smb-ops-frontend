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
    <BaseButton
      label="Discover Leads"
      :disabled="leadStore.loading || !location.trim()"
      @click="handleDiscover"
    />
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
</style>
