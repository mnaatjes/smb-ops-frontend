<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BasePageContainer from '@/shared/ui/BasePageContainer.vue'
import BasePageHeader from '@/shared/ui/BasePageHeader.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseMetricCard from '@/shared/ui/BaseMetricCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseAlert from '@/shared/ui/BaseAlert.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import ScoreBadge from '@/features/lead-triage/ScoreBadge.vue'
import OpportunityDossierDrawer from '@/features/opportunity-dossier/OpportunityDossierDrawer.vue'
import ClientOnboardingModal from '@/features/client-onboarding/ClientOnboardingModal.vue'
import DisqualifyLeadForm, { type DisqualifyLeadPayload } from '@/shared/ui/DisqualifyLeadForm.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { RankedLead, OnboardClientPayload } from '@/shared/types/lead'

const store = useLeadStore()

const breadcrumbs = [
  { label: 'Home', to: '/leads' },
  { label: 'Pursued Pipeline', current: true }
]

// Pipeline Stages
const PIPELINE_STAGES = [
  { key: 'ALL', label: 'All Stages' },
  { key: 'claimed', label: 'Claimed' },
  { key: 'contact_attempted', label: 'Contact Attempted' },
  { key: 'engaged', label: 'Engaged' },
  { key: 'appointment_scheduled', label: 'Appointment Scheduled' },
  { key: 'proposal_presented', label: 'Proposal Presented' }
] as const

const activeStageFilter = ref<string>('ALL')
const searchQuery = ref<string>('')
const minScore = ref<number>(0)

// Modals and Drawer state
const selectedLead = ref<RankedLead | null>(null)
const isDossierOpen = ref<boolean>(false)
const isConvertModalOpen = ref<boolean>(false)
const leadToConvert = ref<RankedLead | null>(null)
const isDisqualifyModalOpen = ref<boolean>(false)
const leadToDisqualify = ref<RankedLead | null>(null)

const successBanner = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const isAdvancing = ref<string | null>(null)

// KPI Metrics Computations
const totalPursuedCount = computed(() => store.pursuedLeads.length)

const engagedCount = computed(() => {
  return store.pursuedLeads.filter((l) => {
    const stage = (l.prospect.opportunity_stage || 'claimed').toLowerCase()
    return stage === 'engaged' || stage === 'appointment_scheduled'
  }).length
})

const proposalsCount = computed(() => {
  return store.pursuedLeads.filter((l) => {
    const stage = (l.prospect.opportunity_stage || 'claimed').toLowerCase()
    return stage === 'proposal_presented'
  }).length
})

const avgScore = computed(() => {
  const scored = store.pursuedLeads.filter((l) => l.audit?.opportunity_score != null)
  if (scored.length === 0) return '0.0'
  const total = scored.reduce((acc, l) => acc + (l.audit?.opportunity_score ?? 0), 0)
  return (total / scored.length).toFixed(1)
})

// Filtered Pursued Leads for Cards
const filteredPursuedLeads = computed(() => {
  return store.pursuedLeads.filter((lead) => {
    const stage = (lead.prospect.opportunity_stage || 'claimed').toLowerCase()
    if (activeStageFilter.value !== 'ALL' && stage !== activeStageFilter.value.toLowerCase()) {
      return false
    }

    const score = lead.audit?.opportunity_score ?? 0
    if (score < minScore.value) {
      return false
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const name = lead.prospect.business_name.toLowerCase()
      const address = (lead.prospect.address || '').toLowerCase()
      const phone = (lead.prospect.phone || '').toLowerCase()
      if (!name.includes(q) && !address.includes(q) && !phone.includes(q)) {
        return false
      }
    }

    return true
  })
})

onMounted(async () => {
  if (store.leads.length === 0) {
    await store.loadRankedLeads()
  }
  if (store.services.length === 0) {
    await store.loadServices()
  }
  if (store.clients.length === 0) {
    await store.loadClients()
  }
})

function getStageVariant(stage: string): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' {
  switch (stage.toLowerCase()) {
    case 'proposal_presented':
      return 'success'
    case 'appointment_scheduled':
      return 'primary'
    case 'engaged':
      return 'warning'
    case 'contact_attempted':
      return 'neutral'
    case 'claimed':
    default:
      return 'neutral'
  }
}

