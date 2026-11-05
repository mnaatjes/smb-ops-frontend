<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BasePageContainer from '@/shared/ui/BasePageContainer.vue'
import BasePageHeader from '@/shared/ui/BasePageHeader.vue'
import BaseMetricCard from '@/shared/ui/BaseMetricCard.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseAlert from '@/shared/ui/BaseAlert.vue'
import ClientDossierDrawer from '@/features/client-dossier/ClientDossierDrawer.vue'
import LogWorkModal from '@/features/client-maintenance/LogWorkModal.vue'
import ContractAgreementModal from '@/features/client-contracts/ContractAgreementModal.vue'
import VaultSecretModal from '@/features/client-vault/VaultSecretModal.vue'
import { useLeadStore } from '@/entities/lead/store'
import type {
  ClientAccount,
  LogTimecardPayload,
  AttachContractPayload,
  ClientSecretPayload
} from '@/shared/types/lead'

const store = useLeadStore()

onMounted(async () => {
  await Promise.all([
    store.loadClients(),
    store.loadServices()
  ])
})

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Client Accounts' }
]

// Filter & Search state
const activeStateFilter = ref<'all' | 'active' | 'onboarding' | 'dormant'>('all')
const searchQuery = ref('')
const successBanner = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Overlay state
const isDossierOpen = ref(false)
const selectedClient = ref<ClientAccount | null>(null)

const isLogWorkModalOpen = ref(false)
const clientForLogWork = ref<ClientAccount | null>(null)
const isSavingLogWork = ref(false)

const isAttachContractModalOpen = ref(false)
const clientForContract = ref<ClientAccount | null>(null)
const isSavingContract = ref(false)

const isAddSecretModalOpen = ref(false)
const clientForSecret = ref<ClientAccount | null>(null)
const isSavingSecret = ref(false)

// KPI Calculations
const totalClientsCount = computed(() => store.clients.length)

const activeRetainersCount = computed(() => {
  return store.clients.filter((c) => c.state === 'active').length
})

const onboardingCount = computed(() => {
  return store.clients.filter((c) => c.state === 'onboarding').length
})

const monthlyCarePlansCount = computed(() => {
  return store.clients.reduce((acc, c) => {
    const careContracts = (c.contracts || []).filter(
      (ct) => ct.status === 'active' && ct.contract_type === 'retainer'
    )
    return acc + careContracts.length
  }, 0)
})

// Filtered Accounts
const filteredClients = computed(() => {
  return store.clients.filter((client) => {
    // 1. State filter
    if (activeStateFilter.value !== 'all' && client.state !== activeStateFilter.value) {
      return false
    }

    // 2. Search query filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchesName = client.business_name.toLowerCase().includes(q)
      const matchesContact = (client.primary_contact_name || '').toLowerCase().includes(q)
      const matchesEmail = (client.primary_contact_email || '').toLowerCase().includes(q)
      const matchesPhone = (client.phone || '').toLowerCase().includes(q)
      if (!matchesName && !matchesContact && !matchesEmail && !matchesPhone) {
        return false
      }
    }

    return true
  })
})

// State Badge styling
function getStateBadgeVariant(state: string): 'success' | 'primary' | 'warning' | 'neutral' {
  switch (state) {
    case 'active':
      return 'success'
    case 'onboarding':
      return 'primary'
    case 'dormant':
      return 'warning'
    default:
      return 'neutral'
  }
}

// Handlers
function handleOpenDossier(client: ClientAccount): void {
  selectedClient.value = client
  isDossierOpen.value = true
}

function handleCloseDossier(): void {
  isDossierOpen.value = false
  selectedClient.value = null
}

function handleOpenLogWork(client: ClientAccount): void {
  clientForLogWork.value = client
  isLogWorkModalOpen.value = true
}

function handleCloseLogWork(): void {
  isLogWorkModalOpen.value = false
  clientForLogWork.value = null
}

async function handleSaveLogWork(payload: LogTimecardPayload): Promise<void> {
  if (!clientForLogWork.value) return
  isSavingLogWork.value = true
  try {
    await store.logWork(clientForLogWork.value.id, payload)
    successBanner.value = `Logged ${payload.minutes_spent}m to client timecard`
    handleCloseLogWork()
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to log maintenance work'
  } finally {
    isSavingLogWork.value = false
  }
}

