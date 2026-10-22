<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import MaintenanceGauge from '@/shared/ui/MaintenanceGauge.vue'
import type {
  ClientAccount,
  ContractAgreement,
  Timecard,
  ContinuityHealth,
  ClientSecretMetadata
} from '@/shared/types/lead'
import { useLeadStore } from '@/entities/lead/store'

const props = defineProps<{
  show: boolean
  client: ClientAccount | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'log-work', client: ClientAccount, hasActiveCarePlan?: boolean): void
  (e: 'attach-contract', client: ClientAccount): void
  (e: 'add-secret', client: ClientAccount): void
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

// Attach Care Plan Contract Trigger
function openAttachContractModal(): void {
  if (props.client) {
    emit('attach-contract', props.client)
  }
}

// Contract Accordion & Discrete Actions Checklist
const expandedContractIds = ref<Record<string, boolean>>({})

// Persistent checklist state: Record<contractId, Record<actionIndex, { completed: boolean; commitUuid?: string }>>
const contractActionStates = ref<Record<string, Record<number, { completed: boolean; commitUuid?: string }>>>({})
const editingCommitContractId = ref<string | null>(null)
const editingCommitActionIdx = ref<number | null>(null)
const editingCommitInput = ref('')

function getStorageKey(clientId: string): string {
  return `smb_contract_actions:${clientId}`
}

function loadContractActionStates(): void {
  if (!props.client) return
  try {
    const raw = localStorage.getItem(getStorageKey(props.client.id))
    if (raw) {
      contractActionStates.value = JSON.parse(raw)
    } else {
      contractActionStates.value = {}
    }
  } catch {
    contractActionStates.value = {}
  }
}

function saveContractActionStates(): void {
  if (!props.client) return
  try {
    localStorage.setItem(getStorageKey(props.client.id), JSON.stringify(contractActionStates.value))
  } catch (err: unknown) {
    console.error('Failed to persist contract actions to localStorage:', err)
  }
}

function toggleContractAccordion(contractId: string): void {
  expandedContractIds.value[contractId] = !expandedContractIds.value[contractId]
}

function getContractDiscreteActions(serviceCode: string): string[] {
  // 1. Cross-reference catalog service offerings
  const catalogMatch = leadStore.services.find((s) => s.code === serviceCode)
  if (catalogMatch && ((catalogMatch.scope && catalogMatch.scope.length > 0) || (catalogMatch.deliverables && catalogMatch.deliverables.length > 0))) {
    const list: string[] = []
    if (catalogMatch.scope) list.push(...catalogMatch.scope)
    if (catalogMatch.deliverables) list.push(...catalogMatch.deliverables)
    return list
  }

  // 2. Default standard care plan and add-on action checklists
  switch (serviceCode) {
    case 'CARE_PLAN_30':
    case 'DYNAMIC_CMS_RETAINER':
      return [
        'Perform monthly CMS core and active plugin security updates',
        'Verify HTTPS TLS certificate validity and renewal schedule',
        'Inspect offsite snapshot backup integrity and restoration bucket',
        'Audit contact forms, lead webhook endpoints, and Google Maps sync'
      ]
    case 'CARE_PLAN_60':
      return [
        'Perform monthly CMS core, plugin, and PHP runtime patch testing',
        'Verify uptime monitor, response latency (<800ms), and error logs',
        'Audit mobile responsive layout, navigation menu, and tap-to-call actions',
        'Verify weekly offsite database snapshots and automated staging restore',
        'Provide monthly executive health digest and SLA adherence verification'
      ]
    case 'CARE_PLAN_90':
      return [
        'High-frequency bi-weekly CMS patch and security vulnerability mitigation',
        'Full performance optimization: image WebP conversion and asset minification',
        'Continuous uptime & SSL probe audit with prioritized 4-hour SLA response',
        'Bi-weekly database optimization, spam purging, and transactional email checks',
        'Detailed monthly performance audit report with Lighthouse benchmark tracking'
      ]
    case 'SVC-SEC':
      return [
        'Provision trusted SSL certificate and enforce HTTPS redirect',
        'Harden HTTP security headers (HSTS, CSP, X-Frame-Options)',
        'Sanitize admin ingress and configure brute-force rate limiting',
        'Verify zero mixed-content warnings on primary landing views'
      ]
    case 'SVC-WEB':
      return [
        'Replace static PDF menus with responsive, accessible semantic HTML tables',
        'Optimize viewport meta tags for modern mobile browsers',
        'Ensure touch targets meet 48px minimum accessibility guidelines',
        'Perform cross-device mobile rendering QA verification'
      ]
    default:
      return [
        'Scope alignment and baseline environment configuration',
        'Execution of contracted service deliverable milestones',
        'Production verification and operator client signoff'
      ]
  }
}

