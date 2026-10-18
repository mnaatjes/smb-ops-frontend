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
      ? `$${min.toFixed(2)} / month`
      : `$${min.toFixed(2)} – $${max.toFixed(2)} / month`
  }
  if (svc.pricing_model === 'HYBRID') {
    return `$${min.toFixed(2)} – $${max.toFixed(2)} Flat or $50/mo Retainer Add-on`
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

      <!-- Exclusions & Non-Goals -->
      <div v-if="service.exclusions && service.exclusions.length > 0" class="details-section exclusions-box">
        <h5 class="section-title exclusion-title">Strict Exclusions & Boundaries</h5>
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
            <code>{{ param }}</code>
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
  padding-right: 0.25rem;
}

.pricing-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background-color: var(--color-bg-secondary, #f8fafc);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius-md, 8px);
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rank-tag {
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.25rem 0.6rem;
  background-color: var(--color-primary-subtle, #e0e7ff);
  color: var(--color-primary, #3b82f6);
  border-radius: var(--radius-sm, 4px);
}

.code-tag {
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--color-text-muted, #64748b);
}

.banner-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.pricing-headline {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-success, #16a34a);
}

.pricing-model {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted, #64748b);
  letter-spacing: 0.05em;
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.section-title {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary, #475569);
}

.section-body {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text, #1e293b);
}

.target-callout {
  padding: 0.6rem 0.85rem;
  background-color: #f1f5f9;
  border-left: 3px solid #3b82f6;
  border-radius: 0 4px 4px 0;
  font-style: italic;
}

.scope-list, .deliverables-list, .exclusions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.scope-item, .deliverable-item, .exclusion-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

.check-bullet {
  color: var(--color-success, #16a34a);
  font-weight: 700;
}

.box-icon {
  font-size: 0.9rem;
}

.prohibit-icon {
  color: var(--color-danger, #dc2626);
  font-weight: 800;
}

.exclusions-box {
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px dashed #fca5a5;
  border-radius: 6px;
}

.exclusion-title {
  color: #991b1b;
}

.params-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.param-chip {
  padding: 0.2rem 0.5rem;
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
