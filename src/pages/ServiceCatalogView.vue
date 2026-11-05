<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BasePageContainer from '@/shared/ui/BasePageContainer.vue'
import BasePageHeader from '@/shared/ui/BasePageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseAlert from '@/shared/ui/BaseAlert.vue'
import BaseDrawer from '@/shared/ui/BaseDrawer.vue'
import CreateCoreServiceForm from '@/shared/ui/CreateCoreServiceForm.vue'
import ServiceDetailsDrawer from '@/features/service-catalog/ServiceDetailsDrawer.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { ServiceCatalogItem, CreateCoreServicePayload } from '@/shared/types/lead'

const store = useLeadStore()

const breadcrumbs = [
  { label: 'Home', to: '/leads' },
  { label: 'Catalogs', to: '/services' },
  { label: 'Service Catalog', current: true }
]

const tierFilters = [
  { id: 'ALL', label: 'All Services' },
  { id: 'Rank 1A', label: 'Rank 1A' },
  { id: 'Rank 1B', label: 'Rank 1B' },
  { id: 'Rank 3', label: 'Rank 3' },
  { id: 'Rank 4', label: 'Rank 4' }
]

const activeTier = ref<string>('ALL')
const selectedService = ref<ServiceCatalogItem | null>(null)
const isDrawerOpen = ref<boolean>(false)
const isCreateDrawerOpen = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const createError = ref<string | null>(null)
const successBanner = ref<string | null>(null)

// Filter out non-core services (Rank 2 is decoupled into /addons)
const coreServices = computed(() => {
  return store.services.filter((svc) => {
    return svc.rank !== 'Rank 2' && svc.pricing_model !== 'MONTHLY_RETAINER'
  })
})

const filteredServices = computed(() => {
  if (activeTier.value === 'ALL') {
    return coreServices.value
  }
  return coreServices.value.filter((svc) => svc.rank === activeTier.value)
})

onMounted(async () => {
  if (store.services.length === 0) {
    await store.loadServices()
  }
})

function setTierFilter(tierId: string) {
  activeTier.value = tierId
}

function handleSelectService(svc: ServiceCatalogItem) {
  selectedService.value = svc
  isDrawerOpen.value = true
}

function handleCloseDrawer() {
  isDrawerOpen.value = false
  selectedService.value = null
}

function handleOpenCreateDrawer() {
  createError.value = null
  isCreateDrawerOpen.value = true
}

function handleCloseCreateDrawer() {
  isCreateDrawerOpen.value = false
  createError.value = null
}

async function handleCreateCoreService(payload: CreateCoreServicePayload) {
  isSubmitting.value = true
  createError.value = null
  try {
    await store.createServiceOffering(payload)
    isCreateDrawerOpen.value = false
    successBanner.value = `Successfully created core service: ${payload.name} (${payload.code})`
  } catch (err: unknown) {
    createError.value = err instanceof Error ? err.message : 'Failed to create core service offering'
  } finally {
    isSubmitting.value = false
  }
}

function getRankVariant(rank?: string): 'primary' | 'warning' | 'emerald' | 'danger' | 'neutral' {
  if (!rank) return 'neutral'
  if (rank.includes('1A')) return 'primary'
  if (rank.includes('1B')) return 'neutral'
  if (rank.includes('3')) return 'warning'
  if (rank.includes('4')) return 'neutral'
  return 'primary'
}

function formatPriceTag(svc: ServiceCatalogItem): string {
  const min = svc.price_min ?? 0
  const max = svc.price_max ?? min
  if (svc.pricing_model === 'HYBRID') {
    return `$${min.toFixed(0)} Hybrid`
  }
  return min === max
    ? `$${min.toFixed(0)} Flat`
    : `$${min.toFixed(0)}–$${max.toFixed(0)} Flat`
}
</script>

