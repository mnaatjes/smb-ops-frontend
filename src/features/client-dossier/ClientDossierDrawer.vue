<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import MaintenanceGauge from '@/shared/ui/MaintenanceGauge.vue'
import type {
  ClientAccount,
  ContractAgreement,
  Timecard,
  ContinuityHealth,
  ClientSecretMetadata,
  ClientSecretPayload,
  SecretType
} from '@/shared/types/lead'
import { useLeadStore } from '@/entities/lead/store'

const props = defineProps<{
  show: boolean
  client: ClientAccount | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'log-work', client: ClientAccount, hasActiveCarePlan?: boolean): void
}>()

const leadStore = useLeadStore()
const timecard = ref<Timecard | null>(null)
const continuity = ref<ContinuityHealth | null>(null)
const secrets = ref<ClientSecretMetadata[]>([])
const contracts = ref<ContractAgreement[]>([])
const loadingTelemetry = ref(false)
const loadingSecrets = ref(false)
const pingingContinuity = ref(false)

// Active plaintext reveals map: secretId -> { plaintext: string, remainingSeconds: number, timer: ReturnType<typeof setInterval> }
const activeReveals = ref<
  Record<string, { plaintext: string; remainingSeconds: number; timer?: ReturnType<typeof setInterval> }>
>({})
const revealingIds = ref<Record<string, boolean>>({})
const copyingIds = ref<Record<string, boolean>>({})

// Add Secret Modal State
const showAddSecretModal = ref(false)
const newSecretType = ref<SecretType>('wordpress_admin')
const newSecretLabel = ref('WordPress Admin')
const newSecretLoginUrl = ref('')
const newSecretUsername = ref('')
const newSecretPassword = ref('')
const savingSecret = ref(false)
const addSecretError = ref<string | null>(null)

// Attach Care Plan Contract Modal State
const showAttachContractModal = ref(false)
const attachServiceCode = ref('CARE_PLAN_30')
const attachBillingRate = ref(150)
const attachContractType = ref('retainer')
const attachingContract = ref(false)
const attachContractError = ref<string | null>(null)

const CARE_PLAN_OPTIONS = [
  { code: 'CARE_PLAN_30', name: 'Basic Care Plan (30 min / mo)', defaultRate: 150, type: 'retainer' },
  { code: 'CARE_PLAN_60', name: 'Standard Care Plan (60 min / mo)', defaultRate: 275, type: 'retainer' },
  { code: 'CARE_PLAN_90', name: 'Premium Care Plan (90 min / mo)', defaultRate: 375, type: 'retainer' },
  { code: 'DYNAMIC_CMS_RETAINER', name: 'Custom CMS Retainer (30 min / mo)', defaultRate: 150, type: 'retainer' },
  { code: 'SVC-SEC', name: 'Domain & SSL Hardening (Fixed Fee)', defaultRate: 350, type: 'fixed_fee' },
  { code: 'SVC-WEB', name: 'Mobile Web Modernization (Fixed Fee)', defaultRate: 1200, type: 'fixed_fee' }
]

function openAttachContractModal(): void {
  attachServiceCode.value = 'CARE_PLAN_30'
  attachBillingRate.value = 150
  attachContractType.value = 'retainer'
  attachContractError.value = null
  showAttachContractModal.value = true
}

function onAttachServiceCodeChange(): void {
  const found = CARE_PLAN_OPTIONS.find((c) => c.code === attachServiceCode.value)
  if (found) {
    attachBillingRate.value = found.defaultRate
    attachContractType.value = found.type
  }
}

async function handleConfirmAttachContract(): Promise<void> {
  if (!props.client) return
  attachingContract.value = true
  attachContractError.value = null
  try {
    const created = await leadStore.attachContract(props.client.id, {
      service_code: attachServiceCode.value,
      billing_rate: Number(attachBillingRate.value),
      contract_type: attachContractType.value
    })
    contracts.value.push(created)
    await loadClientData()
    showAttachContractModal.value = false
  } catch (err: unknown) {
    attachContractError.value = err instanceof Error ? err.message : 'Failed to attach contract'
  } finally {
    attachingContract.value = false
  }
}

