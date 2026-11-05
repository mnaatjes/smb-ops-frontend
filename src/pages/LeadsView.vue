<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BasePageContainer from '@/shared/ui/BasePageContainer.vue'
import BasePageHeader from '@/shared/ui/BasePageHeader.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseMetricCard from '@/shared/ui/BaseMetricCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseAlert from '@/shared/ui/BaseAlert.vue'
import BaseTable, { type TableColumn } from '@/shared/ui/BaseTable.vue'
import BaseDrawer from '@/shared/ui/BaseDrawer.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import DiscoveryBar from '@/features/lead-discovery/DiscoveryBar.vue'
import ServiceFilterDropdown from '@/features/service-catalog/ServiceFilterDropdown.vue'
import ScoreBadge from '@/features/lead-triage/ScoreBadge.vue'
import IssueChips from '@/features/lead-triage/IssueChips.vue'
import ManualLeadForm from '@/shared/ui/ManualLeadForm.vue'
import DisqualifyLeadForm, { type DisqualifyLeadPayload } from '@/shared/ui/DisqualifyLeadForm.vue'
import OpportunityDossierDrawer from '@/features/opportunity-dossier/OpportunityDossierDrawer.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { RankedLead, CreateProspectPayload, AuditResult } from '@/shared/types/lead'

const store = useLeadStore()

const breadcrumbs = [
  { label: 'Home', to: '/leads' },
  { label: 'Leads', current: true }
]

// Table Column Definitions
const tableColumns: TableColumn[] = [
  { key: 'business_name', label: 'Business & Contact', width: '32%' },
  { key: 'opportunity_score', label: 'Opportunity Score', width: '18%', align: 'center' },
  { key: 'audit_findings', label: 'Audited Technical Findings', width: '32%' },
  { key: 'actions', label: 'Triage Actions', width: '18%', align: 'right' }
]

const selectedLead = ref<RankedLead | null>(null)
const isDossierOpen = ref<boolean>(false)
const isManualDrawerOpen = ref<boolean>(false)
const isDisqualifyModalOpen = ref<boolean>(false)
const leadToDisqualify = ref<RankedLead | null>(null)

const isSubmittingManual = ref<boolean>(false)
const manualError = ref<string | null>(null)
const successBanner = ref<string | null>(null)
const qualifyingId = ref<string | null>(null)

// Metrics Computations
const totalPoolCount = computed(() => store.poolLeads.length)

const highRiskCount = computed(() => {
  return store.poolLeads.filter((l) => (l.audit?.opportunity_score ?? 0) >= 70).length
})

const moderateRiskCount = computed(() => {
  return store.poolLeads.filter((l) => {
    const score = l.audit?.opportunity_score ?? 0
    return score >= 40 && score < 70
  }).length
})

const avgScore = computed(() => {
  const scored = store.poolLeads.filter((l) => l.audit?.opportunity_score != null)
  if (scored.length === 0) return '0.0'
  const total = scored.reduce((acc, l) => acc + (l.audit?.opportunity_score ?? 0), 0)
  return (total / scored.length).toFixed(1)
})

// Transform RankedLead into Table Row format
const tableRows = computed(() => {
  return store.filteredLeads.map((item) => ({
    id: item.prospect.id,
    business_name: item.prospect.business_name,
    website_url: item.prospect.website_url,
    phone: item.prospect.phone,
    address: item.prospect.address,
    opportunity_score: item.audit?.opportunity_score ?? null,
    audit: item.audit,
    rawLead: item
  }))
})

onMounted(async () => {
  if (store.leads.length === 0) {
    await store.loadRankedLeads()
  }
  if (store.services.length === 0) {
    await store.loadServices()
  }
})

function handleRowClick(row: Record<string, unknown>) {
  const lead = row.rawLead as RankedLead
  if (lead) {
    selectedLead.value = lead
    isDossierOpen.value = true
  }
}

function handleCloseDossier() {
  isDossierOpen.value = false
  selectedLead.value = null
}

