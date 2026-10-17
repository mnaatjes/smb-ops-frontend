<script setup lang="ts">
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { RankedLead } from '@/entities/lead/model'

defineProps<{
  show: boolean
  lead: RankedLead | null
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <BaseModal
    :show="show"
    :title="`Opportunity Score Breakdown: ${lead?.prospect.business_name || ''}`"
    @close="$emit('close')"
  >
    <div class="rubric-body">
      <div class="total-score-card">
        <span class="score-title">Calculated Opportunity Score</span>
        <span class="score-number">{{ lead?.audit?.opportunity_score ?? 0 }} / 100</span>
      </div>

      <div class="rubric-section">
        <h4>Service Deficit Factors (Why this business qualifies)</h4>
        <ul class="factors-list">
          <li :class="{ active: !lead?.audit?.ssl_active }">
            <span class="factor-name">Missing / Insecure TLS/SSL</span>
            <span class="factor-pts">+25 pts (Qualifies: Domain Security SVC-SEC)</span>
          </li>
          <li :class="{ active: (lead?.audit?.pdf_menu_count ?? 0) > 0 || !lead?.audit?.mobile_viewport_present }">
            <span class="factor-name">Unreadable PDF Menus / Not Mobile Friendly</span>
            <span class="factor-pts">+30 pts (Qualifies: Web Modernization SVC-WEB)</span>
          </li>
          <li :class="{ active: (lead?.audit?.response_time_ms ?? 0) > 1000 }">
            <span class="factor-name">Slow Server Response Time (>1000ms)</span>
            <span class="factor-pts">+15 pts (Qualifies: Performance Optimization SVC-PERF)</span>
          </li>
          <li :class="{ active: (lead?.audit?.pos_integrations?.length ?? 0) > 0 }">
            <span class="factor-name">Active POS / Commercial Ordering Footprint</span>
            <span class="factor-pts">+15 pts (Qualifies: Cloud POS Integration SVC-POS)</span>
          </li>
        </ul>
      </div>

      <p class="rubric-footnote">
        * Opportunity scores align directly with consulting service potential. Scores &ge; 70 represent immediate, high-probability conversion candidates.
      </p>
    </div>

    <template #footer>
      <BaseButton label="Done" variant="secondary" @click="$emit('close')" />
    </template>
  </BaseModal>
</template>

<style scoped>
.rubric-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.total-score-card {
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-color);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.score-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-secondary);
  font-weight: 500;
}

.score-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.rubric-section h4 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.factors-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.factors-list li {
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  opacity: 0.45;
}

.factors-list li.active {
  opacity: 1;
  border-color: var(--accent-primary);
  background: var(--bg-surface-hover);
}

.factor-name {
  font-weight: 600;
  color: var(--text-primary);
}

.factor-pts {
  color: var(--accent-hover);
  font-size: 0.75rem;
  font-weight: 500;
}

.rubric-footnote {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.4;
}
</style>