function onNewSecretTypeChange(): void {
  switch (newSecretType.value) {
    case 'wordpress_admin':
      newSecretLabel.value = 'WordPress Admin'
      if (props.client?.website_url && !newSecretLoginUrl.value) {
        newSecretLoginUrl.value = `${props.client.website_url.replace(/\/$/, '')}/wp-admin`
      }
      break
    case 'hosting_cpanel':
      newSecretLabel.value = 'Hosting / cPanel'
      break
    case 'sftp_ssh':
      newSecretLabel.value = 'SFTP / SSH Access'
      break
    case 'dns_registrar':
      newSecretLabel.value = 'DNS / Domain Registrar'
      break
    case 'database_direct':
      newSecretLabel.value = 'Database Direct'
      break
  }
}

function openAddSecretModal(): void {
  newSecretType.value = 'wordpress_admin'
  newSecretLabel.value = 'WordPress Admin'
  newSecretLoginUrl.value = props.client?.website_url
    ? `${props.client.website_url.replace(/\/$/, '')}/wp-admin`
    : ''
  newSecretUsername.value = ''
  newSecretPassword.value = ''
  addSecretError.value = null
  showAddSecretModal.value = true
}

async function handleSaveNewSecret(): Promise<void> {
  if (!props.client) return
  if (!newSecretUsername.value.trim() || !newSecretPassword.value.trim()) {
    addSecretError.value = 'Username and password are required.'
    return
  }
  savingSecret.value = true
  addSecretError.value = null
  try {
    const payload: ClientSecretPayload = {
      secret_type: newSecretType.value,
      label: newSecretLabel.value.trim() || newSecretType.value,
      username: newSecretUsername.value.trim(),
      password: newSecretPassword.value,
      login_url: newSecretLoginUrl.value.trim() || null
    }
    const created = await leadStore.storeSecret(props.client.id, payload)
    secrets.value.push(created)
    showAddSecretModal.value = false
  } catch (err: unknown) {
    addSecretError.value = err instanceof Error ? err.message : 'Failed to store secret in vault'
  } finally {
    savingSecret.value = false
  }
}

async function handleReveal(secretId: string): Promise<void> {
  if (!props.client) return
  if (activeReveals.value[secretId]) {
    hideSecret(secretId)
    return
  }

  revealingIds.value[secretId] = true
  try {
    const plaintext = await leadStore.revealSecret(props.client.id, secretId)
    const entry: { plaintext: string; remainingSeconds: number; timer?: ReturnType<typeof setInterval> } = {
      plaintext,
      remainingSeconds: 30
    }

    entry.timer = setInterval(() => {
      if (entry.remainingSeconds > 1) {
        entry.remainingSeconds -= 1
      } else {
        hideSecret(secretId)
      }
    }, 1000)

    activeReveals.value[secretId] = entry
  } catch (err: unknown) {
    console.error('Failed to reveal secret:', err)
  } finally {
    revealingIds.value[secretId] = false
  }
}

function hideSecret(secretId: string): void {
  const active = activeReveals.value[secretId]
  if (active?.timer) {
    clearInterval(active.timer)
  }
  delete activeReveals.value[secretId]
}

async function handleCopy(secretId: string): Promise<void> {
  if (!props.client) return
  let text = activeReveals.value[secretId]?.plaintext
  if (!text) {
    copyingIds.value[secretId] = true
    try {
      text = await leadStore.revealSecret(props.client.id, secretId)
    } catch (err: unknown) {
      console.error('Failed to retrieve secret for copying:', err)
      copyingIds.value[secretId] = false
      return
    }
    copyingIds.value[secretId] = false
  }

  try {
    await navigator.clipboard.writeText(text)
    copyingIds.value[secretId] = true
    setTimeout(() => {
      copyingIds.value[secretId] = false
    }, 2000)
  } catch (err: unknown) {
    console.error('Clipboard copy failed:', err)
  }
}

async function handleDeleteSecret(secretId: string): Promise<void> {
  if (!props.client) return
  hideSecret(secretId)
  try {
    await leadStore.deleteSecret(props.client.id, secretId)
    secrets.value = secrets.value.filter((s) => s.id !== secretId)
  } catch (err: unknown) {
    console.error('Failed to delete secret:', err)
  }
}

function clearAllTimers(): void {
  for (const sId of Object.keys(activeReveals.value)) {
    hideSecret(sId)
  }
}