function handleOpenAttachContract(client: ClientAccount): void {
  clientForContract.value = client
  isAttachContractModalOpen.value = true
}

function handleCloseAttachContract(): void {
  isAttachContractModalOpen.value = false
  clientForContract.value = null
}

async function handleSaveAttachContract(payload: AttachContractPayload): Promise<void> {
  if (!clientForContract.value) return
  isSavingContract.value = true
  try {
    await store.attachContract(clientForContract.value.id, payload)
    successBanner.value = `Successfully attached contract: ${payload.service_code}`
    handleCloseAttachContract()
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to attach contract'
  } finally {
    isSavingContract.value = false
  }
}

function handleOpenAddSecret(client: ClientAccount): void {
  clientForSecret.value = client
  isAddSecretModalOpen.value = true
}

function handleCloseAddSecret(): void {
  isAddSecretModalOpen.value = false
  clientForSecret.value = null
}

async function handleSaveSecret(payload: ClientSecretPayload): Promise<void> {
  if (!clientForSecret.value) return
  isSavingSecret.value = true
  try {
    await store.storeSecret(clientForSecret.value.id, payload)
    successBanner.value = `Securely encrypted credential: ${payload.label}`
    handleCloseAddSecret()
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to store secret credential'
  } finally {
    isSavingSecret.value = false
  }
}
</script>

