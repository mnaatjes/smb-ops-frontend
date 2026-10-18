<script setup lang="ts">
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { ServiceCatalogItem } from '@/shared/types/lead'

defineProps<{
  show: boolean
  service: ServiceCatalogItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function formatPrice(svc: ServiceCatalogItem): string {
  const min = svc.price_min ?? 0
  const max = svc.price_max ?? min
  if (svc.pricing_model === 'MONTHLY_RETAINER') {
    return min === max
      ? `$${min.toFixed(2)} / mo`
      : `$${min.toFixed(2)} – $${max.toFixed(2)} / mo`
  }
  if (svc.pricing_model === 'HYBRID') {
    return `$${min.toFixed(2)} – $${max.toFixed(2)} Flat or $50/mo Retainer`
  }
  return min === max
    ? `$${min.toFixed(2)} Flat Fee`
    : `$${min.toFixed(2)} – $${max.toFixed(2)} Flat Fee`
}
</script>

<template>
  <BaseModal
    :show="show && !!service"
    :title="service ? `${service.rank || 'Service'}: ${service.name}` : 'Service Details'"
    @close="emit('close')"
  >
    <div v-if="service" class="service-details">
      <!-- Commercial Summary Banner -->
      <div class="pricing-banner">
        <div class="banner-left">
          <span class="rank-tag">{{ service.rank || 'Rank 1A' }}</span>
          <span class="code-tag">{{ service.code }}</span>
        </div>
        <div class="banner-right">
          <span class="pricing-headline">{{ formatPrice(service) }}</span>
          <span class="pricing-model">{{ (service.pricing_model || 'FLAT_FEE').replace('_', ' ') }}</span>
        </div>
      </div>

      <!-- Description -->
      <div class="details-section">
        <h5 class="section-title">Overview & Value Proposition</h5>
        <p class="section-body">{{ service.description }}</p>
      </div>

      <!-- Target Profile -->
      <div v-if="service.target_profile" class="details-section">
        <h5 class="section-title">Target Client Profile</h5>
        <p class="section-body target-callout">{{ service.target_profile }}</p>
      </div>

      <!-- Scope of Work -->
      <div v-if="service.scope && service.scope.length > 0" class="details-section">
        <h5 class="section-title">Scope of Work & Technical Operations</h5>
        <ul class="scope-list">
          <li v-for="(item, idx) in service.scope" :key="idx" class="scope-item">
            <span class="check-bullet">✓</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- Tangible Deliverables -->
      <div v-if="service.deliverables && service.deliverables.length > 0" class="details-section">
        <h5 class="section-title">Client Deliverables</h5>
        <ul class="deliverables-list">
          <li v-for="(deliv, idx) in service.deliverables" :key="idx" class="deliverable-item">
            <span class="box-icon">📦</span>
            <strong>{{ deliv }}</strong>
          </li>
        </ul>
      </div>

      <!-- Contractual Boundaries / Anti-Scope Creep Exclusions -->
      <div v-if="service.exclusions && service.exclusions.length > 0" class="details-section exclusions-box">
        <div class="exclusions-header">
          <h5 class="section-title exclusion-title">Out of Scope / Contractual Boundaries</h5>
          <span class="exclusion-subtitle">
            Pre-defined non-deliverables to protect against scope creep during delivery.
          </span>
        </div>
        <ul class="exclusions-list">
          <li v-for="(ex, idx) in service.exclusions" :key="idx" class="exclusion-item">
            <span class="prohibit-icon">✕</span>
            <span>{{ ex }}</span>
          </li>
        </ul>
      </div>

      <!-- Audit Parameter Telemetry -->
      <div class="details-section">
        <h5 class="section-title">Governing Automated Audit Telemetry</h5>
        <div class="params-chips">
          <span v-for="param in service.audit_parameters" :key="param" class="param-chip">
            <code class="param-code">{{ param }}</code>
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton label="Close" variant="secondary" @click="emit('close')" />
    </template>
  </BaseModal>
</template>

<style scoped>
.service-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 70vh;
  overflow-y: auto;
  padding: 0.25rem 0.5rem 0.5rem 0.25rem;
}

/* Pricing Banner Redesign */
.pricing-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: var(--bg-surface-subtle, #f1f5f9);
  border: 1px solid var(--border-color, #cbd5e1);
  border-radius: 8px;
  gap: 1rem;
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.rank-tag {
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.35rem 0.75rem;
  background-color: #e0e7ff;
  color: #3730a3;
  border-radius: 6px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.code-tag {
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary, #475569);
  background-color: var(--bg-surface, #ffffff);
  border: 1px solid var(--border-color, #cbd5e1);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
}

.banner-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 0.15rem;
}

.pricing-headline {
  font-size: 1.2rem;
  font-weight: 800;
  color: #15803d;
  line-height: 1.2;
}

.pricing-model {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-secondary, #64748b);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Sections */
.details-section {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.section-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary, #475569);
}

.section-body {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-primary, #1e293b);
}

.target-callout {
  padding: 0.65rem 0.9rem;
  background-color: var(--bg-surface-subtle, #f8fafc);
  border-left: 3px solid var(--accent-primary, #3b82f6);
  border-radius: 0 6px 6px 0;
  font-style: italic;
}

.scope-list, .deliverables-list, .exclusions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.scope-item, .deliverable-item, .exclusion-item {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--text-primary, #1e293b);
}

.check-bullet {
  color: #16a34a;
  font-weight: 700;
}

.box-icon {
  font-size: 0.9rem;
}

.prohibit-icon {
  color: #b91c1c;
  font-weight: 800;
}

/* Exclusions / Contractual Boundaries */
.exclusions-box {
  padding: 0.9rem 1.15rem;
  background-color: var(--bg-surface-subtle, #f8fafc);
  border: 1px solid var(--border-color, #cbd5e1);
  border-radius: 8px;
  gap: 0.65rem;
}

.exclusions-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.exclusion-title {
  color: var(--text-primary, #0f172a);
}

.exclusion-subtitle {
  font-size: 0.82rem;
  color: var(--text-secondary, #475569);
  line-height: 1.4;
  font-weight: 500;
}

/* Parameter Chips - High Contrast */
.params-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.param-chip {
  padding: 0.3rem 0.65rem;
  background-color: var(--bg-surface-subtle, #e2e8f0);
  border: 1px solid var(--border-color, #94a3b8);
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
}

.param-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
}
</style>
