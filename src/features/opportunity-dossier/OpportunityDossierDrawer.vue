<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import type {
  RankedLead,
  ServiceCatalogItem,
  ContactPerson,
  OutreachActivity,
  CreateContactPayload,
  CreateActivityPayload,
  ActivityChannel
} from '@/shared/types/lead'
import { useLeadStore } from '@/entities/lead/store'

const props = withDefaults(
  defineProps<{
    show: boolean
    lead: RankedLead | null
    services?: ServiceCatalogItem[]
  }>(),
  {
    services: () => []
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'convert', lead: RankedLead): void
  (e: 'disqualify', lead: RankedLead): void
}>()

const leadStore = useLeadStore()

// Local state for contacts & activities
const contacts = ref<ContactPerson[]>([])
const activities = ref<OutreachActivity[]>([])
const loadingLedger = ref(false)

// Add Contact Modal State
const showAddContactModal = ref(false)
const contactName = ref('')
const contactRole = ref('')
const contactPhone = ref('')
const contactEmail = ref('')
const contactIsPrimary = ref(false)
const contactNotes = ref('')
const savingContact = ref(false)
const contactError = ref<string | null>(null)

// Log Activity Form State
const actChannel = ref<ActivityChannel>('phone_call')
const actSummary = ref('')
const actContactId = ref<string>('')
const actScheduledAt = ref('')
const savingActivity = ref(false)
const activityError = ref<string | null>(null)

// Pipeline stages in canonical sequence
const STAGES = [
  { key: 'claimed', label: 'Claimed' },
  { key: 'contact_attempted', label: 'Contact Attempted' },
  { key: 'engaged', label: 'Engaged' },
  { key: 'appointment_scheduled', label: 'Appointment Scheduled' },
  { key: 'proposal_presented', label: 'Proposal Presented' }
] as const

const currentOpportunityStage = computed(() => {
  return props.lead?.prospect.opportunity_stage || 'claimed'
})

watch(
  () => [props.show, props.lead?.prospect.id],
  async ([show, leadId]) => {
    if (show && leadId) {
      await loadLedgerData(leadId as string)
    } else {
      contacts.value = []
      activities.value = []
    }
  },
  { immediate: true }
)

async function loadLedgerData(leadId: string): Promise<void> {
  loadingLedger.value = true
  try {
    const [cList, aList] = await Promise.all([
      leadStore.getContacts(leadId),
      leadStore.getActivities(leadId)
    ])
    contacts.value = cList
    activities.value = aList
    // Pre-select primary or first contact for activity logging
    const primary = cList.find((c) => c.is_primary) || cList[0]
    actContactId.value = primary ? primary.id : ''
  } catch (err) {
    console.error('Failed to load opportunity ledger data:', err)
  } finally {
    loadingLedger.value = false
  }
}

function openAddContact(): void {
  contactName.value = ''
  contactRole.value = ''
  contactPhone.value = props.lead?.prospect.phone ?? ''
  contactEmail.value = ''
  contactIsPrimary.value = contacts.value.length === 0
  contactNotes.value = ''
  contactError.value = null
  showAddContactModal.value = true
}

async function handleSaveContact(): Promise<void> {
  if (!props.lead) return
  if (!contactName.value.trim() || !contactRole.value.trim()) {
    contactError.value = 'Name and role/title are required.'
    return
  }
  savingContact.value = true
  contactError.value = null
  try {
    const payload: CreateContactPayload = {
      name: contactName.value.trim(),
      role_title: contactRole.value.trim(),
      phone: contactPhone.value.trim() || null,
      email: contactEmail.value.trim() || null,
      is_primary: contactIsPrimary.value,
      notes: contactNotes.value.trim() || null
    }
    const created = await leadStore.addContact(props.lead.prospect.id, payload)
    contacts.value.push(created)
    if (!actContactId.value || created.is_primary) {
      actContactId.value = created.id
    }
    showAddContactModal.value = false
  } catch (err: unknown) {
    contactError.value = err instanceof Error ? err.message : 'Failed to save contact.'
  } finally {
    savingContact.value = false
  }
}

