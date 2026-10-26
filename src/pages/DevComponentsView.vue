<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'
import BaseList from '@/shared/ui/BaseList.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseTable, { type TableColumn } from '@/shared/ui/BaseTable.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseWizard from '@/shared/ui/BaseWizard.vue'
import ModalWizard from '@/shared/ui/ModalWizard.vue'
import BaseAside, { type NavSectionDef, type NavItemDef } from '@/shared/ui/BaseAside.vue'
import BaseBreadcrumb, { type BreadcrumbItem } from '@/shared/ui/BaseBreadcrumb.vue'
import BasePageHeader from '@/shared/ui/BasePageHeader.vue'
import BasePageContainer from '@/shared/ui/BasePageContainer.vue'
import BaseDrawer from '@/shared/ui/BaseDrawer.vue'
import BaseMetricCard from '@/shared/ui/BaseMetricCard.vue'
import BaseAlert from '@/shared/ui/BaseAlert.vue'
import ManualLeadForm from '@/shared/ui/ManualLeadForm.vue'
import DisqualifyLeadForm, { type DisqualifyLeadPayload } from '@/shared/ui/DisqualifyLeadForm.vue'
import ScoreBadge from '@/features/lead-triage/ScoreBadge.vue'
import IssueChips from '@/features/lead-triage/IssueChips.vue'
import ProgressionIndicator from '@/shared/ui/ProgressionIndicator.vue'
import MaintenanceGauge from '@/shared/ui/MaintenanceGauge.vue'
import ServiceFilterDropdown from '@/features/service-catalog/ServiceFilterDropdown.vue'
import ContractAgreementModal from '@/features/client-contracts/ContractAgreementModal.vue'
import LogWorkModal from '@/features/client-maintenance/LogWorkModal.vue'
import VaultSecretModal from '@/features/client-vault/VaultSecretModal.vue'
import VaultSecretForm from '@/shared/ui/VaultSecretForm.vue'
import ContractAgreementForm from '@/shared/ui/ContractAgreementForm.vue'
import LogWorkForm from '@/shared/ui/LogWorkForm.vue'
import ClientOnboardingModal from '@/features/client-onboarding/ClientOnboardingModal.vue'
import type { ServiceCatalogItem, RankedLead, ClientSecretPayload, AttachContractPayload, LogTimecardPayload, CreateProspectPayload, AuditResult } from '@/shared/types/lead'

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

const selectChoice = ref('retainer')
const selectOptions = [
  { value: 'retainer', label: 'Monthly Retainer Maintenance' },
  { value: 'fixed_fee', label: 'One-Time Remediation Project' },
  { value: 'audit_only', label: 'Diagnostic Audit Only' }
]

const textareaValue = ref('Proactive database indexing and weekly snapshot verification completed.')

const listDemoItems = [
  'Infrastructure Security Assessment',
  'Automated Continuous Integration Gates',
  '24/7 SLA Telemetry & Incident Dispatch'
]

const formDemoSecret = ref<Partial<ClientSecretPayload>>({
  secret_type: 'wordpress_admin',
  label: 'WordPress Admin'
})
const isFormDemoValid = ref(false)

const formDemoContract = ref<Partial<AttachContractPayload>>({
  service_code: 'SVC-RETAINER',
  billing_rate: 150,
  contract_type: 'retainer'
})
const isContractFormValid = ref(true)

const formDemoLogWork = ref<Partial<LogTimecardPayload>>({
  minutes_spent: 15,
  entry_type: 'retainer_maintenance',
  description: 'Proactive SSL renewal and nginx config check'
})
const isLogWorkFormValid = ref(true)

const formDemoManualLead = ref<Partial<CreateProspectPayload>>({
  business_name: 'Pacific Heritage Bakery',
  website_url: 'https://pacificbakery.example.com',
  phone: '(555) 342-9102'
})
const isManualLeadFormValid = ref(true)

const formDemoDisqualify = ref<Partial<DisqualifyLeadPayload>>({
  reason: 'Out of Business',
  notes: 'Domain expired and location permanently closed.',
  suppress: true
})
const isDisqualifyFormValid = ref(true)

const alertDismissed = ref(false)
const metricCardClicks = ref(0)

const sampleAuditHighPriority: AuditResult = {
  id: 'audit-sample-1',
  prospect_id: 'lead-sample-1',
  target_url: 'https://samplebakery.example.com',
  audited_at: '2026-10-23T20:00:00Z',
  opportunity_score: 85,
  ssl_active: false,
  mobile_viewport_present: false,
  response_time_ms: 1850,
  status_code: 200,
  cms_detected: 'WordPress 5.4 (Outdated)',
  pos_integrations: ['Square', 'Toast'],
  menu_format: 'PDF',
  pdf_menu_count: 2,
  tel_link_present: false,
  critical_issues: ['SSL Missing', 'No Viewport Tag']
}

