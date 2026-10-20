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
  ActivityChannel,
  OpportunityPlaybook
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

// Local state for contacts, activities, and playbook
const contacts = ref<ContactPerson[]>([])
const activities = ref<OutreachActivity[]>([])
const playbook = ref<OpportunityPlaybook | null>(null)
const loadingLedger = ref(false)
const discoveringContacts = ref(false)
const copiedScriptIndex = ref<number | null>(null)

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

// Google Maps Embed URL
const googleMapsEmbedUrl = computed(() => {
  if (!props.lead) return ''
  const query = props.lead.prospect.address || props.lead.prospect.business_name
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`
})

const googleMapsExternalUrl = computed(() => {
  if (!props.lead) return ''
  const query = props.lead.prospect.address || props.lead.prospect.business_name
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
})

watch(
  () => [props.show, props.lead?.prospect.id],
  async ([show, leadId]) => {
    if (show && leadId) {
      await Promise.all([
        loadLedgerData(leadId as string),
        loadPlaybookData(leadId as string)
      ])
    } else {
      contacts.value = []
      activities.value = []
      playbook.value = null
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
    const primary = cList.find((c) => c.is_primary) || cList[0]
    actContactId.value = primary ? primary.id : ''
  } catch (err) {
    console.error('Failed to load opportunity ledger data:', err)
  } finally {
    loadingLedger.value = false
  }
}

async function loadPlaybookData(leadId: string): Promise<void> {
  try {
    playbook.value = await leadStore.getPlaybook(leadId)
  } catch (err) {
    console.warn('Could not load opportunity playbook:', err)
  }
}

async function handleDiscoverContacts(): Promise<void> {
  if (!props.lead) return
  discoveringContacts.value = true
  try {
    const discovered = await leadStore.discoverContacts(props.lead.prospect.id)
    contacts.value = discovered
    const primary = discovered.find((c) => c.is_primary) || discovered[0]
    if (primary) {
      actContactId.value = primary.id
    }
  } catch (err) {
    console.error('Failed to discover contacts:', err)
  } finally {
    discoveringContacts.value = false
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

function copyPitchScript(text: string, idx: number): void {
  navigator.clipboard.writeText(text)
  copiedScriptIndex.value = idx
  setTimeout(() => {
    if (copiedScriptIndex.value === idx) {
      copiedScriptIndex.value = null
    }
  }, 2000)
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
  <div v-if="show && lead" class="workspace-overlay" @click.self="emit('close')">
    <div class="workspace-canvas">
      <!-- Full-Canvas Workspace Header -->
      <header class="workspace-header">
        <div class="header-identity">
          <div class="breadcrumbs-row">
            <span class="pipeline-tag">Pursued Opportunity Pipeline</span>
            <span class="crumb-separator">/</span>
            <span class="tracking-uid">UID: {{ lead.prospect.id.slice(0, 8) }}</span>
          </div>
          <div class="title-status-row">
            <h2 class="workspace-title">{{ lead.prospect.business_name }}</h2>
            <BaseBadge variant="primary">{{ lead.prospect.status }}</BaseBadge>
            <span class="score-pill-header">{{ lead.audit?.opportunity_score ?? 0 }} / 100 pts</span>
          </div>
        </div>

        <div class="header-actions">
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
          <button type="button" class="close-btn" title="Close Workspace (Esc)" @click="emit('close')">
            ✕
          </button>
        </div>
      </header>

      <!-- Full-Width Pipeline Stage Stepper Strip -->
      <nav class="workspace-stepper-strip" aria-label="Opportunity Stage Stepper">
        <div class="stepper-strip-inner">
          <div class="stepper-strip-meta">
            <span class="stepper-meta-title">Pipeline Stage:</span>
            <span class="active-stage-label">{{ currentOpportunityStage.toUpperCase().replace('_', ' ') }}</span>
          </div>
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
      </nav>

      <!-- Full-Canvas Dual-Column Split Workspace Body -->
      <main class="workspace-body">
        <!-- COLUMN 1: Location, Intelligence, Rubric & Sales Playbook (42%) -->
        <section class="workspace-col col-left">
          <!-- Geographic Intelligence & Map -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">📍 Location & Contact Details</h3>
              <a
                v-if="lead.prospect.address || lead.prospect.business_name"
                :href="googleMapsExternalUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="panel-action-link"
              >
                Open Google Maps ↗
              </a>
            </div>

            <div class="meta-vitals-grid">
              <div class="vital-item">
                <span class="vital-label">Website</span>
                <a
                  v-if="lead.prospect.website_url"
                  :href="lead.prospect.website_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="website-link"
                >
                  {{ lead.prospect.website_url }}
                </a>
                <span v-else class="vital-empty">N/A</span>
              </div>

              <div class="vital-item">
                <span class="vital-label">Main Business Phone</span>
                <span class="vital-text">{{ lead.prospect.phone ?? 'N/A' }}</span>
              </div>

              <div class="vital-item full-width">
                <span class="vital-label">Physical Address</span>
                <span class="vital-text">{{ lead.prospect.address ?? 'N/A' }}</span>
              </div>
            </div>

            <!-- Embedded Google Map -->
            <div class="map-container">
              <iframe
                class="google-map-iframe"
                title="Google Map Preview"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                :src="googleMapsEmbedUrl"
              ></iframe>
            </div>
          </div>

          <!-- Technical Opportunity Deficit Rubric -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">Opportunity Deficit Rubric</h3>
              <span class="panel-badge-score">{{ lead.audit?.opportunity_score ?? 0 }} / 100</span>
            </div>

            <div class="deficit-factors-block">
              <ul class="factors-list">
                <li :class="{ active: !lead.audit?.ssl_active }">
                  <span class="factor-name">Missing / Inactive TLS/SSL Certificate</span>
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
                  <span class="factor-name">Active Cloud POS / Ordering Integration</span>
                  <span class="factor-pts">+15 pts (POS Integration SVC-POS)</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Sales Playbook: Pitch Scripts & Objection Handlers -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">Sales Outreach Playbook</h3>
              <span class="panel-count">{{ playbook?.scripts.length ?? 0 }} Scripts</span>
            </div>

            <div v-if="playbook && playbook.scripts.length > 0" class="playbook-scripts-list">
              <div
                v-for="(s, idx) in playbook.scripts"
                :key="s.service_code"
                class="script-card"
              >
                <div class="script-card-header">
                  <div class="script-service-tag">{{ s.service_name }}</div>
                  <button
                    type="button"
                    class="copy-script-btn"
                    @click="copyPitchScript(s.phone_pitch, idx)"
                  >
                    {{ copiedScriptIndex === idx ? '✓ Copied' : 'Copy Phone Pitch' }}
                  </button>
                </div>

                <p class="script-hook"><strong>Hook:</strong> {{ s.hook }}</p>

                <div class="script-block">
                  <div class="script-label">📞 30-Second Phone Pitch:</div>
                  <blockquote class="pitch-quote">{{ s.phone_pitch }}</blockquote>
                </div>

                <div class="script-block">
                  <div class="script-label">✉️ Email Outreach Template:</div>
                  <pre class="email-quote">{{ s.email_template }}</pre>
                </div>

                <div class="script-block">
                  <div class="script-label">🛡️ Gatekeeper Objection Handler:</div>
                  <div class="objection-text">{{ s.objection_handler }}</div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              No tailored sales scripts generated for this prospect.
            </div>
          </div>

          <!-- Aligned Service Offerings -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">Aligned Service Catalog Offerings</h3>
              <span class="panel-count">{{ matchingServices.length }} Matched</span>
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
              No service offerings matched this prospect's deficit profile.
            </div>
          </div>
        </section>

        <!-- COLUMN 2: Stakeholders, Outreach Logger & Timeline (58%) -->
        <section class="workspace-col col-right">
          <!-- Stakeholder Contacts Hub -->
          <div class="panel-card">
            <div class="panel-header">
              <div class="title-with-badge">
                <h3 class="panel-title">Stakeholder Contacts</h3>
                <span class="panel-count">{{ contacts.length }}</span>
              </div>
              <div class="panel-actions-row">
                <BaseButton
                  label="⚡ Discover Contacts"
                  variant="secondary"
                  :disabled="discoveringContacts"
                  @click="handleDiscoverContacts"
                />
                <BaseButton
                  label="+ Add Contact"
                  variant="secondary"
                  @click="openAddContact"
                />
              </div>
            </div>

            <div v-if="contacts.length > 0" class="contacts-grid">
              <div
                v-for="c in contacts"
                :key="c.id"
                class="contact-card"
                :class="{
                  'is-primary-card': c.is_primary,
                  'is-active-target': actContactId === c.id
                }"
                @click="actContactId = c.id"
              >
                <div class="contact-card-header">
                  <div class="contact-identity">
                    <strong class="contact-name">{{ c.name }}</strong>
                    <span class="contact-role">{{ c.role_title }}</span>
                  </div>
                  <div class="contact-badges-row">
                    <span v-if="c.is_primary" class="primary-badge">PRIMARY</span>
                    <button
                      type="button"
                      class="delete-contact-btn"
                      title="Remove contact"
                      @click.stop="handleDeleteContact(c.id)"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div class="contact-channels">
                  <span v-if="c.phone" class="channel-pill">📞 {{ c.phone }}</span>
                  <span v-if="c.email" class="channel-pill">✉️ {{ c.email }}</span>
                </div>
                <p v-if="c.notes" class="contact-notes-text">“{{ c.notes }}”</p>
                <div class="target-indicator">
                  {{ actContactId === c.id ? '✓ Selected as Outreach Target' : 'Click to Target' }}
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              No contacts recorded yet. Click "+ Add Contact" or "⚡ Discover Contacts" to populate stakeholders.
            </div>
          </div>

          <!-- Record Outreach & Schedule Appointment Form -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">Record Touchpoint / Schedule Appointment</h3>
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
                  <label class="form-label">Target Stakeholder Contact</label>
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
                <label class="form-label">Interaction Notes & Summary</label>
                <textarea
                  v-model="actSummary"
                  rows="3"
                  class="custom-textarea"
                  placeholder="Spoke with owner about mobile deficits and SSL warning. Agreed to 10-minute briefing..."
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
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">Interaction Timeline</h3>
              <span class="panel-count">{{ activities.length }} Activities</span>
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
        </section>
      </main>
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
.workspace-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 50;
  display: flex;
  justify-content: flex-end;
}

/* Expands across full dashboard width minus 260px vertical navigation rail */
.workspace-canvas {
  width: calc(100vw - 260px);
  max-width: calc(100vw - 260px);
  height: 100vh;
  background-color: var(--color-background, #090d16);
  border-left: 1px solid var(--color-border, #1e293b);
  display: flex;
  flex-direction: column;
  box-shadow: -6px 0 32px rgba(0, 0, 0, 0.6);
  animation: slideInWorkspace 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

@keyframes slideInWorkspace {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Header */
.workspace-header {
  padding: 1rem 1.75rem;
  border-bottom: 1px solid var(--color-border, #1e293b);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface, #0f172a);
  flex-shrink: 0;
}

.breadcrumbs-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
}

.pipeline-tag {
  font-weight: 600;
  color: var(--color-primary, #3b82f6);
}

.tracking-uid {
  font-family: monospace;
}

.title-status-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.workspace-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-text, #f1f5f9);
}

.score-pill-header {
  padding: 0.2rem 0.6rem;
  background-color: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #60a5fa;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted, #94a3b8);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--color-text, #f1f5f9);
}

/* Body: 2 Independent Columns */
.workspace-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: var(--color-background, #090d16);
}

.workspace-col {
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.col-left {
  width: 44%;
  border-right: 1px solid var(--color-border, #1e293b);
  background-color: rgba(15, 23, 42, 0.4);
}

.col-right {
  width: 56%;
  background-color: var(--color-background, #090d16);
}

/* Generic Panel Cards */
.panel-card {
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #1e293b);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text, #f1f5f9);
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-count {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  background-color: var(--color-surface-muted, #1e293b);
  border-radius: 9999px;
  color: var(--color-text-muted, #94a3b8);
  font-weight: 600;
}

.panel-action-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
}

.panel-action-link:hover {
  text-decoration: underline;
}

.panel-badge-score {
  font-size: 0.78rem;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.panel-actions-row {
  display: flex;
  gap: 0.5rem;
}

/* Vitals & Maps */
.meta-vitals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.vital-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.vital-item.full-width {
  grid-column: 1 / -1;
}

.vital-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-muted, #94a3b8);
}

.vital-text {
  font-size: 0.82rem;
  color: var(--color-text, #f1f5f9);
}

.website-link {
  font-size: 0.82rem;
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
  word-break: break-all;
}

.website-link:hover {
  text-decoration: underline;
}

.vital-empty {
  font-size: 0.82rem;
  color: var(--color-text-muted, #94a3b8);
  font-style: italic;
}

.map-container {
  width: 100%;
  height: 200px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--color-border, #1e293b);
  background-color: #0b1120;
}

.google-map-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Deficit Rubric */
.factors-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.factors-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0.75rem;
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  font-size: 0.75rem;
  opacity: 0.45;
}

.factors-list li.active {
  opacity: 1;
  border-color: rgba(239, 68, 68, 0.4);
  background-color: rgba(239, 68, 68, 0.08);
}

.factor-name {
  color: var(--color-text, #f1f5f9);
  font-weight: 500;
}

.factor-pts {
  color: #ef4444;
  font-weight: 600;
  font-size: 0.72rem;
}

/* Playbook Scripts */
.playbook-scripts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.script-card {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.script-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.script-service-tag {
  font-size: 0.78rem;
  font-weight: 700;
  color: #38bdf8;
}

.copy-script-btn {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  background-color: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 4px;
  color: #60a5fa;
  cursor: pointer;
  transition: all 0.15s ease;
}

.copy-script-btn:hover {
  background-color: rgba(59, 130, 246, 0.3);
}

.script-hook {
  margin: 0;
  font-size: 0.78rem;
  color: var(--color-text, #f1f5f9);
  line-height: 1.4;
}

.script-block {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.script-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-muted, #94a3b8);
}

.pitch-quote {
  margin: 0;
  padding: 0.6rem 0.75rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-left: 3px solid var(--color-primary, #3b82f6);
  border-radius: 0 4px 4px 0;
  font-size: 0.78rem;
  color: #e2e8f0;
  font-style: italic;
  line-height: 1.45;
}

.email-quote {
  margin: 0;
  padding: 0.6rem 0.75rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.72rem;
  color: #cbd5e1;
  white-space: pre-wrap;
  font-family: inherit;
  line-height: 1.4;
}

.objection-text {
  font-size: 0.75rem;
  color: #fbbf24;
  background-color: rgba(251, 191, 36, 0.08);
  padding: 0.5rem 0.65rem;
  border-radius: 4px;
  border-left: 3px solid #fbbf24;
  line-height: 1.4;
}

/* Service Offerings Fit */
.services-fit-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-fit-card {
  padding: 0.75rem;
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.service-fit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-code-text {
  font-size: 0.72rem;
  font-family: monospace;
  color: var(--color-text-muted, #94a3b8);
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

/* Stage Stepper Full-Width Header Strip */
.workspace-stepper-strip {
  width: 100%;
  background-color: var(--color-surface, #0f172a);
  border-bottom: 1px solid var(--color-border, #1e293b);
  padding: 0.75rem 2rem;
}

.stepper-strip-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.stepper-strip-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.stepper-meta-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted, #94a3b8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.active-stage-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary, #3b82f6);
  background-color: rgba(59, 130, 246, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.stage-stepper-bar {
  display: flex;
  flex: 1;
  max-width: 850px;
  gap: 0.5rem;
}

.stage-pill-step {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.6rem;
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.stage-pill-step:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--color-text, #f1f5f9);
}

.stage-pill-step.active {
  background-color: var(--color-primary, #3b82f6);
  border-color: var(--color-primary, #3b82f6);
  color: #ffffff;
}

.stage-pill-step.passed {
  background-color: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}

.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  font-size: 0.68rem;
}

/* Contacts Grid */
.contacts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.contact-card {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.contact-card:hover {
  border-color: var(--color-primary, #3b82f6);
}

.contact-card.is-active-target {
  border-color: #60a5fa;
  background-color: rgba(59, 130, 246, 0.08);
}

.contact-card.is-primary-card {
  border-left: 3px solid #10b981;
}

.contact-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.contact-identity {
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-size: 0.82rem;
  color: var(--color-text, #f1f5f9);
}

.contact-role {
  font-size: 0.72rem;
  color: var(--color-text-muted, #94a3b8);
}

.contact-badges-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.primary-badge {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.1rem 0.35rem;
  background-color: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-radius: 4px;
}

.delete-contact-btn {
  background: none;
  border: none;
  color: var(--color-text-muted, #94a3b8);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.1rem 0.25rem;
}

.delete-contact-btn:hover {
  color: #ef4444;
}

.contact-channels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.channel-pill {
  font-size: 0.7rem;
  color: var(--color-text-muted, #94a3b8);
}

.contact-notes-text {
  margin: 0;
  font-size: 0.7rem;
  color: #94a3b8;
  font-style: italic;
}

.target-indicator {
  margin-top: 0.25rem;
  font-size: 0.65rem;
  font-weight: 600;
  color: #60a5fa;
}

/* Activity Form */
.activity-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.flex-1 {
  flex: 1;
}

.form-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-muted, #94a3b8);
}

.custom-select,
.custom-datetime-input,
.custom-textarea {
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  color: var(--color-text, #f1f5f9);
  padding: 0.5rem 0.75rem;
  font-size: 0.78rem;
  outline: none;
  font-family: inherit;
}

.custom-select:focus,
.custom-datetime-input:focus,
.custom-textarea:focus {
  border-color: var(--color-primary, #3b82f6);
}

.field-hint {
  font-size: 0.68rem;
  color: var(--color-text-muted, #94a3b8);
}

.activity-submit-row {
  display: flex;
  justify-content: flex-end;
}

/* Activity Timeline */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.timeline-item {
  padding: 0.75rem 0.9rem;
  background-color: var(--color-surface-muted, #1e293b);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.timeline-item.appointment-item {
  border-left: 3px solid #8b5cf6;
  background-color: rgba(139, 92, 246, 0.06);
}

.timeline-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
}

.timeline-channel-tag {
  font-weight: 700;
  color: var(--color-primary, #3b82f6);
}

.timeline-contact-tag {
  color: var(--color-text, #f1f5f9);
}

.timeline-date {
  margin-left: auto;
  color: var(--color-text-muted, #94a3b8);
}

.appointment-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: #a78bfa;
}

.timeline-summary {
  margin: 0;
  font-size: 0.78rem;
  color: #cbd5e1;
  line-height: 1.4;
}

.empty-state {
  font-size: 0.75rem;
  color: var(--color-text-muted, #94a3b8);
  font-style: italic;
  padding: 0.5rem 0;
}

/* Modal form */
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

@media (max-width: 1200px) {
  .workspace-canvas {
    width: 100vw;
    max-width: 100vw;
  }
  .workspace-body {
    flex-direction: column;
    overflow-y: auto;
  }
  .col-left,
  .col-right {
    width: 100%;
    border-right: none;
    overflow-y: visible;
  }
}
</style>