<template>
  <BasePageContainer :fluid="true">
    <BasePageHeader
      title="Client Accounts & Retainers"
      subtitle="Active Account Ledgers, Retainers, & Vault Access"
      :breadcrumbs="breadcrumbs"
    >
      <template #badges>
        <BaseBadge variant="primary">{{ totalClientsCount }} Active Accounts</BaseBadge>
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
    <div class="metrics-ribbon">
      <BaseMetricCard
        label="Total Client Accounts"
        :value="totalClientsCount"
        description="All registered client accounts"
      />
      <BaseMetricCard
        label="Active Retainers"
        :value="activeRetainersCount"
        description="Operational accounts with active SLAs"
      />
      <BaseMetricCard
        label="Onboarding in Progress"
        :value="onboardingCount"
        description="Recently converted accounts"
      />
      <BaseMetricCard
        label="Active Care Plans"
        :value="monthlyCarePlansCount"
        description="Governed recurring digital care plans"
      />
    </div>

    <!-- Account State & Search Filter Deck -->
    <div class="accounts-controls-deck">
      <div class="deck-top-row">
        <div class="state-pills-cluster">
          <button
            type="button"
            class="state-pill"
            :class="{ active: activeStateFilter === 'all' }"
            @click="activeStateFilter = 'all'"
          >
            All Accounts
          </button>
          <button
            type="button"
            class="state-pill"
            :class="{ active: activeStateFilter === 'active' }"
            @click="activeStateFilter = 'active'"
          >
            Active Retainers
          </button>
          <button
            type="button"
            class="state-pill"
            :class="{ active: activeStateFilter === 'onboarding' }"
            @click="activeStateFilter = 'onboarding'"
          >
            Onboarding
          </button>
          <button
            type="button"
            class="state-pill"
            :class="{ active: activeStateFilter === 'dormant' }"
            @click="activeStateFilter = 'dormant'"
          >
            Dormant
          </button>
        </div>

        <div class="search-input-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search account name, contact, or email..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <!-- Client Accounts Cards Grid -->
    <section class="accounts-cards-section">
      <div v-if="filteredClients.length > 0" class="cards-grid">
        <BaseCard
          v-for="client in filteredClients"
          :key="client.id"
          class="client-card"
          :clickable="true"
          @click="handleOpenDossier(client)"
        >
          <template #header>
            <div class="card-header-cluster">
              <div>
                <h4 class="client-title">{{ client.business_name }}</h4>
                <div class="client-state-pill">
                  <BaseBadge :variant="getStateBadgeVariant(client.state)">
                    {{ client.state.toUpperCase() }}
                  </BaseBadge>
                </div>
              </div>
            </div>
          </template>

          <div class="card-body-content">
            <!-- Contact & External URL Vitals -->
            <div class="vitals-row">
              <span v-if="client.primary_contact_name" class="contact-name">
                👤 {{ client.primary_contact_name }}
              </span>
              <span v-if="client.phone" class="phone-chip">
                📞 {{ client.phone }}
              </span>
              <a
                v-if="client.website_url"
                :href="client.website_url"
                target="_blank"
                rel="noopener noreferrer"
                class="external-site-link"
                @click.stop
              >
                🌐 {{ client.website_url }} ↗
              </a>
            </div>

            <!-- Active Contracts Chips -->
            <div class="contracts-chips-row">
              <span class="contracts-label">Contracts:</span>
              <template v-if="client.contracts && client.contracts.length > 0">
                <span
                  v-for="contract in client.contracts"
                  :key="contract.id"
                  class="contract-tag"
                >
                  {{ contract.service_code }} (${{ contract.billing_rate }}/{{ contract.billing_frequency }})
                </span>
              </template>
              <span v-else class="text-muted">No contracts attached</span>
            </div>
          </div>

          <template #footer>
            <div class="card-actions-cluster" @click.stop>
              <BaseButton
                label="Open Dossier"
                variant="secondary"
                class="action-btn-dossier"
                @click="handleOpenDossier(client)"
              />
              <BaseButton
                label="+ Log Work"
                variant="primary"
                class="action-btn-log-work"
                @click="handleOpenLogWork(client)"
              />
              <BaseButton
                label="+ Attach Care Plan"
                variant="secondary"
                class="action-btn-attach-contract"
                @click="handleOpenAttachContract(client)"
              />
            </div>
          </template>
        </BaseCard>
      </div>

      <div v-else class="empty-accounts-state">
        <p class="empty-text">No client accounts found matching the current filter.</p>
      </div>
    </section>

    <!-- Deep Client Account Dossier Drawer (Slideout lg 960px) -->
    <ClientDossierDrawer
      :show="isDossierOpen"
      :client="selectedClient"
      @close="handleCloseDossier"
      @log-work="handleOpenLogWork"
      @attach-contract="handleOpenAttachContract"
      @add-secret="handleOpenAddSecret"
    />

    <!-- Log Maintenance Work Modal -->
    <LogWorkModal
      :show="isLogWorkModalOpen"
      :client-name="clientForLogWork?.business_name || 'Client'"
      :is-saving="isSavingLogWork"
      @close="handleCloseLogWork"
      @save="handleSaveLogWork"
    />

    <!-- Attach Care Plan Contract Modal -->
    <ContractAgreementModal
      :show="isAttachContractModalOpen"
      :services="store.services"
      :client-id="clientForContract?.id"
      :client-name="clientForContract?.business_name || 'Client'"
      :is-saving="isSavingContract"
      @close="handleCloseAttachContract"
      @save="handleSaveAttachContract"
    />

    <!-- Store Credential Vault Secret Modal -->
    <VaultSecretModal
      :show="isAddSecretModalOpen"
      :client-name="clientForSecret?.business_name || 'Client'"
      :is-saving="isSavingSecret"
      @close="handleCloseAddSecret"
      @save="handleSaveSecret"
    />
  </BasePageContainer>
</template>

<style scoped>
.metrics-ribbon {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.accounts-controls-deck {
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

.state-pills-cluster {
  display: inline-flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.state-pill {
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

.state-pill:hover {
  background-color: var(--bg-hover, #f1f5f9);
  color: var(--text-primary, #0f172a);
}

.state-pill.active {
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

.accounts-cards-section {
  width: 100%;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.25rem;
}

.client-card {
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.card-header-cluster {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.client-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.client-state-pill {
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

.contact-name {
  font-weight: 600;
  color: var(--text-primary);
}

.phone-chip {
  color: var(--text-secondary);
}

.external-site-link {
  color: var(--accent-primary, #3b82f6);
  text-decoration: none;
}

.external-site-link:hover {
  text-decoration: underline;
}

.contracts-chips-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.contracts-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.contract-tag {
  background-color: var(--bg-surface-subtle);
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.75rem;
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

.empty-accounts-state {
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
