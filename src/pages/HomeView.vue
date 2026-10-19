<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLeadStore } from '@/entities/lead/store'
import type { RankedLead } from '@/entities/lead/model'
import DiscoveryBar from '@/features/lead-discovery/DiscoveryBar.vue'
import CreateLeadModal from '@/features/manual-lead/CreateLeadModal.vue'
import LeadTriageTable from '@/features/lead-triage/LeadTriageTable.vue'
import DisqualifyModal from '@/features/lead-triage/DisqualifyModal.vue'
import ScoreRubricModal from '@/features/lead-triage/ScoreRubricModal.vue'
import ServiceFilterDropdown from '@/features/service-catalog/ServiceFilterDropdown.vue'
import CreateServiceModal from '@/features/service-catalog/CreateServiceModal.vue'
import ServiceDetailsModal from '@/features/service-catalog/ServiceDetailsModal.vue'
import ClientOnboardingModal from '@/features/client-onboarding/ClientOnboardingModal.vue'
import ClientDossierDrawer from '@/features/client-dossier/ClientDossierDrawer.vue'
import OpportunityDossierDrawer from '@/features/opportunity-dossier/OpportunityDossierDrawer.vue'
import LogMaintenanceModal from '@/features/client-maintenance/LogMaintenanceModal.vue'
import AsideNavRail from '@/features/navigation/AsideNavRail.vue'
import DoctrineWorkspace from '@/features/business-doctrine/DoctrineWorkspace.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import type {
  CreateServicePayload,
  ServiceCatalogItem,
  ClientAccount,
  OnboardClientPayload,
  LogTimecardPayload
} from '@/entities/lead/model'

const leadStore = useLeadStore()
const activeTab = ref<'pool' | 'pipeline' | 'clients' | 'services' | 'doctrine'>('pool')
const isRailCollapsed = ref(false)
const isMobileNavOpen = ref(false)
const showCreateModal = ref(false)
const showCreateServiceModal = ref(false)
const showDisqualifyModal = ref(false)
const showRubricModal = ref(false)
const showServiceDetailsModal = ref(false)
const showOnboardingModal = ref(false)
const showDossierDrawer = ref(false)
const showOpportunityDrawer = ref(false)
const showLogMaintenanceModal = ref(false)
const selectedLead = ref<RankedLead | null>(null)
const inspectingLead = ref<RankedLead | null>(null)
const activeOpportunityLead = ref<RankedLead | null>(null)
const inspectingService = ref<ServiceCatalogItem | null>(null)
const activeDossierClient = ref<ClientAccount | null>(null)
const activeLogClient = ref<ClientAccount | null>(null)

onMounted(async () => {
  await Promise.all([
    leadStore.loadRankedLeads(),
    leadStore.loadServices(),
    leadStore.loadClients()
  ])
})

async function handleQualify(lead: RankedLead): Promise<void> {
  await leadStore.qualifyLead(lead.prospect.id)
}

function handleOpenDisqualify(lead: RankedLead): void {
  selectedLead.value = lead
  showDisqualifyModal.value = true
}

async function handleConfirmDisqualify(payload: { reason: string; notes?: string; suppress?: boolean }): Promise<void> {
  if (selectedLead.value) {
    await leadStore.disqualifyLead(selectedLead.value.prospect.id, payload)
    selectedLead.value = null
  }
}

function handleOpenOnboard(lead: RankedLead): void {
  selectedLead.value = lead
  showOnboardingModal.value = true
}

async function handleCompleteOnboard(payload: OnboardClientPayload): Promise<void> {
  await leadStore.onboardClient(payload)
  showOnboardingModal.value = false
  selectedLead.value = null
  activeTab.value = 'clients'
}

function handleInspectClient(client: ClientAccount): void {
  activeDossierClient.value = client
  showDossierDrawer.value = true
}

function handleOpenLogWork(client: ClientAccount): void {
  activeLogClient.value = client
  showLogMaintenanceModal.value = true
}

async function handleConfirmLogWork(payload: LogTimecardPayload): Promise<void> {
  if (activeLogClient.value) {
    await leadStore.logWork(activeLogClient.value.id, payload)
    showLogMaintenanceModal.value = false
    // Refresh client in dossier if drawer is open
    if (activeDossierClient.value && activeDossierClient.value.id === activeLogClient.value.id) {
      activeDossierClient.value = { ...activeDossierClient.value }
    }
  }
}