async function handleDeleteContact(contactId: string): Promise<void> {
  if (!props.lead) return
  try {
    await leadStore.removeContact(props.lead.prospect.id, contactId)
    contacts.value = contacts.value.filter((c) => c.id !== contactId)
    if (actContactId.value === contactId) {
      actContactId.value = contacts.value[0]?.id || ''
    }
  } catch (err) {
    console.error('Failed to delete contact:', err)
  }
}

async function handleLogActivity(): Promise<void> {
  if (!props.lead) return
  if (!actSummary.value.trim()) {
    activityError.value = 'Summary is required.'
    return
  }
  savingActivity.value = true
  activityError.value = null
  try {
    const payload: CreateActivityPayload = {
      channel: actChannel.value,
      summary: actSummary.value.trim(),
      contact_id: actContactId.value || null,
      scheduled_at: actScheduledAt.value ? new Date(actScheduledAt.value).toISOString() : null,
      performed_by: 'operator'
    }
    const created = await leadStore.addActivity(props.lead.prospect.id, payload)
    activities.value.unshift(created)
    actSummary.value = ''
    actScheduledAt.value = ''
    // Reload ledger to get updated lead stage
    await loadLedgerData(props.lead.prospect.id)
  } catch (err: unknown) {
    activityError.value = err instanceof Error ? err.message : 'Failed to log activity.'
  } finally {
    savingActivity.value = false
  }
}

async function handleStageClick(stageKey: string): Promise<void> {
  if (!props.lead) return
  try {
    await leadStore.setOpportunityStage(props.lead.prospect.id, stageKey)
  } catch (err) {
    console.error('Failed to update stage:', err)
  }
}

function getContactName(contactId?: string | null): string {
  if (!contactId) return 'General Business'
  const match = contacts.value.find((c) => c.id === contactId)
  return match ? `${match.name} (${match.role_title})` : 'Contact'
}

function formatActivityDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

function formatPrice(svc: ServiceCatalogItem): string {
  const min = svc.price_min ?? 0
  const max = svc.price_max ?? min
  if (svc.pricing_model === 'MONTHLY_RETAINER') {
    return min === max
      ? `$${min.toFixed(0)} / mo`
      : `$${min.toFixed(0)}–$${max.toFixed(0)} / mo`
  }
  if (svc.pricing_model === 'HYBRID') {
    return `$${min.toFixed(0)}–$${max.toFixed(0)} Flat`
  }
  return min === max
    ? `$${min.toFixed(0)} Flat`
    : `$${min.toFixed(0)}–$${max.toFixed(0)} Flat`
}

const matchingServices = computed<ServiceCatalogItem[]>(() => {
  if (!props.lead || !props.services || props.services.length === 0) return []
  const audit = props.lead.audit
  const score = audit?.opportunity_score ?? 0

  return props.services.filter((svc) => {
    const meetsMinScore = score >= (svc.minimum_opportunity_score || 0)
    if (!meetsMinScore) return false
    if (!audit || !svc.audit_parameters || svc.audit_parameters.length === 0) return true

    return svc.audit_parameters.some((param) => {
      if (param === 'ssl_active') return !audit.ssl_active
      if (param === 'mobile_viewport_present') return !audit.mobile_viewport_present
      if (param === 'response_time_ms') return (audit.response_time_ms ?? 0) > 1000
      if (param === 'status_code') return (audit.status_code ?? 200) >= 400
      if (param === 'pos_integrations') return (audit.pos_integrations?.length ?? 0) > 0
      if (param === 'pdf_menu_count') return (audit.pdf_menu_count ?? 0) > 0
      if (param === 'tel_link_present') return !audit.tel_link_present
      if (param === 'cms_detected') return !!audit.cms_detected
      return true
    })
  })
})
</script>

