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
  <div class="batch-audit-trigger">
    <BaseButton
      :label="isAuditing ? 'Auditing Batch...' : 'Run Batch Audit'"
      :disabled="leadStore.loading || isAuditing"
      @click="handleBatchAudit"
    />
  </div>
</template>

<style scoped>
.batch-audit-trigger {
  display: inline-flex;
}
</style>
