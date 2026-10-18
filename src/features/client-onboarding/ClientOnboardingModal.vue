<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import type {
  RankedLead,
  ServiceCatalogItem,
  OnboardClientPayload,
  ClientSecretPayload,
  SecretType
} from '@/shared/types/lead'

const props = defineProps<{
  show: boolean
  lead: RankedLead | null
  services: ServiceCatalogItem[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'onboard', payload: OnboardClientPayload): void
}>()

const step = ref<1 | 2 | 3 | 4 | 5>(1)

// Step 1: Contact
const contactName = ref('')
const contactEmail = ref('')
const contactPhone = ref('')

// Step 2: Services Selection
const selectedServiceCodes = ref<string[]>([])

// Step 3: Scope & Terms
const customNotes = ref('')
const slaAccepted = ref(true)

// Step 4: Access & Infrastructure Credentials
interface CredentialInputRow {
  secret_type: SecretType
  label: string
  login_url: string
  username: string
  password: string
}

const credentials = ref<CredentialInputRow[]>([])

function addCredentialRow(): void {
  credentials.value.push({
    secret_type: 'wordpress_admin',
    label: 'WordPress Admin',
    login_url: props.lead?.prospect.website_url
      ? `${props.lead.prospect.website_url.replace(/\/$/, '')}/wp-admin`
      : '',
    username: '',
    password: ''
  })
}

function removeCredentialRow(index: number): void {
  credentials.value.splice(index, 1)
}

function onSecretTypeChange(row: CredentialInputRow): void {
  switch (row.secret_type) {
    case 'wordpress_admin':
      row.label = 'WordPress Admin'
      if (props.lead?.prospect.website_url && !row.login_url) {
        row.login_url = `${props.lead.prospect.website_url.replace(/\/$/, '')}/wp-admin`
      }
      break
    case 'hosting_cpanel':
      row.label = 'Hosting / cPanel'
      break
    case 'sftp_ssh':
      row.label = 'SFTP / SSH Access'
      break
    case 'dns_registrar':
      row.label = 'DNS / Domain Registrar'
      break
    case 'database_direct':
      row.label = 'Database Direct'
      break
  }
}

// Validation error
const stepError = ref<string | null>(null)

function initLeadData(): void {
  step.value = 1
  stepError.value = null
  credentials.value = []
  if (props.lead) {
    contactName.value = props.lead.prospect.business_name
    contactPhone.value = props.lead.prospect.phone ?? ''
    contactEmail.value = ''
    selectedServiceCodes.value = props.services.length > 0 ? [props.services[0].code] : []
  }
}

watch(
  () => [props.show, props.lead],
  ([show, lead]) => {
    if (show && lead) {
      initLeadData()
    }
  },
  { immediate: true }
)

function nextStep(): void {
  stepError.value = null
  if (step.value === 1) {
    if (!contactName.value.trim()) {
      stepError.value = 'Primary contact name is required'
      return
    }
    if (!contactEmail.value.trim() || !contactEmail.value.includes('@')) {
      stepError.value = 'A valid contact email is required'
      return
    }
    step.value = 2
    return
  }
  if (step.value === 2) {
    if (selectedServiceCodes.value.length === 0) {
      stepError.value = 'Select at least one service package to contract'
      return
    }
    step.value = 3
    return
  }
  if (step.value === 3) {
    if (!slaAccepted.value) {
      stepError.value = 'Standard SLA and terms must be accepted'
      return
    }
    step.value = 4
    return
  }
  if (step.value === 4) {
    for (let i = 0; i < credentials.value.length; i++) {
      const c = credentials.value[i]
      if (!c.username.trim() || !c.password.trim()) {
        stepError.value = `Credential row ${i + 1} requires both username and password.`
        return
      }
    }
    step.value = 5
    return
  }
}

function prevStep(): void {
  stepError.value = null
  if (step.value > 1) {
    step.value = (step.value - 1) as 1 | 2 | 3 | 4 | 5
  }
}

function handleDispatch(): void {
  if (!props.lead) return
  const validSecrets: ClientSecretPayload[] = credentials.value
    .filter((c) => c.username.trim() && c.password.trim())
    .map((c) => ({
      secret_type: c.secret_type,
      label: c.label.trim() || c.secret_type,
      username: c.username.trim(),
      password: c.password,
      login_url: c.login_url.trim() || null
    }))

  emit('onboard', {
    lead_id: props.lead.prospect.id,
    contact_name: contactName.value.trim(),
    contact_email: contactEmail.value.trim(),
    contact_phone: contactPhone.value.trim() || null,
    service_codes: selectedServiceCodes.value,
    custom_scope_notes: customNotes.value.trim() || null,
    secrets: validSecrets.length > 0 ? validSecrets : undefined
  })
}

function toggleService(code: string): void {
  const idx = selectedServiceCodes.value.indexOf(code)
  if (idx >= 0) {
    selectedServiceCodes.value.splice(idx, 1)
  } else {
    selectedServiceCodes.value.push(code)
  }
}

const chosenServices = computed(() => {
  return props.services.filter((s) => selectedServiceCodes.value.includes(s.code))
})
</script>