function getNextStage(current: string): string | null {
  switch (current.toLowerCase()) {
    case 'claimed':
      return 'contact_attempted'
    case 'contact_attempted':
      return 'engaged'
    case 'engaged':
      return 'appointment_scheduled'
    case 'appointment_scheduled':
      return 'proposal_presented'
    case 'proposal_presented':
    default:
      return null
  }
}

function handleCardClick(lead: RankedLead) {
  selectedLead.value = lead
  isDossierOpen.value = true
}

function handleCloseDossier() {
  isDossierOpen.value = false
  selectedLead.value = null
}

async function handleAdvanceStage(lead: RankedLead) {
  const currentStage = lead.prospect.opportunity_stage || 'claimed'
  const next = getNextStage(currentStage)
  if (!next) return

  isAdvancing.value = lead.prospect.id
  try {
    await store.setOpportunityStage(lead.prospect.id, next)
    successBanner.value = `Updated opportunity stage: ${next}`
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to advance stage'
  } finally {
    isAdvancing.value = null
  }
}

function handleOpenConvertModal(lead: RankedLead) {
  leadToConvert.value = lead
  isConvertModalOpen.value = true
}

function handleCloseConvertModal() {
  isConvertModalOpen.value = false
  leadToConvert.value = null
}

async function handleOnboardClient(payload: OnboardClientPayload) {
  try {
    await store.onboardClient(payload)
    successBanner.value = `Successfully converted to active client!`
    handleCloseConvertModal()
    if (selectedLead.value?.prospect.id === payload.lead_id) {
      handleCloseDossier()
    }
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Client conversion failed'
  }
}

function handleOpenDisqualifyModal(lead: RankedLead) {
  leadToDisqualify.value = lead
  isDisqualifyModalOpen.value = true
}

function handleCloseDisqualifyModal() {
  isDisqualifyModalOpen.value = false
  leadToDisqualify.value = null
}

async function handleConfirmDisqualify(payload: DisqualifyLeadPayload) {
  if (!leadToDisqualify.value) return
  const id = leadToDisqualify.value.prospect.id
  const name = leadToDisqualify.value.prospect.business_name
  try {
    await store.disqualifyLead(id, payload)
    successBanner.value = `Dropped ${name} from pipeline: ${payload.reason}`
    handleCloseDisqualifyModal()
    if (selectedLead.value?.prospect.id === id) {
      handleCloseDossier()
    }
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Disqualification failed'
  }
}
</script>

