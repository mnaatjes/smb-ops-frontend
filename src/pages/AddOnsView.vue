<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BasePageContainer from '@/shared/ui/BasePageContainer.vue'
import BasePageHeader from '@/shared/ui/BasePageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseAlert from '@/shared/ui/BaseAlert.vue'
import BaseDrawer from '@/shared/ui/BaseDrawer.vue'
import CreateAddOnForm from '@/shared/ui/CreateAddOnForm.vue'
import AddOnDetailsDrawer from '@/features/service-catalog/AddOnDetailsDrawer.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { ServiceCatalogItem, CreateAddOnPayload } from '@/shared/types/lead'

const store = useLeadStore()

const breadcrumbs = [
  { label: 'Home', to: '/leads' },
  { label: 'Catalogs', to: '/addons' },
  { label: 'Add-ons & Subs', current: true }
]

const capFilters = [
  { id: 'ALL', label: 'All Care Plans' },
  { id: '0', label: 'Automated (0m)' },
  { id: '30', label: '30m Cap' },
  { id: '60', label: '60m Cap' },
  { id: '90', label: '90m+ Cap' }
]

const activeCapFilter = ref<string>('ALL')
const selectedPlan = ref<ServiceCatalogItem | null>(null)
const isInspectDrawerOpen = ref<boolean>(false)
const isCreateDrawerOpen = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const createError = ref<string | null>(null)
const successBanner = ref<string | null>(null)

// Isolate strictly recurring add-on Care Plans (Rank 2 / MONTHLY_RETAINER)
const addOnPlans = computed(() => {
  return store.services.filter((svc) => {
    return svc.rank === 'Rank 2' || svc.pricing_model === 'MONTHLY_RETAINER'
  })
})

const filteredPlans = computed(() => {
  if (activeCapFilter.value === 'ALL') {
    return addOnPlans.value
  }
  const targetCap = parseInt(activeCapFilter.value, 10)
  if (targetCap === 90) {
    return addOnPlans.value.filter((p) => (p.monthly_retainer_cap_minutes ?? 0) >= 90)
  }
  return addOnPlans.value.filter((p) => (p.monthly_retainer_cap_minutes ?? 0) === targetCap)
})

onMounted(async () => {
  if (store.services.length === 0) {
    await store.loadServices()
  }
})

function setCapFilter(filterId: string) {
  activeCapFilter.value = filterId
}

function handleSelectPlan(plan: ServiceCatalogItem) {
  selectedPlan.value = plan
  isInspectDrawerOpen.value = true
}

function handleCloseInspectDrawer() {
  isInspectDrawerOpen.value = false
  selectedPlan.value = null
}

function handleOpenCreateDrawer() {
  createError.value = null
  isCreateDrawerOpen.value = true
}

function handleCloseCreateDrawer() {
  isCreateDrawerOpen.value = false
  createError.value = null
}

async function handleCreateAddOn(payload: CreateAddOnPayload) {
  isSubmitting.value = true
  createError.value = null
  try {
    // Map to entity creation payload and store
    await store.createServiceOffering({
      ...payload,
      price_min: payload.monthly_rate,
      price_max: payload.monthly_rate
    })
    isCreateDrawerOpen.value = false
    successBanner.value = `Successfully registered Care Plan: ${payload.name} (${payload.code})`
  } catch (err: unknown) {
    createError.value = err instanceof Error ? err.message : 'Failed to register care plan'
  } finally {
    isSubmitting.value = false
  }
}

function formatRate(plan: ServiceCatalogItem): string {
  const rate = plan.price_min ?? 0
  return `$${rate.toFixed(0)} / mo`
}

