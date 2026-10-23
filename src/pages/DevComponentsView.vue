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
  <div class="workbench-page">
    <!-- Sticky Navigation Ribbon -->
    <header class="sticky-nav">
      <div class="nav-content">
        <div class="title-cluster">
          <div class="title-row">
            <span class="status-dot"></span>
            <h1 class="page-title">Component Living Workbench</h1>
            <span class="path-badge">/dev/components</span>
          </div>
          <p class="page-subtitle">Spacious, high-contrast isolated staging canvas for visual review & regression prevention.</p>
        </div>

        <nav class="nav-links">
          <a href="#wave-1" class="nav-pill">Wave 1: Primitives</a>
          <a href="#wave-2" class="nav-pill">Wave 2: Shell</a>
          <a href="#wave-3" class="nav-pill">Wave 3: Telemetry</a>
          <a href="#wave-4" class="nav-pill">Wave 4: Modals</a>
        </nav>
      </div>
    </header>

    <!-- Content Container -->
    <main class="workbench-container">

      <!-- ================================================================= -->
      <!-- WAVE 1: PRIMITIVES                                                -->
      <!-- ================================================================= -->
      <section id="wave-1" class="wave-section">
        <div class="section-header">
          <div class="section-title-cluster">
            <span class="wave-number">1</span>
            <div>
              <h2 class="section-heading">Wave 1: Atomic Primitives</h2>
              <p class="section-subtext">Presentation primitives with explicit state contracts and zero business logic dependencies.</p>
            </div>
          </div>
          <span class="count-tag">3 Components</span>
        </div>

        <!-- 1.1 BaseButton -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseButton</h3>
              <p class="component-desc">Button primitives with variants, loading spinners, and submit contracts.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseButton.vue</span>
          </header>

          <div class="staging-surface flex-row">
            <div class="control-group">
              <span class="group-label">Variant Styles</span>
              <div class="button-cluster">
                <BaseButton label="Primary Button" variant="primary" @click="buttonClicks++" />
                <BaseButton label="Secondary Button" variant="secondary" @click="buttonClicks++" />
                <BaseButton label="Danger Button" variant="danger" @click="buttonClicks++" />
              </div>
            </div>

            <div class="control-group">
              <span class="group-label">Interactive States</span>
              <div class="button-cluster">
                <BaseButton
                  :label="isButtonLoading ? 'Saving...' : 'Trigger Loading Spinner'"
                  variant="primary"
                  :loading="isButtonLoading"
                  @click="triggerLoading"
                />
                <BaseButton label="Disabled Button" variant="primary" :disabled="true" />
              </div>
            </div>
          </div>

          <footer class="card-footer">
            <span class="counter-label">Clicks Recorded in Session:</span>
            <span class="counter-badge">{{ buttonClicks }} Clicks</span>
          </footer>
        </article>

        <!-- 1.2 BaseBadge -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseBadge</h3>
              <p class="component-desc">Status indicators with high-contrast color tokens and sm/md pill sizes.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseBadge.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <div class="control-group">
              <span class="group-label">Small Sizing (size="sm")</span>
              <div class="badge-cluster">
                <BaseBadge variant="emerald" size="sm">Active (Emerald)</BaseBadge>
                <BaseBadge variant="amber" size="sm">Warning (Amber)</BaseBadge>
                <BaseBadge variant="rose" size="sm">Breach (Rose)</BaseBadge>
                <BaseBadge variant="indigo" size="sm">Info (Indigo)</BaseBadge>
                <BaseBadge variant="slate" size="sm">Neutral (Slate)</BaseBadge>
              </div>
            </div>

            <div class="control-group" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
              <span class="group-label">Medium Sizing (size="md")</span>
              <div class="badge-cluster">
                <BaseBadge variant="emerald" size="md">Active (Emerald)</BaseBadge>
                <BaseBadge variant="amber" size="md">Warning (Amber)</BaseBadge>
                <BaseBadge variant="rose" size="md">Breach (Rose)</BaseBadge>
                <BaseBadge variant="indigo" size="md">Info (Indigo)</BaseBadge>
                <BaseBadge variant="slate" size="md">Neutral (Slate)</BaseBadge>
              </div>
            </div>
          </div>

          <footer class="card-footer-note">
            CSS token mapping: Emerald (Active/Healthy), Amber (Warning/Near Cap), Rose (Breached), Indigo (Selected), Slate (Archived).
          </footer>
        </article>

        <!-- 1.3 BaseInput -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseInput</h3>
              <p class="component-desc">Form entry fields with active focus rings and validation error captions.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseInput.vue</span>
          </header>

          <div class="staging-surface grid-3">
            <div class="input-cell">
              <label class="cell-label">Standard Text</label>
              <BaseInput v-model="textInput" placeholder="Enter text..." />
              <span class="cell-feedback font-mono">Value: {{ textInput }}</span>
            </div>

            <div class="input-cell">
              <label class="cell-label">Email Address</label>
              <BaseInput v-model="emailInput" type="email" placeholder="name@domain.com" />
              <span class="cell-feedback font-mono">Value: {{ emailInput }}</span>
            </div>

            <div class="input-cell">
              <label class="cell-label">Validation Error State</label>
              <BaseInput v-model="errorInput" :error="inputError" placeholder="Type here..." />
              <span class="cell-feedback error-feedback">Displays prominent error caption</span>
            </div>
          </div>

          <footer class="card-footer-note">
            Emits standard <code>update:modelValue</code>. Automatically renders red borders when <code>error</code> prop is present.
          </footer>
        </article>
      </section>

      <!-- ================================================================= -->
      <!-- WAVE 2: STRUCTURAL SHELL                                          -->
      <!-- ================================================================= -->
      <section id="wave-2" class="wave-section">
        <div class="section-header">
          <div class="section-title-cluster">
            <span class="wave-number">2</span>
            <div>
              <h2 class="section-heading">Wave 2: Structural Shell</h2>
              <p class="section-subtext">Headless modal shell governing body scroll locking, teleporting, and dismissal.</p>
            </div>
          </div>
          <span class="count-tag">1 Component</span>
        </div>

        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseModal</h3>
              <p class="component-desc">Teleported shell with Escape listener, backdrop dismiss, and max-w-xl (640px) geometry.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseModal.vue</span>
          </header>

          <div class="staging-surface flex-row items-center">
            <div class="shell-info">
              <span class="shell-title">Interactive Modal Verification</span>
              <p class="shell-subtext">
                Click below to launch the modal shell. Test backdrop interception, the Escape key, and body scroll lock.
              </p>
            </div>
            <BaseButton label="Launch BaseModal Verification Shell" variant="primary" @click="isModalOpen = true" />
          </div>

          <div class="feature-grid">
            <div class="feature-box">
              <span class="feature-title">DOM Teleport</span>
              <p class="feature-text">Mounts into <code>document.body</code> to prevent z-index clipping.</p>
            </div>
            <div class="feature-box">
              <span class="feature-title">Scroll Lock</span>
              <p class="feature-text">Locks background scrolling and restores cleanly on dismiss.</p>
            </div>
            <div class="feature-box">
              <span class="feature-title">Max-Width 640px</span>
              <p class="feature-text">Centered flexbox canvas preventing viewport bleed.</p>
            </div>
          </div>

          <BaseModal :show="isModalOpen" title="BaseModal Verification Shell" @close="isModalOpen = false">
            <div style="padding: 1rem 0;">
              <p style="color: #475569; font-size: 0.9rem; margin-bottom: 1rem;">
                This modal is rendered cleanly via <code>&lt;Teleport to="body"&gt;</code> without canvas bleed.
              </p>
              <div>
                <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 0.35rem;">Focus Target</label>
                <BaseInput v-model="modalSampleInput" placeholder="Test input inside modal..." />
              </div>
            </div>
            <template #footer>
              <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
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
      <section id="wave-3" class="wave-section">
        <div class="section-header">
          <div class="section-title-cluster">
            <span class="wave-number">3</span>
            <div>
              <h2 class="section-heading">Wave 3: Telemetry & Selection</h2>
              <p class="section-subtext">Care plan capacity threshold gauges and multi-select service catalog filters.</p>
            </div>
          </div>
          <span class="count-tag">2 Components</span>
        </div>

        <!-- 3.1 MaintenanceGauge -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">MaintenanceGauge</h3>
              <p class="component-desc">Dynamic capacity threshold shifts (&le;75% Emerald, 76-100% Amber, &gt;100% Rose) and neutral 0-cap baseline.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/MaintenanceGauge.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <div class="gauge-preview-wrapper">
              <MaintenanceGauge
                :total-minutes="testGaugeMinutes"
                :cap-minutes="testGaugeCap"
                :out-of-scope="testGaugeOutOfScope"
              />
            </div>

            <div class="gauge-controls-wrapper">
              <div class="slider-group">
                <div class="slider-header">
                  <span class="slider-label">Usage Slider</span>
                  <span class="slider-badge">
                    {{ testGaugeMinutes }}m / {{ testGaugeCap }}m ({{ testGaugeCap > 0 ? Math.round((testGaugeMinutes / testGaugeCap) * 100) : 0 }}%)
                  </span>
                </div>
                <input
                  v-model.number="testGaugeMinutes"
                  type="range"
                  min="0"
                  max="60"
                  class="range-slider"
                />
              </div>

              <div class="preset-group">
                <span class="group-label">Threshold Presets</span>
                <div class="button-cluster">
                  <BaseButton label="Healthy (15m / 50%)" variant="secondary" @click="setGaugePreset(15, 30)" />
                  <BaseButton label="Warning (27m / 90%)" variant="secondary" @click="setGaugePreset(27, 30)" />
                  <BaseButton label="Breach (35m / 116%)" variant="secondary" @click="setGaugePreset(35, 30)" />
                  <BaseButton label="Zero Cap (No Plan)" variant="secondary" @click="setGaugePreset(0, 0)" />
                </div>
              </div>
            </div>
          </div>

          <footer class="card-footer-note">
            Threshold contracts: &le;75% Emerald, 76-100% Amber, &gt;100% Rose. When cap is 0 or undefined, renders neutral slate bar with "No Active Care Plan".
          </footer>
        </article>

        <!-- 3.2 ServiceFilterDropdown -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">ServiceFilterDropdown</h3>
              <p class="component-desc">Multi-select service offering filter with active selection counters and toggle tags.</p>
            </div>
            <span class="filepath-tag">src/features/service-catalog/ServiceFilterDropdown.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <div class="filter-wrapper">
              <label class="cell-label">Service Offerings Filter</label>
              <ServiceFilterDropdown
                v-model="testSelectedServices"
                :services="workbenchCatalogServices"
              />
            </div>

            <div class="filter-feedback-box">
              <span class="feedback-title">Active Filter Codes:</span>
              <code class="feedback-code">
                {{ testSelectedServices.length ? testSelectedServices : '(None selected - showing all)' }}
              </code>
            </div>
          </div>

          <footer class="card-footer-note">
            Renders pill badges for active filters and supports individual dismiss tags.
          </footer>
        </article>
      </section>

      <!-- ================================================================= -->
      <!-- WAVE 4: DOMAIN FEATURE MODALS                                     -->
      <!-- ================================================================= -->
      <section id="wave-4" class="wave-section">
        <div class="section-header">
          <div class="section-title-cluster">
            <span class="wave-number">4</span>
            <div>
              <h2 class="section-heading">Wave 4: Domain Feature Modals</h2>
              <p class="section-subtext">Business-critical dialogs composing BaseModal with clean payload emission contracts.</p>
            </div>
          </div>
          <span class="count-tag">4 Modals</span>
        </div>

        <!-- 4.1 ContractAgreementModal -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <div class="title-with-badge">
                <h3 class="component-name">ContractAgreementModal</h3>
                <BaseBadge variant="indigo" size="sm">Dual-Mode</BaseBadge>
              </div>
              <p class="component-desc">Single agreed rate input, agreement type toggle (Monthly vs One-Time), deliverables checklist preview.</p>
            </div>
            <span class="filepath-tag">src/features/client-contracts/ContractAgreementModal.vue</span>
          </header>

          <div class="staging-surface flex-row items-center">
            <div class="modal-info">
              <span class="modal-launch-title">Launch Contract Agreement Modal</span>
              <p class="modal-launch-subtext">Attach a service agreement to a client account or stage during onboarding.</p>
            </div>
            <BaseButton label="Open Contract Agreement Modal" variant="primary" @click="showContractModal = true" />
          </div>

          <div v-if="lastSavedContractPayload" class="payload-box">
            <span class="payload-header">Emitted Payload Contract:</span>
            <pre class="payload-code">{{ lastSavedContractPayload }}</pre>
          </div>
        </article>

        <!-- 4.2 LogWorkModal -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <div class="title-with-badge">
                <h3 class="component-name">LogWorkModal</h3>
                <BaseBadge variant="emerald" size="sm">Timecard</BaseBadge>
              </div>
              <p class="component-desc">Minutes spent input, 3-way work category dropdown (retainer, billable_extra, internal), care plan scope guardrails.</p>
            </div>
            <span class="filepath-tag">src/features/client-maintenance/LogWorkModal.vue</span>
          </header>

          <div class="staging-surface flex-row items-center">
            <div class="modal-info">
              <span class="modal-launch-title">Launch Log Work Modal</span>
              <p class="modal-launch-subtext">Record maintenance work with care plan validation and category tags.</p>
            </div>
            <BaseButton label="Open Log Work Modal" variant="primary" @click="showLogWorkModal = true" />
          </div>

          <div v-if="lastSavedWorkPayload" class="payload-box">
            <span class="payload-header">Emitted Payload Contract:</span>
            <pre class="payload-code">{{ lastSavedWorkPayload }}</pre>
          </div>
        </article>

        <!-- 4.3 VaultSecretModal -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <div class="title-with-badge">
                <h3 class="component-name">VaultSecretModal</h3>
                <BaseBadge variant="amber" size="sm">Vault & Keys</BaseBadge>
              </div>
              <p class="component-desc">Secret label, credential type selector (SSH, WP Admin, DB, API Key), username, and password fields.</p>
            </div>
            <span class="filepath-tag">src/features/client-vault/VaultSecretModal.vue</span>
          </header>

          <div class="staging-surface flex-row items-center">
            <div class="modal-info">
              <span class="modal-launch-title">Launch Vault Secret Modal</span>
              <p class="modal-launch-subtext">Store credentials securely in the client vault with masked previews.</p>
            </div>
            <BaseButton label="Open Vault Secret Modal" variant="primary" @click="showVaultModal = true" />
          </div>

          <div v-if="lastSavedVaultPayload" class="payload-box">
            <span class="payload-header">Emitted Payload Contract:</span>
            <pre class="payload-code">{{ lastSavedVaultPayload }}</pre>
          </div>
        </article>

        <!-- 4.4 ClientOnboardingModal -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <div class="title-with-badge">
                <h3 class="component-name">ClientOnboardingModal</h3>
                <BaseBadge variant="rose" size="sm">3-Step Wizard</BaseBadge>
              </div>
              <p class="component-desc">Streamlined 3-step wizard (Contact Details &rarr; Service Offerings &rarr; Vault & Dispatch).</p>
            </div>
            <span class="filepath-tag">src/features/client-onboarding/ClientOnboardingModal.vue</span>
          </header>

          <div class="staging-surface flex-row items-center">
            <div class="modal-info">
              <span class="modal-launch-title">Launch Client Onboarding Wizard</span>
              <p class="modal-launch-subtext">Step through full onboarding flow and inspect composite payload emission.</p>
            </div>
            <BaseButton label="Open Client Onboarding Wizard" variant="primary" @click="showOnboardingModal = true" />
          </div>

          <div v-if="lastSavedOnboardPayload" class="payload-box">
            <span class="payload-header">Emitted Payload Contract:</span>
            <pre class="payload-code">{{ lastSavedOnboardPayload }}</pre>
          </div>
        </article>
      </section>

      <!-- Rendered Feature Modals Mounted to Body via Teleport -->
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
    </main>
  </div>