<template>
  <BasePageContainer :fluid="true">
    <BasePageHeader
      title="Pursued Opportunity Pipeline"
      subtitle="Engage Qualified Prospects & Assemble Proposals"
      :breadcrumbs="breadcrumbs"
    >
      <template #badges>
        <BaseBadge variant="primary">{{ totalPursuedCount }} Pursued Deals</BaseBadge>
      </template>
    </BasePageHeader>

    <!-- Operational Alerts -->
    <BaseAlert
      v-if="successBanner"
      variant="success"
      :dismissible="true"
      @dismiss="successBanner = null"
    >
      {{ successBanner }}
    </BaseAlert>

    <BaseAlert
      v-if="errorMessage"
      variant="danger"
      :dismissible="true"
      @dismiss="errorMessage = null"
    >
      {{ errorMessage }}
    </BaseAlert>

    <!-- Executive KPI Metric Ribbon -->
    <section class="metrics-ribbon" aria-label="Pipeline KPI Overview">
      <BaseMetricCard
        label="Active Pursued Deals"
        :value="totalPursuedCount"
        subtext="Qualified opportunities in motion"
        variant="nominal"
      />
      <BaseMetricCard
        label="Engaged / In Discussion"
        :value="engagedCount"
        subtext="Active dialogues & meetings"
        variant="nominal"
      />
      <BaseMetricCard
        label="Proposals Out"
        :value="proposalsCount"
        subtext="Submitted offers awaiting closing"
        variant="nominal"
      />
      <BaseMetricCard
        label="Average Opp Score"
        :value="avgScore"
        subtext="Out of 100 max deficit rubric"
        variant="nominal"
      />
    </section>

    <!-- Stage Filter & Search Controls Deck -->
    <section class="pipeline-controls-deck">
      <div class="deck-top-row">
        <div class="stage-pills-cluster" role="tablist" aria-label="Pipeline Stage Filters">
          <button
            v-for="stage in PIPELINE_STAGES"
            :key="stage.key"
            type="button"
            :class="['stage-pill', { active: activeStageFilter === stage.key }]"
            @click="activeStageFilter = stage.key"
          >
            {{ stage.label }}
          </button>
        </div>

        <div class="search-input-wrapper">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search business, address, or phone..."
            class="search-input"
            aria-label="Filter pursued opportunities"
          />
        </div>
      </div>

      <div class="deck-bottom-row">
        <div class="slider-wrapper">
          <label for="pursued-min-score" class="slider-label">
            Min Opportunity Score: <strong>{{ minScore }} / 100</strong>
          </label>
          <input
            id="pursued-min-score"
            v-model.number="minScore"
            type="range"
            min="0"
            max="100"
            step="5"
            class="range-slider"
          />
        </div>
      </div>
    </section>

    <!-- Pursued Opportunities Responsive Card Grid -->
    <section class="pipeline-cards-section" aria-label="Pursued Opportunities Deck">
      <div v-if="filteredPursuedLeads.length > 0" class="cards-grid">
        <BaseCard
          v-for="lead in filteredPursuedLeads"
          :key="lead.prospect.id"
          class="opportunity-card"
          :clickable="true"
          padding="md"
          @click="handleCardClick(lead)"
        >
          <template #header>
            <div class="card-header-cluster">
              <div class="header-main-meta">
                <h3 class="opportunity-title">{{ lead.prospect.business_name }}</h3>
                <span class="opportunity-stage-pill">
                  <BaseBadge :variant="getStageVariant(lead.prospect.opportunity_stage || 'claimed')">
                    {{ (lead.prospect.opportunity_stage || 'claimed').replace('_', ' ').toUpperCase() }}
                  </BaseBadge>
                </span>
              </div>
              <div class="header-score-wrapper">
                <ScoreBadge :score="lead.audit?.opportunity_score ?? null" />
              </div>
            </div>
          </template>

          <div class="card-body-content">
            <div class="vitals-row">
              <a
                v-if="lead.prospect.website_url"
                :href="lead.prospect.website_url"
                target="_blank"
                rel="noopener noreferrer"
                class="external-site-link"
                @click.stop
              >
                🌐 {{ lead.prospect.website_url }}
              </a>
              <span v-if="lead.prospect.phone" class="phone-chip">📞 {{ lead.prospect.phone }}</span>
            </div>

            <p v-if="lead.prospect.address" class="address-text">
              📍 {{ lead.prospect.address }}
            </p>

            <div class="audit-chips-row">
              <span class="tech-tag">
                Stack: {{ lead.audit?.cms_detected || 'Standard Stack' }}
              </span>
              <span v-if="lead.audit?.ssl_active != null" :class="['ssl-pill', lead.audit.ssl_active ? 'ssl-ok' : 'ssl-bad']">
                {{ lead.audit.ssl_active ? '✓ SSL Active' : '⚠ Missing SSL' }}
              </span>
            </div>
          </div>

          <template #footer>
            <div class="card-actions-cluster" @click.stop>
              <BaseButton
                label="Dossier"
                variant="secondary"
                class="action-btn-dossier"
                @click="handleCardClick(lead)"
              />
              <BaseButton
                v-if="getNextStage(lead.prospect.opportunity_stage || 'claimed')"
                label="Advance Stage"
                variant="secondary"
                :disabled="isAdvancing === lead.prospect.id"
                class="action-btn-advance"
                @click="handleAdvanceStage(lead)"
              />
              <BaseButton
                label="Convert to Client"
                variant="primary"
                class="action-btn-convert"
                @click="handleOpenConvertModal(lead)"
              />
            </div>
          </template>
        </BaseCard>
      </div>

      <div v-else class="empty-pipeline-state">
        <p class="empty-text">No pursued opportunities found. Qualify leads from the Discovery Pool to engage them here.</p>
      </div>
    </section>

    <!-- Deep Opportunity Dossier Drawer (Slideout lg 960px) -->
    <OpportunityDossierDrawer
      :show="isDossierOpen"
      :lead="selectedLead"
      :services="store.services"
      @close="handleCloseDossier"
      @convert="handleOpenConvertModal"
      @disqualify="handleOpenDisqualifyModal"
    />

    <!-- Client Onboarding Modal -->
    <ClientOnboardingModal
      :show="isConvertModalOpen"
      :lead="leadToConvert"
      :services="store.services"
      @close="handleCloseConvertModal"
      @onboard="handleOnboardClient"
    />

    <!-- Disqualification Modal -->
    <BaseModal
      :show="isDisqualifyModalOpen"
      :title="`Drop Opportunity: ${leadToDisqualify?.prospect.business_name || 'Prospect'}`"
      @close="handleCloseDisqualifyModal"
    >
      <div class="disqualify-modal-content">
        <DisqualifyLeadForm
          @submit="handleConfirmDisqualify"
        />
      </div>
    </BaseModal>
  </BasePageContainer>