<template>
  <BaseModal
    :show="show"
    title="Client Onboarding Pipeline"
    @close="emit('close')"
  >
    <div class="onboarding-wizard">
      <!-- Stepper Header -->
      <div class="stepper-bar">
        <div class="step-item" :class="{ active: step === 1, done: step > 1 }">
          <span class="step-circle">1</span>
          <span class="step-label">Contact</span>
        </div>
        <div class="step-divider" />
        <div class="step-item" :class="{ active: step === 2, done: step > 2 }">
          <span class="step-circle">2</span>
          <span class="step-label">Services</span>
        </div>
        <div class="step-divider" />
        <div class="step-item" :class="{ active: step === 3, done: step > 3 }">
          <span class="step-circle">3</span>
          <span class="step-label">Scope</span>
        </div>
        <div class="step-divider" />
        <div class="step-item" :class="{ active: step === 4, done: step > 4 }">
          <span class="step-circle">4</span>
          <span class="step-label">Credentials</span>
        </div>
        <div class="step-divider" />
        <div class="step-item" :class="{ active: step === 5, done: step > 5 }">
          <span class="step-circle">5</span>
          <span class="step-label">Contract</span>
        </div>
      </div>

      <div v-if="stepError" class="wizard-error">
        {{ stepError }}
      </div>

      <!-- Step 1: Contact Verification -->
      <div v-if="step === 1" class="wizard-step">
        <h4 class="step-title">1. Contact & Owner Verification</h4>
        <p class="step-desc">Confirm owner name, direct email, and phone for {{ lead?.prospect.business_name }}.</p>

        <div class="field-group">
          <label class="field-label">Contact Name *</label>
          <BaseInput v-model="contactName" placeholder="e.g. Jane Doe" />
        </div>

        <div class="field-group">
          <label class="field-label">Direct Email *</label>
          <BaseInput v-model="contactEmail" type="email" placeholder="owner@business.com" />
        </div>

        <div class="field-group">
          <label class="field-label">Contact Phone</label>
          <BaseInput v-model="contactPhone" placeholder="(555) 123-4567" />
        </div>
      </div>

      <!-- Step 2: Service Selection -->
      <div v-if="step === 2" class="wizard-step">
        <h4 class="step-title">2. Select Contracted Services</h4>
        <p class="step-desc">Attach consulting service offerings to this client agreement.</p>

        <div class="service-selection-list">
          <div
            v-for="svc in services"
            :key="svc.code"
            class="service-select-card"
            :class="{ selected: selectedServiceCodes.includes(svc.code) }"
            @click="toggleService(svc.code)"
          >
            <div class="service-select-head">
              <span class="service-code">{{ svc.code }}</span>
              <BaseBadge :variant="selectedServiceCodes.includes(svc.code) ? 'success' : 'neutral'">
                {{ selectedServiceCodes.includes(svc.code) ? 'Selected' : 'Available' }}
              </BaseBadge>
            </div>
            <h5 class="service-name">{{ svc.name }}</h5>
            <p class="service-desc">{{ svc.description }}</p>
          </div>
        </div>
      </div>

      <!-- Step 3: Work Scope & Terms -->
      <div v-if="step === 3" class="wizard-step">
        <h4 class="step-title">3. Work Scope & Operating Terms</h4>
        <p class="step-desc">Establish standard SLA and deliverables governance.</p>

        <div class="sla-box">
          <div class="sla-item">
            <strong>Maintenance Retainer Cap:</strong> 30 minutes monthly support included.
          </div>
          <div class="sla-item">
            <strong>Support Hours:</strong> Mon–Fri 9:00 AM – 5:00 PM EST.
          </div>
          <div class="sla-item">
            <strong>Continuity Telemetry:</strong> Automatic weekly backup monitoring & uptime pings.
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Custom Scope Notes / Initial Work Order</label>
          <textarea
            v-model="customNotes"
            rows="3"
            placeholder="e.g. Initial SSL deployment and Google Maps hours sync"
            class="field-textarea"
          />
        </div>

        <label class="checkbox-label">
          <input v-model="slaAccepted" type="checkbox" />
          <span>I verify the client has agreed to the standard SLA terms and scope limits.</span>
        </label>
      </div>

      <!-- Step 4: Access & Infrastructure Credentials -->
      <div v-if="step === 4" class="wizard-step">
        <div class="step-header-with-action">
          <div>
            <h4 class="step-title">4. Access & Infrastructure Credentials</h4>
            <p class="step-desc">Capture credentials to be encrypted with AES-256 upon onboarding. (Optional)</p>
          </div>
          <BaseButton label="+ Add Credential" variant="secondary" @click="addCredentialRow" />
        </div>

        <div v-if="credentials.length === 0" class="empty-credentials-notice">
          No credentials configured yet. Click <strong>+ Add Credential</strong> to ingest WordPress admin, cPanel, or SFTP access.
        </div>

        <div v-else class="credential-cards-list">
          <div v-for="(cred, idx) in credentials" :key="idx" class="credential-entry-card">
            <div class="cred-card-header">
              <span class="cred-index">Credential #{{ idx + 1 }}</span>
              <button class="remove-cred-btn" title="Remove" @click="removeCredentialRow(idx)">✕</button>
            </div>

            <div class="cred-grid">
              <div class="field-group">
                <label class="field-label">Type</label>
                <select
                  v-model="cred.secret_type"
                  class="field-select"
                  @change="onSecretTypeChange(cred)"
                >
                  <option value="wordpress_admin">WordPress Admin</option>
                  <option value="hosting_cpanel">Hosting / cPanel</option>
                  <option value="sftp_ssh">SFTP / SSH Access</option>
                  <option value="dns_registrar">DNS / Domain Registrar</option>
                  <option value="database_direct">Database Direct</option>
                </select>
              </div>

              <div class="field-group">
                <label class="field-label">Label / Identifier</label>
                <BaseInput v-model="cred.label" placeholder="e.g. Production WP Admin" />
              </div>

              <div class="field-group full-width">
                <label class="field-label">Login URL / Endpoint</label>
                <BaseInput v-model="cred.login_url" placeholder="https://example.com/wp-admin" />
              </div>

              <div class="field-group">
                <label class="field-label">Username / Email *</label>
                <BaseInput v-model="cred.username" placeholder="admin@example.com" />
              </div>

              <div class="field-group">
                <label class="field-label">Password *</label>
                <BaseInput v-model="cred.password" type="password" placeholder="••••••••" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 5: Contract Dispatch & Execution -->
      <div v-if="step === 5" class="wizard-step">
        <h4 class="step-title">5. Contract Dispatch & Provisioning</h4>
        <p class="step-desc">Review agreement summary and dispatch contract to {{ contactEmail }}.</p>

        <div class="summary-card">
          <div class="summary-row">
            <span>Client:</span>
            <strong>{{ lead?.prospect.business_name }}</strong>
          </div>
          <div class="summary-row">
            <span>Primary Contact:</span>
            <span>{{ contactName }} &lt;{{ contactEmail }}&gt;</span>
          </div>
          <div class="summary-row">
            <span>Contracted Services ({{ chosenServices.length }}):</span>
            <div class="chosen-badges">
              <BaseBadge v-for="s in chosenServices" :key="s.code" variant="primary">
                {{ s.code }}
              </BaseBadge>
            </div>
          </div>
          <div class="summary-row">
            <span>Monthly Retainer Cap:</span>
            <span>30 minutes / billing cycle</span>
          </div>
          <div class="summary-row">
            <span>Vault Credentials:</span>
            <span>{{ credentials.length }} secret(s) ready for AES-256 envelope encryption</span>
          </div>
        </div>

        <div class="dispatch-notice">
          Clicking <strong>Dispatch & Onboard</strong> will provision the client account, encrypt stored secrets, initialize current month's timecard, configure continuity monitoring, and generate agreement records.
        </div>
      </div>

      <!-- Wizard Navigation Footer -->
      <div class="wizard-actions">
        <BaseButton v-if="step > 1" label="Back" variant="secondary" @click="prevStep" />
        <BaseButton v-else label="Cancel" variant="secondary" @click="emit('close')" />

        <BaseButton v-if="step < 5" label="Continue" variant="primary" @click="nextStep" />
        <BaseButton v-else label="Dispatch & Onboard" variant="primary" @click="handleDispatch" />
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.onboarding-wizard {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.stepper-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border, #334155);
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.75rem;
}