<template>
  <div v-if="show && lead" class="drawer-overlay" @click.self="emit('close')">
    <div class="dossier-drawer">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div>
          <span class="tracking-uid">UID: {{ lead.prospect.id.slice(0, 8) }}</span>
          <h3 class="opportunity-title">{{ lead.prospect.business_name }}</h3>
        </div>
        <button type="button" class="close-btn" @click="emit('close')">✕</button>
      </div>

      <!-- Drawer Body -->
      <div class="drawer-body">
        <!-- Milestone Stage Progression Bar -->
        <div class="stage-stepper-section">
          <div class="stage-stepper-title">Opportunity Pipeline Stage</div>
          <div class="stage-stepper-bar">
            <button
              v-for="(st, idx) in STAGES"
              :key="st.key"
              type="button"
              class="stage-pill-step"
              :class="{
                active: currentOpportunityStage === st.key,
                passed: STAGES.findIndex(s => s.key === currentOpportunityStage) > idx
              }"
              @click="handleStageClick(st.key)"
            >
              <span class="step-num">{{ idx + 1 }}</span>
              <span class="step-label">{{ st.label }}</span>
            </button>
          </div>
        </div>

        <!-- Business Profile Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Prospect Profile</h4>
            <BaseBadge variant="primary">{{ lead.prospect.status }}</BaseBadge>
          </div>
          <div class="profile-grid">
            <div class="profile-item">
              <span class="profile-label">Website:</span>
              <a
                v-if="lead.prospect.website_url"
                :href="lead.prospect.website_url"
                target="_blank"
                rel="noopener noreferrer"
                class="website-link"
              >
                {{ lead.prospect.website_url }}
              </a>
              <span v-else class="profile-val">N/A</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Main Business Phone:</span>
              <span class="profile-val">{{ lead.prospect.phone ?? 'N/A' }}</span>
            </div>
            <div class="profile-item full-width">
              <span class="profile-label">Address:</span>
              <span class="profile-val">{{ lead.prospect.address ?? 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Stakeholder Contacts Directory Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Stakeholder Contacts</h4>
            <BaseButton
              label="+ Add Contact"
              variant="secondary"
              @click="openAddContact"
            />
          </div>

          <div v-if="contacts.length > 0" class="contacts-list">
            <div
              v-for="c in contacts"
              :key="c.id"
              class="contact-card"
              :class="{ 'is-primary-card': c.is_primary }"
            >
              <div class="contact-card-header">
                <div class="contact-identity">
                  <strong class="contact-name">{{ c.name }}</strong>
                  <span class="contact-role">{{ c.role_title }}</span>
                  <span v-if="c.is_primary" class="primary-badge">PRIMARY</span>
                </div>
                <button
                  type="button"
                  class="delete-contact-btn"
                  title="Remove contact"
                  @click="handleDeleteContact(c.id)"
                >
                  ✕
                </button>
              </div>

              <div class="contact-channels">
                <span v-if="c.phone" class="channel-pill">📞 {{ c.phone }}</span>
                <span v-if="c.email" class="channel-pill">✉️ {{ c.email }}</span>
              </div>
              <p v-if="c.notes" class="contact-notes-text">“{{ c.notes }}”</p>
            </div>
          </div>
          <div v-else class="empty-state">
            No contacts recorded. Add owners, managers, or decision-makers to track appointments.
          </div>
        </div>

        <!-- Touchpoint & Appointment Logging Form -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Record Outreach / Schedule Appointment</h4>
          </div>

          <form class="activity-form" @submit.prevent="handleLogActivity">
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Touchpoint Channel</label>
                <select v-model="actChannel" class="custom-select">
                  <option value="phone_call">Phone Call</option>
                  <option value="voicemail">Left Voicemail</option>
                  <option value="email">Email Outreach</option>
                  <option value="in_person_visit">Walk-in / In-Person</option>
                  <option value="appointment">Appointment / Consultation</option>
                  <option value="note">Internal Note</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Stakeholder Contact</label>
                <select v-model="actContactId" class="custom-select">
                  <option value="">General (No Contact Linked)</option>
                  <option v-for="c in contacts" :key="c.id" :value="c.id">
                    {{ c.name }} ({{ c.role_title }})
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Schedule Appointment (Optional)</label>
              <input
                v-model="actScheduledAt"
                type="datetime-local"
                class="custom-datetime-input"
              />
              <span class="field-hint">Setting a future datetime auto-advances opportunity to Appointment Scheduled.</span>
            </div>

            <div class="form-group">
              <label class="form-label">Interaction Summary</label>
              <textarea
                v-model="actSummary"
                rows="2"
                class="custom-textarea"
                placeholder="Spoke with owner about broken mobile menu; agreed to 15-min discovery call..."
                required
              ></textarea>
            </div>

            <div v-if="activityError" class="form-error">
              {{ activityError }}
            </div>

            <div class="activity-submit-row">
              <BaseButton
                :label="actScheduledAt ? 'Schedule & Record' : 'Record Touchpoint'"
                variant="primary"
                :disabled="savingActivity"
              />
            </div>
          </form>
        </div>

        <!-- Outreach Activity Timeline Feed -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Interaction Timeline ({{ activities.length }})</h4>
          </div>

          <div v-if="activities.length > 0" class="activity-timeline">
            <div
              v-for="act in activities"
              :key="act.id"
              class="timeline-item"
              :class="{ 'appointment-item': act.scheduled_at || act.channel === 'appointment' }"
            >
              <div class="timeline-meta">
                <span class="timeline-channel-tag">{{ act.channel.toUpperCase().replace('_', ' ') }}</span>
                <span class="timeline-contact-tag">{{ getContactName(act.contact_id) }}</span>
                <span class="timeline-date">{{ formatActivityDate(act.created_at) }}</span>
              </div>

              <div v-if="act.scheduled_at" class="scheduled-badge-row">
                <span class="appointment-badge">
                  📅 Scheduled For: {{ formatActivityDate(act.scheduled_at) }}
                </span>
              </div>

              <p class="timeline-summary">{{ act.summary }}</p>
            </div>
          </div>
          <div v-else class="empty-state">
            No outreach activities recorded yet.
          </div>
        </div>

        <!-- Opportunity Score Breakdown Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Opportunity Rubric</h4>
            <span class="score-pill">{{ lead.audit?.opportunity_score ?? 0 }} / 100</span>
          </div>

          <div class="total-score-card">
            <span class="score-title">Calculated Opportunity Score</span>
            <span class="score-number">{{ lead.audit?.opportunity_score ?? 0 }} / 100</span>
            <span class="score-subtitle">
              {{ (lead.audit?.opportunity_score ?? 0) >= 70 ? 'High-Yield Immediate Conversion Prospect' : 'Moderate Opportunity Prospect' }}
            </span>
          </div>

          <div class="deficit-factors-block">
            <h5>Service Deficit Factors</h5>
            <ul class="factors-list">
              <li :class="{ active: !lead.audit?.ssl_active }">
                <span class="factor-name">Missing / Insecure TLS/SSL</span>
                <span class="factor-pts">+25 pts (Domain Security SVC-SEC)</span>
              </li>
              <li :class="{ active: (lead.audit?.pdf_menu_count ?? 0) > 0 || !lead.audit?.mobile_viewport_present }">
                <span class="factor-name">Unreadable PDF Menus / Not Mobile Friendly</span>
                <span class="factor-pts">+30 pts (Web Modernization SVC-WEB)</span>
              </li>
              <li :class="{ active: (lead.audit?.response_time_ms ?? 0) > 1000 }">
                <span class="factor-name">Slow Server Response Time (>1000ms)</span>
                <span class="factor-pts">+15 pts (Performance Opt SVC-PERF)</span>
              </li>
              <li :class="{ active: (lead.audit?.pos_integrations?.length ?? 0) > 0 }">
                <span class="factor-name">Active POS / Commercial Ordering</span>
                <span class="factor-pts">+15 pts (Cloud POS Integration SVC-POS)</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Target Service Offerings Section -->
        <div class="dossier-section">
          <div class="section-title-row">
            <h4>Best-Fit Service Offerings</h4>
            <span class="catalog-count-badge">{{ matchingServices.length }} Matching</span>
          </div>

          <div v-if="matchingServices.length > 0" class="services-fit-list">
            <div
              v-for="svc in matchingServices"
              :key="svc.code"
              class="service-fit-card"
            >
              <div class="service-fit-header">
                <div class="badge-group">
                  <BaseBadge variant="primary">{{ svc.rank || 'Service' }}</BaseBadge>
                  <span class="service-code-text">{{ svc.code }}</span>
                </div>
                <span class="service-price-text">{{ formatPrice(svc) }}</span>
              </div>
              <div class="service-fit-name">{{ svc.name }}</div>
              <p class="service-fit-desc">{{ svc.description }}</p>
            </div>
          </div>
          <div v-else class="empty-state">
            No service catalog offerings met the minimum score or deficit threshold.
          </div>
        </div>
      </div>

      <!-- Drawer Footer Actions -->
      <div class="drawer-footer">
        <BaseButton
          label="Disqualify Lead"
          variant="danger"
          @click="emit('disqualify', lead)"
        />
        <BaseButton
          label="Convert to Client"
          variant="primary"
          @click="emit('convert', lead)"
        />
      </div>
    </div>

    <!-- Add Contact Modal -->
    <BaseModal
      :show="showAddContactModal"
      title="Add Stakeholder Contact"
      @close="showAddContactModal = false"
    >
      <form class="modal-form" @submit.prevent="handleSaveContact">
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <BaseInput
            v-model="contactName"
            placeholder="e.g. Jane Doe"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Role / Title *</label>
          <BaseInput
            v-model="contactRole"
            placeholder="e.g. Owner, General Manager, Head Chef"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group flex-1">
            <label class="form-label">Direct Phone</label>
            <BaseInput
              v-model="contactPhone"
              placeholder="e.g. 269-555-0101"
            />
          </div>
          <div class="form-group flex-1">
            <label class="form-label">Direct Email</label>
            <BaseInput
              v-model="contactEmail"
              type="email"
              placeholder="e.g. jane@business.com"
            />
          </div>
        </div>

        <div class="form-checkbox-row">
          <label class="checkbox-label">
            <input v-model="contactIsPrimary" type="checkbox" />
            <span>Designate as Primary Decision-Maker</span>
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">Notes / Preferences</label>
          <textarea
            v-model="contactNotes"
            rows="2"
            class="custom-textarea"
            placeholder="Prefers morning phone calls, off on Tuesdays..."
          ></textarea>
        </div>

        <div v-if="contactError" class="form-error">
          {{ contactError }}
        </div>

        <div class="modal-actions">
          <BaseButton
            label="Cancel"
            variant="secondary"
            @click="showAddContactModal = false"
          />
          <BaseButton
            label="Save Contact"
            variant="primary"
            :disabled="savingContact"
          />
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 50;
  display: flex;
  justify-content: flex-end;
}

.dossier-drawer {
  width: 100%;
  max-width: 580px;
  height: 100%;
  background-color: var(--color-background, #090d16);
  border-left: 1px solid var(--color-border, #1e293b);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #1e293b);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: var(--color-surface, #0f172a);
}

.tracking-uid {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.opportunity-title {
  margin: 0.25rem 0 0;
  font-size: 1.2rem;
  color: var(--color-text, #f1f5f9);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted, #94a3b8);
  font-size: 1.25rem;
  cursor: pointer;
}

.close-btn:hover {
  color: var(--color-text, #f1f5f9);
}

.drawer-body {
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

/* Stage Stepper Bar */
.stage-stepper-section {
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #1e293b);
  border-radius: 8px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stage-stepper-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-muted, #94a3b8);
  letter-spacing: 0.05em;
}

.stage-stepper-bar {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
}

.stage-pill-step {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.5rem;
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.stage-pill-step:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: var(--color-text, #f1f5f9);
}

.stage-pill-step.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.stage-pill-step.passed {
  background-color: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #10b981;
}

.step-num {
  font-size: 0.65rem;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}

/* Sections */
.dossier-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #1e293b);
  border-radius: 8px;
  padding: 1rem;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dossier-section h4 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text, #f1f5f9);
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.profile-item.full-width {
  grid-column: span 2;
}

.profile-label {
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.75rem;
}

.profile-val {
  color: var(--color-text, #f1f5f9);
}

.website-link {
  color: var(--color-primary, #3b82f6);
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Contacts Directory */
.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-card {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.65rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.contact-card.is-primary-card {
  border-left: 3px solid #3b82f6;
}

.contact-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-identity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-name {
  font-size: 0.85rem;
  color: var(--color-text, #f1f5f9);
}

.contact-role {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.primary-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.15);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

.delete-contact-btn {
  background: none;
  border: none;
  color: var(--color-text-muted, #94a3b8);
  cursor: pointer;
  font-size: 0.85rem;
}

.delete-contact-btn:hover {
  color: #ef4444;
}

.contact-channels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.channel-pill {
  font-size: 0.75rem;
  color: var(--color-text-muted, #cbd5e1);
}

.contact-notes-text {
  margin: 0;
  font-size: 0.72rem;
  color: var(--color-text-muted, #94a3b8);
  font-style: italic;
}

/* Activity Form */
.activity-form {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.form-row {
  display: flex;
  gap: 0.75rem;
}

.flex-1 {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted, #94a3b8);
}

.field-hint {
  font-size: 0.68rem;
  color: var(--color-text-muted, #64748b);
}

.custom-select,
.custom-datetime-input,
.custom-textarea {
  width: 100%;
  padding: 0.45rem 0.6rem;
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  color: var(--color-text, #f1f5f9);
  font-size: 0.8rem;
}

.custom-select:focus,
.custom-datetime-input:focus,
.custom-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.activity-submit-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.25rem;
}

/* Activity Timeline */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.timeline-item {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.65rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.timeline-item.appointment-item {
  border-left: 3px solid #10b981;
}

.timeline-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.timeline-channel-tag {
  font-size: 0.68rem;
  font-weight: 700;
  font-family: monospace;
  color: #3b82f6;
}

.timeline-contact-tag {
  font-size: 0.72rem;
  color: var(--color-text, #f1f5f9);
  font-weight: 500;
}

.timeline-date {
  font-size: 0.7rem;
  color: var(--color-text-muted, #94a3b8);
}

.scheduled-badge-row {
  display: flex;
}

.appointment-badge {
  font-size: 0.72rem;
  font-weight: 600;
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.timeline-summary {
  margin: 0;
  font-size: 0.78rem;
  color: var(--color-text, #e2e8f0);
  line-height: 1.4;
}

/* Opportunity Rubric */
.score-pill {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.15);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.total-score-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border, #1e293b);
  padding: 0.85rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.score-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-text-muted, #94a3b8);
  font-weight: 600;
}

.score-number {
  font-size: 1.6rem;
  font-weight: 800;
  color: #3b82f6;
  font-family: monospace;
}

.score-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.deficit-factors-block h5 {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text, #f1f5f9);
}

.factors-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.factors-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.02);
  color: var(--color-text-muted, #64748b);
  border: 1px dashed var(--color-border, #1e293b);
}

.factors-list li.active {
  background-color: rgba(59, 130, 246, 0.08);
  color: var(--color-text, #f1f5f9);
  border-style: solid;
  border-color: rgba(59, 130, 246, 0.3);
}

.factor-pts {
  color: var(--color-primary, #3b82f6);
  font-size: 0.75rem;
  font-weight: 500;
}

.catalog-count-badge {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.services-fit-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-fit-card {
  padding: 0.65rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--color-border, #334155);
  background-color: var(--color-surface-muted, #1e293b);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.service-fit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.service-code-text {
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--color-text-muted, #94a3b8);
  font-weight: 600;
}

.service-price-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #10b981;
}

.service-fit-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text, #f1f5f9);
}

.service-fit-desc {
  margin: 0;
  font-size: 0.72rem;
  color: var(--color-text-muted, #94a3b8);
  line-height: 1.35;
}

.empty-state {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
  font-style: italic;
  padding: 0.5rem 0;
}

.drawer-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border, #1e293b);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface, #0f172a);
}

/* Modal form elements */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-checkbox-row {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text, #f1f5f9);
  cursor: pointer;
}

.form-error {
  font-size: 0.75rem;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .dossier-drawer {
    width: 100vw;
    max-width: 100vw;
    border-left: none;
    box-shadow: none;
  }

  .drawer-header {
    padding: 1rem 1.25rem;
  }

  .drawer-body {
    padding: 1rem;
    gap: 1rem;
  }

  .drawer-footer {
    padding: 1rem 1.25rem;
  }

  .profile-grid,
  .form-row {
    grid-template-columns: 1fr;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
