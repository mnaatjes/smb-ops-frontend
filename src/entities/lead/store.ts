import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  RankedLead,
  CreateProspectPayload,
  DiscoverPayload,
  BatchAuditPayload
} from '@/entities/lead/model'
import {
  fetchRankedLeads,
  triggerLeadDiscovery,
  triggerBatchAudit,
  createProspect
} from '@/shared/api/leads'

export const useLeadStore = defineStore('lead', () => {
  const leads = ref<RankedLead[]>([])
  const minScore = ref<number>(0)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const statusMessage = ref<string | null>(null)

  const filteredLeads = computed(() => {
    return leads.value
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

  const totalLeadsCount = computed(() => leads.value.length)

  const auditedCount = computed(() => {
    return leads.value.filter((item) => item.audit !== null).length
  })

  const highPriorityCount = computed(() => {
    return leads.value.filter(
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

  function setMinScore(score: number): void {
    minScore.value = score
  }

  return {
    leads,
    minScore,
    loading,
    error,
    statusMessage,
    filteredLeads,
    totalLeadsCount,
    auditedCount,
    highPriorityCount,
    loadRankedLeads,
    discoverLeads,
    runBatchAudit,
    addManualLead,
    setMinScore
  }
})