.step-item.active {
  color: var(--color-primary, #3b82f6);
  font-weight: 600;
}

.step-item.done {
  color: var(--color-success, #10b981);
}

.step-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid currentColor;
}

.step-divider {
  flex: 1;
  height: 1px;
  background-color: var(--color-border, #334155);
  margin: 0 0.5rem;
}

.wizard-error {
  background-color: rgba(239, 68, 68, 0.15);
  color: var(--color-danger, #ef4444);
  border: 1px solid var(--color-danger, #ef4444);
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.wizard-step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-title {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text, #f1f5f9);
}

.step-desc {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted, #94a3b8);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text, #f1f5f9);
}

.field-textarea {
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  color: var(--color-text, #f1f5f9);
  padding: 0.6rem 0.8rem;
  font-family: inherit;
  font-size: 0.85rem;
  resize: vertical;
}

.service-selection-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  max-height: 220px;
  overflow-y: auto;
}

.service-select-card {
  padding: 0.75rem;
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.service-select-card.selected {
  border-color: var(--color-primary, #3b82f6);
  background-color: rgba(59, 130, 246, 0.08);
}

.service-select-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-code {
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--color-text-muted, #94a3b8);
}

.service-name {
  margin: 0.3rem 0;
  font-size: 0.85rem;
  color: var(--color-text, #f1f5f9);
}

.service-desc {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.sla-box {
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-text-muted, #94a3b8);
}

.sla-item strong {
  color: var(--color-text, #f1f5f9);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text, #f1f5f9);
  cursor: pointer;
}

.summary-card {
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-row span {
  color: var(--color-text-muted, #94a3b8);
}

.chosen-badges {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.dispatch-notice {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
  background-color: rgba(59, 130, 246, 0.08);
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.wizard-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}
</style>