function handleInspectScore(lead: RankedLead): void {
  inspectingLead.value = lead
  showRubricModal.value = true
}

function handleOpenOpportunityDossier(lead: RankedLead): void {
  activeOpportunityLead.value = lead
  showOpportunityDrawer.value = true
}

function handleConvertFromOpportunityDrawer(lead: RankedLead): void {
  showOpportunityDrawer.value = false
  activeOpportunityLead.value = null
  handleOpenOnboard(lead)
}

function handleDisqualifyFromOpportunityDrawer(lead: RankedLead): void {
  showOpportunityDrawer.value = false
  activeOpportunityLead.value = null
  handleOpenDisqualify(lead)
}

function handleInspectService(svc: ServiceCatalogItem): void {
  inspectingService.value = svc
  showServiceDetailsModal.value = true
}

function formatServicePrice(svc: ServiceCatalogItem): string {
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

async function handleCreateService(payload: CreateServicePayload): Promise<void> {
  await leadStore.createServiceOffering(payload)
}
</script>

<template>
  <div class="app-layout">
    <!-- Top Mobile App Bar (< 768px) -->
    <header class="mobile-top-bar">
      <button
        type="button"
        class="mobile-hamburger-btn"
        aria-label="Open navigation menu"
        @click="isMobileNavOpen = true"
      >
        <span class="hamburger-icon">☰</span>
      </button>
      <div class="mobile-brand">
        <span class="brand-icon">⚡</span>
        <span class="brand-text">SMB Ops</span>
      </div>
      <div class="mobile-actions">
        <button
          type="button"
          class="mobile-add-btn"
          title="Add Lead"
          aria-label="Add Lead"
          @click="showCreateModal = true"
        >
          ➕
        </button>
      </div>
    </header>

    <!-- Vertical Aside Navigation Rail -->
    <AsideNavRail
      :active-tab="activeTab"
      :pool-count="leadStore.totalLeadsCount"
      :pursued-count="leadStore.pursuedCount"
      :clients-count="leadStore.clientsCount"
      :services-count="leadStore.services.length"
      :collapsed="isRailCollapsed"
      :mobile-open="isMobileNavOpen"
      @select-tab="(tab) => { activeTab = tab }"
      @open-add-lead="showCreateModal = true"
      @toggle-collapse="isRailCollapsed = !isRailCollapsed"
      @close-mobile="isMobileNavOpen = false"
    />

    <main class="page-container">
      <header class="header">
        <div class="header-titles">
          <h1>SMB Consulting Operations</h1>
          <p class="subtitle">Service-Driven Lead Discovery, Enrichment & Client Operations</p>
        </div>
        <div class="header-actions">
          <BaseButton label="+ Add Lead" @click="showCreateModal = true" />
        </div>
      </header>

      <!-- Metrics Ribbon -->
      <section class="metrics-ribbon">
        <div class="metric-card">
          <span class="metric-label">Discovery Pool</span>
          <span class="metric-value">{{ leadStore.totalLeadsCount }}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Pursued Pipeline</span>
          <span class="metric-value">{{ leadStore.pursuedCount }}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Client Accounts</span>
          <span class="metric-value">{{ leadStore.clientsCount }}</span>
        </div>
        <div class="metric-card metric-alert">
          <span class="metric-label">High Priority (Score &ge; 70)</span>
          <span class="metric-value">{{ leadStore.highPriorityCount }}</span>
        </div>
      </section>

      <!-- Status / Notification Feedback -->
      <div v-if="leadStore.statusMessage" class="status-banner">
        {{ leadStore.statusMessage }}
      </div>
      <div v-if="leadStore.error" class="error-banner">
        {{ leadStore.error }}
      </div>

      <!-- Workspace 1: Discovery Pool -->
      <section v-if="activeTab === 'pool'" class="workspace-view">
        <!-- Operational Action Row -->
        <section class="actions-section">
          <DiscoveryBar class="discovery-flex" />
        </section>

        <!-- Service Catalog Filter Dropdown -->
        <ServiceFilterDropdown
          v-model="leadStore.activeServiceFilters"
          :services="leadStore.services"
        />

        <!-- Triage Filter Controls -->
        <section class="triage-controls">
          <div class="score-filter">
            <label for="score-threshold">Filter Min Opportunity Score:</label>
            <select
              id="score-threshold"
              :value="leadStore.minScore"
              class="score-select"
              @change="leadStore.setMinScore(Number(($event.target as HTMLSelectElement).value))"
            >
              <option :value="0">All Leads (0+)</option>
              <option :value="40">Moderate & High (&ge; 40)</option>
              <option :value="70">High Priority Only (&ge; 70)</option>
            </select>
          </div>
        </section>

        <!-- Ranked Lead Triage Table -->
        <section class="table-section">
          <LeadTriageTable
            :leads="leadStore.filteredLeads"
            :loading="leadStore.loading"
            @qualify="handleQualify"
            @disqualify="handleOpenDisqualify"
            @inspect-score="handleInspectScore"
          />
        </section>
      </section>

    <!-- Workspace 2: Pursued Pipeline -->
    <section v-if="activeTab === 'pipeline'" class="workspace-view">
      <div class="pipeline-header">
        <h3>Active Consulting Opportunities</h3>
        <p class="pipeline-subtitle">Claimed leads undergoing Stage 2 contact discovery and active outreach.</p>
      </div>

      <div v-if="leadStore.pursuedLeads.length === 0" class="empty-pipeline">
        No leads currently claimed. Browse the <strong>Discovery Pool</strong> and click "Add to List" to begin outreach.
      </div>

      <div v-else class="pipeline-grid">
        <div
          v-for="lead in leadStore.pursuedLeads"
          :key="lead.prospect.id"
          class="pipeline-card"
        >
          <div class="card-content" @click="handleOpenOpportunityDossier(lead)">
            <div class="card-head">
              <div>
                <span class="tracking-uid">UID: {{ lead.prospect.id.slice(0, 8) }}</span>
                <h4 class="business-title">{{ lead.prospect.business_name }}</h4>
              </div>
              <BaseBadge variant="primary">{{ lead.prospect.status }}</BaseBadge>
            </div>

            <div class="card-body">
              <p v-if="lead.prospect.website_url" class="card-link">
                <a
                  :href="lead.prospect.website_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                >
                  {{ lead.prospect.website_url }}
                </a>
              </p>
              <p v-if="lead.prospect.phone" class="card-meta">📞 {{ lead.prospect.phone }}</p>
              <p v-if="lead.prospect.address" class="card-meta">📍 {{ lead.prospect.address }}</p>

              <div class="score-line">
                <span>Opportunity Score:</span>
                <strong class="highlight-score">{{ lead.audit?.opportunity_score ?? 'N/A' }} / 100</strong>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <BaseButton
              label="Convert to Client"
              variant="primary"
              @click="handleOpenOnboard(lead)"
            />
            <BaseButton
              label="Disqualify"
              variant="danger"
              @click="handleOpenDisqualify(lead)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Workspace 3: Client Accounts -->
    <section v-if="activeTab === 'clients'" class="workspace-view">
      <div class="clients-header">
        <h3>Contracted SMB Clients</h3>
        <p class="clients-subtitle">Paying accounts, active consulting service jobs, and engagement delivery.</p>
      </div>

      <div v-if="leadStore.clients.length === 0" class="empty-pipeline">
        No active clients yet. Convert claimed prospects from the <strong>Pursued Pipeline</strong> once signed.
      </div>

      <div v-else class="clients-grid">
        <div
          v-for="client in leadStore.clients"
          :key="client.id"
          class="client-card"
        >
          <div class="card-head" @click="handleInspectClient(client)">
            <div>
              <span class="tracking-uid">CLIENT-ID: {{ client.id.slice(0, 8) }}</span>
              <h4 class="business-title">{{ client.business_name }}</h4>
            </div>
            <BaseBadge :variant="client.state === 'active' ? 'success' : 'primary'">{{ client.state }}</BaseBadge>
          </div>

          <div class="card-body" @click="handleInspectClient(client)">
            <p v-if="client.website_url" class="card-link">
              <a :href="client.website_url" target="_blank" rel="noopener noreferrer" @click.stop>
                {{ client.website_url }}
              </a>
            </p>
            <p class="card-meta">
              👤 Contact: {{ client.primary_contact_name || 'Unassigned' }}
              <span v-if="client.primary_contact_email">({{ client.primary_contact_email }})</span>
            </p>
            <p class="card-meta">Origin Lead: <code>{{ client.source_lead_id.slice(0, 8) }}</code></p>
            <p class="card-meta">Onboarded: {{ new Date(client.created_at).toLocaleDateString() }}</p>

            <div class="engagements-box">
              <span class="engagements-title">Contracts ({{ client.contracts?.length ?? 0 }}):</span>
              <div v-if="client.contracts && client.contracts.length > 0" class="client-contract-badges">
                <BaseBadge v-for="c in client.contracts" :key="c.id" variant="neutral">
                  {{ c.service_code }}
                </BaseBadge>
              </div>
              <div v-else class="no-engagements">
                Account lifecycle in <strong>{{ client.state }}</strong>. Consulting review active.
              </div>
            </div>
          </div>

          <div class="card-actions">
            <BaseButton
              label="View Dossier"
              variant="secondary"
              @click="handleInspectClient(client)"
            />
            <BaseButton
              label="+ Log Work"
              variant="primary"
              @click="handleOpenLogWork(client)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Workspace 4: Service Catalog Management -->
    <section v-if="activeTab === 'services'" class="workspace-view">
      <div class="services-mgmt-header">
        <div>
          <h3>Service Catalog & Audit Criteria</h3>
          <p class="services-mgmt-subtitle">
            Consulting service offerings governing automated audit parameters and opportunity score weighting.
          </p>
        </div>
        <BaseButton label="+ Add Service Offering" @click="showCreateServiceModal = true" />
      </div>

      <div class="services-grid">
        <div
          v-for="svc in leadStore.services"
          :key="svc.code"
          class="service-mgmt-card"
          @click="handleInspectService(svc)"
        >
          <div class="service-mgmt-head">
            <span class="service-mgmt-rank">{{ svc.rank || 'Rank 1A' }}</span>
            <span class="service-mgmt-price">{{ formatServicePrice(svc) }}</span>
          </div>
          <span class="service-mgmt-code">{{ svc.code }}</span>
          <h4 class="service-mgmt-title">{{ svc.name }}</h4>
          <p class="service-mgmt-desc">{{ svc.description }}</p>

          <div class="service-mgmt-params">
            <span class="params-label">Audit Parameters:</span>
            <div class="params-chips">
              <span
                v-for="p in svc.audit_parameters"
                :key="p"
                class="param-chip"
              >
                {{ p }}
              </span>
            </div>
          </div>

          <div class="card-footer-prompt">
            <span>Click to inspect scope & deliverables &rarr;</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Workspace 5: Business Doctrine -->
    <section v-if="activeTab === 'doctrine'" class="workspace-view">
      <DoctrineWorkspace />
    </section>

    <!-- Modals -->
    <CreateLeadModal :show="showCreateModal" @close="showCreateModal = false" />
    <CreateServiceModal
      :show="showCreateServiceModal"
      @close="showCreateServiceModal = false"
      @create="handleCreateService"
    />
    <ServiceDetailsModal
      :show="showServiceDetailsModal"
      :service="inspectingService"
      @close="showServiceDetailsModal = false"
    />
    <DisqualifyModal
      :show="showDisqualifyModal"
      :lead="selectedLead"
      @close="showDisqualifyModal = false"
      @confirm="handleConfirmDisqualify"
    />
    <ScoreRubricModal
      :show="showRubricModal"
      :lead="inspectingLead"
      :services="leadStore.services"
      @close="showRubricModal = false; inspectingLead = null"
    />
    <ClientOnboardingModal
      :show="showOnboardingModal"
      :lead="selectedLead"
      :services="leadStore.services"
      @close="showOnboardingModal = false; selectedLead = null"
      @onboard="handleCompleteOnboard"
    />
    <ClientDossierDrawer
      :show="showDossierDrawer"
      :client="activeDossierClient"
      @close="showDossierDrawer = false; activeDossierClient = null"
      @log-work="handleOpenLogWork"
    />
    <OpportunityDossierDrawer
      :show="showOpportunityDrawer"
      :lead="activeOpportunityLead"
      :services="leadStore.services"
      @close="showOpportunityDrawer = false; activeOpportunityLead = null"
      @convert="handleConvertFromOpportunityDrawer"
      @disqualify="handleDisqualifyFromOpportunityDrawer"
    />
    <LogMaintenanceModal
      :show="showLogMaintenanceModal"
      :client-id="activeLogClient?.id ?? ''"
      :client-name="activeLogClient?.business_name ?? ''"
      @close="showLogMaintenanceModal = false; activeLogClient = null"
      @submit="handleConfirmLogWork"
    />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-body);
}

