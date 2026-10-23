<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import ProgressionIndicator from '@/shared/ui/ProgressionIndicator.vue'
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
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'onboard', payload: OnboardClientPayload): void
}>()

const wizardSteps = [
  { number: 1, label: 'Contact' },
  { number: 2, label: 'Services' },
  { number: 3, label: 'Vault & Launch' }
]

// Streamlined 3-step wizard (1: Contact, 2: Contracts/Services, 3: Vault Credentials & Dispatch)
const step = ref<1 | 2 | 3>(1)

// Step 1: Contact
const contactName = ref('')
const contactEmail = ref('')
const contactPhone = ref('')

// Step 2: Services
const selectedServiceCodes = ref<string[]>([])
const agreedBillingRate = ref<number>(150)

// Step 3: Vault Credentials
const vaultUsername = ref('')
const vaultPassword = ref('')
const vaultSecretType = ref<SecretType>('wordpress_admin')

const businessName = computed(() => props.lead?.prospect.business_name || 'Prospect')

function toggleService(code: string): void {
  const idx = selectedServiceCodes.value.indexOf(code)
  if (idx >= 0) {
    selectedServiceCodes.value.splice(idx, 1)
  } else {
    selectedServiceCodes.value.push(code)
  }
}

function handleNext(): void {
  if (step.value < 3) {
    step.value = (step.value + 1) as 1 | 2 | 3
  }
}

function handleBack(): void {
  if (step.value > 1) {
    step.value = (step.value - 1) as 1 | 2 | 3
  }
}

function handleDispatch(): void {
  if (!props.lead) return

  const secrets: ClientSecretPayload[] = []
  if (vaultUsername.value.trim() && vaultPassword.value.trim()) {
    secrets.push({
      secret_type: vaultSecretType.value,
      label: 'Primary Console Access',
      username: vaultUsername.value.trim(),
      password: vaultPassword.value.trim(),
      login_url: props.lead.prospect.website_url || null
    })
  }

  emit('onboard', {
    lead_id: props.lead.prospect.id,
    contact_name: contactName.value.trim() || 'Primary Contact',
    contact_email: contactEmail.value.trim(),
    contact_phone: contactPhone.value.trim() || null,
    service_codes: selectedServiceCodes.value,
    secrets: secrets.length > 0 ? secrets : undefined
  })
}
</script>

<template>
  <BaseModal
    :show="show"
    :title="`Onboard Client — ${businessName}`"
    @close="emit('close')"
  >
    <div class="modal-form-layout">
      <!-- Standardized Reusable Progression Indicator -->
      <ProgressionIndicator :steps="wizardSteps" :current-step="step" />

      <!-- Step 1: Contact Details -->
      <div v-if="step === 1" class="step-content">
        <h4 class="step-subheading">Primary Account Representative</h4>
        <BaseInput
          id="onboard-contact-name"
          v-model="contactName"
          label="Contact Name *"
          placeholder="Owner / Operator"
          required
        />
        <BaseInput
          id="onboard-contact-email"
          v-model="contactEmail"
          type="email"
          label="Billing / Communication Email *"
          placeholder="owner@client.com"
          required
        />
        <BaseInput
          id="onboard-contact-phone"
          v-model="contactPhone"
          label="Phone Number"
          placeholder="555-0199"
        />
      </div>

      <!-- Step 2: Contract Services Selection -->
      <div v-else-if="step === 2" class="step-content">
        <h4 class="step-subheading">Select Contracted Offerings</h4>
        <div class="services-scroll-panel">
          <div
            v-for="s in services"
            :key="s.code"
            class="service-select-card"
            :class="{ selected: selectedServiceCodes.includes(s.code) }"
            @click="toggleService(s.code)"
          >
            <div class="service-meta-cluster">
              <input
                type="checkbox"
                :checked="selectedServiceCodes.includes(s.code)"
                class="service-checkbox"
              />
              <div>
                <div class="service-name">{{ s.name }}</div>
                <div class="service-code">{{ s.code }}</div>
              </div>
            </div>
            <BaseBadge :variant="selectedServiceCodes.includes(s.code) ? 'emerald' : 'slate'" size="sm">
              {{ selectedServiceCodes.includes(s.code) ? 'Selected' : 'Available' }}
            </BaseBadge>
          </div>
        </div>

        <BaseInput
          id="onboard-billing-rate"
          v-model="agreedBillingRate"
          type="number"
          label="Agreed Monthly Baseline Rate ($)"
          placeholder="150"
        />
      </div>

      <!-- Step 3: Vault Credentials & Provisioning -->
      <div v-else-if="step === 3" class="step-content">
        <h4 class="step-subheading">Initial Vault Infrastructure Secret</h4>
        <div class="form-row-2col">
          <BaseInput
            id="onboard-vault-user"
            v-model="vaultUsername"
            label="Console / Admin Username"
            placeholder="admin"
          />
          <BaseInput
            id="onboard-vault-pass"
            v-model="vaultPassword"
            type="password"
            label="Password / Token"
            placeholder="••••••••••••"
          />
        </div>

        <div class="summary-box">
          <div>• Lead ID: <code class="mono-id">{{ lead?.prospect.id }}</code></div>
          <div>• Contract Services: <span>{{ selectedServiceCodes.length }} selected</span></div>
          <div>• Account Status: <BaseBadge variant="emerald" size="sm">Active upon dispatch</BaseBadge></div>
        </div>
      </div>
    </div>

    <!-- Right-aligned footer with back navigation -->
    <template #footer>
      <div class="modal-footer-cluster">
        <div>
          <BaseButton
            v-if="step > 1"
            label="Back"
            variant="secondary"
            @click="handleBack"
          />
        </div>
        <div class="actions-right">
          <BaseButton label="Cancel" variant="secondary" @click="emit('close')" />
          <BaseButton
            v-if="step < 3"
            label="Continue"
            variant="primary"
            @click="handleNext"
          />
          <BaseButton
            v-else
            label="Dispatch & Onboard"
            variant="primary"
            :loading="isSubmitting"
            @click="handleDispatch"
          />
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.modal-form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-subheading {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.form-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.services-scroll-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 12rem;
  overflow-y: auto;
  border-radius: 6px;
}

.service-select-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface-subtle);
  cursor: pointer;
  transition: all 0.15s ease;
}

.service-select-card:hover {
  border-color: var(--accent-primary);
}

.service-select-card.selected {
  border-color: var(--accent-primary);
  background-color: var(--bg-surface);
}

.service-meta-cluster {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.service-checkbox {
  cursor: pointer;
}

.service-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
}

.service-code {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.summary-box {
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface-subtle);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.mono-id {
  font-family: var(--font-mono, monospace);
  color: var(--text-primary);
}

.modal-footer-cluster {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.actions-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
