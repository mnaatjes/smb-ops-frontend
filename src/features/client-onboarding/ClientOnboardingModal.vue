<script setup lang="ts">
import { ref, computed } from 'vue'
import ModalWizard from '@/shared/ui/ModalWizard.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import VaultSecretForm from '@/shared/ui/VaultSecretForm.vue'
import type {
  RankedLead,
  ServiceCatalogItem,
  OnboardClientPayload,
  ClientSecretPayload
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

const currentStep = ref(1)

// Step 1: Contact
const contactName = ref('')
const contactEmail = ref('')
const contactPhone = ref('')

// Step 2: Services
const selectedServiceCodes = ref<string[]>([])
const agreedBillingRate = ref<number>(150)

// Step 3: Vault Credentials (composed via VaultSecretForm)
const vaultSecretPayload = ref<Partial<ClientSecretPayload>>({
  label: 'Primary Console Access'
})
const isVaultFormValid = ref(false)

const businessName = computed(() => props.lead?.prospect.business_name || 'Prospect')
const modalTitle = computed(() => `Onboard Client — ${businessName.value}`)

function toggleService(code: string): void {
  const idx = selectedServiceCodes.value.indexOf(code)
  if (idx >= 0) {
    selectedServiceCodes.value.splice(idx, 1)
  } else {
    selectedServiceCodes.value.push(code)
  }
}

function handleDispatch(): void {
  if (!props.lead) return

  const secrets: ClientSecretPayload[] = []
  if (isVaultFormValid.value && vaultSecretPayload.value.username && vaultSecretPayload.value.password) {
    secrets.push({
      secret_type: vaultSecretPayload.value.secret_type || 'wordpress_admin',
      label: vaultSecretPayload.value.label || 'Primary Console Access',
      username: vaultSecretPayload.value.username,
      password: vaultSecretPayload.value.password,
      login_url: vaultSecretPayload.value.login_url || props.lead.prospect.website_url || null
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
  <ModalWizard
    :show="show"
    :title="modalTitle"
    :steps="wizardSteps"
    v-model:current-step="currentStep"
    :is-submitting="isSubmitting"
    submit-label="Dispatch & Onboard"
    :require-confirm-on-dismiss="false"
    @close="emit('close')"
    @submit="handleDispatch"
  >
    <!-- Step 1: Contact Details -->
    <template #step-1>
      <div class="step-content">
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
    </template>

    <!-- Step 2: Contract Services Selection -->
    <template #step-2>
      <div class="step-content">
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
    </template>

    <!-- Step 3: Vault Credentials & Provisioning (Composes VaultSecretForm) -->
    <template #step-3>
      <div class="step-content">
        <h4 class="step-subheading">Initial Vault Infrastructure Secret</h4>
        <VaultSecretForm
          v-model="vaultSecretPayload"
          id-prefix="onboard-vault-secret"
          @valid-change="(valid) => isVaultFormValid = valid"
        />

        <div class="summary-box">
          <div>• Lead ID: <code class="mono-id">{{ lead?.prospect.id }}</code></div>
          <div>• Contract Services: <span>{{ selectedServiceCodes.length }} selected</span></div>
          <div>• Account Status: <BaseBadge variant="emerald" size="sm">Active upon dispatch</BaseBadge></div>
        </div>
      </div>
    </template>
  </ModalWizard>
</template>

<style scoped>
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

.services-scroll-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 12rem;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  background-color: var(--bg-surface-subtle);
}

.service-select-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.15s ease;
}

.service-select-card:hover {
  border-color: var(--accent-primary);
}

.service-select-card.selected {
  border-color: var(--accent-primary);
  background-color: var(--bg-surface-hover);
}

.service-meta-cluster {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.service-checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: var(--accent-primary);
  cursor: pointer;
}

.service-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.service-code {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.summary-box {
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.mono-id {
  font-family: var(--font-mono);
  color: var(--accent-primary);
}
</style>
