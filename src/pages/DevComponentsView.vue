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

const textInput = ref('Sample text entry')
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
  <div class="min-h-screen bg-slate-100 text-slate-900 pb-32">
    <!-- Sticky Quick-Jump Navigation Bar -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-300 px-8 py-5 shadow-sm">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <span class="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 class="text-xl font-extrabold tracking-tight text-slate-900">Component Living Workbench</h1>
            <span class="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md border border-slate-300 font-mono">
              /dev/components
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1 font-medium">Spacious single-column layout for relaxed visual inspection & regression testing.</p>
        </div>

        <nav class="flex flex-wrap gap-2 text-xs font-semibold">
          <a
            href="#wave-1"
            class="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 transition-colors border border-slate-300 shadow-xs"
          >
            Wave 1: Primitives
          </a>
          <a
            href="#wave-2"
            class="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 transition-colors border border-slate-300 shadow-xs"
          >
            Wave 2: Shell
          </a>
          <a
            href="#wave-3"
            class="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 transition-colors border border-slate-300 shadow-xs"
          >
            Wave 3: Telemetry
          </a>
          <a
            href="#wave-4"
            class="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 transition-colors border border-slate-300 shadow-xs"
          >
            Wave 4: Modals
          </a>
        </nav>
      </div>
    </header>

    <!-- Main Content Stream (Generously Spaced Single Column) -->
    <main class="max-w-5xl mx-auto px-6 pt-12 space-y-20">

      <!-- ================================================================= -->
      <!-- WAVE 1: PRIMITIVES                                                -->
      <!-- ================================================================= -->
      <section id="wave-1" class="space-y-8">
        <div class="border-b-2 border-indigo-500 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">1</span>
            <div>
              <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">Wave 1: Atomic Primitives</h2>
              <p class="text-xs text-slate-500 font-medium">Core presentation building blocks with zero business logic dependencies.</p>
            </div>
          </div>
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
            3 Components
          </span>
        </div>

        <div class="space-y-10">
          <!-- Component 1.1: BaseButton -->
          <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <h3 class="text-xl font-bold text-slate-900">BaseButton</h3>
                <p class="text-sm text-slate-500 mt-1">Button primitives with explicit variants, loading spinner states, and submit contracts.</p>
              </div>
              <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
                src/shared/ui/BaseButton.vue
              </span>
            </header>

            <!-- Staging Surface -->
            <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col md:flex-row items-center justify-around gap-6">
              <div class="space-y-3 text-center md:text-left">
                <span class="block text-xs font-bold uppercase tracking-wider text-slate-400">Variant Styles</span>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <BaseButton label="Primary Button" variant="primary" @click="buttonClicks++" />
                  <BaseButton label="Secondary Button" variant="secondary" @click="buttonClicks++" />
                  <BaseButton label="Danger Button" variant="danger" @click="buttonClicks++" />
                </div>
              </div>

              <div class="space-y-3 text-center md:text-left">
                <span class="block text-xs font-bold uppercase tracking-wider text-slate-400">Interactive States</span>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <BaseButton
                    :label="isButtonLoading ? 'Saving Changes...' : 'Trigger Loading Spinner'"
                    variant="primary"
                    :loading="isButtonLoading"
                    @click="triggerLoading"
                  />
                  <BaseButton label="Disabled Button" variant="primary" :disabled="true" />
                </div>
              </div>
            </div>

            <footer class="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Interactive Verification Counter:</span>
              <span class="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">
                {{ buttonClicks }} Clicks
              </span>
            </footer>
          </article>

          <!-- Component 1.2: BaseBadge -->
          <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <h3 class="text-xl font-bold text-slate-900">BaseBadge</h3>
                <p class="text-sm text-slate-500 mt-1">Status pills and tag indicators with high-contrast color semantics.</p>
              </div>
              <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
                src/shared/ui/BaseBadge.vue
              </span>
            </header>

            <!-- Staging Surface -->
            <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 space-y-6">
              <div class="space-y-3">
                <span class="block text-xs font-bold uppercase tracking-wider text-slate-400">Small Sizing (size="sm")</span>
                <div class="flex flex-wrap items-center gap-2.5">
                  <BaseBadge variant="emerald" size="sm">Active (Emerald)</BaseBadge>
                  <BaseBadge variant="amber" size="sm">Warning (Amber)</BaseBadge>
                  <BaseBadge variant="rose" size="sm">Breach (Rose)</BaseBadge>
                  <BaseBadge variant="indigo" size="sm">Info (Indigo)</BaseBadge>
                  <BaseBadge variant="slate" size="sm">Neutral (Slate)</BaseBadge>
                </div>
              </div>

              <div class="space-y-3 pt-3 border-t border-slate-200">
                <span class="block text-xs font-bold uppercase tracking-wider text-slate-400">Medium Sizing (size="md")</span>
                <div class="flex flex-wrap items-center gap-2.5">
                  <BaseBadge variant="emerald" size="md">Active (Emerald)</BaseBadge>
                  <BaseBadge variant="amber" size="md">Warning (Amber)</BaseBadge>
                  <BaseBadge variant="rose" size="md">Breach (Rose)</BaseBadge>
                  <BaseBadge variant="indigo" size="md">Info (Indigo)</BaseBadge>
                  <BaseBadge variant="slate" size="md">Neutral (Slate)</BaseBadge>
                </div>
              </div>
            </div>

            <footer class="pt-2 text-xs text-slate-400">
              Direct CSS token binding: Emerald (Healthy/Active), Amber (Attention/Near Cap), Rose (Breached/Danger), Indigo (Selected), Slate (Archived).
            </footer>
          </article>

          <!-- Component 1.3: BaseInput -->
          <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <h3 class="text-xl font-bold text-slate-900">BaseInput</h3>
                <p class="text-sm text-slate-500 mt-1">Text, email, and credential entry fields with distinct focus rings and validation captions.</p>
              </div>
              <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
                src/shared/ui/BaseInput.vue
              </span>
            </header>

            <!-- Staging Surface -->
            <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Standard Text</label>
                <BaseInput v-model="textInput" placeholder="Enter standard text..." />
                <span class="text-[11px] text-slate-400 block font-mono mt-1">Value: {{ textInput }}</span>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <BaseInput v-model="emailInput" type="email" placeholder="name@domain.com" />
                <span class="text-[11px] text-slate-400 block font-mono mt-1">Value: {{ emailInput }}</span>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Validation Error State</label>
                <BaseInput v-model="errorInput" :error="inputError" placeholder="Type here..." />
                <span class="text-[11px] text-rose-500 block font-medium mt-1">Displays prominent red border & caption</span>
              </div>
            </div>

            <footer class="pt-2 text-xs text-slate-400">
              Emits native <code class="font-mono">update:modelValue</code>. Automatically styles red borders and aria attributes when <code class="font-mono">error</code> prop is passed.
            </footer>
          </article>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- WAVE 2: STRUCTURAL SHELL                                          -->
      <!-- ================================================================= -->
      <section id="wave-2" class="space-y-8">
        <div class="border-b-2 border-indigo-500 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">2</span>
            <div>
              <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">Wave 2: Structural Shell</h2>
              <p class="text-xs text-slate-500 font-medium">Headless modal shell governing viewport boundaries, focus, and scrolling.</p>
            </div>
          </div>
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
            1 Component
          </span>
        </div>

        <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
          <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
            <div>
              <h3 class="text-xl font-bold text-slate-900">BaseModal</h3>
              <p class="text-sm text-slate-500 mt-1">Teleported dumb modal shell enforcing max-width 640px geometry, Escape listener, and body scroll lock.</p>
            </div>
            <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
              src/shared/ui/BaseModal.vue
            </span>
          </header>

          <!-- Staging Surface -->
          <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="space-y-2 text-center md:text-left">
              <span class="text-base font-bold text-slate-900 block">Interactive Modal Test Gate</span>
              <p class="text-xs text-slate-500 max-w-md">
                Click below to launch the modal shell into the DOM. Test dismissing via backdrop click, the Escape key, or the close buttons.
              </p>
            </div>
            <BaseButton label="Launch BaseModal Verification Shell" variant="primary" @click="isModalOpen = true" />
          </div>

          <!-- Feature Ledger -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">DOM Isolation</span>
              <p class="text-xs text-slate-500">Teleports directly to <code class="font-mono text-slate-700">document.body</code> to prevent z-index stacking conflicts.</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Scroll Locking</span>
              <p class="text-xs text-slate-500">Locks <code class="font-mono text-slate-700">&lt;body&gt;</code> scrolling on mount and cleans up on unmount or dismiss.</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Strict Geometry</span>
              <p class="text-xs text-slate-500">Restricted to centered <code class="font-mono text-slate-700">max-w-xl</code> (640px) to prevent viewport canvas bleed.</p>
            </div>
          </div>

          <BaseModal :show="isModalOpen" title="BaseModal Verification Shell" @close="isModalOpen = false">
            <div class="space-y-4">
              <p class="text-sm text-slate-600">
                This modal is rendered cleanly via <code class="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">&lt;Teleport to="body"&gt;</code> without CSS canvas bleed.
              </p>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Focus Target</label>
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
        </article>
      </section>

      <!-- ================================================================= -->
      <!-- WAVE 3: TELEMETRY & SELECTION                                     -->
      <!-- ================================================================= -->
      <section id="wave-3" class="space-y-8">
        <div class="border-b-2 border-indigo-500 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">3</span>
            <div>
              <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">Wave 3: Telemetry & Selection</h2>
              <p class="text-xs text-slate-500 font-medium">Domain gauges and multi-select filtering controls.</p>
            </div>
          </div>
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
            2 Components
          </span>
        </div>

        <div class="space-y-10">
          <!-- Component 3.1: MaintenanceGauge -->
          <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <h3 class="text-xl font-bold text-slate-900">MaintenanceGauge</h3>
                <p class="text-sm text-slate-500 mt-1">Care plan retainer capacity gauge with dynamic threshold color shifts and 0-cap baseline handling.</p>
              </div>
              <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
                src/shared/ui/MaintenanceGauge.vue
              </span>
            </header>

            <!-- Staging Surface -->
            <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 space-y-8">
              <!-- Rendered Gauge Container -->
              <div class="max-w-md mx-auto p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
                <MaintenanceGauge
                  :total-minutes="testGaugeMinutes"
                  :cap-minutes="testGaugeCap"
                  :out-of-scope="testGaugeOutOfScope"
                />
              </div>

              <!-- Interactive Gauge Controls -->
              <div class="space-y-6 max-w-xl mx-auto pt-4 border-t border-slate-200">
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span class="uppercase tracking-wider">Interactive Usage Slider</span>
                    <span class="font-mono bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-1 rounded-md text-xs">
                      {{ testGaugeMinutes }}m / {{ testGaugeCap }}m ({{ testGaugeCap > 0 ? Math.round((testGaugeMinutes / testGaugeCap) * 100) : 0 }}%)
                    </span>
                  </div>
                  <input
                    v-model.number="testGaugeMinutes"
                    type="range"
                    min="0"
                    max="60"
                    class="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div class="space-y-2">
                  <span class="block text-xs font-bold uppercase tracking-wider text-slate-500">Threshold Presets</span>
                  <div class="flex flex-wrap gap-2.5">
                    <BaseButton label="Healthy (15m / 50%)" variant="secondary" @click="setGaugePreset(15, 30)" />
                    <BaseButton label="Warning (27m / 90%)" variant="secondary" @click="setGaugePreset(27, 30)" />
                    <BaseButton label="Breach (35m / 116%)" variant="secondary" @click="setGaugePreset(35, 30)" />
                    <BaseButton label="Zero Cap (No Plan)" variant="secondary" @click="setGaugePreset(0, 0)" />
                  </div>
                </div>
              </div>
            </div>

            <footer class="pt-2 text-xs text-slate-400">
              Threshold specifications: &le;75% Emerald, 76-100% Amber, &gt;100% Rose. When cap is 0 or undefined, renders neutral slate bar with "No Active Care Plan".
            </footer>
          </article>

          <!-- Component 3.2: ServiceFilterDropdown -->
          <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <h3 class="text-xl font-bold text-slate-900">ServiceFilterDropdown</h3>
                <p class="text-sm text-slate-500 mt-1">Multi-select service offering filter with active selection counters and toggle tags.</p>
              </div>
              <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
                src/features/service-catalog/ServiceFilterDropdown.vue
              </span>
            </header>

            <!-- Staging Surface -->
            <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 space-y-6">
              <div class="max-w-md mx-auto space-y-3">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Service Offerings Filter</label>
                <ServiceFilterDropdown
                  v-model="testSelectedServices"
                  :services="workbenchCatalogServices"
                />
              </div>

              <div class="max-w-md mx-auto p-4 bg-white border border-slate-200 rounded-xl shadow-xs text-xs space-y-1">
                <span class="font-bold text-slate-700 block uppercase tracking-wider">Active Filter Codes:</span>
                <code class="font-mono text-indigo-700 block font-semibold">
                  {{ testSelectedServices.length ? testSelectedServices : '(None selected - showing all)' }}
                </code>
              </div>
            </div>

            <footer class="pt-2 text-xs text-slate-400">
              Renders pill badges for active filters and supports individual dismiss tags.
            </footer>
          </article>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- WAVE 4: DOMAIN FEATURE MODALS                                     -->
      <!-- ================================================================= -->
      <section id="wave-4" class="space-y-8">
        <div class="border-b-2 border-indigo-500 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">4</span>
            <div>
              <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">Wave 4: Domain Feature Modals</h2>
              <p class="text-xs text-slate-500 font-medium">Business-critical dialogs composing BaseModal with clean payload emission contracts.</p>
            </div>
          </div>
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
            4 Modals
          </span>
        </div>

        <div class="space-y-10">
          <!-- Modal 4.1: ContractAgreementModal -->
          <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="text-xl font-bold text-slate-900">ContractAgreementModal</h3>
                  <BaseBadge variant="indigo" size="sm">Dual-Mode</BaseBadge>
                </div>
                <p class="text-sm text-slate-500 mt-1">Single agreed rate input, agreement type toggle (Monthly vs One-Time), deliverables checklist preview.</p>
              </div>
              <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
                src/features/client-contracts/ContractAgreementModal.vue
              </span>
            </header>

            <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="space-y-1 text-center md:text-left">
                <span class="text-base font-bold text-slate-900 block">Launch Contract Modal</span>
                <p class="text-xs text-slate-500">Attach a service agreement to a client account or stage in onboarding.</p>
              </div>
              <BaseButton label="Open Contract Agreement Modal" variant="primary" @click="showContractModal = true" />
            </div>

            <div v-if="lastSavedContractPayload" class="p-4 bg-slate-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto space-y-1">
              <span class="text-[10px] uppercase text-slate-400 font-bold block">Emitted Payload Contract:</span>
              <pre>{{ lastSavedContractPayload }}</pre>
            </div>
          </article>

          <!-- Modal 4.2: LogWorkModal -->
          <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="text-xl font-bold text-slate-900">LogWorkModal</h3>
                  <BaseBadge variant="emerald" size="sm">Timecard</BaseBadge>
                </div>
                <p class="text-sm text-slate-500 mt-1">Minutes spent input, 3-way work category dropdown (retainer, billable_extra, internal), care plan scope guardrails.</p>
              </div>
              <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
                src/features/client-maintenance/LogWorkModal.vue
              </span>
            </header>

            <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="space-y-1 text-center md:text-left">
                <span class="text-base font-bold text-slate-900 block">Launch Log Work Modal</span>
                <p class="text-xs text-slate-500">Record maintenance work with care plan validation and category tags.</p>
              </div>
              <BaseButton label="Open Log Work Modal" variant="primary" @click="showLogWorkModal = true" />
            </div>

            <div v-if="lastSavedWorkPayload" class="p-4 bg-slate-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto space-y-1">
              <span class="text-[10px] uppercase text-slate-400 font-bold block">Emitted Payload Contract:</span>
              <pre>{{ lastSavedWorkPayload }}</pre>
            </div>
          </article>

          <!-- Modal 4.3: VaultSecretModal -->
          <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="text-xl font-bold text-slate-900">VaultSecretModal</h3>
                  <BaseBadge variant="amber" size="sm">Vault & Keys</BaseBadge>
                </div>
                <p class="text-sm text-slate-500 mt-1">Secret label, credential type selector (SSH, WP Admin, DB, API Key), username, and password fields.</p>
              </div>
              <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
                src/features/client-vault/VaultSecretModal.vue
              </span>
            </header>

            <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="space-y-1 text-center md:text-left">
                <span class="text-base font-bold text-slate-900 block">Launch Vault Secret Modal</span>
                <p class="text-xs text-slate-500">Store credentials securely in the client vault with masked previews.</p>
              </div>
              <BaseButton label="Open Vault Secret Modal" variant="primary" @click="showVaultModal = true" />
            </div>

            <div v-if="lastSavedVaultPayload" class="p-4 bg-slate-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto space-y-1">
              <span class="text-[10px] uppercase text-slate-400 font-bold block">Emitted Payload Contract:</span>
              <pre>{{ lastSavedVaultPayload }}</pre>
            </div>
          </article>

          <!-- Modal 4.4: ClientOnboardingModal -->
          <article class="bg-white rounded-2xl border-2 border-slate-300 p-8 md:p-10 shadow-sm space-y-6">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="text-xl font-bold text-slate-900">ClientOnboardingModal</h3>
                  <BaseBadge variant="rose" size="sm">3-Step Wizard</BaseBadge>
                </div>
                <p class="text-sm text-slate-500 mt-1">Streamlined 3-step wizard (Contact Details &rarr; Service Offerings &rarr; Vault & Dispatch).</p>
              </div>
              <span class="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg self-start md:self-auto">
                src/features/client-onboarding/ClientOnboardingModal.vue
              </span>
            </header>

            <div class="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="space-y-1 text-center md:text-left">
                <span class="text-base font-bold text-slate-900 block">Launch Client Onboarding Wizard</span>
                <p class="text-xs text-slate-500">Step through full onboarding flow and inspect composite payload emission.</p>
              </div>
              <BaseButton label="Open Client Onboarding Wizard" variant="primary" @click="showOnboardingModal = true" />
            </div>

            <div v-if="lastSavedOnboardPayload" class="p-4 bg-slate-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto space-y-1">
              <span class="text-[10px] uppercase text-slate-400 font-bold block">Emitted Payload Contract:</span>
              <pre>{{ lastSavedOnboardPayload }}</pre>
            </div>
          </article>
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