onUnmounted(() => {
  clearAllTimers()
})

async function loadClientData(): Promise<void> {
  if (!props.client) return
  clearAllTimers()
  loadingTelemetry.value = true
  loadingSecrets.value = true
  try {
    const [tc, health, secList] = await Promise.all([
      leadStore.getTimecard(props.client.id).catch(() => null),
      leadStore.getContinuity(props.client.id).catch(() => null),
      leadStore.getClientSecrets(props.client.id).catch(() => [])
    ])
    timecard.value = tc
    continuity.value = health
    secrets.value = secList ?? []
  } finally {
    loadingTelemetry.value = false
    loadingSecrets.value = false
  }
}

watch(
  () => props.client,
  (newClient) => {
    if (newClient) {
      contracts.value = [...(newClient.contracts ?? [])]
      loadClientData()
    } else {
      contracts.value = []
    }
  },
  { immediate: true }
)

async function handlePing(): Promise<void> {
  if (!props.client) return
  pingingContinuity.value = true
  try {
    const updated = await leadStore.pingContinuity(props.client.id)
    continuity.value = updated
  } finally {
    pingingContinuity.value = false
  }
}

function formatEntryType(entryType?: string): string {
  switch (entryType) {
    case 'billable_extra':
      return 'Billable Extra'
    case 'internal_non_billable':
      return 'Internal'
    default:
      return 'Retainer'
  }
}

function handleTriggerLogWork(): void {
  if (!props.client) return
  const hasPlan = Boolean(timecard.value && timecard.value.monthly_retainer_cap_minutes > 0)
  emit('log-work', props.client, hasPlan)
}
</script>