</template>

<style scoped>
/* Page Layout */
.workbench-page {
  min-height: 100vh;
  background-color: #f1f5f9;
  color: #0f172a;
  padding-bottom: 8rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Sticky Navigation Ribbon */
.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  border-bottom: 2px solid #cbd5e1;
  padding: 1.25rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-content {
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .nav-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.title-cluster {
  display: flex;
  flex-direction: column;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background-color: #10b981;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.025em;
}

.path-badge {
  font-family: monospace;
  font-size: 0.75rem;
  background-color: #f1f5f9;
  color: #475569;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-weight: 600;
}

.page-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.nav-pill {
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  background-color: #f1f5f9;
  color: #334155;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  transition: all 0.15s ease;
}

.nav-pill:hover {
  background-color: #4f46e5;
  color: #ffffff;
  border-color: #4f46e5;
}

/* Container */
.workbench-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

/* Wave Sections */
.wave-section {
  margin-bottom: 5rem;
}

.section-header {
  border-bottom: 2px solid #4f46e5;
  padding-bottom: 0.75rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title-cluster {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.wave-number {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  background-color: #4f46e5;
  color: #ffffff;
  font-weight: 800;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-heading {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.section-subtext {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.15rem 0 0 0;
}

.count-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: #4f46e5;
  background-color: #eef2ff;
  border: 1px solid #c7d2fe;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  text-transform: uppercase;
}

/* Component Cards */
.component-card {
  background-color: #ffffff;
  border: 2px solid #cbd5e1;
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .card-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.component-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.component-desc {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.filepath-tag {
  font-family: monospace;
  font-size: 0.75rem;
  color: #64748b;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  align-self: flex-start;
}

/* Staging Surface */
.staging-surface {
  background-color: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 2.25rem;
  margin: 1.75rem 0;
}

.flex-row {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

@media (min-width: 768px) {
  .flex-row {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-around;
  }
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.items-center {
  align-items: center !important;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.button-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.badge-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

/* Input Grid */
.grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
}

@media (min-width: 768px) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.input-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cell-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #475569;
}

.cell-feedback {
  font-size: 0.75rem;
  color: #64748b;
}

.error-feedback {
  color: #ef4444;
  font-weight: 600;
}

/* Card Footers */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
}

.counter-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.counter-badge {
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 800;
  color: #4338ca;
  background-color: #eef2ff;
  border: 1px solid #c7d2fe;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
}

.card-footer-note {
  font-size: 0.75rem;
  color: #94a3b8;
  padding-top: 0.5rem;
}

/* Structural Shell Styles */
.shell-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.shell-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
}

.shell-subtext {
  font-size: 0.8rem;
  color: #64748b;
  max-width: 450px;
  margin: 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-box {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
}

.feature-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #334155;
  margin-bottom: 0.25rem;
}

.feature-text {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

/* Telemetry Styles */
.gauge-preview-wrapper {
  max-width: 420px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.gauge-controls-wrapper {
  max-width: 560px;
  margin: 1rem auto 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #334155;
}

.slider-badge {
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4338ca;
  background-color: #eef2ff;
  border: 1px solid #c7d2fe;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.range-slider {
  width: 100%;
  height: 0.65rem;
  background-color: #e2e8f0;
  border-radius: 8px;
  appearance: none;
  cursor: pointer;
}

.preset-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-wrapper {
  max-width: 450px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-feedback-box {
  max-width: 450px;
  margin: 0 auto;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
}

.feedback-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #334155;
  margin-bottom: 0.25rem;
}

.feedback-code {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4338ca;
}

/* Feature Modals Styles */
.title-with-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-launch-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.modal-launch-subtext {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.payload-box {
  background-color: #0f172a;
  border-radius: 12px;
  padding: 1.25rem;
  margin-top: 1rem;
}

.payload-header {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.payload-code {
  font-family: monospace;
  font-size: 0.75rem;
  color: #34d399;
  margin: 0;
  overflow-x: auto;
}
</style>
