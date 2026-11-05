<script setup lang="ts">
import BaseDrawer from '@/shared/ui/BaseDrawer.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseList from '@/shared/ui/BaseList.vue'
import type { ServiceCatalogItem } from '@/shared/types/lead'

defineProps<{
  show: boolean
  plan: ServiceCatalogItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function formatRate(plan: ServiceCatalogItem): string {
  const rate = plan.price_min ?? 0
  return `$${rate.toFixed(2)} / mo`
}

function getCapBadgeText(plan: ServiceCatalogItem): string {
  const cap = plan.monthly_retainer_cap_minutes ?? 0
  if (cap === 0) return '0m Cap (Automated)'
  return `${cap}m Support Cap`
}

function getCapVariant(cap?: number): 'neutral' | 'primary' | 'warning' | 'emerald' | 'danger' {
  if (!cap || cap === 0) return 'neutral'
  if (cap <= 30) return 'primary'
  if (cap <= 60) return 'emerald'
  return 'warning'
}
</script>

<template>
  <BaseDrawer
    :show="show && !!plan"
    :title="plan ? `${plan.name} (${plan.code})` : 'Care Plan Details'"
    subtitle="Recurring maintenance scope, monthly deliverables, and retainer commitments"
    size="md"
    @close="emit('close')"
  >
    <div v-if="plan" class="plan-details-drawer">
      <!-- Commercial Summary Banner -->
      <div class="pricing-banner">
        <div class="banner-left">
          <BaseBadge :label="getCapBadgeText(plan)" :variant="getCapVariant(plan.monthly_retainer_cap_minutes)" />
          <span class="code-tag">{{ plan.code }}</span>
        </div>
        <div class="banner-right">
          <span class="pricing-headline">{{ formatRate(plan) }}</span>
          <span class="pricing-model">Recurring Retainer</span>
        </div>
      </div>

      <!-- Description Section -->
      <section class="details-section">
        <h5 class="section-title">Overview & Continuity Value</h5>
        <p class="section-body">{{ plan.description }}</p>
      </section>

      <!-- Target Profile -->
      <section v-if="plan.target_profile" class="details-section">
        <h5 class="section-title">Target Client Profile</h5>
        <div class="target-callout">{{ plan.target_profile }}</div>
      </section>

      <!-- Recurring Scope of Work -->
      <section v-if="plan.scope && plan.scope.length > 0" class="details-section">
        <h5 class="section-title">Recurring Scope & SLA Commitments</h5>
        <BaseList :items="plan.scope" variant="bullet" />
      </section>

      <!-- Tangible Deliverables -->
      <section v-if="plan.deliverables && plan.deliverables.length > 0" class="details-section">
        <h5 class="section-title">Monthly Client Deliverables</h5>
        <BaseList :items="plan.deliverables" variant="checkmark" />
      </section>

      <!-- Exclusions / Boundaries -->
      <section v-if="plan.exclusions && plan.exclusions.length > 0" class="details-section exclusions-box">
        <div class="exclusions-header">
          <h5 class="section-title exclusion-title">Out of Scope / Non-Retainer Boundaries</h5>
          <span class="exclusion-subtitle">
            Items requiring separate one-off project contracts or additional billable time.
          </span>
        </div>
        <BaseList :items="plan.exclusions" variant="bullet" />
      </section>

      <!-- Active Audit Telemetry Parameters -->
      <section v-if="plan.audit_parameters && plan.audit_parameters.length > 0" class="details-section">
        <h5 class="section-title">Telemetry & Automated Probes</h5>
        <div class="params-chips">
          <span
            v-for="param in plan.audit_parameters"
            :key="param"
            class="param-chip"
          >
            📡 {{ param }}
          </span>
        </div>
      </section>
    </div>
  </BaseDrawer>
</template>

<style scoped>
.plan-details-drawer {
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
  color: var(--color-emerald, #10b981);
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
  border-left: 3px solid var(--color-emerald, #10b981);
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