async function handleQualifyLead(lead: RankedLead) {
  qualifyingId.value = lead.prospect.id
  try {
    await store.qualifyLead(lead.prospect.id)
    successBanner.value = `Qualified ${lead.prospect.business_name} for outreach pipeline!`
    if (selectedLead.value?.prospect.id === lead.prospect.id) {
      handleCloseDossier()
    }
  } catch (err: unknown) {
    // Handled in store
  } finally {
    qualifyingId.value = null
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
    successBanner.value = `Disqualified ${name}: ${payload.reason}`
    handleCloseDisqualifyModal()
    if (selectedLead.value?.prospect.id === id) {
      handleCloseDossier()
    }
  } catch (err: unknown) {
    // Handled in store
  }
}

function handleOpenManualDrawer() {
  manualError.value = null
  isManualDrawerOpen.value = true
}

function handleCloseManualDrawer() {
  isManualDrawerOpen.value = false
  manualError.value = null
}

async function handleCreateManualLead(payload: CreateProspectPayload) {
  isSubmittingManual.value = true
  manualError.value = null
  try {
    await store.addManualLead(payload)
    isManualDrawerOpen.value = false
    successBanner.value = `Added prospect: ${payload.business_name}`
  } catch (err: unknown) {
    manualError.value = err instanceof Error ? err.message : 'Failed to ingest manual lead'
  } finally {
    isSubmittingManual.value = false
  }
}
</script>