<template>
  <BasePageContainer>
    <BasePageHeader
      title="Core Service Catalog"
      subtitle="Consulting Offerings, Fixed Scopes & Ingestion"
      :breadcrumbs="breadcrumbs"
    >
      <template #badges>
        <BaseBadge :label="`${coreServices.length} Active Offerings`" variant="primary" />
      </template>

      <template #actions>
        <BaseButton
          label="+ New Core Service"
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

    <!-- Tier Filter Ribbon -->
    <section class="tier-filter-ribbon" aria-label="Commercial Rank Filter">
      <div class="ribbon-pills">
        <button
          v-for="pill in tierFilters"
          :key="pill.id"
          type="button"
          :class="['ribbon-pill', { active: activeTier === pill.id }]"
          @click="setTierFilter(pill.id)"
        >
          {{ pill.label }}
          <span v-if="pill.id === 'ALL'" class="pill-count">({{ coreServices.length }})</span>
        </button>
      </div>
    </section>

    <!-- Catalog Grid Canvas -->
    <div v-if="filteredServices.length > 0" class="catalog-grid">
      <BaseCard
        v-for="svc in filteredServices"
        :key="svc.code"
        :clickable="true"
        class="service-catalog-card"
        @click="handleSelectService(svc)"
      >
        <template #header>
          <div class="card-meta-row">
            <div class="card-badges">
              <BaseBadge :label="svc.rank || 'Rank 1A'" :variant="getRankVariant(svc.rank)" />
              <span class="card-code">{{ svc.code }}</span>
            </div>
            <span class="card-price">{{ formatPriceTag(svc) }}</span>
          </div>
        </template>

        <div class="card-body-content">
          <h3 class="card-title">{{ svc.name }}</h3>
          <p class="card-description">{{ svc.description }}</p>
          <div v-if="svc.target_profile" class="target-profile-snippet">
            <span class="target-label">Target:</span> {{ svc.target_profile }}
          </div>
        </div>

        <template #footer>
          <div class="card-footer-content">
            <div v-if="svc.audit_parameters && svc.audit_parameters.length > 0" class="param-chips">
              <span
                v-for="param in svc.audit_parameters.slice(0, 3)"
                :key="param"
                class="param-chip-sm"
              >
                {{ param }}
              </span>
              <span v-if="svc.audit_parameters.length > 3" class="param-chip-more">
                +{{ svc.audit_parameters.length - 3 }} more
              </span>
            </div>
            <span class="inspect-cue">View Details &rarr;</span>
          </div>
        </template>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-catalog-stage">
      <div class="empty-icon">📋</div>
      <h3 class="empty-title">No Core Service Offerings Found</h3>
      <p class="empty-desc">
        There are currently no active core services registered under the selected rank. Register a new consulting offering using the action button above.
      </p>
      <BaseButton
        label="+ New Core Service"
        variant="primary"
        @click="handleOpenCreateDrawer"
      />
    </div>

    <!-- Deep Inspection Flyout Drawer -->
    <ServiceDetailsDrawer
      :show="isDrawerOpen"
      :service="selectedService"
      @close="handleCloseDrawer"
    />

    <!-- Ingestion Deep Drawer -->
    <BaseDrawer
      :show="isCreateDrawerOpen"
      title="Register Core Service Offering"
      subtitle="Define canonical rank pricing, scope boundaries, deliverables, and parameter bindings"
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

        <CreateCoreServiceForm
          :disabled="isSubmitting"
          @submit="handleCreateCoreService"
        />
      </div>
    </BaseDrawer>
  </BasePageContainer>
</template>

<style scoped>
.tier-filter-ribbon {
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
  background: var(--accent-primary, #2563eb);
  color: #ffffff;
  border-color: var(--accent-primary, #2563eb);
}

.pill-count {
  font-size: 0.75rem;
  opacity: 0.85;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

@media (max-width: 1279px) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 767px) {
  .catalog-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.service-catalog-card {
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

.card-price {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
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
  border-left: 2px solid var(--accent-primary);
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
  color: var(--accent-primary);
}

.empty-catalog-stage {
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

.form-alert {
  margin-bottom: 1rem;
}
</style>
