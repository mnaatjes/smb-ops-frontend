<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useLeadStore } from '@/entities/lead/store'

const props = withDefaults(
  defineProps<{
    limit?: number
  }>(),
  {
    limit: 15
  }
)

const leadStore = useLeadStore()
const isAuditing = ref(false)

async function handleBatchAudit() {
  isAuditing.value = true
  try {
    await leadStore.runBatchAudit(props.limit)
  } finally {
    isAuditing.value = false
  }
}
</script>

<template>
  <div class="batch-audit-trigger" title="Inspects SSL, speed, mobile viewport, PDF menus, and POS across pending leads">
    <BaseButton
      :label="isAuditing ? 'Auditing Batch...' : 'Run Batch Audit'"
      :disabled="leadStore.loading || isAuditing"
      @click="handleBatchAudit"
    />
    <div class="hover-tooltip">
      Inspects SSL, speed, mobile viewport, PDF menus, and POS across pending leads
    </div>
  </div>
</template>

<style scoped>
.batch-audit-trigger {
  position: relative;
  display: inline-flex;
}

.hover-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 115%;
  left: 50%;
  transform: translateX(-50%);
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

.batch-audit-trigger:hover .hover-tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
