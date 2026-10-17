import { apiClient } from './client'
import type {
  RankedLead,
  Prospect,
  CreateProspectPayload,
  DiscoverPayload,
  BatchAuditPayload,
  BatchAuditResponse
} from '@/shared/types/lead'

export async function fetchRankedLeads(minScore = 0): Promise<RankedLead[]> {
  const response = await apiClient.get<RankedLead[]>('/leads/ranked', {
    params: { min_score: minScore }
  })
  return response.data
}

export async function triggerLeadDiscovery(payload: DiscoverPayload): Promise<Prospect[]> {
  const response = await apiClient.post<Prospect[]>('/leads/discover', payload)
  return response.data
}

export async function triggerBatchAudit(payload: BatchAuditPayload = {}): Promise<BatchAuditResponse> {
  const response = await apiClient.post<BatchAuditResponse>('/leads/audit', payload)
  return response.data
}

export async function createProspect(payload: CreateProspectPayload): Promise<Prospect> {
  const response = await apiClient.post<Prospect[]>('/leads', [payload])
  return response.data[0]
}
