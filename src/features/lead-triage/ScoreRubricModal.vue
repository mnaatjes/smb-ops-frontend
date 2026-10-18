<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import type { RankedLead, ServiceCatalogItem } from '@/entities/lead/model'

const props = withDefaults(
  defineProps<{
    show: boolean
    lead: RankedLead | null
    services?: ServiceCatalogItem[]
  }>(),
  {
    services: () => []
  }
)

defineEmits<{
  (e: 'close'): void
}>()

function formatPrice(svc: ServiceCatalogItem): string {
  const min = svc.price_min ?? 0
  const max = svc.price_max ?? min
  if (svc.pricing_model === 'MONTHLY_RETAINER') {
    return min === max
      ? `$${min.toFixed(0)} / mo`
      : `$${min.toFixed(0)}–$${max.toFixed(0)} / mo`
  }
  if (svc.pricing_model === 'HYBRID') {
    return `$${min.toFixed(0)}–$${max.toFixed(0)} Flat`
  }
  return min === max
    ? `$${min.toFixed(0)} Flat`
    : `$${min.toFixed(0)}–$${max.toFixed(0)} Flat`
}

const matchingServices = computed<ServiceCatalogItem[]>(() => {
  if (!props.lead || !props.services || props.services.length === 0) return []
  const audit = props.lead.audit
  const score = audit?.opportunity_score ?? 0

  return props.services.filter((svc) => {
    const meetsMinScore = score >= (svc.minimum_opportunity_score || 0)
    if (!meetsMinScore) return false
    if (!audit || !svc.audit_parameters || svc.audit_parameters.length === 0) return true

    return svc.audit_parameters.some((param) => {
      if (param === 'ssl_active') return !audit.ssl_active
      if (param === 'mobile_viewport_present') return !audit.mobile_viewport_present
      if (param === 'response_time_ms') return (audit.response_time_ms ?? 0) > 1000
      if (param === 'status_code') return (audit.status_code ?? 200) >= 400
      if (param === 'pos_integrations') return (audit.pos_integrations?.length ?? 0) > 0
      if (param === 'pdf_menu_count') return (audit.pdf_menu_count ?? 0) > 0
      if (param === 'tel_link_present') return !audit.tel_link_present
      if (param === 'cms_detected') return !!audit.cms_detected
      return true
    })
  })
})
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

      <!-- Qualified Service Categories -->
      <div class="rubric-section">
        <h4>Target Service Categories (Best Fit Offerings)</h4>
        <div v-if="matchingServices.length > 0" class="services-fit-list">
          <div
            v-for="svc in matchingServices"
            :key="svc.code"
            class="service-fit-card"
          >
            <div class="service-fit-header">
              <div class="badge-group">
                <BaseBadge variant="primary">{{ svc.rank || 'Service' }}</BaseBadge>
                <span class="service-code-text">{{ svc.code }}</span>
              </div>
              <span class="service-price-text">{{ formatPrice(svc) }}</span>
            </div>
            <div class="service-fit-name">{{ svc.name }}</div>
            <p class="service-fit-desc">{{ svc.description }}</p>
          </div>
        </div>
        <div v-else class="empty-services-fit">
          No service catalog offerings met the minimum score or deficit threshold.
        </div>
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

.services-fit-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.service-fit-card {
  padding: 0.75rem 0.85rem;
  border-radius: 6px;
  border: 1px solid var(--accent-primary);
  background: var(--bg-surface-hover);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.service-fit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-code-text {
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--text-muted);
  font-weight: 600;
}

.service-price-text {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-hover);
}

.service-fit-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.service-fit-desc {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.35;
}

.empty-services-fit {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px dashed var(--border-color);
  background: var(--bg-surface);
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
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
