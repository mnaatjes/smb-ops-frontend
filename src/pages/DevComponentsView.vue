<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import MaintenanceGauge from '@/shared/ui/MaintenanceGauge.vue'
import ServiceFilterDropdown from '@/features/service-catalog/ServiceFilterDropdown.vue'
import ContractAgreementModal from '@/features/client-contracts/ContractAgreementModal.vue'
import LogWorkModal from '@/features/client-maintenance/LogWorkModal.vue'
import VaultSecretModal from '@/features/client-vault/VaultSecretModal.vue'
import ClientOnboardingModal from '@/features/client-onboarding/ClientOnboardingModal.vue'
import type { ServiceCatalogItem, RankedLead } from '@/shared/types/lead'

const route = useRoute()
const activeComponentId = computed(() => (route.query.c as string) || null)

// Component Catalog Registry for Index View
interface CatalogEntry {
  id: string
  name: string
  category: 'Primitives (Wave 1)' | 'Structural Shell (Wave 2)' | 'Telemetry & Controls (Wave 3)' | 'Feature Modals (Wave 4)'
  description: string
  canonicalPath: string
}

const componentCatalog: CatalogEntry[] = [
  {
    id: 'base-button',
    name: 'BaseButton',
    category: 'Primitives (Wave 1)',
    description: 'Variants (primary, secondary, danger, ghost), loading spinners, disabled states, submit types.',
    canonicalPath: 'src/shared/ui/BaseButton.vue'
  },
  {
    id: 'base-badge',
    name: 'BaseBadge',
    category: 'Primitives (Wave 1)',
    description: 'Status tokens (emerald, amber, rose, indigo, slate) with sm/md pill sizes.',
    canonicalPath: 'src/shared/ui/BaseBadge.vue'
  },
  {
    id: 'base-input',
    name: 'BaseInput',
    category: 'Primitives (Wave 1)',
    description: 'Text, email, password fields, focus rings, validation error states with captions.',
    canonicalPath: 'src/shared/ui/BaseInput.vue'
  },
  {
    id: 'base-modal',
    name: 'BaseModal',
    category: 'Structural Shell (Wave 2)',
    description: 'Teleported shell, Escape listener, backdrop dismiss, centered max-w-xl geometry, body scroll lock.',
    canonicalPath: 'src/shared/ui/BaseModal.vue'
  },
  {
    id: 'maintenance-gauge',
    name: 'MaintenanceGauge',
    category: 'Telemetry & Controls (Wave 3)',
    description: 'Dynamic thresholds (<=75% Emerald, 76-100% Amber, >100% Rose) and neutral 0-cap baseline.',
    canonicalPath: 'src/shared/ui/MaintenanceGauge.vue'
  },
  {
    id: 'service-filter-dropdown',
    name: 'ServiceFilterDropdown',
    category: 'Telemetry & Controls (Wave 3)',
    description: 'Multi-select catalog service filter with tags and active badges.',
    canonicalPath: 'src/features/service-catalog/ServiceFilterDropdown.vue'
  },
  {
    id: 'contract-agreement-modal',
    name: 'ContractAgreementModal',
    category: 'Feature Modals (Wave 4)',
    description: 'Dual-mode staging/mutation, single agreed rate, recurring/one-time toggle, deliverables preview.',
    canonicalPath: 'src/features/client-contracts/ContractAgreementModal.vue'
  },
  {
    id: 'log-work-modal',
    name: 'LogWorkModal',
    category: 'Feature Modals (Wave 4)',
    description: 'Minutes worked, 3-way work category (retainer, billable_extra, internal), care plan guardrails.',
    canonicalPath: 'src/features/client-maintenance/LogWorkModal.vue'
  },
  {
    id: 'vault-secret-modal',
    name: 'VaultSecretModal',
    category: 'Feature Modals (Wave 4)',
    description: 'Secret label, credential type selector, username, and password fields.',
    canonicalPath: 'src/features/client-vault/VaultSecretModal.vue'
  },
  {
    id: 'client-onboarding-modal',
    name: 'ClientOnboardingModal',
    category: 'Feature Modals (Wave 4)',
    description: 'Streamlined 3-step wizard (Contact -> Services -> Vault & Dispatch).',
    canonicalPath: 'src/features/client-onboarding/ClientOnboardingModal.vue'
  }
]

