<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { RankedLead, ServiceCatalogItem } from '@/shared/types/lead'

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

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'convert', lead: RankedLead): void
  (e: 'disqualify', lead: RankedLead): void
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
  <div v-if="show && lead" class="drawer-overlay" @click.self="emit('close')">
    <div class="dossier-drawer">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div>
          <span class="tracking-uid">UID: {{ lead.prospect.id.slice(0, 8) }}</span>
          <h3 class="opportunity-title">{{ lead.prospect.business_name }}</h3>
        </div>
        <button type="button" class="close-btn" @click="emit('close')">✕</button>
      </div>

      <!-- Drawer Body -->
      <div class="drawer-body">
        <!-- Business Profile Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Prospect Profile</h4>
            <BaseBadge variant="primary">{{ lead.prospect.status }}</BaseBadge>
          </div>
          <div class="profile-grid">
            <div class="profile-item">
              <span class="profile-label">Website:</span>
              <a
                v-if="lead.prospect.website_url"
                :href="lead.prospect.website_url"
                target="_blank"
                rel="noopener noreferrer"
                class="website-link"
              >
                {{ lead.prospect.website_url }}
              </a>
              <span v-else class="profile-val">N/A</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Phone:</span>
              <span class="profile-val">{{ lead.prospect.phone ?? 'N/A' }}</span>
            </div>
            <div class="profile-item full-width">
              <span class="profile-label">Address:</span>
              <span class="profile-val">{{ lead.prospect.address ?? 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Opportunity Score Breakdown Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Opportunity Rubric</h4>
            <span class="score-pill">{{ lead.audit?.opportunity_score ?? 0 }} / 100</span>
          </div>

          <div class="total-score-card">
            <span class="score-title">Calculated Opportunity Score</span>
            <span class="score-number">{{ lead.audit?.opportunity_score ?? 0 }} / 100</span>
            <span class="score-subtitle">
              {{ (lead.audit?.opportunity_score ?? 0) >= 70 ? 'High-Yield Immediate Conversion Prospect' : 'Moderate Opportunity Prospect' }}
            </span>
          </div>

          <div class="deficit-factors-block">
            <h5>Service Deficit Factors</h5>
            <ul class="factors-list">
              <li :class="{ active: !lead.audit?.ssl_active }">
                <span class="factor-name">Missing / Insecure TLS/SSL</span>
                <span class="factor-pts">+25 pts (Domain Security SVC-SEC)</span>
              </li>
              <li :class="{ active: (lead.audit?.pdf_menu_count ?? 0) > 0 || !lead.audit?.mobile_viewport_present }">
                <span class="factor-name">Unreadable PDF Menus / Not Mobile Friendly</span>
                <span class="factor-pts">+30 pts (Web Modernization SVC-WEB)</span>
              </li>
              <li :class="{ active: (lead.audit?.response_time_ms ?? 0) > 1000 }">
                <span class="factor-name">Slow Server Response Time (>1000ms)</span>
                <span class="factor-pts">+15 pts (Performance Opt SVC-PERF)</span>
              </li>
              <li :class="{ active: (lead.audit?.pos_integrations?.length ?? 0) > 0 }">
                <span class="factor-name">Active POS / Commercial Ordering</span>
                <span class="factor-pts">+15 pts (Cloud POS Integration SVC-POS)</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Target Service Offerings Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Best-Fit Service Offerings</h4>
            <span class="catalog-count-badge">{{ matchingServices.length }} Matching</span>
          </div>

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
          <div v-else class="empty-state">
            No service catalog offerings met the minimum score or deficit threshold.
          </div>
        </div>
      </div>

      <!-- Drawer Footer Actions -->
      <div class="drawer-footer">
        <BaseButton
          label="Disqualify Lead"
          variant="danger"
          @click="emit('disqualify', lead)"
        />
        <BaseButton
          label="Convert to Client"
          variant="primary"
          @click="emit('convert', lead)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 50;
  display: flex;
  justify-content: flex-end;
}

.dossier-drawer {
  width: 100%;
  max-width: 540px;
  height: 100%;
  background-color: var(--color-background, #090d16);
  border-left: 1px solid var(--color-border, #1e293b);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #1e293b);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: var(--color-surface, #0f172a);
}

.tracking-uid {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.opportunity-title {
  margin: 0.25rem 0 0;
  font-size: 1.2rem;
  color: var(--color-text, #f1f5f9);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted, #94a3b8);
  font-size: 1.25rem;
  cursor: pointer;
}

.close-btn:hover {
  color: var(--color-text, #f1f5f9);
}

.drawer-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.dossier-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #1e293b);
  border-radius: 8px;
  padding: 1rem;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dossier-section h4 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text, #f1f5f9);
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.profile-item.full-width {
  grid-column: span 2;
}

.profile-label {
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.75rem;
}

.profile-val {
  color: var(--color-text, #f1f5f9);
}

.website-link {
  color: var(--color-primary, #3b82f6);
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.score-pill {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.15);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.total-score-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border, #1e293b);
  padding: 0.85rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.score-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-text-muted, #94a3b8);
  font-weight: 600;
}

.score-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary, #3b82f6);
}

.score-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.deficit-factors-block h5 {
  margin: 0.4rem 0 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text, #f1f5f9);
}

.factors-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.factors-list li {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--color-border, #334155);
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  opacity: 0.45;
}

.factors-list li.active {
  opacity: 1;
  border-color: var(--color-primary, #3b82f6);
  background: rgba(59, 130, 246, 0.08);
}

.factor-name {
  font-weight: 600;
  color: var(--color-text, #f1f5f9);
}

.factor-pts {
  color: var(--color-primary, #3b82f6);
  font-size: 0.75rem;
  font-weight: 500;
}

.catalog-count-badge {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.services-fit-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-fit-card {
  padding: 0.65rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--color-border, #334155);
  background-color: var(--color-surface-muted, #1e293b);
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
  gap: 0.4rem;
}

.service-code-text {
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--color-text-muted, #94a3b8);
  font-weight: 600;
}

.service-price-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #10b981;
}

.service-fit-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text, #f1f5f9);
}

.service-fit-desc {
  margin: 0;
  font-size: 0.72rem;
  color: var(--color-text-muted, #94a3b8);
  line-height: 1.35;
}

.empty-state {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
  font-style: italic;
  padding: 0.5rem 0;
}

.drawer-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border, #1e293b);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface, #0f172a);
}

@media (max-width: 768px) {
  .dossier-drawer {
    width: 100vw;
    max-width: 100vw;
    border-left: none;
    box-shadow: none;
  }

  .drawer-header {
    padding: 1rem 1.25rem;
  }

  .drawer-body {
    padding: 1rem;
    gap: 1rem;
  }

  .drawer-footer {
    padding: 1rem 1.25rem;
  }

  .profile-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