</template>

<style scoped>
.metrics-ribbon {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.pipeline-controls-deck {
  background-color: var(--color-surface, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.deck-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stage-pills-cluster {
  display: inline-flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.stage-pill {
  padding: 0.4rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: 9999px;
  border: 1px solid var(--border-color, #cbd5e1);
  background-color: var(--color-surface, #ffffff);
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.stage-pill:hover {
  background-color: var(--bg-hover, #f1f5f9);
  color: var(--text-primary, #0f172a);
}

.stage-pill.active {
  background-color: var(--color-primary, #2563eb);
  border-color: var(--color-primary, #2563eb);
  color: #ffffff;
}

.search-input-wrapper {
  flex: 1;
  min-width: 260px;
  max-width: 420px;
}

.search-input {
  width: 100%;
  padding: 0.45rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-color, #cbd5e1);
  border-radius: 0.5rem;
  background-color: var(--color-surface, #ffffff);
  color: var(--text-primary, #0f172a);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary, #2563eb);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.deck-bottom-row {
  display: flex;
  align-items: center;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider-label {
  font-size: 0.8125rem;
  color: var(--text-secondary, #64748b);
}

.range-slider {
  width: 180px;
  accent-color: var(--color-primary, #2563eb);
  cursor: pointer;
}

.pipeline-cards-section {
  width: 100%;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.25rem;
}

.opportunity-card {
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.card-header-cluster {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.opportunity-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.opportunity-stage-pill {
  margin-top: 0.35rem;
  display: inline-block;
}

.card-body-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.8125rem;
}

.vitals-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.external-site-link {
  color: var(--accent-primary, #3b82f6);
  text-decoration: none;
}

.external-site-link:hover {
  text-decoration: underline;
}

.phone-chip {
  color: var(--text-secondary);
}

.address-text {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.35;
}

.audit-chips-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tech-tag {
  background-color: var(--bg-surface-subtle);
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.ssl-pill {
  font-size: 0.75rem;
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.ssl-ok {
  background-color: var(--badge-success-bg);
  color: var(--badge-success-text);
}

.ssl-bad {
  background-color: var(--badge-danger-bg);
  color: var(--badge-danger-text);
}

.card-actions-cluster {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-actions-cluster :deep(.base-button) {
  padding: 0.35rem 0.6rem;
  font-size: 0.775rem;
  white-space: nowrap;
}

.empty-pipeline-state {
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--bg-surface);
  border: 1px dashed var(--border-color);
  border-radius: 0.75rem;
}

.empty-text {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.disqualify-modal-content {
  padding: 0.5rem 0;
}

.text-muted {
  color: var(--text-secondary, #94a3b8);
}

@media (max-width: 1024px) {
  .metrics-ribbon {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .metrics-ribbon {
    grid-template-columns: 1fr;
  }
  .deck-top-row {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input-wrapper {
    max-width: 100%;
  }
}
</style>
