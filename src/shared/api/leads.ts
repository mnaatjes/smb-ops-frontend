import { apiClient } from './client'
import type {
  RankedLead,
  Prospect,
  CreateProspectPayload,
  DiscoverPayload,
  BatchAuditPayload,
  BatchAuditResponse,
  DisqualifyPayload,
  CreateServicePayload,
  ServiceCatalogItem,
  AuditParameterOption,
  ClientAccount
} from '@/shared/types/lead'

export async function fetchRankedLeads(minScore = 0): Promise<RankedLead[]> {
  const response = await apiClient.get<RankedLead[] | { items: RankedLead[] }>('/leads/ranked', {
    params: { min_score: minScore }
  })
  if ('items' in response.data && Array.isArray(response.data.items)) {
    return response.data.items
  }
  return response.data as RankedLead[]
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
  const response = await apiClient.post<Prospect | Prospect[]>('/leads', payload)
  if (Array.isArray(response.data)) {
    return response.data[0]
  }
  return response.data
}

export async function qualifyLead(prospectId: string): Promise<Prospect> {
  const response = await apiClient.post<Prospect>(`/leads/${prospectId}/qualify`)
  return response.data
}

export async function disqualifyLead(
  prospectId: string,
  payload: DisqualifyPayload
): Promise<Prospect> {
  const response = await apiClient.post<Prospect>(`/leads/${prospectId}/disqualify`, payload)
  return response.data
}

export async function pursueLead(prospectId: string): Promise<Prospect> {
  const response = await apiClient.post<Prospect>(`/leads/${prospectId}/pursue`)
  return response.data
}

export async function suppressLead(prospectId: string): Promise<Prospect> {
  const response = await apiClient.post<Prospect>(`/leads/${prospectId}/suppress`)
  return response.data
}

export async function fetchServices(): Promise<ServiceCatalogItem[]> {
  const response = await apiClient.get<ServiceCatalogItem[]>('/services')
  return response.data
}

export async function fetchAuditParameters(): Promise<AuditParameterOption[]> {
  const response = await apiClient.get<AuditParameterOption[]>('/services/audit-parameters')
  return response.data
}

export async function createService(payload: CreateServicePayload): Promise<ServiceCatalogItem> {
  const response = await apiClient.post<ServiceCatalogItem>('/services', payload)
  return response.data
}

export async function convertLeadToClient(prospectId: string): Promise<ClientAccount> {
  const response = await apiClient.post<ClientAccount>(`/clients/convert/${prospectId}`)
  return response.data
}

export async function fetchClients(): Promise<ClientAccount[]> {
  const response = await apiClient.get<ClientAccount[]>('/clients')
  return response.data
}

export async function clearLeadsApi(): Promise<{ cleared_count: number; message: string }> {
  const response = await apiClient.delete<{ cleared_count: number; message: string }>('/leads')
  return response.data
}

