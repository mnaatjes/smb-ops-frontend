import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  RankedLead,
  CreateProspectPayload,
  DiscoverPayload,
  BatchAuditPayload,
  DisqualifyPayload,
  ServiceCatalogItem,
  ClientAccount
} from '@/entities/lead/model'
import {
  fetchRankedLeads,
  triggerLeadDiscovery,
  triggerBatchAudit,
  createProspect,
  qualifyLead as apiQualifyLead,
  disqualifyLead as apiDisqualifyLead,
  pursueLead as apiPursueLead,
  suppressLead as apiSuppressLead,
  fetchServices as apiFetchServices,
  fetchClients as apiFetchClients,
  convertLeadToClient as apiConvertLeadToClient
} from '@/shared/api/leads'

export const useLeadStore = defineStore('lead', () => {
  const leads = ref<RankedLead[]>([])
  const services = ref<ServiceCatalogItem[]>([])
  const clients = ref<ClientAccount[]>([])
  const activeServiceFilter = ref<string | null>(null)
  const minScore = ref<number>(0)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const statusMessage = ref<string | null>(null)

  const poolLeads = computed(() => {
    return leads.value.filter(
      (l) => l.prospect.status !== 'PURSUED' && l.prospect.status !== 'SUPPRESSED'
    )
  })

  const pursuedLeads = computed(() => {
    return leads.value.filter((l) => l.prospect.status === 'PURSUED')
  })

  const filteredLeads = computed(() => {
    return poolLeads.value
      .filter((item) => {
        const score = item.audit ? item.audit.opportunity_score : 0
        return score >= minScore.value
      })
      .slice()
      .sort((a, b) => {
        const scoreA = a.audit ? a.audit.opportunity_score : -1
        const scoreB = b.audit ? b.audit.opportunity_score : -1
        return scoreB - scoreA
      })
  })

  const totalLeadsCount = computed(() => poolLeads.value.length)
  const pursuedCount = computed(() => pursuedLeads.value.length)
  const clientsCount = computed(() => clients.value.length)

  const auditedCount = computed(() => {
    return poolLeads.value.filter((item) => item.audit !== null).length
  })

  const highPriorityCount = computed(() => {
    return poolLeads.value.filter(
      (item) => item.audit !== null && item.audit.opportunity_score >= 70
    ).length
  })

  async function loadRankedLeads(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      leads.value = await fetchRankedLeads(0)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load leads'
    } finally {
      loading.value = false
    }
  }

  async function loadServices(): Promise<void> {
    try {
      services.value = await apiFetchServices()
    } catch (err: unknown) {
      console.warn('Could not load service catalog:', err)
    }
  }

  async function loadClients(): Promise<void> {
    try {
      clients.value = await apiFetchClients()
    } catch (err: unknown) {
      console.warn('Could not load clients:', err)
    }
  }

  async function discoverLeads(location: string, limit = 15): Promise<void> {
    loading.value = true
    error.value = null
    statusMessage.value = `Discovering leads for ${location}...`
    try {
      const payload: DiscoverPayload = { location, limit }
      const discovered = await triggerLeadDiscovery(payload)
      statusMessage.value = `Discovered ${discovered.length} prospects.`
      await loadRankedLeads()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Discovery failed'
      statusMessage.value = null
    } finally {
      loading.value = false
    }
  }

  async function runBatchAudit(limit = 15): Promise<void> {
    loading.value = true
    error.value = null
    statusMessage.value = `Running batch audit for up to ${limit} pending leads...`
    try {
      const payload: BatchAuditPayload = { limit }
      const res = await triggerBatchAudit(payload)
      statusMessage.value = `Audited ${res.audited_count} leads (${res.failed_count} failed).`
      await loadRankedLeads()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Audit batch failed'
      statusMessage.value = null
    } finally {
      loading.value = false
    }
  }

  async function addManualLead(payload: CreateProspectPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await createProspect(payload)
      statusMessage.value = `Added lead: ${payload.business_name}`
      await loadRankedLeads()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to add lead'
    } finally {
      loading.value = false
    }
  }

  async function qualifyLead(prospectId: string): Promise<void> {
    error.value = null
    try {
      await apiQualifyLead(prospectId)
      leads.value = leads.value.filter((item) => item.prospect.id !== prospectId)
      statusMessage.value = 'Lead marked QUALIFIED.'
    } catch (err: unknown) {
      leads.value = leads.value.filter((item) => item.prospect.id !== prospectId)
      statusMessage.value = 'Lead marked QUALIFIED (local).'
    }
  }

  async function disqualifyLead(prospectId: string, payload: DisqualifyPayload): Promise<void> {
    error.value = null
    try {
      await apiDisqualifyLead(prospectId, payload)
      leads.value = leads.value.filter((item) => item.prospect.id !== prospectId)
      statusMessage.value = `Lead marked DISQUALIFIED (${payload.reason}).`
    } catch (err: unknown) {
      leads.value = leads.value.filter((item) => item.prospect.id !== prospectId)
      statusMessage.value = `Lead marked DISQUALIFIED: ${payload.reason} (local).`
    }
  }

  async function pursueLead(prospectId: string): Promise<void> {
    error.value = null
    try {
      await apiPursueLead(prospectId)
      const lead = leads.value.find((l) => l.prospect.id === prospectId)
      if (lead) {
        lead.prospect.status = 'PURSUED'
      }
      statusMessage.value = 'Lead added to Pursued Pipeline. Contact enrichment enqueued.'
    } catch (err: unknown) {
      const lead = leads.value.find((l) => l.prospect.id === prospectId)
      if (lead) {
        lead.prospect.status = 'PURSUED'
      }
      statusMessage.value = 'Lead added to Pursued Pipeline (local).'
    }
  }

  async function suppressLead(prospectId: string): Promise<void> {
    error.value = null
    try {
      await apiSuppressLead(prospectId)
      leads.value = leads.value.filter((item) => item.prospect.id !== prospectId)
      statusMessage.value = 'Lead suppressed from future searches.'
    } catch (err: unknown) {
      leads.value = leads.value.filter((item) => item.prospect.id !== prospectId)
      statusMessage.value = 'Lead suppressed (local).'
    }
  }

  async function convertToClient(prospectId: string): Promise<void> {
    error.value = null
    try {
      const client = await apiConvertLeadToClient(prospectId)
      clients.value.push(client)
      leads.value = leads.value.filter((item) => item.prospect.id !== prospectId)
      statusMessage.value = `Lead converted to Client: ${client.business_name}!`
    } catch (err: unknown) {
      leads.value = leads.value.filter((item) => item.prospect.id !== prospectId)
      statusMessage.value = 'Lead converted to Client (local).'
    }
  }

  function setMinScore(score: number): void {
    minScore.value = score
  }

  return {
    leads,
    services,
    clients,
    activeServiceFilter,
    minScore,
    loading,
    error,
    statusMessage,
    poolLeads,
    pursuedLeads,
    filteredLeads,
    totalLeadsCount,
    pursuedCount,
    clientsCount,
    auditedCount,
    highPriorityCount,
    loadRankedLeads,
    loadServices,
    loadClients,
    discoverLeads,
    runBatchAudit,
    addManualLead,
    qualifyLead,
    disqualifyLead,
    pursueLead,
    suppressLead,
    convertToClient,
    setMinScore
  }
})
