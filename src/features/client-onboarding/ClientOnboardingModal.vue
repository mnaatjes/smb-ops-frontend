<script setup lang="ts">
import { ref, computed } from 'vue'
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
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'onboard', payload: OnboardClientPayload): void
}>()

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
    <div class="space-y-5">
      <!-- 3-Step Wizard Indicator -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <span :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold', step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400']">1</span>
          <span class="text-xs font-medium" :class="step === 1 ? 'text-blue-400' : 'text-slate-400'">Contact</span>
        </div>
        <div class="w-8 h-px bg-slate-800" />
        <div class="flex items-center gap-2">
          <span :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold', step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400']">2</span>
          <span class="text-xs font-medium" :class="step === 2 ? 'text-blue-400' : 'text-slate-400'">Services</span>
        </div>
        <div class="w-8 h-px bg-slate-800" />
        <div class="flex items-center gap-2">
          <span :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold', step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400']">3</span>
          <span class="text-xs font-medium" :class="step === 3 ? 'text-blue-400' : 'text-slate-400'">Vault & Launch</span>
        </div>
      </div>

      <!-- Step 1: Contact Details -->
      <div v-if="step === 1" class="space-y-4">
        <h4 class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Primary Account Representative</h4>
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
      <div v-else-if="step === 2" class="space-y-4">
        <h4 class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Select Contracted Offerings</h4>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div
            v-for="s in services"
            :key="s.code"
            class="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 cursor-pointer"
            @click="toggleService(s.code)"
          >
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="selectedServiceCodes.includes(s.code)"
                class="rounded"
              />
              <div>
                <div class="text-xs font-medium text-slate-100">{{ s.name }}</div>
                <div class="text-[11px] text-slate-400">{{ s.code }}</div>
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
      <div v-else-if="step === 3" class="space-y-4">
        <h4 class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Initial Vault Infrastructure Secret</h4>
        <div class="grid grid-cols-2 gap-4">
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

        <div class="rounded-lg border border-slate-800 bg-slate-950/40 p-3 space-y-1 text-xs text-slate-400">
          <div>• Lead ID: <code class="text-slate-200">{{ lead?.prospect.id }}</code></div>
          <div>• Contract Services: <span class="text-slate-200">{{ selectedServiceCodes.length }} selected</span></div>
          <div>• Account Status: <BaseBadge variant="emerald" size="sm">Active upon dispatch</BaseBadge></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-4 border-t border-slate-800">
        <div>
          <BaseButton
            v-if="step > 1"
            label="Back"
            variant="secondary"
            @click="handleBack"
          />
        </div>
        <div class="flex items-center gap-3">
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
    </div>
  </BaseModal>
</template>