const categories = [
  'Primitives (Wave 1)',
  'Structural Shell (Wave 2)',
  'Telemetry & Controls (Wave 3)',
  'Feature Modals (Wave 4)'
] as const

// State for BaseButton Review
const buttonClicks = ref(0)
const isButtonLoading = ref(false)
function triggerLoading() {
  isButtonLoading.value = true
  setTimeout(() => {
    isButtonLoading.value = false
  }, 1500)
}

// State for BaseInput Review
const textInput = ref('Sample Input')
const emailInput = ref('operator@smbops.internal')
const errorInput = ref('')
const inputError = ref('This field is required and cannot be empty')

// State for BaseModal Review
const isModalOpen = ref(false)
const modalSampleInput = ref('')

// State for MaintenanceGauge Review
const testGaugeMinutes = ref(18)
const testGaugeCap = ref(30)
const testGaugeOutOfScope = ref(false)
function setGaugePreset(mins: number, cap: number, oos = false) {
  testGaugeMinutes.value = mins
  testGaugeCap.value = cap
  testGaugeOutOfScope.value = oos
}

// State for ServiceFilterDropdown Review
const testSelectedServices = ref<string[]>(['SVC-SEO'])
const workbenchCatalogServices: ServiceCatalogItem[] = [
  {
    id: 'wb-svc-1',
    code: 'SVC-SEO',
    name: 'Technical SEO Audit & Remediation',
    description: 'On-page technical remediation and speed pack',
    minimum_opportunity_score: 50,
    audit_parameters: ['ssl_active', 'mobile_viewport_present'],
    created_at: '2026-10-18T00:00:00Z',
    rank: 'Tier 1'
  },
  {
    id: 'wb-svc-2',
    code: 'SVC-RETAINER',
    name: 'Monthly WordPress Care Plan',
    description: '30-minute monthly support and maintenance',
    minimum_opportunity_score: 40,
    audit_parameters: ['cms_detected'],
    created_at: '2026-10-18T00:00:00Z',
    rank: 'Tier 2'
  },
  {
    id: 'wb-svc-3',
    code: 'SVC-SECURITY',
    name: 'Hardened Security & Backup Vault',
    description: 'Automated backups and intrusion audit',
    minimum_opportunity_score: 65,
    audit_parameters: ['ssl_active'],
    created_at: '2026-10-18T00:00:00Z',
    rank: 'Tier 3'
  }
]

// State for Feature Modals Review
const showContractModal = ref(false)
const showLogWorkModal = ref(false)
const showVaultModal = ref(false)
const showOnboardingModal = ref(false)

const lastSavedContractPayload = ref<string>('')
const lastSavedWorkPayload = ref<string>('')
const lastSavedVaultPayload = ref<string>('')
const lastSavedOnboardPayload = ref<string>('')

const workbenchMockLead: RankedLead = {
  prospect: {
    id: 'lead-harbor-101',
    business_name: 'Harbor Artisanal Bakery',
    website_url: 'https://harborbakery.com',
    phone: '555-0199',
    address: '42 Waterfront Way',
    source: 'DISCOVERY',
    status: 'PURSUED',
    disqualification_reason: null,
    created_at: '2026-10-18T00:00:00Z',
    updated_at: '2026-10-18T00:00:00Z'
  },
  audit: null
}
</script>