function getCapBadgeText(plan: ServiceCatalogItem): string {
  const cap = plan.monthly_retainer_cap_minutes ?? 0
  if (cap === 0) return '0m Cap'
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
  <BasePageContainer>
    <BasePageHeader
      title="Add-ons & Recurring Subscriptions"
      subtitle="Monthly Digital Care Plans, Retainer Support Caps & SLAs"
      :breadcrumbs="breadcrumbs"
    >
      <template #badges>
        <BaseBadge :label="`${addOnPlans.length} Active Plans`" variant="emerald" />
      </template>

      <template #actions>
        <BaseButton
          label="+ New Care Plan"
          variant="primary"
          @click="handleOpenCreateDrawer"
        />
      </template>
    </BasePageHeader>

    <!-- Operational Success Notification -->
    <BaseAlert
      v-if="successBanner"
      variant="success"
      :dismissible="true"
      @dismiss="successBanner = null"
    >
      {{ successBanner }}
    </BaseAlert>

    <!-- Operational Error Notification -->
    <BaseAlert
      v-if="store.error"
      variant="danger"
      :dismissible="true"
      @dismiss="store.error = null"
    >
      {{ store.error }}
    </BaseAlert>

    <!-- Retainer Cap Filter Ribbon -->
    <section class="cap-filter-ribbon" aria-label="Support Cap Filter">
      <div class="ribbon-pills">
        <button
          v-for="pill in capFilters"
          :key="pill.id"
          type="button"
          :class="['ribbon-pill', { active: activeCapFilter === pill.id }]"
          @click="setCapFilter(pill.id)"
        >
          {{ pill.label }}
          <span v-if="pill.id === 'ALL'" class="pill-count">({{ addOnPlans.length }})</span>
        </button>
      </div>
    </section>

    <!-- Subscriptions Grid Canvas -->
    <div v-if="filteredPlans.length > 0" class="addons-grid">
      <BaseCard
        v-for="plan in filteredPlans"
        :key="plan.code"
        :clickable="true"
        class="care-plan-card"
        @click="handleSelectPlan(plan)"
      >
        <template #header>
          <div class="card-meta-row">
            <div class="card-badges">
              <BaseBadge :label="getCapBadgeText(plan)" :variant="getCapVariant(plan.monthly_retainer_cap_minutes)" />
              <span class="card-code">{{ plan.code }}</span>
            </div>
            <span class="card-rate">{{ formatRate(plan) }}</span>
          </div>
        </template>

        <div class="card-body-content">
          <h3 class="card-title">{{ plan.name }}</h3>
          <p class="card-description">{{ plan.description }}</p>
          <div v-if="plan.target_profile" class="target-profile-snippet">
            <span class="target-label">Target:</span> {{ plan.target_profile }}
          </div>
        </div>

        <template #footer>
          <div class="card-footer-content">
            <div v-if="plan.audit_parameters && plan.audit_parameters.length > 0" class="param-chips">
              <span
                v-for="param in plan.audit_parameters.slice(0, 3)"
                :key="param"
                class="param-chip-sm"
              >
                📡 {{ param }}
              </span>
              <span v-if="plan.audit_parameters.length > 3" class="param-chip-more">
                +{{ plan.audit_parameters.length - 3 }} more
              </span>
            </div>
            <span class="inspect-cue">View SLA & Scope &rarr;</span>
          </div>
        </template>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-addons-stage">
      <div class="empty-icon">🛡️</div>
      <h3 class="empty-title">No Recurring Care Plans Found</h3>
      <p class="empty-desc">
        There are currently no active digital care plans matching the selected retainer cap filter. Register a new subscription offering using the button above.
      </p>
      <BaseButton
        label="+ New Care Plan"
        variant="primary"
        @click="handleOpenCreateDrawer"
      />
    </div>

    <!-- Deep Plan Inspection Flyout Drawer -->
    <AddOnDetailsDrawer
      :show="isInspectDrawerOpen"
      :plan="selectedPlan"
      @close="handleCloseInspectDrawer"
    />

    <!-- Ingestion Deep Drawer -->
    <BaseDrawer
      :show="isCreateDrawerOpen"
      title="Register Recurring Care Plan"
      subtitle="Define monthly retainer fee, support cap minutes, recurring SLA commitments, and deliverables"
      size="lg"
      @close="handleCloseCreateDrawer"
    >
      <div class="create-drawer-body">
        <BaseAlert
          v-if="createError"
          variant="danger"
          class="form-alert"
        >
          {{ createError }}
        </BaseAlert>

        <CreateAddOnForm
          :disabled="isSubmitting"
          @submit="handleCreateAddOn"
        />
      </div>
    </BaseDrawer>
  </BasePageContainer>
</template>

<style scoped>
.cap-filter-ribbon {
  margin: 1.5rem 0 1rem 0;
  display: flex;
  align-items: center;
}

.ribbon-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ribbon-pill {
  padding: 0.4rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.ribbon-pill:hover {
  background: var(--bg-surface-subtle);
  color: var(--text-primary);
  border-color: var(--border-subtle);
}

.ribbon-pill.active {
  background: var(--color-emerald, #10b981);
  color: #ffffff;
  border-color: var(--color-emerald, #10b981);
}

.pill-count {
  font-size: 0.75rem;
  opacity: 0.85;
}

.addons-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

@media (max-width: 1279px) {
  .addons-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 767px) {
  .addons-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.care-plan-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-code {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.card-rate {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-emerald, #10b981);
}

.card-body-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.card-title {
  font-size: 1.0625rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.card-description {
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--text-secondary);
  margin: 0;
}

.target-profile-snippet {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  background: var(--bg-surface-subtle);
  border-left: 2px solid var(--color-emerald, #10b981);
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
}

.target-label {
  font-weight: 600;
  color: var(--text-primary);
}

.card-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.8125rem;
}

.param-chips {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.param-chip-sm {
  font-size: 0.6875rem;
  font-family: monospace;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.param-chip-more {
  font-size: 0.6875rem;
  color: var(--text-secondary);
}

.inspect-cue {
  font-weight: 600;
  color: var(--color-emerald, #10b981);
}

.empty-addons-stage {
  background: var(--bg-surface);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.empty-icon {
  font-size: 2.5rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.empty-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  max-width: 480px;
  margin: 0;
}

.create-drawer-body {
  padding: 0.5rem 0;
}

.form-alert {
  margin-bottom: 1rem;
}
</style>