function isActionCompleted(contractId: string, idx: number): boolean {
  return Boolean(contractActionStates.value[contractId]?.[idx]?.completed)
}

function getActionCommitUuid(contractId: string, idx: number): string | undefined {
  return contractActionStates.value[contractId]?.[idx]?.commitUuid
}

function toggleActionCompletion(contractId: string, idx: number): void {
  if (!contractActionStates.value[contractId]) {
    contractActionStates.value[contractId] = {}
  }
  const current = contractActionStates.value[contractId][idx] ?? { completed: false }
  contractActionStates.value[contractId][idx] = {
    ...current,
    completed: !current.completed
  }
  saveContractActionStates()
}

function openEditCommit(contractId: string, idx: number): void {
  editingCommitContractId.value = contractId
  editingCommitActionIdx.value = idx
  editingCommitInput.value = contractActionStates.value[contractId]?.[idx]?.commitUuid ?? ''
}

function saveActionCommit(contractId: string, idx: number): void {
  if (!contractActionStates.value[contractId]) {
    contractActionStates.value[contractId] = {}
  }
  const current = contractActionStates.value[contractId][idx] ?? { completed: true }
  contractActionStates.value[contractId][idx] = {
    ...current,
    commitUuid: editingCommitInput.value.trim() || undefined
  }
  saveContractActionStates()
  editingCommitContractId.value = null
  editingCommitActionIdx.value = null
  editingCommitInput.value = ''
}

