<script setup lang="ts">
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import type { AuditResult } from '@/entities/lead/model'

defineProps<{
  audit: AuditResult | null
}>()
</script>

<template>
  <div class="issue-chips">
    <template v-if="audit">
      <BaseBadge :variant="audit.ssl_active ? 'success' : 'danger'">
        {{ audit.ssl_active ? 'SSL Active' : 'No SSL' }}
      </BaseBadge>

      <BaseBadge v-if="audit.pdf_menu_count > 0" variant="warning">
        {{ audit.pdf_menu_count }} PDF Menu(s)
      </BaseBadge>

      <BaseBadge v-if="!audit.mobile_viewport_present" variant="danger">
        No Mobile Viewport
      </BaseBadge>

      <BaseBadge v-if="audit.cms_detected" variant="neutral">
        {{ audit.cms_detected }}
      </BaseBadge>

      <BaseBadge
        v-for="pos in audit.pos_integrations"
        :key="pos"
        variant="primary"
      >
        POS: {{ pos }}
      </BaseBadge>
    </template>
    <span v-else class="text-muted">No audit data</span>
  </div>
</template>

<style scoped>
.issue-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
}

.text-muted {
  font-size: 0.8rem;
  color: #9ca3af;
  font-style: italic;
}
</style>
