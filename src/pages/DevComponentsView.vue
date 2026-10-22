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

// State for interactive primitive checks
const buttonClicks = ref(0)
const isButtonLoading = ref(false)

const textInput = ref('Sample Input')
const emailInput = ref('operator@smbops.internal')
const errorInput = ref('')
const inputError = ref('This field cannot be empty')

// State for BaseModal preview
const isModalOpen = ref(false)
const modalSampleInput = ref('')

// State for Wave 3 Telemetry & Selection controls
const testGaugeMinutes = ref(18)
const testGaugeCap = ref(30)
const testGaugeOutOfScope = ref(false)

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

// State for Wave 4 Feature Modals
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

function triggerLoading() {
  isButtonLoading.value = true
  setTimeout(() => {
    isButtonLoading.value = false
  }, 1500)
}
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto space-y-10">
    <header class="border-b border-slate-700/60 pb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-100">
            UI Component Developer Workbench
          </h1>
          <p class="text-sm text-slate-400 mt-1">
            Isolated presentation staging and visual verification environment (<code>/dev/components</code>).
          </p>
        </div>
        <router-link
          to="/"
          class="text-xs font-medium text-blue-400 hover:text-blue-300 underline"
        >
          ← Return to Workspace
        </router-link>
      </div>
    </header>

    <!-- Wave 1: BaseButton -->
    <section class="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-slate-100">1. BaseButton Primitives</h2>
          <p class="text-xs text-slate-400">Variants, button types, disabled states, and active spinner transitions.</p>
        </div>
        <span class="text-xs font-mono text-slate-400">Click Count: {{ buttonClicks }}</span>
      </div>

      <div class="flex flex-wrap items-center gap-4 pt-2">
        <BaseButton
          label="Primary Button"
          variant="primary"
          @click="buttonClicks++"
        />
        <BaseButton
          label="Secondary Button"
          variant="secondary"
          @click="buttonClicks++"
        />
        <BaseButton
          label="Danger Button"
          variant="danger"
          @click="buttonClicks++"
        />
        <BaseButton
          label="Loading Spinner"
          variant="primary"
          :loading="isButtonLoading"
          @click="triggerLoading"
        />
        <BaseButton
          label="Disabled State"
          variant="secondary"
          :disabled="true"
        />
      </div>
    </section>

    <!-- Wave 1: BaseBadge -->
    <section class="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div>
        <h2 class="text-lg font-semibold text-slate-100">2. BaseBadge Primitives</h2>
        <p class="text-xs text-slate-400">Tailwind-tokenized badge chips, semantic colors, and sizing tiers.</p>
      </div>

      <div class="space-y-3 pt-2">
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500 w-24">Color Tokens:</span>
          <div class="flex flex-wrap gap-2">
            <BaseBadge variant="emerald">emerald</BaseBadge>
            <BaseBadge variant="amber">amber</BaseBadge>
            <BaseBadge variant="rose">rose</BaseBadge>
            <BaseBadge variant="indigo">indigo</BaseBadge>
            <BaseBadge variant="slate">slate</BaseBadge>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500 w-24">Semantic Aliases:</span>
          <div class="flex flex-wrap gap-2">
            <BaseBadge variant="primary">primary</BaseBadge>
            <BaseBadge variant="success">success</BaseBadge>
            <BaseBadge variant="warning">warning</BaseBadge>
            <BaseBadge variant="danger">danger</BaseBadge>
            <BaseBadge variant="neutral">neutral</BaseBadge>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500 w-24">Size Scale:</span>
          <div class="flex items-center gap-2">
            <BaseBadge variant="indigo" size="sm">Small (sm)</BaseBadge>
            <BaseBadge variant="indigo" size="md">Medium (md)</BaseBadge>
          </div>
        </div>
      </div>
    </section>

    <!-- Wave 1: BaseInput -->
    <section class="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div>
        <h2 class="text-lg font-semibold text-slate-100">3. BaseInput Primitives</h2>
        <p class="text-xs text-slate-400">Data binding, HTML5 input types, disabled states, and validated error messaging.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <BaseInput
          id="wb-input-text"
          v-model="textInput"
          label="Text Input (v-model)"
          placeholder="Enter text..."
        />
        <BaseInput
          id="wb-input-email"
          v-model="emailInput"
          type="email"
          label="Email Input"
          placeholder="email@example.com"
        />
        <BaseInput
          id="wb-input-error"
          v-model="errorInput"
          label="Input with Error State"
          placeholder="Required input..."
          :error="inputError"
        />
        <BaseInput
          id="wb-input-disabled"
          model-value="Locked configuration value"
          label="Disabled Input"
          :disabled="true"
        />
      </div>
    </section>

    <!-- Wave 2: BaseModal Shell -->
    <section class="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-slate-100">4. BaseModal Dumb Frame (Wave 2)</h2>
          <p class="text-xs text-slate-400">Centered geometry (max-w-xl $\le 640$px), dark backdrop, ESC dismissal, and Teleport.</p>
        </div>
        <BaseButton
          label="Open Preview Modal"
          variant="primary"
          @click="isModalOpen = true"
        />
      </div>

      <div class="rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-xs font-mono text-slate-400 space-y-1">
        <div>• Backdrop: <code>rgba(0, 0, 0, 0.65)</code> with click-to-dismiss</div>
        <div>• Card Constraint: <code>max-width: 500px</code> centered flexbox</div>
        <div>• Accessibility: <code>Escape</code> key closes modal; body scroll is locked</div>
        <div>• Composition: Consumes <code>BaseInput</code> and <code>BaseButton</code> within slot body</div>
      </div>

      <BaseModal
        :show="isModalOpen"
        title="Workbench Modal Demonstration"
        @close="isModalOpen = false"
      >
        <div class="space-y-4">
          <p class="text-sm text-slate-300">
            This modal exercises the re-articulated <code>BaseModal.vue</code> shell rendered via <code>&lt;Teleport to="body"&gt;</code>.
          </p>

          <BaseInput
            id="modal-sample-input"
            v-model="modalSampleInput"
            label="Sample Transaction Input"
            placeholder="Type note or identifier..."
          />

          <div class="flex items-center gap-2 pt-2">
            <span class="text-xs text-slate-400">Context Status:</span>
            <BaseBadge variant="emerald">Live Preview</BaseBadge>
            <BaseBadge variant="indigo" size="sm">Teleported</BaseBadge>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-end gap-3">
            <BaseButton
              label="Cancel"
              variant="secondary"
              @click="isModalOpen = false"
            />
            <BaseButton
              label="Confirm Action"
              variant="primary"
              @click="isModalOpen = false"
            />
          </div>
        </template>
      </BaseModal>
    </section>

    <!-- Wave 3: MaintenanceGauge & ServiceFilterDropdown -->
    <section class="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div>
        <h2 class="text-lg font-semibold text-slate-100">5. Telemetry & Selection Controls (Wave 3)</h2>
        <p class="text-xs text-slate-400">Dynamic maintenance gauge progress tracks and multi-select filter controls.</p>
      </div>

      <!-- MaintenanceGauge interactive controls -->
      <div class="space-y-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
        <h3 class="text-sm font-medium text-slate-200">MaintenanceGauge Interactive Harness</h3>
        <div class="max-w-md bg-slate-900 p-4 rounded-lg border border-slate-800">
          <MaintenanceGauge
            :total-minutes="testGaugeMinutes"
            :cap-minutes="testGaugeCap"
            :out-of-scope="testGaugeOutOfScope"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label class="text-xs text-slate-400">Total Minutes Logged: {{ testGaugeMinutes }}m</label>
            <input
              v-model.number="testGaugeMinutes"
              type="range"
              min="0"
              max="60"
              class="w-full mt-1"
            />
          </div>
          <div>
            <label class="text-xs text-slate-400">Monthly Retainer Cap: {{ testGaugeCap }}m</label>
            <input
              v-model.number="testGaugeCap"
              type="range"
              min="0"
              max="60"
              step="10"
              class="w-full mt-1"
            />
          </div>
          <div class="flex items-center gap-2 pt-4">
            <input
              id="gauge-oos-check"
              v-model="testGaugeOutOfScope"
              type="checkbox"
              class="rounded"
            />
            <label for="gauge-oos-check" class="text-xs text-slate-300">Force Out-of-Scope (Danger)</label>
          </div>
        </div>
      </div>

      <!-- ServiceFilterDropdown interactive harness -->
      <div class="space-y-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
        <h3 class="text-sm font-medium text-slate-200">ServiceFilterDropdown Interactive Harness</h3>
        <ServiceFilterDropdown
          v-model="testSelectedServices"
          :services="workbenchCatalogServices"
        />

        <div class="text-xs font-mono text-slate-400 pt-2">
          Active Filter Selection: {{ JSON.stringify(testSelectedServices) }}
        </div>
      </div>
    </section>

    <!-- Wave 4: Domain Feature Modals -->
    <section class="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div>
        <h2 class="text-lg font-semibold text-slate-100">6. Domain Feature Modals (Wave 4)</h2>
        <p class="text-xs text-slate-400">Isolated operational feature modals composing BaseModal, BaseInput, and BaseButton.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 4.1 ContractAgreementModal Trigger -->
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-950/40 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-200">ContractAgreementModal</h3>
            <BaseButton
              label="Launch Modal"
              variant="primary"
              @click="showContractModal = true"
            />
          </div>
          <p class="text-xs text-slate-400">Unified dual-mode contract agreement (single rate, recurring vs one-time, deliverables).</p>
          <div v-if="lastSavedContractPayload" class="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
            Last Emitted: {{ lastSavedContractPayload }}
          </div>
        </div>

        <!-- 4.2 LogWorkModal Trigger -->
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-950/40 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-200">LogWorkModal</h3>
            <BaseButton
              label="Launch Modal"
              variant="primary"
              @click="showLogWorkModal = true"
            />
          </div>
          <p class="text-xs text-slate-400">Timecard logger with minutes input and 3-way work category dropdown.</p>
          <div v-if="lastSavedWorkPayload" class="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
            Last Emitted: {{ lastSavedWorkPayload }}
          </div>
        </div>

        <!-- 4.3 VaultSecretModal Trigger -->
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-950/40 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-200">VaultSecretModal</h3>
            <BaseButton
              label="Launch Modal"
              variant="primary"
              @click="showVaultModal = true"
            />
          </div>
          <p class="text-xs text-slate-400">Isolated credential entry for client infrastructure secret storage.</p>
          <div v-if="lastSavedVaultPayload" class="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
            Last Emitted: {{ lastSavedVaultPayload }}
          </div>
        </div>

        <!-- 4.4 ClientOnboardingModal Trigger -->
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-950/40 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-200">ClientOnboardingModal</h3>
            <BaseButton
              label="Launch Modal"
              variant="primary"
              @click="showOnboardingModal = true"
            />
          </div>
          <p class="text-xs text-slate-400">Streamlined 3-step wizard composing contact, services, and vault credentials.</p>
          <div v-if="lastSavedOnboardPayload" class="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
            Last Emitted: {{ lastSavedOnboardPayload }}
          </div>
        </div>
      </div>

      <!-- Mounted Modal Instances -->
      <ContractAgreementModal
        :show="showContractModal"
        :services="workbenchCatalogServices"
        client-name="Harbor Bakery"
        initial-service-code="SVC-RETAINER"
        @close="showContractModal = false"
        @save="(p) => { lastSavedContractPayload = JSON.stringify(p); showContractModal = false }"
      />

      <LogWorkModal
        :show="showLogWorkModal"
        client-name="Harbor Bakery"
        :has-active-care-plan="true"
        @close="showLogWorkModal = false"
        @save="(p) => { lastSavedWorkPayload = JSON.stringify(p); showLogWorkModal = false }"
      />

      <VaultSecretModal
        :show="showVaultModal"
        client-name="Harbor Bakery"
        @close="showVaultModal = false"
        @save="(p) => { lastSavedVaultPayload = JSON.stringify(p); showVaultModal = false }"
      />

      <ClientOnboardingModal
        :show="showOnboardingModal"
        :lead="workbenchMockLead"
        :services="workbenchCatalogServices"
        @close="showOnboardingModal = false"
        @onboard="(p) => { lastSavedOnboardPayload = JSON.stringify(p); showOnboardingModal = false }"
      />
    </section>
  </div>
</template>