<template>
  <BasePageContainer>
    <BasePageHeader
      title="Lead Operations & Triage"
      subtitle="Discover, Audit, and Qualify Business Opportunities"
      :breadcrumbs="breadcrumbs"
    >
      <template #badges>
        <BaseBadge variant="primary">{{ totalPoolCount }} Pool Leads</BaseBadge>
      </template>

      <template #actions>
        <BaseButton
          label="+ Manual Lead"
          variant="primary"
          @click="handleOpenManualDrawer"
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

    <!-- Executive KPI Metric Ribbon -->
    <section class="metrics-ribbon" aria-label="Executive KPI Overview">
      <BaseMetricCard
        label="Discovery Pool"
        :value="totalPoolCount"
        subtext="Active un-pursued candidates"
        variant="nominal"
      />
      <BaseMetricCard
        label="High Risk (70+)"
        :value="highRiskCount"
        subtext="Severe deficit door-openers"
        variant="alert"
      />
      <BaseMetricCard
        label="Moderate Deficit (40-69)"
        :value="moderateRiskCount"
        subtext="Operational improvement targets"
        variant="warning"
      />
      <BaseMetricCard
        label="Average Opp Score"
        :value="avgScore"
        subtext="Out of 100 max deficit rubric"
        variant="nominal"
      />
    </section>

    <!-- Discovery & Filter Controls Deck -->
    <section class="triage-controls-deck">
      <div class="deck-top-row">
        <DiscoveryBar class="discovery-bar-instance" />
      </div>

      <div class="deck-filters-row">
        <div class="filter-item service-filter-wrapper">
          <label class="filter-label">Service Criteria Filter:</label>
          <ServiceFilterDropdown
            v-model="store.activeServiceFilters"
            :services="store.services"
          />
        </div>

        <div class="filter-item score-slider-wrapper">
          <div class="slider-header">
            <label class="filter-label" for="min-score-slider">Min Opportunity Score:</label>
            <span class="slider-val">{{ store.minScore }} / 100</span>
          </div>
          <input
            id="min-score-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            :value="store.minScore"
            class="range-slider"
            @input="store.setMinScore(Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>
    </section>

    <!-- Lead Triage Data Table -->
    <section class="triage-table-section">
      <BaseTable
        :columns="tableColumns"
        :rows="tableRows"
        :loading="store.loading"
        empty-text="No leads available. Run discovery or add a lead manually."
        @row-click="handleRowClick"
      >
        <!-- Custom Column: Business & Contact -->
        <template #cell-business_name="{ row }">
          <div class="business-cell">
            <span class="business-title">{{ row.business_name }}</span>
            <div class="business-meta">
              <a
                v-if="row.website_url"
                :href="(row.website_url as string)"
                target="_blank"
                rel="noopener noreferrer"
                class="external-site-link"
                @click.stop
              >
                🌐 {{ row.website_url }}
              </a>
              <span v-if="row.phone" class="phone-tag">📞 {{ row.phone }}</span>
            </div>
          </div>
        </template>

        <!-- Custom Column: Opportunity Score -->
        <template #cell-opportunity_score="{ value }">
          <div class="score-cell">
            <ScoreBadge :score="(value as number | null)" />
          </div>
        </template>

        <!-- Custom Column: Audited Findings -->
        <template #cell-audit_findings="{ row }">
          <div class="findings-cell">
            <IssueChips :audit="(row.audit as AuditResult | null)" />
          </div>
        </template>

        <!-- Custom Column: Triage Actions -->
        <template #cell-actions="{ row }">
          <div class="actions-cell" @click.stop>
            <BaseButton
              label="Qualify"
              variant="primary"
              :disabled="qualifyingId === (row.rawLead as RankedLead).prospect.id"
              class="action-btn-qualify"
              @click="handleQualifyLead(row.rawLead as RankedLead)"
            />
            <BaseButton
              label="Disqualify"
              variant="secondary"
              class="action-btn-disqualify"
              @click="handleOpenDisqualifyModal(row.rawLead as RankedLead)"
            />
          </div>
        </template>
      </BaseTable>
    </section>

    <!-- Deep Inspection Dossier Drawer -->
    <OpportunityDossierDrawer
      :show="isDossierOpen"
      :lead="selectedLead"
      :services="store.services"
      @close="handleCloseDossier"
      @convert="handleQualifyLead"
      @disqualify="handleOpenDisqualifyModal"
    />

    <!-- Manual Prospect Ingestion Drawer -->
    <BaseDrawer
      :show="isManualDrawerOpen"
      title="Create Manual Lead"
      subtitle="Ingest an independent small business prospect into the triage discovery pool"
      size="lg"
      @close="handleCloseManualDrawer"
    >
      <div class="manual-drawer-body">
        <BaseAlert
          v-if="manualError"
          variant="danger"
          class="form-alert"
        >
          {{ manualError }}
        </BaseAlert>

        <ManualLeadForm
          :disabled="isSubmittingManual"
          @submit="handleCreateManualLead"
        />
      </div>
    </BaseDrawer>

    <!-- Disqualification Modal -->
    <BaseModal
      :show="isDisqualifyModalOpen"
      :title="`Disqualify: ${leadToDisqualify?.prospect.business_name || 'Prospect'}`"
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
  margin: 1.5rem 0 1.25rem 0;
}

@media (max-width: 1279px) {
  .metrics-ribbon {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 767px) {
  .metrics-ribbon {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

.triage-controls-deck {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.deck-filters-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.score-slider-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 220px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider-val {
  font-family: monospace;
  font-weight: 700;
  font-size: 0.8125rem;
  color: var(--text-primary);
}

.range-slider {
  width: 100%;
  accent-color: var(--accent-primary, #2563eb);
  cursor: pointer;
}

.triage-table-section {
  width: 100%;
}

.business-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.business-title {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.business-meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.external-site-link {
  color: var(--accent-primary, #2563eb);
  text-decoration: none;
}

.external-site-link:hover {
  text-decoration: underline;
}

.phone-tag {
  font-family: monospace;
}

.score-cell {
  display: flex;
  justify-content: center;
}

.findings-cell {
  display: flex;
  align-items: center;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-btn-qualify {
  font-size: 0.75rem;
  padding: 0.3rem 0.65rem;
}

.action-btn-disqualify {
  font-size: 0.75rem;
  padding: 0.3rem 0.65rem;
}

.manual-drawer-body {
  padding: 0.5rem 0;
}

.form-alert {
  margin-bottom: 1rem;
}

.disqualify-modal-content {
  padding: 0.5rem 0;
}
</style>