.page-container {
  flex: 1;
  max-width: 1200px;
  margin: 1.5rem auto;
  padding: 0 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.header-titles h1 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.subtitle {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.metrics-ribbon {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background: var(--bg-surface);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.metric-alert {
  border-color: var(--metric-alert-border);
  background-color: var(--metric-alert-bg);
}

.metric-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 0.25rem;
}

.metric-alert .metric-value {
  color: var(--metric-alert-text);
}

.actions-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.discovery-flex {
  flex: 1;
  min-width: 320px;
}

.status-banner {
  padding: 0.75rem 1rem;
  background-color: var(--banner-info-bg);
  border: 1px solid var(--banner-info-border);
  color: var(--banner-info-text);
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.error-banner {
  padding: 0.75rem 1rem;
  background-color: var(--banner-error-bg);
  border: 1px solid var(--banner-error-border);
  color: var(--banner-error-text);
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.triage-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
}

.score-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.score-select {
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.table-section {
  margin-bottom: 3rem;
}

.workspace-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.65rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.15s ease;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.pipeline-header,
.clients-header {
  margin-bottom: 1.5rem;
}

.pipeline-header h3,
.clients-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.pipeline-subtitle,
.clients-subtitle {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.empty-pipeline {
  padding: 3rem 1.5rem;
  text-align: center;
  background: var(--bg-surface);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
}

.pipeline-grid,
.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.card-content {
  cursor: pointer;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pipeline-card,
.client-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.pipeline-card:hover,
.client-card:hover {
  border-color: var(--accent-primary);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.tracking-uid {
  font-size: 0.7rem;
  font-family: monospace;
  color: var(--text-muted);
  text-transform: uppercase;
}

.business-title {
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.card-body {
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.card-link a {
  color: var(--accent-hover);
  text-decoration: none;
  font-size: 0.8rem;
  word-break: break-all;
}

.card-link a:hover {
  text-decoration: underline;
}

.card-meta {
  margin: 0;
}

.score-line {
  margin-top: 0.5rem;
  padding: 0.4rem 0.6rem;
  background: var(--bg-surface-hover);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.highlight-score {
  color: var(--accent-primary);
  font-size: 0.95rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-subtle);
}

.engagements-box {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-surface-hover);
  border-radius: 6px;
  font-size: 0.8rem;
}

.engagements-title {
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 0.25rem;
}

.client-contract-badges {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.no-engagements {
  color: var(--text-muted);
  font-style: italic;
}

.engagements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.engagements-list li {
  padding: 0.2rem 0;
  color: var(--text-secondary);
}

.services-mgmt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.services-mgmt-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.services-mgmt-subtitle {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.service-mgmt-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.service-mgmt-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.service-mgmt-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-mgmt-rank {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.service-mgmt-price {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--accent-success, #16a34a);
}

.service-mgmt-code {
  font-size: 0.75rem;
  font-family: monospace;
  font-weight: 600;
  color: var(--text-muted);
  width: fit-content;
}

.service-mgmt-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.service-mgmt-desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.service-mgmt-params {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.params-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.params-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.param-chip {
  font-size: 0.7rem;
  background: var(--bg-surface-hover);
  color: var(--text-secondary);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  font-family: monospace;
}

.card-footer-prompt {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--accent-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
}

/* Mobile App Bar Styling */
.mobile-top-bar {
  display: none;
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }

  .mobile-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background-color: var(--bg-surface);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 30;
  }

  .mobile-hamburger-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-hamburger-btn:hover {
    background-color: var(--bg-surface-hover);
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mobile-brand .brand-text {
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text-primary);
  }

  .mobile-add-btn {
    background: var(--bg-surface-hover);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 0.35rem 0.65rem;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .page-container {
    margin: 1rem auto;
    padding: 0 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    width: 100%;
  }

  .metrics-ribbon {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .metric-card {
    padding: 0.75rem;
  }

  .metric-value {
    font-size: 1.35rem;
  }

  .actions-section {
    flex-direction: column;
    align-items: stretch;
  }

  .discovery-flex {
    min-width: 100%;
  }

  .pipeline-grid,
  .clients-grid {
    grid-template-columns: 1fr;
  }

  .services-mgmt-grid {
    grid-template-columns: 1fr;
  }
}
</style>