function openAddSecretModal(): void {
  if (props.client) {
    emit('add-secret', props.client)
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
      loadContractActionStates()
      loadClientData()
    } else {
      contracts.value = []
      contractActionStates.value = {}
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
              <div
                v-for="c in contracts"
                :key="c.id"
                class="contract-card"
                :class="{ expanded: expandedContractIds[c.id] }"
              >
                <div class="contract-head" @click="toggleContractAccordion(c.id)">
                  <div class="contract-head-left">
                    <span class="accordion-chevron">{{ expandedContractIds[c.id] ? '▼' : '▶' }}</span>
                    <span class="contract-code">{{ c.service_code }}</span>
                  </div>
                  <BaseBadge variant="success">{{ c.status }}</BaseBadge>
                </div>
                <div class="contract-body">
                  <div>Rate: <strong>${{ c.billing_rate }}</strong> / {{ c.billing_frequency }}</div>
                  <div>Type: {{ c.contract_type }}</div>
                  <div class="contract-date">Started: {{ c.start_date }}</div>
                </div>

                <!-- Expandable Discrete Deliverables & Actions Checklist -->
                <div v-if="expandedContractIds[c.id]" class="contract-actions-drawer">
                  <div class="actions-drawer-header">
                    <h5 class="actions-drawer-title">Discrete Service Deliverables & Checklist</h5>
                    <span class="actions-completion-counter">
                      {{
                        getContractDiscreteActions(c.service_code).filter((_, idx) => isActionCompleted(c.id, idx)).length
                      }} / {{ getContractDiscreteActions(c.service_code).length }} Completed
                    </span>
                  </div>

                  <ul class="discrete-actions-list">
                    <li
                      v-for="(action, idx) in getContractDiscreteActions(c.service_code)"
                      :key="idx"
                      class="discrete-action-item"
                      :class="{ completed: isActionCompleted(c.id, idx) }"
                    >
                      <div class="action-item-main">
                        <label class="action-checkbox-label">
                          <input
                            type="checkbox"
                            :checked="isActionCompleted(c.id, idx)"
                            @change="toggleActionCompletion(c.id, idx)"
                          />
                          <span class="action-text">{{ action }}</span>
                        </label>
                      </div>

                      <div class="action-commit-block">
                        <div
                          v-if="editingCommitContractId === c.id && editingCommitActionIdx === idx"
                          class="commit-edit-row"
                        >
                          <BaseInput
                            v-model="editingCommitInput"
                            placeholder="Git Commit SHA (e.g. a1b2c3d)"
                            class="commit-sha-input"
                          />
                          <BaseButton
                            label="Save"
                            variant="primary"
                            @click="saveActionCommit(c.id, idx)"
                          />
                          <BaseButton
                            label="Cancel"
                            variant="secondary"
                            @click="editingCommitContractId = null; editingCommitActionIdx = null"
                          />
                        </div>
                        <div v-else class="commit-display-row">
                          <span
                            v-if="getActionCommitUuid(c.id, idx)"
                            class="commit-sha-badge"
                            title="Associated Git Commit UUID"
                            @click="openEditCommit(c.id, idx)"
                          >
                            🔗 {{ getActionCommitUuid(c.id, idx) }}
                          </span>
                          <button
                            v-else
                            type="button"
                            class="add-commit-btn"
                            @click="openEditCommit(c.id, idx)"
                          >
                            + Tag Commit UUID
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
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
              <h3 class="panel-title">⏱️ Timecards & Retainer Maintenance</h3>
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
  transition: all 0.2s ease;
}

.contract-card.expanded {
  border-color: var(--color-primary, #3b82f6);
  background-color: rgba(30, 41, 59, 0.9);
}

.contract-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
  cursor: pointer;
  user-select: none;
}

.contract-head-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.accordion-chevron {
  font-size: 0.65rem;
  color: var(--color-text-muted, #94a3b8);
  transition: transform 0.2s ease;
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

/* Contract Actions Drawer Accordion Content */
.contract-actions-drawer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border, #334155);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.actions-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-drawer-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary, #3b82f6);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.actions-completion-counter {
  font-size: 0.7rem;
  color: var(--color-text-muted, #94a3b8);
  font-weight: 600;
}

.discrete-actions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.discrete-action-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.5rem 0.6rem;
  background-color: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--color-border, rgba(51, 65, 85, 0.6));
  border-radius: 4px;
  transition: all 0.15s ease;
}

.discrete-action-item.completed {
  border-color: rgba(16, 185, 129, 0.3);
  background-color: rgba(16, 185, 129, 0.05);
}

.action-item-main {
  display: flex;
  align-items: center;
}

.action-checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--color-text, #f1f5f9);
  line-height: 1.35;
}

.action-checkbox-label input[type='checkbox'] {
  margin-top: 0.15rem;
  cursor: pointer;
}

.discrete-action-item.completed .action-text {
  text-decoration: line-through;
  color: var(--color-text-muted, #94a3b8);
}

.action-commit-block {
  display: flex;
  align-items: center;
  padding-left: 1.4rem;
}

.commit-display-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.commit-sha-badge {
  font-family: monospace;
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  background-color: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 4px;
  color: #60a5fa;
  cursor: pointer;
  transition: all 0.15s ease;
}

.commit-sha-badge:hover {
  background-color: rgba(59, 130, 246, 0.25);
  border-color: #60a5fa;
}

.add-commit-btn {
  background: none;
  border: none;
  color: var(--color-text-muted, #64748b);
  font-size: 0.7rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.15s ease;
}

.add-commit-btn:hover {
  color: var(--color-primary, #3b82f6);
}

.commit-edit-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.commit-sha-input {
  font-size: 0.72rem;
  padding: 0.2rem 0.4rem;
  max-width: 200px;
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