interface DemoTableOperator extends Record<string, unknown> {
  id: string
  name: string
  role: string
  status: string
}

const tableDemoColumns: TableColumn[] = [
  { key: 'name', label: 'Operator Name' },
  { key: 'role', label: 'Operational Role' },
  { key: 'status', label: 'Cluster State' }
]

const tableDemoRows = ref<DemoTableOperator[]>([
  { id: 'op-1', name: 'Alice Walker', role: 'Infrastructure Lead', status: 'Active' },
  { id: 'op-2', name: 'Devon Vance', role: 'Security Auditor', status: 'Standby' },
  { id: 'op-3', name: 'Elena Rostova', role: 'Site Reliability Engineer', status: 'Active' }
])
const selectedTableRow = ref<string>('None')

// ==========================================
// 2. Structural Shell (Wave 2) State
// ==========================================
const isModalOpen = ref(false)
const modalSampleInput = ref('')

const isAsideCollapsed = ref(false)
const isDrawerOpen = ref(false)
const drawerSize = ref<'sm' | 'md' | 'lg' | 'full'>('md')
const cardClickCount = ref(0)

const activeAsideNavId = ref('leads')
const demoNavSections = ref<NavSectionDef[]>([
  {
    id: 'primary-funnel',
    tier: 'primary',
    title: 'Core Funnel',
    items: [
      { id: 'leads', label: 'Leads', icon: '🔍', badge: 14, badgeVariant: 'primary' },
      { id: 'pursued', label: 'Pursued', icon: '🎯', badge: 3, badgeVariant: 'warning' },
      { id: 'accounts', label: 'Accounts', icon: '💼', badge: 8, badgeVariant: 'emerald' }
    ]
  },
  {
    id: 'secondary-catalogs',
    tier: 'secondary',
    title: 'Catalogs',
    items: [
      { id: 'services', label: 'Service Catalog', icon: '📋' },
      { id: 'addons', label: 'Add-ons & Subs', icon: '📦' }
    ]
  },
  {
    id: 'tertiary-system',
    tier: 'tertiary',
    title: 'Doctrine & Tools',
    items: [
      { id: 'doctrine', label: 'Business Doctrine', icon: '📖' },
      { id: 'components', label: 'Dev Components', icon: '⚡' }
    ]
  }
])

function handleAsideItemSelect(item: NavItemDef) {
  activeAsideNavId.value = item.id
}

const demoBreadcrumbs = ref<BreadcrumbItem[]>([
  { label: 'Operations Hub', to: '/dev/components' },
  { label: 'Client Accounts', to: '/dev/components' },
  { label: 'Acme Logistics Retainer', current: true }
])
const lastBreadcrumbNav = ref<string>('None')
function handleBreadcrumbClick(item: BreadcrumbItem) {
  lastBreadcrumbNav.value = item.label
}

function openDrawerWithSize(sz: 'sm' | 'md' | 'lg' | 'full') {
  drawerSize.value = sz
  isDrawerOpen.value = true
}

const isModalWizardOpen = ref(false)
const wizardDemoStep = ref(1)
const wizardDemoCluster = ref('production-cluster-01')
const wizardDemoEnv = ref('staging')
const wizardDemoSteps = [
  { number: 1, label: 'Identity' },
  { number: 2, label: 'Configuration' },
  { number: 3, label: 'Deployment' }
]
const wizardSubmissionCount = ref(0)

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

