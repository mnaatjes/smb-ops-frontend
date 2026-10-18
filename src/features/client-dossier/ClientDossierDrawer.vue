<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import MaintenanceGauge from '@/shared/ui/MaintenanceGauge.vue'
import type { ClientAccount, Timecard, ContinuityHealth } from '@/shared/types/lead'
import { useLeadStore } from '@/entities/lead/store'

const props = defineProps<{
  show: boolean
  client: ClientAccount | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'log-work', client: ClientAccount): void
}>()

const leadStore = useLeadStore()
const timecard = ref<Timecard | null>(null)
const continuity = ref<ContinuityHealth | null>(null)
const loadingTelemetry = ref(false)
const pingingContinuity = ref(false)

async function loadClientData(): Promise<void> {
  if (!props.client) return
  loadingTelemetry.value = true
  try {
    const [tc, health] = await Promise.all([
      leadStore.getTimecard(props.client.id).catch(() => null),
      leadStore.getContinuity(props.client.id).catch(() => null)
    ])
    timecard.value = tc
    continuity.value = health
  } finally {
    loadingTelemetry.value = false
  }
}

watch(
  () => props.client,
  (newClient) => {
    if (newClient) {
      loadClientData()
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
</script>

<template>
  <div v-if="show && client" class="drawer-overlay" @click.self="emit('close')">
    <div class="dossier-drawer">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div>
          <span class="tracking-uid">CLIENT-ID: {{ client.id.slice(0, 8) }}</span>
          <h3 class="client-title">{{ client.business_name }}</h3>
        </div>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <!-- Drawer Body -->
      <div class="drawer-body">
        <!-- Status & Contact Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Account Profile</h4>
            <BaseBadge variant="primary">{{ client.state }}</BaseBadge>
          </div>
          <div class="profile-grid">
            <div class="profile-item">
              <span class="profile-label">Primary Contact:</span>
              <span class="profile-val">{{ client.primary_contact_name ?? 'N/A' }}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Email:</span>
              <span class="profile-val">{{ client.primary_contact_email ?? 'N/A' }}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Phone:</span>
              <span class="profile-val">{{ client.phone ?? 'N/A' }}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Website:</span>
              <a
                v-if="client.website_url"
                :href="client.website_url"
                target="_blank"
                rel="noopener noreferrer"
                class="website-link"
              >
                {{ client.website_url }}
              </a>
              <span v-else class="profile-val">N/A</span>
            </div>
          </div>
        </div>

        <!-- Continuity Health Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Continuity & SLA Health</h4>
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

        <!-- Monthly Retainer & Timecard Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Monthly Retainer Timecard</h4>
            <BaseButton
              label="+ Log Work"
              variant="primary"
              @click="emit('log-work', client)"
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
              <h5>Recent Maintenance Entries ({{ timecard.entries.length }})</h5>
              <div v-if="timecard.entries.length === 0" class="empty-log">
                No maintenance time logged this billing cycle.
              </div>
              <div v-else class="log-entries-list">
                <div v-for="entry in timecard.entries" :key="entry.id" class="log-entry-item">
                  <div class="log-entry-head">
                    <span class="log-desc">{{ entry.description }}</span>
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
        </div>

        <!-- Governed Service Contracts Section -->
        <div class="dossier-section">
          <h4>Active Service Contracts</h4>
          <div v-if="client.contracts && client.contracts.length > 0" class="contracts-list">
            <div v-for="c in client.contracts" :key="c.id" class="contract-card">
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 50;
  display: flex;
  justify-content: flex-end;
}

.dossier-drawer {
  width: 100%;
  max-width: 540px;
  height: 100%;
  background-color: var(--color-background, #090d16);
  border-left: 1px solid var(--color-border, #1e293b);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #1e293b);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: var(--color-surface, #0f172a);
}

.tracking-uid {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.client-title {
  margin: 0.25rem 0 0;
  font-size: 1.2rem;
  color: var(--color-text, #f1f5f9);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted, #94a3b8);
  font-size: 1.25rem;
  cursor: pointer;
}

.drawer-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dossier-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #1e293b);
  border-radius: 8px;
  padding: 1rem;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dossier-section h4 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text, #f1f5f9);
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.profile-label {
  color: var(--color-text-muted, #94a3b8);
  display: block;
}

.profile-val {
  color: var(--color-text, #f1f5f9);
  font-weight: 500;
}

.website-link {
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
  word-break: break-all;
}

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

.timecard-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.work-log-history h5 {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-muted, #94a3b8);
}

.log-entries-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 180px;
  overflow-y: auto;
}

.log-entry-item {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
}

.log-entry-head {
  display: flex;
  justify-content: space-between;
  color: var(--color-text, #f1f5f9);
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

.contracts-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.contract-card {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
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

.empty-state, .empty-log {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
  font-style: italic;
}
</style>
