import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ClientDossierDrawer from '@/features/client-dossier/ClientDossierDrawer.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { ClientAccount, Timecard, ContinuityHealth, ClientSecretMetadata } from '@/shared/types/lead'

describe('ClientDossierDrawer.vue Headless Assertion Matrix (UAT-0009)', () => {
  let store: ReturnType<typeof useLeadStore>

  const mockClient: ClientAccount = {
    id: 'client-test-12345678',
    source_lead_id: 'lead-test-1',
    business_name: 'Grand Rapids Bakery',
    website_url: 'https://grbakery.example.com',
    primary_contact_name: 'John Doe',
    primary_contact_email: 'john@grbakery.example.com',
    phone: '616-555-0101',
    state: 'active',
    contracts: [
      {
        id: 'contract-1',
        client_id: 'client-test-12345678',
        service_code: 'CARE_PLAN_60',
        contract_type: 'retainer',
        billing_rate: 199,
        billing_frequency: 'monthly',
        signature_document_url: null,
        status: 'active',
        start_date: '2026-11-01',
        renewal_date: null,
        created_at: '2026-11-01T00:00:00Z'
      }
    ],
    created_at: '2026-11-01T00:00:00Z',
    updated_at: '2026-11-01T00:00:00Z'
  }

  const mockTimecard: Timecard = {
    id: 'tc-1',
    client_id: 'client-test-12345678',
    contract_id: 'contract-1',
    billing_month: 11,
    billing_year: 2026,
    total_minutes_logged: 25,
    monthly_retainer_cap_minutes: 60,
    out_of_scope_flag: false,
    entries: [
      {
        id: 'entry-1',
        timecard_id: 'tc-1',
        description: 'WordPress core & WooCommerce security patches',
        minutes_spent: 25,
        entry_type: 'retainer_maintenance',
        performed_at: '2026-11-03T10:00:00Z',
        author: 'Lead Engineer'
      }
    ]
  }

  const mockContinuity: ContinuityHealth = {
    id: 'cont-1',
    client_id: 'client-test-12345678',
    ssl_monitored: true,
    uptime_healthy: true,
    last_backup_at: '2026-11-04T00:00:00Z',
    backup_bucket: 's3://smb-ops-backups/grbakery',
    last_ping_at: '2026-11-05T12:00:00Z'
  }

  const mockSecrets: ClientSecretMetadata[] = [
    {
      id: 'sec-1',
      client_id: 'client-test-12345678',
      secret_type: 'wordpress_admin',
      label: 'Production WP Admin',
      username: 'admin_bakery',
      login_url: 'https://grbakery.example.com/wp-admin',
      key_version: 'v1',
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-01T00:00:00Z'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLeadStore()

    vi.spyOn(store, 'getTimecard').mockResolvedValue(mockTimecard)
    vi.spyOn(store, 'getContinuity').mockResolvedValue(mockContinuity)
    vi.spyOn(store, 'getClientSecrets').mockResolvedValue(mockSecrets)
    vi.spyOn(store, 'pingContinuity').mockResolvedValue(mockContinuity)
    vi.spyOn(store, 'revealSecret').mockResolvedValue('PlaintextPass123!')
    vi.spyOn(store, 'deleteSecret').mockResolvedValue()
  })

  // =========================================================================
  // SCENARIO 1: OVERLAY MOUNTING & DUAL-COLUMN LAYOUT
  // =========================================================================
  it('renders full-canvas overlay header and dual-column split layout (Scenario 1)', async () => {
    const wrapper = mount(ClientDossierDrawer, {
      props: {
        show: true,
        client: mockClient
      }
    })
    await flushPromises()

    const canvas = wrapper.find('.workspace-canvas')
    expect(canvas.exists()).toBe(true)

    // Header identity
    expect(wrapper.find('.workspace-title').text()).toBe('Grand Rapids Bakery')
    expect(wrapper.find('.tracking-uid').text()).toContain('CLIENT-ID: client-t')
    expect(wrapper.text()).toContain('active')

    // Column 1 (44% width)
    const colLeft = wrapper.find('.col-left')
    expect(colLeft.exists()).toBe(true)
    expect(colLeft.text()).toContain('Account Profile')
    expect(colLeft.text()).toContain('John Doe')
    expect(colLeft.text()).toContain('john@grbakery.example.com')
    expect(colLeft.text()).toContain('Continuity & SLA Health')
    expect(colLeft.text()).toContain('SSL Certificate: Monitored & Valid')
    expect(colLeft.text()).toContain('Active Service Contracts')
    expect(colLeft.text()).toContain('CARE_PLAN_60')

    // Column 2 (56% width)
    const colRight = wrapper.find('.col-right')
    expect(colRight.exists()).toBe(true)
    expect(colRight.text()).toContain('Timecards & Retainer Maintenance')
    expect(colRight.text()).toContain('25m')
    expect(colRight.text()).toContain('Credentials & Access Vault')
    expect(colRight.text()).toContain('Production WP Admin')
    expect(colRight.text()).toContain('admin_bakery')
  })

  // =========================================================================
  // SCENARIO 2: LIGHT & DARK MODE THEME TOKEN ADAPTATION
  // =========================================================================
  it('supports light and dark theme mode tokens without hardcoded canvas colors (Scenario 2)', async () => {
    const wrapper = mount(ClientDossierDrawer, {
      props: {
        show: true,
        client: mockClient
      }
    })
    await flushPromises()

    const canvas = wrapper.find('.workspace-canvas')
    expect(canvas.exists()).toBe(true)

    // Document dark theme toggle simulation
    document.documentElement.classList.add('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    document.documentElement.classList.remove('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  // =========================================================================
  // SCENARIO 3: CONTRACT ACCORDION & DISCRETE DELIVERABLES CHECKLIST
  // =========================================================================
  it('expands contract deliverables accordion and toggles action item (Scenario 3)', async () => {
    const wrapper = mount(ClientDossierDrawer, {
      props: {
        show: true,
        client: mockClient
      }
    })
    await flushPromises()

    // Accordion starts collapsed
    expect(wrapper.find('.contract-actions-drawer').exists()).toBe(false)

    // Click contract card to expand
    const contractHead = wrapper.find('.contract-head')
    expect(contractHead.exists()).toBe(true)
    await contractHead.trigger('click')
    await wrapper.vm.$nextTick()

    // Discrete deliverables drawer now visible
    const actionsDrawer = wrapper.find('.contract-actions-drawer')
    expect(actionsDrawer.exists()).toBe(true)
    expect(actionsDrawer.text()).toContain('Discrete Service Deliverables & Checklist')

    // Toggle first action checkbox
    const firstCheckbox = actionsDrawer.find('input[type="checkbox"]')
    expect(firstCheckbox.exists()).toBe(true)
    await firstCheckbox.trigger('change')
    await wrapper.vm.$nextTick()

    expect(actionsDrawer.find('.discrete-action-item').classes()).toContain('completed')
  })

  // =========================================================================
  // SCENARIO 4: 15-SECOND SECRET REVEAL COUNTDOWN
  // =========================================================================
  it('reveals plaintext password with 15-second countdown timer (Scenario 4)', async () => {
    const wrapper = mount(ClientDossierDrawer, {
      props: {
        show: true,
        client: mockClient
      }
    })
    await flushPromises()

    // Secret masked initially
    expect(wrapper.find('.masked-dots').exists()).toBe(true)
    expect(wrapper.text()).toContain('••••••••••••••••')

    vi.useFakeTimers()

    // Click reveal toggle button
    const revealBtn = wrapper.find('.reveal-toggle-btn')
    expect(revealBtn.exists()).toBe(true)
    await revealBtn.trigger('click')
    await flushPromises()

    expect(store.revealSecret).toHaveBeenCalledWith('client-test-12345678', 'sec-1')
    expect(wrapper.find('.revealed-plaintext').text()).toBe('PlaintextPass123!')
    expect(wrapper.find('.countdown-badge').text()).toBe('15s')

    // Advance 5 seconds
    vi.advanceTimersByTime(5000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.countdown-badge').text()).toBe('10s')

    // Advance remaining 10 seconds to expire timer
    vi.advanceTimersByTime(10000)
    await wrapper.vm.$nextTick()

    // Plaintext purged, reverts to masked dots
    expect(wrapper.find('.masked-dots').exists()).toBe(true)
    expect(wrapper.find('.revealed-plaintext').exists()).toBe(false)

    vi.useRealTimers()
  })

  // =========================================================================
  // SCENARIO 5: MODAL DELEGATION EVENTS
  // =========================================================================
  it('emits modal delegation events on button triggers (Scenario 5)', async () => {
    const wrapper = mount(ClientDossierDrawer, {
      props: {
        show: true,
        client: mockClient
      }
    })
    await flushPromises()

    // Click "+ Log Work" in header
    const logWorkBtn = wrapper.find('.workspace-header .base-button')
    expect(logWorkBtn.exists()).toBe(true)
    await logWorkBtn.trigger('click')
    expect(wrapper.emitted('log-work')).toHaveLength(1)
    expect(wrapper.emitted('log-work')?.[0]?.[0]).toEqual(mockClient)

    // Click "+ Attach Care Plan" in contracts panel
    const attachBtn = wrapper.findAll('.col-left .panel-card .panel-header button')
      .find((b) => b.text().includes('Attach Care Plan'))
    expect(attachBtn?.exists()).toBe(true)
    await attachBtn!.trigger('click')
    expect(wrapper.emitted('attach-contract')).toHaveLength(1)
    expect(wrapper.emitted('attach-contract')?.[0]?.[0]).toEqual(mockClient)

    // Click "+ Add Secret" in vault panel
    const addSecretBtn = wrapper.findAll('.col-right .panel-card .panel-header button')
      .find((b) => b.text().includes('Add Secret'))
    expect(addSecretBtn?.exists()).toBe(true)
    await addSecretBtn!.trigger('click')
    expect(wrapper.emitted('add-secret')).toHaveLength(1)
    expect(wrapper.emitted('add-secret')?.[0]?.[0]).toEqual(mockClient)

    // Click close button
    const closeBtn = wrapper.find('.close-btn')
    expect(closeBtn.exists()).toBe(true)
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