const demoStepperSteps = [
  { number: 1, label: 'Identity & Legal' },
  { number: 2, label: 'Service Packaging' },
  { number: 3, label: 'Console Vault & Dispatch' }
]
const demoStepperCurrent = ref(2)

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
          <ThemeToggle />
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
          <span class="count-tag">15 Components</span>
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

        <!-- 1.4 BaseSelect -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseSelect</h3>
              <p class="component-desc">Standardized dropdown menu with custom SVG chevron and theme token support.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseSelect.vue</span>
          </header>

          <div class="staging-surface grid-3">
            <div class="input-cell">
              <label class="cell-label">Standard Dropdown</label>
              <BaseSelect
                id="wb-base-select"
                v-model="selectChoice"
                label="Agreement Type"
                :options="selectOptions"
              />
              <span class="cell-feedback font-mono">Value: {{ selectChoice }}</span>
            </div>

            <div class="input-cell">
              <label class="cell-label">Disabled State</label>
              <BaseSelect
                id="wb-base-select-disabled"
                model-value="audit_only"
                label="Locked Selection"
                :options="selectOptions"
                disabled
              />
              <span class="cell-feedback">Selection prevented</span>
            </div>

            <div class="input-cell">
              <label class="cell-label">Error State</label>
              <BaseSelect
                id="wb-base-select-error"
                model-value=""
                label="Required Selection"
                error="Please choose an agreement type"
                :options="selectOptions"
              />
              <span class="cell-feedback error-feedback">Prominent error styling</span>
            </div>
          </div>

          <footer class="card-footer-note">
            Standardizes native <code>&lt;select&gt;</code> styling across modals with <code>appearance: none</code> and custom chevron.
          </footer>
        </article>

        <!-- 1.5 BaseTextarea -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseTextarea</h3>
              <p class="component-desc">Multi-line text input with strict non-resizable geometry and uniform focus rings.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseTextarea.vue</span>
          </header>

          <div class="staging-surface grid-2">
            <div class="input-cell">
              <label class="cell-label">Standard Work Notes</label>
              <BaseTextarea
                id="wb-base-textarea"
                v-model="textareaValue"
                label="Work Description"
                :rows="3"
                placeholder="Log activity details..."
              />
              <span class="cell-feedback font-mono">Length: {{ textareaValue.length }} chars</span>
            </div>

            <div class="input-cell">
              <label class="cell-label">Error &amp; Required State</label>
              <BaseTextarea
                id="wb-base-textarea-error"
                model-value=""
                label="Mandatory Resolution Log"
                error="Description cannot be empty"
                placeholder="Enter details..."
                required
              />
              <span class="cell-feedback error-feedback">Displays red border &amp; caption</span>
            </div>
          </div>

          <footer class="card-footer-note">
            Enforces <code>resize: none</code> to prevent modal layout distortions.
          </footer>
        </article>

        <!-- 1.6 BaseList -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseList</h3>
              <p class="component-desc">Standardized list primitive supporting bullet, checkmark, and numbered variants.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseList.vue</span>
          </header>

          <div class="staging-surface grid-3">
            <div class="input-cell">
              <label class="cell-label">Bullet Variant</label>
              <BaseList :items="listDemoItems" variant="bullet" />
            </div>

            <div class="input-cell">
              <label class="cell-label">Checkmark Variant</label>
              <BaseList :items="listDemoItems" variant="checkmark" />
            </div>

            <div class="input-cell">
              <label class="cell-label">Numbered Variant (Dense)</label>
              <BaseList :items="listDemoItems" variant="numbered" dense />
            </div>
          </div>

          <footer class="card-footer-note">
            Standardizes deliverables lists, feature audits, and instructional progressions across all modal surfaces.
          </footer>
        </article>

        <!-- 1.7 VaultSecretForm -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">VaultSecretForm</h3>
              <p class="component-desc">Extracted form sub-tree primitive managing credential category schemas, reactive validation, and payload binding.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/VaultSecretForm.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <VaultSecretForm
              v-model="formDemoSecret"
              id-prefix="wb-vault-form"
              @valid-change="(valid) => isFormDemoValid = valid"
            />
          </div>

          <footer class="card-footer">
            <span class="counter-label">Form Validation Status:</span>
            <span :class="['counter-badge', isFormDemoValid ? 'text-emerald' : 'text-amber']">
              {{ isFormDemoValid ? 'Valid (Ready for Dispatch)' : 'Incomplete (Required Fields Missing)' }}
            </span>
          </footer>
        </article>

        <!-- 1.8 ContractAgreementForm -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">ContractAgreementForm</h3>
              <p class="component-desc">Extracted agreement sub-tree binding service catalog options, agreement billing rate, and contract scope.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/ContractAgreementForm.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <ContractAgreementForm
              id-prefix="wb-contract-form"
              :services="workbenchCatalogServices"
              initial-service-code="SVC-RETAINER"
              :initial-billing-rate="150"
              @valid-change="(valid) => isContractFormValid = valid"
              @update:model-value="(payload) => formDemoContract = payload"
            />
          </div>

          <footer class="card-footer">
            <span class="counter-label">Contract Form Status:</span>
            <span :class="['counter-badge', isContractFormValid ? 'text-emerald' : 'text-amber']">
              {{ isContractFormValid ? 'Valid Agreement Scope' : 'Incomplete Fields' }}
            </span>
          </footer>
        </article>

        <!-- 1.9 LogWorkForm -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">LogWorkForm</h3>
              <p class="component-desc">Extracted maintenance work logging sub-tree enforcing positive minutes, category allocation, and description.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/LogWorkForm.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <LogWorkForm
              id-prefix="wb-logwork-form"
              :has-active-care-plan="true"
              :initial-minutes="20"
              initial-description="Proactive WordPress core security patching"
              @valid-change="(valid) => isLogWorkFormValid = valid"
              @update:model-value="(payload) => formDemoLogWork = payload"
            />
          </div>

          <footer class="card-footer">
            <span class="counter-label">Log Work Status:</span>
            <span :class="['counter-badge', isLogWorkFormValid ? 'text-emerald' : 'text-amber']">
              {{ isLogWorkFormValid ? 'Valid Timecard Entry' : 'Incomplete Description/Minutes' }}
            </span>
          </footer>
        </article>

        <!-- 1.10 ManualLeadForm -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">ManualLeadForm</h3>
              <p class="component-desc">Extracted manual prospect intake sub-tree standardizing business identity, URL, and phone contact validation.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/ManualLeadForm.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <ManualLeadForm
              id-prefix="wb-manual-lead-form"
              v-model="formDemoManualLead"
              @valid-change="(valid) => isManualLeadFormValid = valid"
            />
          </div>

          <footer class="card-footer">
            <span class="counter-label">Manual Lead Form Status:</span>
            <span :class="['counter-badge', isManualLeadFormValid ? 'text-emerald' : 'text-amber']">
              {{ isManualLeadFormValid ? 'Valid Intake Payload' : 'Business Name Required' }}
            </span>
          </footer>
        </article>

        <!-- 1.11 DisqualifyLeadForm -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">DisqualifyLeadForm</h3>
              <p class="component-desc">Extracted prospect disqualification sub-tree capturing categorized reason, triage notes, and suppression flags.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/DisqualifyLeadForm.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <DisqualifyLeadForm
              id-prefix="wb-disqualify-form"
              v-model="formDemoDisqualify"
              @valid-change="(valid) => isDisqualifyFormValid = valid"
            />
          </div>

          <footer class="card-footer">
            <span class="counter-label">Disqualification Form Status:</span>
            <span :class="['counter-badge', isDisqualifyFormValid ? 'text-emerald' : 'text-amber']">
              {{ isDisqualifyFormValid ? 'Valid Archive Record' : 'Reason Required' }}
            </span>
          </footer>
        </article>

        <!-- 1.12 BaseCard -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseCard</h3>
              <p class="component-desc">Theme-tokenized surface container with header, default, and footer slots, plus padding variants.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseCard.vue</span>
          </header>

          <div class="staging-surface grid-3">
            <BaseCard title="Nominal Staging Card" subtitle="Bordered with medium padding">
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
                Primary card body containing standard layout text or feature metrics.
              </p>
              <template #footer>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Card Footer Slot</span>
                <BaseBadge variant="emerald" size="sm">Active</BaseBadge>
              </template>
            </BaseCard>

            <BaseCard title="Elevated Surface" subtitle="Box-shadow elevation variant" :elevated="true">
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
                Subtle drop-shadow elevation for high-priority operational callouts.
              </p>
              <template #footer>
                <BaseButton label="Card Action" variant="primary" />
              </template>
            </BaseCard>

            <BaseCard
              title="Clickable Action Card"
              subtitle="Triggers drawer inspection"
              :clickable="true"
              @click="openDrawerWithSize('md'); cardClickCount++"
            >
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
                Clicking anywhere on this card activates focus, depression state, and opens the flyout drawer.
              </p>
              <template #footer>
                <span style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 600;">Clicks: {{ cardClickCount }}</span>
                <BaseBadge variant="indigo" size="sm">Interactive</BaseBadge>
              </template>
            </BaseCard>
          </div>

          <footer class="card-footer-note">
            Provides a uniform surface primitive across dashboards, kanban boards, and workspace dossiers. Supports clickable mode with keyboard Enter/Space delegation.
          </footer>
        </article>

        <!-- 1.9 BaseTable -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseTable</h3>
              <p class="component-desc">High-contrast data table shell with column formatting, loading spinners, and row-click delegation.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseTable.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <BaseTable
              :columns="tableDemoColumns"
              :rows="tableDemoRows"
              @row-click="(row) => selectedTableRow = String(row.name || 'Unknown')"
            />
          </div>

          <footer class="card-footer">
            <span class="counter-label">Last Row Clicked:</span>
            <span class="counter-badge">{{ selectedTableRow }}</span>
          </footer>
        </article>

        <!-- 1.14 BaseAlert -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseAlert</h3>
              <p class="component-desc">Notification and operational feedback banner with info, success, warning, and danger tokens.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseAlert.vue</span>
          </header>

          <div class="staging-surface flex-col" style="gap: 0.75rem;">
            <BaseAlert variant="info" title="System Operational Feedback">
              Discovery service completed ingestion of 15 candidate businesses in Kalamazoo, MI.
            </BaseAlert>

            <BaseAlert variant="success" title="Retainer Synchronized">
              Client agreement activated for WordPress Care Plan with zero overages.
            </BaseAlert>

            <BaseAlert variant="warning" title="Audit Threshold Exceeded">
              Target domain response latency is 1,850ms, triggering technical SEO remediation score.
            </BaseAlert>

            <BaseAlert
              v-if="!alertDismissed"
              variant="danger"
              title="Interactive Dismissible Alert"
              :dismissible="true"
              @dismiss="alertDismissed = true"
            >
              Click the dismiss ✕ button to test interactive notification dismissal.
            </BaseAlert>
            <BaseButton
              v-else
              label="Reset Dismissed Alert"
              variant="secondary"
              @click="alertDismissed = false"
            />
          </div>

          <footer class="card-footer-note">
            Replaces ad-hoc <code>.status-banner</code> and <code>.error-banner</code> across the application shell and dialog surfaces.
          </footer>
        </article>

        <!-- 1.15 BaseMetricCard -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseMetricCard</h3>
              <p class="component-desc">Executive KPI metric card with nominal, alert, success, and warning tokens plus clickable delegation.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseMetricCard.vue</span>
          </header>

          <div class="staging-surface grid-3">
            <BaseMetricCard
              label="Discovery Pool"
              value="128"
              subtext="Unprocessed leads"
            />

            <BaseMetricCard
              label="Active Retainers"
              value="12"
              variant="success"
              subtext="100% capacity"
            />

            <BaseMetricCard
              label="High Priority"
              value="14"
              variant="alert"
              :clickable="true"
              subtext="Click to filter (Score >= 70)"
              @click="metricCardClicks++"
            >
              <template #badge>
                <BaseBadge variant="danger" size="sm">Urgent</BaseBadge>
              </template>
            </BaseMetricCard>
          </div>

          <footer class="card-footer">
            <span class="counter-label">High Priority Card Clicks:</span>
            <span class="counter-badge">{{ metricCardClicks }} Clicks</span>
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
          <span class="count-tag">6 Components</span>
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

        <!-- 2.2 BaseWizard -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseWizard</h3>
              <p class="component-desc">Headless canvas workflow engine with multi-step validation gating and back/forward navigation.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseWizard.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <BaseWizard
              :steps="wizardDemoSteps"
              v-model:current-step="wizardDemoStep"
              submit-label="Complete Setup"
              @submit="wizardSubmissionCount++"
            >
              <template #step-1>
                <div style="padding: 0.5rem 0;">
                  <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                    Step 1 Content: Define primary system identifier.
                  </p>
                  <BaseInput v-model="wizardDemoCluster" label="System Identifier" />
                </div>
              </template>

              <template #step-2>
                <div style="padding: 0.5rem 0;">
                  <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                    Step 2 Content: Select operational profile.
                  </p>
                  <BaseSelect
                    v-model="wizardDemoEnv"
                    label="Environment Mode"
                    :options="[
                      { value: 'staging', label: 'Staging Environment' },
                      { value: 'production', label: 'Production High-Availability' }
                    ]"
                  />
                </div>
              </template>

              <template #step-3>
                <div style="padding: 0.5rem 0;">
                  <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                    Step 3 Content: Review configuration and confirm deployment.
                  </p>
                  <div style="font-size: 0.85rem; background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: 6px; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-primary);">
                    <div>Cluster Identifier: <strong>{{ wizardDemoCluster || 'Not set' }}</strong></div>
                    <div>Operational Profile: <strong>{{ wizardDemoEnv }}</strong></div>
                    <div style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
                      <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Pre-Flight Checks</span>
                      <BaseList
                        :items="[
                          'Nodes healthy & ready for orchestration',
                          'TLS certificates staged',
                          'DNS records propagated'
                        ]"
                        variant="checkmark"
                        dense
                      />
                    </div>
                  </div>
                </div>
              </template>
            </BaseWizard>
          </div>

          <footer class="card-footer-note">
            Submissions Triggered: <strong>{{ wizardSubmissionCount }}</strong>. Works cleanly standalone or inside modals.
          </footer>
        </article>

        <!-- 2.3 ModalWizard -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">ModalWizard</h3>
              <p class="component-desc">Composes BaseModal with BaseWizard to provide dialog overlays with guarded dismissal.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/ModalWizard.vue</span>
          </header>

          <div class="staging-surface flex-row items-center">
            <div class="modal-info">
              <span class="modal-launch-title">Launch Modal Wizard Demo</span>
              <p class="modal-launch-subtext">Multi-stage modal flow with built-in navigation and validation gating.</p>
            </div>
            <BaseButton label="Open Modal Wizard" variant="primary" @click="isModalWizardOpen = true" />
          </div>

          <ModalWizard
            :show="isModalWizardOpen"
            title="System Initialization Wizard"
            :steps="wizardDemoSteps"
            submit-label="Initialize Cluster"
            @close="isModalWizardOpen = false"
            @submit="isModalWizardOpen = false"
          >
            <template #step-1>
              <div style="padding: 0.5rem 0;">
                <BaseInput label="Cluster Name" model-value="alpha-node-01" />
              </div>
            </template>
            <template #step-2>
              <div style="padding: 0.5rem 0;">
                <BaseInput label="Region" model-value="us-east-1" />
              </div>
            </template>
            <template #step-3>
              <div style="padding: 0.5rem 0;">
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Ready to provision cluster node.</p>
              </div>
            </template>
          </ModalWizard>
        </article>

        <!-- 2.4 BaseAside -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseAside</h3>
              <p class="component-desc">Controlled vertical navigation rail supporting expanded (240px) and collapsed (64px) interactive modes.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseAside.vue</span>
          </header>

          <div class="staging-surface flex-col" style="align-items: center;">
            <div style="height: 380px; width: 100%; max-width: 520px; border: 1px solid var(--border-color); border-radius: 8px; position: relative; display: flex; overflow: visible;">
              <BaseAside
                :collapsed="isAsideCollapsed"
                :sections="demoNavSections"
                :active-id="activeAsideNavId"
                brand-title="SMB Ops"
                brand-subtitle="Practice Engine"
                @toggle-collapse="isAsideCollapsed = !isAsideCollapsed"
                @select-item="handleAsideItemSelect"
              >
                <template #footer>
                  <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); width: 100%;">
                    <span v-if="!isAsideCollapsed">v1.2.0 • Active</span>
                    <ThemeToggle />
                  </div>
                </template>
              </BaseAside>

              <div style="flex: 1; padding: 1.5rem; background: var(--bg-app); display: flex; flex-direction: column; gap: 0.75rem;">
                <span style="font-size: 0.8rem; font-weight: 700;">Simulated Stage</span>
                <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">
                  Active Route: <code style="font-weight: 700; color: var(--accent-primary);">{{ activeAsideNavId }}</code>
                </p>
                <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">
                  Tiers rendered: <strong>Primary Funnel</strong> (with count badges), <strong>Secondary Catalogs</strong>, and <strong>Tertiary Tools</strong>.
                </p>
                <BaseButton
                  :label="isAsideCollapsed ? 'Expand Rail (240px)' : 'Collapse to Rail (64px)'"
                  variant="secondary"
                  @click="isAsideCollapsed = !isAsideCollapsed"
                />
              </div>
            </div>
          </div>

          <footer class="card-footer-note">
            Provides unambiguous visual hierarchy across acquisition funnel, catalogs, and documentation with popover tooltips in collapsed mode.
          </footer>
        </article>

        <!-- 2.5 BasePageContainer -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BasePageContainer</h3>
              <p class="component-desc">Standardized viewport stage wrapper establishing max-width constraints, fluid width options, and vertical scroll containment.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BasePageContainer.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <div style="height: 180px; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
              <BasePageContainer max-width="100%">
                <div style="font-size: 0.85rem; color: var(--text-secondary); background: var(--bg-surface); padding: 1.25rem; border: 1px solid var(--border-color); border-radius: 6px;">
                  Pure Stage Canvas: Content scrolls smoothly within container bounds while maintaining consistent horizontal padding rhythms.
                </div>
              </BasePageContainer>
            </div>
          </div>

          <footer class="card-footer-note">
            Decoupled from headers and actions: use BasePageHeader inside this container for route title and breadcrumb orientation.
          </footer>
        </article>

        <!-- 2.5a BaseBreadcrumb -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseBreadcrumb</h3>
              <p class="component-desc">Orientation breadcrumb trail supporting nested hierarchies, custom separators, and router navigation emission.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseBreadcrumb.vue</span>
          </header>

          <div class="staging-surface flex-col" style="gap: 1rem;">
            <div style="background: var(--bg-surface); padding: 1rem; border: 1px solid var(--border-color); border-radius: 6px;">
              <BaseBreadcrumb
                :items="demoBreadcrumbs"
                @navigate="handleBreadcrumbClick"
              />
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">
              Last Clicked Node: <strong>{{ lastBreadcrumbNav }}</strong>
            </div>
          </div>

          <footer class="card-footer-note">
            Enforces strict aria-current="page" accessibility semantics and non-navigable leaf styling.
          </footer>
        </article>

        <!-- 2.5b BasePageHeader -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BasePageHeader</h3>
              <p class="component-desc">Top-of-view orientation header unifying breadcrumbs, page title, subtitle, and primary stage actions.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BasePageHeader.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <div style="background: var(--bg-surface); padding: 1.25rem; border: 1px solid var(--border-color); border-radius: 6px; width: 100%;">
              <BasePageHeader
                title="Client Account Ledger"
                subtitle="Active service retainers, SLA fulfillment, and credential vaults"
                :breadcrumbs="demoBreadcrumbs"
                @navigate-breadcrumb="handleBreadcrumbClick"
              >
                <template #actions>
                  <BaseButton label="Export Ledger" variant="secondary" />
                  <BaseButton label="Create Account" variant="primary" />
                </template>
                <template #context>
                  <div style="display: inline-flex; gap: 0.5rem; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
                    <BaseBadge label="14 Active Retainers" variant="emerald" />
                    <span>Last audited: 10m ago</span>
                  </div>
                </template>
              </BasePageHeader>
            </div>
          </div>

          <footer class="card-footer-note">
            Responsive flexbox structure drops actions below title row seamlessly on mobile (&le;640px).
          </footer>
        </article>

        <!-- 2.6 BaseDrawer -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">BaseDrawer</h3>
              <p class="component-desc">Contextual flyout overlay translating from right screen edge, sized flush against the Aside Navigation.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/BaseDrawer.vue</span>
          </header>

          <div class="staging-surface flex-col" style="gap: 1.25rem;">
            <div class="modal-info">
              <span class="modal-launch-title">Launch Flyout Drawer By Size Variant</span>
              <p class="modal-launch-subtext">Slides across the Dashboard Stage and stops flush at the 240px Aside margin.</p>
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <BaseButton label="Inspect Drawer (sm: 420px)" variant="secondary" @click="openDrawerWithSize('sm')" />
              <BaseButton label="Form Drawer (md: 680px)" variant="primary" @click="openDrawerWithSize('md')" />
              <BaseButton label="Deep Drawer (lg: 960px)" variant="secondary" @click="openDrawerWithSize('lg')" />
              <BaseButton label="Canvas Drawer (full: 100%)" variant="secondary" @click="openDrawerWithSize('full')" />
            </div>

            <!-- Architectural Governance Callout -->
            <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em;">
                📐 Flyout Drawer vs. Stage vs. Modal Architectural Governance
              </span>
              <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; display: flex; flex-direction: column; gap: 0.4rem;">
                <div>
                  <strong>• Inspect Drawer (sm: 420px):</strong> Fast contextual preview (e.g. Lead Dossier summary, audit score breakdown) preserving table position and scroll context.
                </div>
                <div>
                  <strong>• Form Drawer (md: 680px / lg: 960px):</strong> Multi-field editing workflows (e.g. Client Account updates, Work logging) without context switching or navigating away.
                </div>
                <div>
                  <strong>• Canvas Drawer (full: calc(100vw - aside)):</strong> Focused, immersive work environments (e.g. Strategy/Doctrine Workspace, Client Dossier) requiring maximum workspace width while maintaining Aside rail orientation.
                </div>
                <div>
                  <strong>• Update Stage (Router Navigation):</strong> Use when switching top-level operational domains (e.g. Triage Dashboard ↔ Service Catalog).
                </div>
                <div>
                  <strong>• BaseModal Dialog:</strong> Reserved for atomic, blocking confirmation or creation flows (e.g. Confirm Delete, Wizard Deployment).
                </div>
              </div>
            </div>
          </div>

          <BaseDrawer
            :show="isDrawerOpen"
            :size="drawerSize"
            :title="`Workspace Drawer — [${drawerSize.toUpperCase()}]`"
            subtitle="Contextual Lead & Operational Inspection"
            aside-width="240px"
            @close="isDrawerOpen = false"
          >
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
                Active size: <code>{{ drawerSize }}</code>. Contextual workspace canvas for deep records editing without losing aside navigational orientation.
              </p>
              <BaseInput label="Lead Business Name" model-value="Harbor Artisanal Bakery" />
              <BaseInput label="Domain / URL" model-value="https://harborbakery.example.com" />
            </div>

            <template #footer>
              <BaseButton label="Close (Esc)" variant="secondary" @click="isDrawerOpen = false" />
              <BaseButton label="Save Changes" variant="primary" @click="isDrawerOpen = false" />
            </template>
          </BaseDrawer>
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
          <span class="count-tag">5 Components</span>
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

        <!-- 3.3 ProgressionIndicator -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">ProgressionIndicator</h3>
              <p class="component-desc">Multi-step wizard progress tracker with active, completed, and upcoming visual tokens.</p>
            </div>
            <span class="filepath-tag">src/shared/ui/ProgressionIndicator.vue</span>
          </header>

          <div class="staging-surface flex-col">
            <div class="control-group">
              <span class="group-label">Interactive Stepper Preview</span>
              <ProgressionIndicator :steps="demoStepperSteps" :current-step="demoStepperCurrent" />
            </div>

            <div class="stepper-controls" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
              <BaseButton label="Step 1" variant="secondary" @click="demoStepperCurrent = 1" />
              <BaseButton label="Step 2" variant="secondary" @click="demoStepperCurrent = 2" />
              <BaseButton label="Step 3" variant="secondary" @click="demoStepperCurrent = 3" />
            </div>
          </div>

          <footer class="card-footer-note">
            Replaces hardcoded modal stepper text with a theme-tokenized accessible progress bar.
          </footer>
        </article>

        <!-- 3.4 ScoreBadge -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">ScoreBadge</h3>
              <p class="component-desc">Triage opportunity score badge with dynamic thresholds: green (&lt;40), amber (&ge;40), and danger (&ge;70).</p>
            </div>
            <span class="filepath-tag">src/features/lead-triage/ScoreBadge.vue</span>
          </header>

          <div class="staging-surface flex-row items-center" style="gap: 1rem;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
              <ScoreBadge :score="85" />
              <span style="font-size: 0.7rem; color: var(--text-muted);">&ge; 70 (High Priority)</span>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
              <ScoreBadge :score="55" />
              <span style="font-size: 0.7rem; color: var(--text-muted);">&ge; 40 (Moderate)</span>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
              <ScoreBadge :score="25" />
              <span style="font-size: 0.7rem; color: var(--text-muted);">&lt; 40 (Low / Healthy)</span>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
              <ScoreBadge :score="null" />
              <span style="font-size: 0.7rem; color: var(--text-muted);">Null (Unaudited)</span>
            </div>
          </div>

          <footer class="card-footer-note">
            Standardizes lead qualification badges across table rows, Kanban cards, and dossier headers.
          </footer>
        </article>

        <!-- 3.5 IssueChips -->
        <article class="component-card">
          <header class="card-header">
            <div>
              <h3 class="component-name">IssueChips</h3>
              <p class="component-desc">Technical audit issue tags showing SSL status, PDF menus, viewport compliance, and CMS detections.</p>
            </div>
            <span class="filepath-tag">src/features/lead-triage/IssueChips.vue</span>
          </header>

          <div class="staging-surface flex-col" style="gap: 1rem;">
            <div>
              <label class="cell-label">Critical Findings Profile (Score: 85)</label>
              <IssueChips :audit="sampleAuditHighPriority" />
            </div>

            <div>
              <label class="cell-label">Empty / Unaudited Profile</label>
              <IssueChips :audit="null" />
            </div>
          </div>

          <footer class="card-footer-note">
            Provides instant visual indicators for key technical pain points driving sales outreach playbooks.
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
        @save="(payload) => {
          const sanitized = { ...payload, password: '***MASKED***' }
          if ('value' in sanitized) sanitized.value = '***MASKED***'
          lastSavedVaultPayload = JSON.stringify(sanitized, null, 2)
          showVaultModal = false
        }"
      />

      <ClientOnboardingModal
        :show="showOnboardingModal"
        :services="workbenchCatalogServices"
        :lead="workbenchMockLead"
        @close="showOnboardingModal = false"
        @onboard="(payload) => {
          const sanitized = {
            ...payload,
            secrets: payload.secrets?.map(s => ({ ...s, password: '***MASKED***' }))
          }
          lastSavedOnboardPayload = JSON.stringify(sanitized, null, 2)
          showOnboardingModal = false
        }"
      />
    </main>
  </div>
