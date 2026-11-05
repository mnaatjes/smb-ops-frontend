<script setup lang="ts">
import BaseDrawer from '@/shared/ui/BaseDrawer.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseList from '@/shared/ui/BaseList.vue'
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
  if (svc.pricing_model === 'HYBRID') {
    return `$${min.toFixed(2)} – $${max.toFixed(2)} Flat or Retainer`
  }
  return min === max
    ? `$${min.toFixed(2)} Flat Fee`
    : `$${min.toFixed(2)} – $${max.toFixed(2)} Flat Fee`
}

function getRankVariant(rank?: string): 'primary' | 'warning' | 'emerald' | 'danger' | 'neutral' {
  if (!rank) return 'neutral'
  if (rank.includes('1A')) return 'primary'
  if (rank.includes('1B')) return 'neutral'
  if (rank.includes('3')) return 'warning'
  if (rank.includes('4')) return 'neutral'
  return 'primary'
}
</script>

<template>
  <BaseDrawer
    :show="show && !!service"
    :title="service ? `${service.rank || 'Core Service'}: ${service.name}` : 'Service Details'"
    subtitle="Full commercial profile, technical deliverables, and audit criteria"
    size="md"
    @close="emit('close')"
  >
    <div v-if="service" class="service-details-drawer">
      <!-- Commercial Summary Banner -->
      <div class="pricing-banner">
        <div class="banner-left">
          <BaseBadge :label="service.rank || 'Rank 1A'" :variant="getRankVariant(service.rank)" />
          <span class="code-tag">{{ service.code }}</span>
        </div>
        <div class="banner-right">
          <span class="pricing-headline">{{ formatPrice(service) }}</span>
          <span class="pricing-model">{{ (service.pricing_model || 'FLAT_FEE').replace('_', ' ') }}</span>
        </div>
      </div>

      <!-- Overview Section -->
      <section class="details-section">
        <h5 class="section-title">Overview & Value Proposition</h5>
        <p class="section-body">{{ service.description }}</p>
      </section>

      <!-- Target Profile -->
      <section v-if="service.target_profile" class="details-section">
        <h5 class="section-title">Target Client Profile</h5>
        <div class="target-callout">{{ service.target_profile }}</div>
      </section>

      <!-- Scope of Work -->
      <section v-if="service.scope && service.scope.length > 0" class="details-section">
        <h5 class="section-title">Scope of Work & Technical Operations</h5>
        <BaseList :items="service.scope" variant="bullet" />
      </section>

      <!-- Tangible Deliverables -->
      <section v-if="service.deliverables && service.deliverables.length > 0" class="details-section">
        <h5 class="section-title">Client Deliverables</h5>
        <BaseList :items="service.deliverables" variant="checkmark" />
      </section>

      <!-- Exclusions / Boundaries -->
      <section v-if="service.exclusions && service.exclusions.length > 0" class="details-section exclusions-box">
        <div class="exclusions-header">
          <h5 class="section-title exclusion-title">Out of Scope / Contractual Boundaries</h5>
          <span class="exclusion-subtitle">
            Pre-defined non-deliverables to protect against scope creep during engagement delivery.
          </span>
        </div>
        <BaseList :items="service.exclusions" variant="bullet" />
      </section>

      <!-- Active Audit Parameters -->
      <section v-if="service.audit_parameters && service.audit_parameters.length > 0" class="details-section">
        <h5 class="section-title">Active Audit Parameters</h5>
        <div class="params-chips">
          <span
            v-for="param in service.audit_parameters"
            :key="param"
            class="param-chip"
          >
            🔍 {{ param }}
          </span>
        </div>
      </section>
    </div>
  </BaseDrawer>
</template>

<style scoped>
.service-details-drawer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.pricing-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.code-tag {
  font-family: monospace;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.banner-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.pricing-headline {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.pricing-model {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin: 0;
}

.section-body {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--text-primary);
  margin: 0;
}

.target-callout {
  padding: 0.75rem 1rem;
  background-color: var(--bg-surface-subtle);
  border-left: 3px solid var(--accent-primary);
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.exclusions-box {
  background-color: var(--bg-surface-subtle);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.exclusions-header {
  margin-bottom: 0.5rem;
}

.exclusion-title {
  color: var(--color-warning, #d97706);
}

.exclusion-subtitle {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.params-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.param-chip {
  font-size: 0.8125rem;
  font-family: monospace;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}
</style>