<template>
  <!-- VIEW 1: Clean Index Directory (When ?c= is absent) -->
  <main v-if="!activeComponentId" class="min-h-screen bg-slate-50 text-slate-900 p-8 flex flex-col items-center">
    <div class="w-full max-w-4xl space-y-8">
      <header class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Component Living Workbench</h1>
        <p class="text-sm text-slate-600 mt-1">
          Select any component to launch an isolated review stage with a pure white canvas, centered geometry, and interactive controls.
        </p>
      </header>

      <section
        v-for="cat in categories"
        :key="cat"
        class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4"
      >
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          {{ cat }}
        </h2>
        <ul class="divide-y divide-slate-100">
          <li
            v-for="item in componentCatalog.filter(c => c.category === cat)"
            :key="item.id"
            class="py-3 flex items-center justify-between gap-4"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-slate-900">{{ item.name }}</span>
                <code class="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {{ item.canonicalPath }}
                </code>
              </div>
              <p class="text-xs text-slate-500 mt-1">{{ item.description }}</p>
            </div>
            <a
              :href="`/dev/components?c=${item.id}`"
              target="_blank"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors shrink-0"
            >
              Review Component
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </li>
        </ul>
      </section>
    </div>
  </main>

  <!-- VIEW 2: Isolated Component Review Stage (Pure white background, centered) -->
  <main v-else class="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-8">
    <div class="w-full max-w-xl border border-slate-200 rounded-lg p-8 shadow-sm">
      <!-- Stage Header -->
      <header class="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900">
            {{ componentCatalog.find(c => c.id === activeComponentId)?.name || activeComponentId }}
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            {{ componentCatalog.find(c => c.id === activeComponentId)?.description }}
          </p>
        </div>
        <a href="/dev/components" class="text-xs font-medium text-indigo-600 hover:text-indigo-800">
          ← Back to Directory
        </a>
      </header>

      <!-- Stage 1: BaseButton -->
      <div v-if="activeComponentId === 'base-button'" class="space-y-6">
        <div>
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Variants</h2>
          <div class="flex flex-wrap gap-3 items-center">
            <BaseButton label="Primary" variant="primary" @click="buttonClicks++" />
            <BaseButton label="Secondary" variant="secondary" @click="buttonClicks++" />
            <BaseButton label="Danger" variant="danger" @click="buttonClicks++" />
          </div>
        </div>
        <div>
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Interactive States</h2>
          <div class="flex flex-wrap gap-3 items-center">
            <BaseButton
              :label="isButtonLoading ? 'Processing...' : 'Click for Spinner'"
              variant="primary"
              :loading="isButtonLoading"
              @click="triggerLoading"
            />
            <BaseButton label="Disabled State" variant="primary" :disabled="true" />
          </div>
        </div>
        <div class="pt-4 border-t border-slate-100 text-xs text-slate-500">
          Clicks recorded: <strong class="text-slate-900">{{ buttonClicks }}</strong>
        </div>
      </div>

      <!-- Stage 2: BaseBadge -->
      <div v-else-if="activeComponentId === 'base-badge'" class="space-y-6">
        <div>
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Small Pill (sm)</h2>
          <div class="flex flex-wrap gap-2 items-center">
            <BaseBadge variant="emerald" size="sm">Active (Emerald)</BaseBadge>
            <BaseBadge variant="amber" size="sm">Warning (Amber)</BaseBadge>
            <BaseBadge variant="rose" size="sm">Error (Rose)</BaseBadge>
            <BaseBadge variant="indigo" size="sm">Info (Indigo)</BaseBadge>
            <BaseBadge variant="slate" size="sm">Neutral (Slate)</BaseBadge>
          </div>
        </div>
        <div>
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Medium Pill (md)</h2>
          <div class="flex flex-wrap gap-2 items-center">
            <BaseBadge variant="emerald" size="md">Active (Emerald)</BaseBadge>
            <BaseBadge variant="amber" size="md">Warning (Amber)</BaseBadge>
            <BaseBadge variant="rose" size="md">Error (Rose)</BaseBadge>
            <BaseBadge variant="indigo" size="md">Info (Indigo)</BaseBadge>
            <BaseBadge variant="slate" size="md">Neutral (Slate)</BaseBadge>
          </div>
        </div>
      </div>

      <!-- Stage 3: BaseInput -->
      <div v-else-if="activeComponentId === 'base-input'" class="space-y-5">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Standard Text</label>
          <BaseInput v-model="textInput" placeholder="Enter standard text..." />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Input</label>
          <BaseInput v-model="emailInput" type="email" placeholder="name@domain.com" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Error State with Caption</label>
          <BaseInput v-model="errorInput" :error="inputError" placeholder="Type here..." />
        </div>
      </div>

      <!-- Stage 4: BaseModal -->
      <div v-else-if="activeComponentId === 'base-modal'" class="space-y-4 text-center py-6">
        <p class="text-sm text-slate-600 mb-4">
          Click below to test the structural teleport shell, backdrop interception, Escape dismiss, and body scroll lock.
        </p>
        <BaseButton label="Launch BaseModal Preview" variant="primary" @click="isModalOpen = true" />

        <BaseModal :show="isModalOpen" title="BaseModal Verification Shell" @close="isModalOpen = false">
          <div class="space-y-4 text-left">
            <p class="text-sm text-slate-600">
              Modal content renders via <code>&lt;Teleport to="body"&gt;</code> without canvas bleed or layout distortion.
            </p>
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Focus Target</label>
              <BaseInput v-model="modalSampleInput" placeholder="Input inside modal..." />
            </div>
          </div>
          <template #footer>
            <div class="flex justify-end gap-3">
              <BaseButton label="Dismiss" variant="secondary" @click="isModalOpen = false" />
              <BaseButton label="Confirm" variant="primary" @click="isModalOpen = false" />
            </div>
          </template>
        </BaseModal>
      </div>

      <!-- Stage 5: MaintenanceGauge -->
      <div v-else-if="activeComponentId === 'maintenance-gauge'" class="space-y-6">
        <div class="p-6 bg-slate-50 border border-slate-200 rounded-lg">
          <MaintenanceGauge
            :total-minutes="testGaugeMinutes"
            :cap-minutes="testGaugeCap"
            :out-of-scope="testGaugeOutOfScope"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Interactive Slider: {{ testGaugeMinutes }}m / {{ testGaugeCap }}m
          </label>
          <input
            v-model.number="testGaugeMinutes"
            type="range"
            min="0"
            max="60"
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
        <div>
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Threshold Presets</h2>
          <div class="flex flex-wrap gap-2">
            <BaseButton label="Healthy 50%" variant="secondary" @click="setGaugePreset(15, 30)" />
            <BaseButton label="Amber 90%" variant="secondary" @click="setGaugePreset(27, 30)" />
            <BaseButton label="Over Cap 116%" variant="secondary" @click="setGaugePreset(35, 30)" />
            <BaseButton label="Zero Cap Baseline" variant="secondary" @click="setGaugePreset(0, 0)" />
          </div>
        </div>
      </div>

      <!-- Stage 6: ServiceFilterDropdown -->
      <div v-else-if="activeComponentId === 'service-filter-dropdown'" class="space-y-6">
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Filter Catalog</label>
        <ServiceFilterDropdown
          v-model="testSelectedServices"
          :services="workbenchCatalogServices"
        />
        <div class="p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
          Selected Service Codes: <code>{{ testSelectedServices }}</code>
        </div>
      </div>

      <!-- Stage 7: ContractAgreementModal -->
      <div v-else-if="activeComponentId === 'contract-agreement-modal'" class="space-y-4 text-center py-6">
        <p class="text-sm text-slate-600 mb-4">Launch modal to review rate, agreement type toggle, and deliverables checklist.</p>
        <BaseButton label="Open Contract Agreement Modal" variant="primary" @click="showContractModal = true" />
        <ContractAgreementModal
          :show="showContractModal"
          client-name="Harbor Artisanal Bakery"
          :services="workbenchCatalogServices"
          @close="showContractModal = false"
          @save="(payload) => { lastSavedContractPayload = JSON.stringify(payload, null, 2); showContractModal = false; }"
        />
        <div v-if="lastSavedContractPayload" class="text-left mt-4 p-4 bg-slate-50 border border-slate-200 rounded">
          <span class="text-xs font-semibold uppercase text-slate-500">Last Emitted Payload:</span>
          <pre class="text-xs text-slate-800 mt-2 overflow-x-auto">{{ lastSavedContractPayload }}</pre>
        </div>
      </div>

      <!-- Stage 8: LogWorkModal -->
      <div v-else-if="activeComponentId === 'log-work-modal'" class="space-y-4 text-center py-6">
        <p class="text-sm text-slate-600 mb-4">Launch modal to review work logging, work category dropdown, and guardrails.</p>
        <BaseButton label="Open Log Work Modal" variant="primary" @click="showLogWorkModal = true" />
        <LogWorkModal
          :show="showLogWorkModal"
          client-name="Harbor Artisanal Bakery"
          :has-active-care-plan="true"
          @close="showLogWorkModal = false"
          @save="(payload) => { lastSavedWorkPayload = JSON.stringify(payload, null, 2); showLogWorkModal = false; }"
        />
        <div v-if="lastSavedWorkPayload" class="text-left mt-4 p-4 bg-slate-50 border border-slate-200 rounded">
          <span class="text-xs font-semibold uppercase text-slate-500">Last Emitted Payload:</span>
          <pre class="text-xs text-slate-800 mt-2 overflow-x-auto">{{ lastSavedWorkPayload }}</pre>
        </div>
      </div>

      <!-- Stage 9: VaultSecretModal -->
      <div v-else-if="activeComponentId === 'vault-secret-modal'" class="space-y-4 text-center py-6">
        <p class="text-sm text-slate-600 mb-4">Launch modal to review credential entry and secret type selector.</p>
        <BaseButton label="Open Vault Secret Modal" variant="primary" @click="showVaultModal = true" />
        <VaultSecretModal
          :show="showVaultModal"
          client-name="Harbor Artisanal Bakery"
          @close="showVaultModal = false"
          @save="(payload) => { lastSavedVaultPayload = JSON.stringify({ ...payload, value: '***MASKED***' }, null, 2); showVaultModal = false; }"
        />
        <div v-if="lastSavedVaultPayload" class="text-left mt-4 p-4 bg-slate-50 border border-slate-200 rounded">
          <span class="text-xs font-semibold uppercase text-slate-500">Last Emitted Payload:</span>
          <pre class="text-xs text-slate-800 mt-2 overflow-x-auto">{{ lastSavedVaultPayload }}</pre>
        </div>
      </div>

      <!-- Stage 10: ClientOnboardingModal -->
      <div v-else-if="activeComponentId === 'client-onboarding-modal'" class="space-y-4 text-center py-6">
        <p class="text-sm text-slate-600 mb-4">Launch modal to step through 3-step onboarding wizard.</p>
        <BaseButton label="Open Client Onboarding Wizard" variant="primary" @click="showOnboardingModal = true" />
        <ClientOnboardingModal
          :show="showOnboardingModal"
          :services="workbenchCatalogServices"
          :lead="workbenchMockLead"
          @close="showOnboardingModal = false"
          @onboard="(payload) => { lastSavedOnboardPayload = JSON.stringify(payload, null, 2); showOnboardingModal = false; }"
        />
        <div v-if="lastSavedOnboardPayload" class="text-left mt-4 p-4 bg-slate-50 border border-slate-200 rounded">
          <span class="text-xs font-semibold uppercase text-slate-500">Last Completed Payload:</span>
          <pre class="text-xs text-slate-800 mt-2 overflow-x-auto">{{ lastSavedOnboardPayload }}</pre>
        </div>
      </div>

      <!-- Stage Fallback: Unknown Component -->
      <div v-else class="text-center py-8">
        <p class="text-sm text-rose-600 font-medium">Component identifier "{{ activeComponentId }}" was not found.</p>
        <a href="/dev/components" class="mt-4 inline-block text-xs text-indigo-600 hover:text-indigo-800">
          Return to Directory
        </a>
      </div>
    </div>
  </main>
</template>