</template>

<style scoped>
/* Page Layout */
.workbench-page {
  min-height: 100vh;
  background-color: var(--bg-app);
  color: var(--text-primary);
  padding-bottom: 8rem;
  font-family: var(--font-sans);
}

/* Sticky Navigation Ribbon */
.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: var(--bg-surface);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-color);
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
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.025em;
}

.path-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background-color: var(--bg-surface-subtle);
  color: var(--text-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-weight: 600;
}

.page-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.nav-pill {
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  background-color: var(--bg-surface-subtle);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid var(--border-color);
  transition: all 0.15s ease;
}

.nav-pill:hover {
  background-color: var(--accent-primary);
  color: #ffffff;
  border-color: var(--accent-primary);
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
  border-bottom: 2px solid var(--accent-primary);
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
  background-color: var(--accent-primary);
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
  color: var(--text-primary);
  margin: 0;
}

.section-subtext {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0.15rem 0 0 0;
}

.count-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-primary);
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  text-transform: uppercase;
}

/* Component Cards */
.component-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
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
  border-bottom: 1px solid var(--border-color);
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
  color: var(--text-primary);
  margin: 0;
}

.component-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
}

.filepath-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  align-self: flex-start;
}

/* Staging Surface */
.staging-surface {
  background-color: var(--bg-surface-subtle);
  border: 2px dashed var(--border-color);
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
  color: var(--text-muted);
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
  color: var(--text-secondary);
}

.cell-feedback {
  font-size: 0.75rem;
  color: var(--text-muted);
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
  color: var(--text-secondary);
  font-weight: 600;
}

.counter-badge {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--accent-primary);
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
}

.card-footer-note {
  font-size: 0.75rem;
  color: var(--text-muted);
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
  color: var(--text-primary);
}

.shell-subtext {
  font-size: 0.8rem;
  color: var(--text-secondary);
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
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1rem;
}

.feature-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.feature-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Telemetry Styles */
.gauge-preview-wrapper {
  max-width: 420px;
  margin: 0 auto;
  background-color: var(--bg-surface);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.gauge-controls-wrapper {
  max-width: 560px;
  margin: 1rem auto 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-top: 1px solid var(--border-color);
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
  color: var(--text-secondary);
}

.slider-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-primary);
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.range-slider {
  width: 100%;
  height: 0.65rem;
  background-color: var(--border-color);
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
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1rem;
}

.feedback-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.feedback-code {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-primary);
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
  color: var(--text-primary);
}

.modal-launch-subtext {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
}

.payload-box {
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  margin-top: 1rem;
}

.payload-header {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.payload-code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent-primary);
  margin: 0;
  overflow-x: auto;
}
</style>
