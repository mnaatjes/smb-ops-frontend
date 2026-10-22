<script setup lang="ts">
import { ref } from 'vue'
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

// ==========================================
// 1. Primitives (Wave 1) State
// ==========================================
const buttonClicks = ref(0)
const isButtonLoading = ref(false)
function triggerLoading() {
  isButtonLoading.value = true
  setTimeout(() => {
    isButtonLoading.value = false
  }, 1500)
}

const textInput = ref('Sample text')
const emailInput = ref('operator@smbops.internal')
const errorInput = ref('')
const inputError = ref('This field is required and cannot be empty')

// ==========================================
// 2. Structural Shell (Wave 2) State
// ==========================================
const isModalOpen = ref(false)
const modalSampleInput = ref('')

// ==========================================
// 3. Telemetry & Selection (Wave 3) State
// ==========================================
const testGaugeMinutes = ref(18)
const testGaugeCap = ref(30)
const testGaugeOutOfScope = ref(false)
function setGaugePreset(mins: number, cap: number, oos = false) {
  testGaugeMinutes.value = mins
  testGaugeCap.value = cap
  testGaugeOutOfScope.value = oos
}

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

// ==========================================
// 4. Domain Feature Modals (Wave 4) State
// ==========================================
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
  <div class="min-h-screen bg-slate-100 text-slate-900 pb-24">
    <!-- Sticky Quick-Jump Navigation Bar (ADHD-friendly overview) -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 class="text-lg font-bold tracking-tight text-slate-900">Component Living Workbench</h1>
            <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono border border-slate-200">/dev/components</span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Continuous isolated staging canvas for visual review and regression prevention.</p>
        </div>

        <nav class="flex flex-wrap gap-2 text-xs">
          <a
            href="#primitives"
            class="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors border border-slate-200"
          >
            1. Primitives (Wave 1)
          </a>
          <a
            href="#structural-shell"
            class="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors border border-slate-200"
          >
            2. Structural Shell (Wave 2)
          </a>
          <a
            href="#telemetry"
            class="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors border border-slate-200"
          >
            3. Telemetry & Selection (Wave 3)
          </a>
          <a
            href="#domain-modals"
            class="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors border border-slate-200"
          >
            4. Feature Modals (Wave 4)
          </a>
        </nav>
      </div>
    </header>

    <!-- Main Content Workspace -->
    <main class="max-w-7xl mx-auto px-6 pt-8 space-y-12">
      <!-- SECTION 1: PRIMITIVES (WAVE 1) -->
      <section id="primitives" class="space-y-4">
        <div class="flex items-center gap-3 border-b border-slate-200 pb-3">
          <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">1</span>
          <div>
            <h2 class="text-base font-bold text-slate-900">Atomic Primitives (Wave 1)</h2>
            <p class="text-xs text-slate-500">Dumb typography, buttons, inputs, and status badges with zero business logic dependencies.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Card 1.1: BaseButton -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 class="font-bold text-sm text-slate-900">BaseButton</h3>
                <span class="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">src/shared/ui/BaseButton.vue</span>
              </div>

              <div class="space-y-4">
                <div>
                  <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Variants</span>
                  <div class="flex flex-wrap gap-2">
                    <BaseButton label="Primary" variant="primary" @click="buttonClicks++" />
                    <BaseButton label="Secondary" variant="secondary" @click="buttonClicks++" />
                    <BaseButton label="Danger" variant="danger" @click="buttonClicks++" />
                  </div>
                </div>

                <div>
                  <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">States</span>
                  <div class="flex flex-wrap gap-2">
                    <BaseButton
                      :label="isButtonLoading ? 'Saving...' : 'Trigger Spinner'"
                      variant="primary"
                      :loading="isButtonLoading"
                      @click="triggerLoading"
                    />
                    <BaseButton label="Disabled" variant="primary" :disabled="true" />
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 mt-6 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Clicks Recorded:</span>
              <span class="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{{ buttonClicks }}</span>
            </div>
          </div>

          <!-- Card 1.2: BaseBadge -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 class="font-bold text-sm text-slate-900">BaseBadge</h3>
                <span class="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">src/shared/ui/BaseBadge.vue</span>
              </div>

              <div class="space-y-4">
                <div>
                  <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Small Pills (sm)</span>
                  <div class="flex flex-wrap gap-1.5">
                    <BaseBadge variant="emerald" size="sm">Emerald</BaseBadge>
                    <BaseBadge variant="amber" size="sm">Amber</BaseBadge>
                    <BaseBadge variant="rose" size="sm">Rose</BaseBadge>
                    <BaseBadge variant="indigo" size="sm">Indigo</BaseBadge>
                    <BaseBadge variant="slate" size="sm">Slate</BaseBadge>
                  </div>
                </div>

                <div>
                  <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Medium Pills (md)</span>
                  <div class="flex flex-wrap gap-1.5">
                    <BaseBadge variant="emerald" size="md">Active</BaseBadge>
                    <BaseBadge variant="amber" size="md">Attention</BaseBadge>
                    <BaseBadge variant="rose" size="md">Breach</BaseBadge>
                    <BaseBadge variant="indigo" size="md">Pending</BaseBadge>
                    <BaseBadge variant="slate" size="md">Archived</BaseBadge>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 mt-6 border-t border-slate-100 text-xs text-slate-400">
              Tailwind design tokens mapped directly to theme variables.
            </div>
          </div>

          <!-- Card 1.3: BaseInput -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 class="font-bold text-sm text-slate-900">BaseInput</h3>
                <span class="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">src/shared/ui/BaseInput.vue</span>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Standard Text</label>
                  <BaseInput v-model="textInput" placeholder="Enter text..." />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Email Input</label>
                  <BaseInput v-model="emailInput" type="email" placeholder="name@domain.com" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Error State with Caption</label>
                  <BaseInput v-model="errorInput" :error="inputError" placeholder="Type here..." />
                </div>
              </div>
            </div>

            <div class="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-400">
              Focus rings, border states, and reactive error message binding.
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 2: STRUCTURAL SHELL (WAVE 2) -->
      <section id="structural-shell" class="space-y-4">
        <div class="flex items-center gap-3 border-b border-slate-200 pb-3">
          <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">2</span>
          <div>
            <h2 class="text-base font-bold text-slate-900">Structural Shell (Wave 2)</h2>
            <p class="text-xs text-slate-500">Teleported modal wrapper enforcing max-width 640px, Escape listeners, and body scroll lock.</p>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-sm text-slate-900">BaseModal</h3>
                <span class="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">src/shared/ui/BaseModal.vue</span>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                Zero nested modals, no viewport bleeding, backdrop dismiss handler, body scroll lock cleanup on unmount.
              </p>
            </div>
            <BaseButton label="Launch BaseModal Verification" variant="primary" @click="isModalOpen = true" />
          </div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong class="text-slate-800 block mb-1">Teleport Target:</strong>
              Renders into <code>document.body</code> outside component hierarchy.
            </div>
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong class="text-slate-800 block mb-1">Dismiss Gates:</strong>
              Supports Escape key listener and backdrop click dismissal.
            </div>
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong class="text-slate-800 block mb-1">Geometry Constraints:</strong>
              Centered flexbox canvas with strict <code>max-w-xl</code> (640px) boundary.
            </div>
          </div>

          <BaseModal :show="isModalOpen" title="BaseModal Verification Shell" @close="isModalOpen = false">
            <div class="space-y-4">
              <p class="text-sm text-slate-600">
                This modal is rendered cleanly via <code>&lt;Teleport to="body"&gt;</code> without CSS canvas bleed.
              </p>
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Focus Target</label>
                <BaseInput v-model="modalSampleInput" placeholder="Test input focus..." />
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
      </section>

      <!-- SECTION 3: TELEMETRY & SELECTION (WAVE 3) -->
      <section id="telemetry" class="space-y-4">
        <div class="flex items-center gap-3 border-b border-slate-200 pb-3">
          <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">3</span>
          <div>
            <h2 class="text-base font-bold text-slate-900">Telemetry & Selection Controls (Wave 3)</h2>
            <p class="text-xs text-slate-500">Capacity utilization gauges and multi-select filtering dropdowns.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Card 3.1: MaintenanceGauge -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 class="font-bold text-sm text-slate-900">MaintenanceGauge</h3>
                <span class="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">src/shared/ui/MaintenanceGauge.vue</span>
              </div>

              <div class="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                <MaintenanceGauge
                  :total-minutes="testGaugeMinutes"
                  :cap-minutes="testGaugeCap"
                  :out-of-scope="testGaugeOutOfScope"
                />
              </div>

              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Usage Slider</span>
                    <span>{{ testGaugeMinutes }}m / {{ testGaugeCap }}m</span>
                  </div>
                  <input
                    v-model.number="testGaugeMinutes"
                    type="range"
                    min="0"
                    max="60"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Threshold Presets</span>
                  <div class="flex flex-wrap gap-2">
                    <BaseButton label="Healthy (50%)" variant="secondary" @click="setGaugePreset(15, 30)" />
                    <BaseButton label="Amber (90%)" variant="secondary" @click="setGaugePreset(27, 30)" />
                    <BaseButton label="Breach (116%)" variant="secondary" @click="setGaugePreset(35, 30)" />
                    <BaseButton label="Zero Cap" variant="secondary" @click="setGaugePreset(0, 0)" />
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 mt-6 border-t border-slate-100 text-xs text-slate-400">
              Dynamic threshold color shifts: &le;75% Emerald, 76-100% Amber, &gt;100% Rose.
            </div>
          </div>

          <!-- Card 3.2: ServiceFilterDropdown -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 class="font-bold text-sm text-slate-900">ServiceFilterDropdown</h3>
                <span class="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">src/features/service-catalog/...</span>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-2">Multi-Select Service Filter</label>
                  <ServiceFilterDropdown
                    v-model="testSelectedServices"
                    :services="workbenchCatalogServices"
                  />
                </div>

                <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  <strong class="block text-slate-900 mb-1">Active Filter Codes:</strong>
                  <code>{{ testSelectedServices.length ? testSelectedServices : '(None selected - showing all)' }}</code>
                </div>
              </div>
            </div>

            <div class="pt-4 mt-6 border-t border-slate-100 text-xs text-slate-400">
              Supports individual tag badges and dropdown selection toggle.
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 4: DOMAIN FEATURE MODALS (WAVE 4) -->
      <section id="domain-modals" class="space-y-4">
        <div class="flex items-center gap-3 border-b border-slate-200 pb-3">
          <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">4</span>
          <div>
            <h2 class="text-base font-bold text-slate-900">Domain Feature Modals (Wave 4)</h2>
            <p class="text-xs text-slate-500">Business-critical dialogs composing BaseModal with clean payload emission contracts.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Card 4.1: ContractAgreementModal -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-sm text-slate-900">ContractAgreementModal</h3>
                <BaseBadge variant="indigo" size="sm">Dual-Mode</BaseBadge>
              </div>
              <p class="text-xs text-slate-500 mb-4">Single agreed rate input, agreement type toggle, deliverables preview checklist.</p>
              <BaseButton label="Launch Contract Modal" variant="primary" @click="showContractModal = true" />
            </div>

            <div v-if="lastSavedContractPayload" class="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
              <span class="text-[10px] font-bold uppercase text-slate-500">Emitted Payload:</span>
              <pre class="text-[11px] font-mono text-slate-800 mt-1 overflow-x-auto max-h-28">{{ lastSavedContractPayload }}</pre>
            </div>
          </div>

          <!-- Card 4.2: LogWorkModal -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-sm text-slate-900">LogWorkModal</h3>
                <BaseBadge variant="emerald" size="sm">Timecard</BaseBadge>
              </div>
              <p class="text-xs text-slate-500 mb-4">Minutes spent input, 3-way work category dropdown, care plan scope guardrails.</p>
              <BaseButton label="Launch Log Work Modal" variant="primary" @click="showLogWorkModal = true" />
            </div>

            <div v-if="lastSavedWorkPayload" class="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
              <span class="text-[10px] font-bold uppercase text-slate-500">Emitted Payload:</span>
              <pre class="text-[11px] font-mono text-slate-800 mt-1 overflow-x-auto max-h-28">{{ lastSavedWorkPayload }}</pre>
            </div>
          </div>

          <!-- Card 4.3: VaultSecretModal -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-sm text-slate-900">VaultSecretModal</h3>
                <BaseBadge variant="amber" size="sm">Credentials</BaseBadge>
              </div>
              <p class="text-xs text-slate-500 mb-4">Secret label, credential type selector, username, and password fields.</p>
              <BaseButton label="Launch Vault Secret Modal" variant="primary" @click="showVaultModal = true" />
            </div>

            <div v-if="lastSavedVaultPayload" class="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
              <span class="text-[10px] font-bold uppercase text-slate-500">Emitted Payload:</span>
              <pre class="text-[11px] font-mono text-slate-800 mt-1 overflow-x-auto max-h-28">{{ lastSavedVaultPayload }}</pre>
            </div>
          </div>

          <!-- Card 4.4: ClientOnboardingModal -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-sm text-slate-900">ClientOnboardingModal</h3>
                <BaseBadge variant="rose" size="sm">3-Step Wizard</BaseBadge>
              </div>
              <p class="text-xs text-slate-500 mb-4">Unified wizard (Contact details &rarr; Service selection &rarr; Vault & Dispatch).</p>
              <BaseButton label="Launch Onboarding Wizard" variant="primary" @click="showOnboardingModal = true" />
            </div>

            <div v-if="lastSavedOnboardPayload" class="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
              <span class="text-[10px] font-bold uppercase text-slate-500">Emitted Payload:</span>
              <pre class="text-[11px] font-mono text-slate-800 mt-1 overflow-x-auto max-h-28">{{ lastSavedOnboardPayload }}</pre>
            </div>
          </div>
        </div>

        <!-- Rendered Feature Modals Mounted to Body -->
        <ContractAgreementModal
          :show="showContractModal"
          client-name="Harbor Artisanal Bakery"
          :services="workbenchCatalogServices"
          @close="showContractModal = false"
          @save="(payload) => { lastSavedContractPayload = JSON.stringify(payload, null, 2); showContractModal = false; }"
        />

        <LogWorkModal
          :show="showLogWorkModal"
          client-name="Harbor Artisanal Bakery"
          :has-active-care-plan="true"
          @close="showLogWorkModal = false"
          @save="(payload) => { lastSavedWorkPayload = JSON.stringify(payload, null, 2); showLogWorkModal = false; }"
        />

        <VaultSecretModal
          :show="showVaultModal"
          client-name="Harbor Artisanal Bakery"
          @close="showVaultModal = false"
          @save="(payload) => { lastSavedVaultPayload = JSON.stringify({ ...payload, value: '***MASKED***' }, null, 2); showVaultModal = false; }"
        />

        <ClientOnboardingModal
          :show="showOnboardingModal"
          :services="workbenchCatalogServices"
          :lead="workbenchMockLead"
          @close="showOnboardingModal = false"
          @onboard="(payload) => { lastSavedOnboardPayload = JSON.stringify(payload, null, 2); showOnboardingModal = false; }"
        />
      </section>
    </main>
  </div>
</template>