<template>
  <div v-if="show && client" class="workspace-overlay" @click.self="emit('close')">
    <div class="workspace-canvas">
      <!-- Full-Canvas Workspace Header -->
      <header class="workspace-header">
        <div class="header-identity">
          <div class="breadcrumbs-row">
            <span class="workspace-tag">Client Accounts</span>
            <span class="crumb-separator">/</span>
            <span class="tracking-uid">CLIENT-ID: {{ client.id.slice(0, 8) }}</span>
          </div>
          <div class="title-status-row">
            <h2 class="workspace-title">{{ client.business_name }}</h2>
            <BaseBadge variant="primary">{{ client.state }}</BaseBadge>
          </div>
        </div>

        <div class="header-actions">
          <BaseButton
            label="+ Log Work"
            variant="primary"
            @click="handleTriggerLogWork"
          />
          <button type="button" class="close-btn" title="Close Workspace (Esc)" @click="emit('close')">
            ✕
          </button>
        </div>
      </header>

      <!-- Full-Canvas Dual-Column Split Workspace Body -->
      <main class="workspace-body">
        <!-- COLUMN 1: Account Context & Continuity Telemetry (44%) -->
        <section class="workspace-col col-left">
          <!-- Account Profile & Identity -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">👤 Account Profile</h3>
              <BaseBadge variant="primary">{{ client.state }}</BaseBadge>
            </div>
            <div class="meta-vitals-grid">
              <div class="vital-item">
                <span class="vital-label">Primary Contact</span>
                <span class="vital-text">{{ client.primary_contact_name ?? 'N/A' }}</span>
              </div>
              <div class="vital-item">
                <span class="vital-label">Contact Email</span>
                <span class="vital-text">{{ client.primary_contact_email ?? 'N/A' }}</span>
              </div>
              <div class="vital-item">
                <span class="vital-label">Phone</span>
                <span class="vital-text">{{ client.phone ?? 'N/A' }}</span>
              </div>
              <div class="vital-item">
                <span class="vital-label">Website</span>
                <a
                  v-if="client.website_url"
                  :href="client.website_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="website-link"
                >
                  {{ client.website_url }} ↗
                </a>
                <span v-else class="vital-empty">N/A</span>
              </div>
            </div>
          </div>

          <!-- Continuity & SLA Health Probes -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">🛡️ Continuity & SLA Health</h3>
              <BaseButton
                label="Run Diagnostics Ping"
                variant="secondary"
                :disabled="pingingContinuity"
                @click="handlePing"
              />
            </div>

            <div v-if="continuity" class="continuity-card">
              <div class="health-item">
                <span class="health-bullet green" />
                <span>SSL Certificate: Monitored & Valid</span>
              </div>
              <div class="health-item">
                <span class="health-bullet" :class="continuity.uptime_healthy ? 'green' : 'red'" />
                <span>Endpoint Uptime: {{ continuity.uptime_healthy ? 'Operational' : 'Degraded' }}</span>
              </div>
              <div class="health-item">
                <span class="health-bullet green" />
                <span>Weekly Backup: {{ continuity.backup_bucket }}</span>
              </div>
              <div class="ping-meta">
                Last probe ping: {{ new Date(continuity.last_ping_at).toLocaleTimeString() }}
              </div>
            </div>
            <div v-else class="empty-state">
              Continuity diagnostics not initialized. Click "Run Diagnostics Ping" to check status.
            </div>
          </div>

          <!-- Governed Active Service Contracts -->
          <div class="panel-card">
            <div class="panel-header">
              <div class="title-with-badge">
                <h3 class="panel-title">📄 Active Service Contracts</h3>
                <span class="panel-count">{{ contracts.length }}</span>
              </div>
              <BaseButton
                label="+ Attach Care Plan"
                variant="secondary"
                @click="openAttachContractModal"
              />
            </div>
            <div v-if="contracts.length > 0" class="contracts-list">
              <div v-for="c in contracts" :key="c.id" class="contract-card">
                <div class="contract-head">
                  <span class="contract-code">{{ c.service_code }}</span>
                  <BaseBadge variant="success">{{ c.status }}</BaseBadge>
                </div>
                <div class="contract-body">
                  <div>Rate: <strong>${{ c.billing_rate }}</strong> / {{ c.billing_frequency }}</div>
                  <div>Type: {{ c.contract_type }}</div>
                  <div class="contract-date">Started: {{ c.start_date }}</div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              No service contracts attached.
            </div>
          </div>
        </section>

        <!-- COLUMN 2: Operations, Retainer Timecard & Secret Vault (56%) -->
        <section class="workspace-col col-right">
          <!-- Monthly Retainer & Timecard Section -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">⏱️ Monthly Retainer Timecard</h3>
              <BaseButton
                label="+ Log Work"
                variant="primary"
                @click="handleTriggerLogWork"
              />
            </div>

            <div v-if="timecard" class="timecard-box">
              <MaintenanceGauge
                :total-minutes="timecard.total_minutes_logged"
                :cap-minutes="timecard.monthly_retainer_cap_minutes"
                :out-of-scope="timecard.out_of_scope_flag"
              />

              <!-- Work Log Entries Table -->
              <div class="work-log-history">
                <h5 class="history-title">Recent Maintenance Entries ({{ timecard.entries.length }})</h5>
                <div v-if="timecard.entries.length === 0" class="empty-log">
                  No maintenance time logged this billing cycle.
                </div>
                <div v-else class="log-entries-list">
                  <div v-for="entry in timecard.entries" :key="entry.id" class="log-entry-item">
                    <div class="log-entry-head">
                      <div class="log-title-group">
                        <span
                          class="log-type-tag"
                          :class="entry.entry_type || 'retainer_maintenance'"
                        >
                          {{ formatEntryType(entry.entry_type) }}
                        </span>
                        <span class="log-desc">{{ entry.description }}</span>
                      </div>
                      <strong class="log-duration">{{ entry.minutes_spent }}m</strong>
                    </div>
                    <div class="log-entry-meta">
                      <span>Logged by {{ entry.author }}</span>
                      <span>{{ new Date(entry.performed_at).toLocaleDateString() }}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              Loading timecard telemetry...
            </div>
          </div>

          <!-- Credentials & Access Vault Section -->
          <div class="panel-card">
            <div class="panel-header">
              <div class="title-with-badge">
                <h3 class="panel-title">🔐 Credentials & Access Vault</h3>
                <span class="panel-count">{{ secrets.length }}</span>
              </div>
              <BaseButton
                label="+ Add Secret"
                variant="secondary"
                @click="openAddSecretModal"
              />
            </div>

            <div v-if="loadingSecrets" class="empty-state">
              Loading encrypted vault credentials...
            </div>

            <div v-else-if="secrets.length === 0" class="empty-state">
              No credentials stored in vault. Click "+ Add Secret" to safely ingest website or server logins.
            </div>

            <div v-else class="vault-credentials-list">
              <div v-for="sec in secrets" :key="sec.id" class="vault-credential-card">
                <div class="vault-card-head">
                  <div class="vault-card-title-group">
                    <span class="vault-sec-type">{{ sec.secret_type }}</span>
                    <strong class="vault-sec-label">{{ sec.label }}</strong>
                  </div>
                  <div class="vault-card-actions">
                    <button
                      class="vault-action-btn delete-btn"
                      title="Purge Secret"
                      @click="handleDeleteSecret(sec.id)"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div class="vault-card-details">
                  <div v-if="sec.login_url" class="vault-row">
                    <span class="vault-field-label">URL:</span>
                    <a :href="sec.login_url" target="_blank" rel="noopener noreferrer" class="vault-link">
                      {{ sec.login_url }}
                    </a>
                  </div>
                  <div class="vault-row">
                    <span class="vault-field-label">Username:</span>
                    <code class="vault-username">{{ sec.username }}</code>
                  </div>
                  <div class="vault-row vault-secret-row">
                    <span class="vault-field-label">Password:</span>
                    <div class="vault-secret-reveal-box">
                      <span v-if="activeReveals[sec.id]" class="revealed-plaintext">
                        {{ activeReveals[sec.id].plaintext }}
                      </span>
                      <span v-else class="masked-dots">
                        ••••••••••••••••
                      </span>

                      <span v-if="activeReveals[sec.id]" class="countdown-badge">
                        {{ activeReveals[sec.id].remainingSeconds }}s
                      </span>

                      <button
                        class="reveal-toggle-btn"
                        :title="activeReveals[sec.id] ? 'Hide Password' : 'Audit Reveal Password'"
                        :disabled="revealingIds[sec.id]"
                        @click="handleReveal(sec.id)"
                      >
                        {{ activeReveals[sec.id] ? '👁️‍🗨️' : '👁️' }}
                      </button>

                      <button
                        class="copy-btn"
                        :title="copyingIds[sec.id] ? 'Copied!' : 'Copy to Clipboard'"
                        @click="handleCopy(sec.id)"
                      >
                        {{ copyingIds[sec.id] ? '✓' : '📋' }}
                      </button>
                    </div>
                  </div>
                  <div class="vault-meta-row">
                    <span>AES-256 ({{ sec.key_version }})</span>
                    <span>Updated {{ new Date(sec.updated_at).toLocaleDateString() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Add Secret Modal -->
    <BaseModal
      :show="showAddSecretModal"
      title="Store Encrypted Credential"
      @close="showAddSecretModal = false"
    >
      <div class="add-secret-modal-form">
        <p class="modal-instruction">
          Credentials are encrypted via Fernet AES-256 before persisting. Operators can reveal passwords on-demand with automatic 30-second masking.
        </p>

        <div v-if="addSecretError" class="add-secret-error">
          {{ addSecretError }}
        </div>

        <div class="form-group">
          <label class="form-label">Secret Category</label>
          <select
            v-model="newSecretType"
            class="modal-select"
            @change="onNewSecretTypeChange"
          >
            <option value="wordpress_admin">WordPress Admin</option>
            <option value="hosting_cpanel">Hosting / cPanel</option>
            <option value="sftp_ssh">SFTP / SSH Access</option>
            <option value="dns_registrar">DNS / Domain Registrar</option>
            <option value="database_direct">Database Direct</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Label</label>
          <BaseInput v-model="newSecretLabel" placeholder="e.g. Production WP Admin" />
        </div>

        <div class="form-group">
          <label class="form-label">Login URL / Endpoint</label>
          <BaseInput v-model="newSecretLoginUrl" placeholder="https://example.com/wp-admin" />
        </div>

        <div class="form-group">
          <label class="form-label">Username / Identifier *</label>
          <BaseInput v-model="newSecretUsername" placeholder="admin@example.com" />
        </div>

        <div class="form-group">
          <label class="form-label">Password / Secret *</label>
          <BaseInput v-model="newSecretPassword" type="password" placeholder="••••••••" />
        </div>

        <div class="modal-form-actions">
          <BaseButton
            label="Cancel"
            variant="secondary"
            @click="showAddSecretModal = false"
          />
          <BaseButton
            label="Encrypt & Store"
            variant="primary"
            :disabled="savingSecret"
            @click="handleSaveNewSecret"
          />
        </div>
      </div>
    </BaseModal>

    <!-- Attach Care Plan Contract Modal -->
    <BaseModal
      :show="showAttachContractModal"
      title="Attach Add-on Care Plan / Contract"
      @close="showAttachContractModal = false"
    >
      <div class="modal-form-body">
        <p class="modal-intro">
          Attach a recurring Care Plan retainer or fixed consulting contract to
          <strong>{{ client.business_name }}</strong>.
        </p>

        <div v-if="attachContractError" class="modal-error-banner">
          {{ attachContractError }}
        </div>

        <div class="form-group">
          <label class="form-label">Service Package / Care Plan *</label>
          <select
            v-model="attachServiceCode"
            class="modal-select"
            @change="onAttachServiceCodeChange"
          >
            <option
              v-for="opt in CARE_PLAN_OPTIONS"
              :key="opt.code"
              :value="opt.code"
            >
              {{ opt.name }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label class="form-label">Billing Rate ($ USD) *</label>
            <BaseInput
              v-model.number="attachBillingRate"
              type="number"
              min="0"
              placeholder="150"
            />
          </div>

          <div class="form-group half">
            <label class="form-label">Contract Type</label>
            <select v-model="attachContractType" class="modal-select">
              <option value="retainer">Monthly Retainer</option>
              <option value="fixed_fee">Fixed Fee Project</option>
            </select>
          </div>
        </div>

        <div class="modal-form-actions">
          <BaseButton
            label="Cancel"
            variant="secondary"
            @click="showAttachContractModal = false"
          />
          <BaseButton
            label="Attach Contract"
            variant="primary"
            :disabled="attachingContract"
            @click="handleConfirmAttachContract"
          />
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.workspace-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 50;
  display: flex;
  justify-content: flex-end;
}

/* Expands across full dashboard width minus 260px vertical navigation rail */
.workspace-canvas {
  width: calc(100vw - 260px);
  max-width: calc(100vw - 260px);
  height: 100vh;
  background-color: var(--color-background, #090d16);
  border-left: 1px solid var(--color-border, #1e293b);
  display: flex;
  flex-direction: column;
  box-shadow: -6px 0 32px rgba(0, 0, 0, 0.6);
  animation: slideInWorkspace 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

@keyframes slideInWorkspace {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Header */
.workspace-header {
  padding: 1rem 1.75rem;
  border-bottom: 1px solid var(--color-border, #1e293b);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface, #0f172a);
  flex-shrink: 0;
}

.breadcrumbs-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.workspace-tag {
  font-weight: 600;
  color: var(--color-primary, #3b82f6);
}

.crumb-separator {
  color: var(--color-text-muted, #64748b);
}

.tracking-uid {
  font-family: monospace;
}

.title-status-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.workspace-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-text, #f1f5f9);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted, #94a3b8);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--color-text, #f1f5f9);
}

/* Body: 2 Independent Columns */
.workspace-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: var(--color-background, #090d16);
}

.workspace-col {
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.col-left {
  width: 44%;
  border-right: 1px solid var(--color-border, #1e293b);
  background-color: rgba(15, 23, 42, 0.4);
}

.col-right {
  width: 56%;
  background-color: var(--color-background, #090d16);
}

/* Generic Panel Cards */
.panel-card {
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #1e293b);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text, #f1f5f9);
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-count {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  background-color: var(--color-surface-muted, #1e293b);
  border-radius: 9999px;
  color: var(--color-text-muted, #94a3b8);
  font-weight: 600;
}

/* Meta vitals */
.meta-vitals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.vital-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.vital-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-muted, #94a3b8);
}

.vital-text {
  font-size: 0.82rem;
  color: var(--color-text, #f1f5f9);
}

.vital-empty {
  font-size: 0.82rem;
  color: var(--color-text-muted, #94a3b8);
  font-style: italic;
}

.website-link {
  font-size: 0.82rem;
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
  word-break: break-all;
}

.website-link:hover {
  text-decoration: underline;
}

/* Continuity */
.continuity-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.health-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text, #f1f5f9);
}

.health-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.health-bullet.green {
  background-color: var(--color-success, #10b981);
  box-shadow: 0 0 6px var(--color-success, #10b981);
}

.health-bullet.red {
  background-color: var(--color-danger, #ef4444);
  box-shadow: 0 0 6px var(--color-danger, #ef4444);
}

.ping-meta {
  font-size: 0.7rem;
  color: var(--color-text-muted, #94a3b8);
  margin-top: 0.25rem;
}

/* Contracts */
.contracts-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;
}

.contract-card {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.8rem;
}

.contract-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.contract-code {
  font-family: monospace;
  font-weight: 600;
  color: var(--color-text, #f1f5f9);
}

.contract-body {
  display: flex;
  gap: 1rem;
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.75rem;
}

.contract-date {
  font-style: italic;
}

/* Timecard */
.timecard-box {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.history-title {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-muted, #94a3b8);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.log-entries-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 240px;
  overflow-y: auto;
}

.log-entry-item {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  font-size: 0.78rem;
}

.log-entry-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: var(--color-text, #f1f5f9);
}

.log-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  overflow: hidden;
}

.log-type-tag {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.log-type-tag.retainer_maintenance {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.log-type-tag.billable_extra {
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.log-type-tag.internal_non_billable {
  background-color: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}


.log-duration {
  color: var(--color-primary, #3b82f6);
}

.log-entry-meta {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.7rem;
  margin-top: 0.25rem;
}

.empty-state, .empty-log {
  font-size: 0.78rem;
  color: var(--color-text-muted, #94a3b8);
  font-style: italic;
}

/* Secret Vault */
.vault-credentials-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vault-credential-card {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.85rem;
}

.vault-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border, #334155);
  padding-bottom: 0.35rem;
  margin-bottom: 0.5rem;
}

.vault-card-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.vault-sec-type {
  font-size: 0.65rem;
  text-transform: uppercase;
  background-color: rgba(59, 130, 246, 0.15);
  color: var(--color-primary, #3b82f6);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

.vault-sec-label {
  font-size: 0.85rem;
  color: var(--color-text, #f1f5f9);
}

.vault-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem 0.3rem;
  font-size: 0.8rem;
  border-radius: 4px;
}

.vault-action-btn:hover {
  background-color: rgba(239, 68, 68, 0.15);
}

.vault-card-details {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.78rem;
}

.vault-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.vault-field-label {
  width: 75px;
  color: var(--color-text-muted, #94a3b8);
  flex-shrink: 0;
}

.vault-link {
  color: var(--color-primary, #3b82f6);
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vault-username {
  font-family: monospace;
  color: var(--color-text, #f1f5f9);
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

.vault-secret-reveal-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--color-border, #334155);
}

.masked-dots {
  letter-spacing: 2px;
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.85rem;
}

.revealed-plaintext {
  font-family: monospace;
  color: #10b981;
  font-weight: 600;
  font-size: 0.85rem;
}

.countdown-badge {
  background-color: #ef4444;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}

.reveal-toggle-btn, .copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.1rem 0.2rem;
  font-size: 0.8rem;
  border-radius: 3px;
}

.reveal-toggle-btn:hover, .copy-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.vault-meta-row {
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  color: var(--color-text-muted, #64748b);
  font-size: 0.65rem;
}

/* Add Secret Modal Styles */
.add-secret-modal-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 0.5rem 0;
}

.modal-instruction {
  font-size: 0.8rem;
  color: var(--color-text-muted, #94a3b8);
  margin: 0;
}

.add-secret-error {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.8rem;
  color: var(--color-text-muted, #94a3b8);
}

.modal-select {
  width: 100%;
  padding: 0.5rem;
  background-color: var(--color-background, #090d16);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  color: var(--color-text, #f1f5f9);
  font-size: 0.85rem;
}

.modal-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 1024px) {
  .workspace-canvas {
    width: 100vw;
    max-width: 100vw;
  }

  .workspace-body {
    flex-direction: column;
    overflow-y: auto;
  }

  .col-left, .col-right {
    width: 100%;
    border-right: none;
    height: auto;
    overflow-y: visible;
  }
}
</style>

