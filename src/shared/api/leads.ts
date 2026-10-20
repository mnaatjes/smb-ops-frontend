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
  ClientAccount,
  ContractAgreement,
  AttachContractPayload,
  Timecard,
  TimecardEntry,
  ContinuityHealth,
  OnboardClientPayload,
  LogTimecardPayload,
  ClientSecretMetadata,
  ClientSecretPayload,
  ContactPerson,
  CreateContactPayload,
  OutreachActivity,
  CreateActivityPayload,
  OpportunityPlaybook
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
  const response = await apiClient.post<Prospect[]>('/leads/discover', payload, {
    timeout: 120000
  })
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

export async function onboardClientApi(payload: OnboardClientPayload): Promise<ClientAccount> {
  const response = await apiClient.post<ClientAccount>('/clients/onboard', payload)
  return response.data
}

export async function addClientContractApi(
  clientId: string,
  payload: AttachContractPayload
): Promise<ContractAgreement> {
  const response = await apiClient.post<ContractAgreement>(`/clients/${clientId}/contracts`, payload)
  return response.data
}

export async function fetchClients(): Promise<ClientAccount[]> {
  const response = await apiClient.get<ClientAccount[]>('/clients')
  return response.data
}

export async function fetchClientTimecard(clientId: string): Promise<Timecard> {
  const response = await apiClient.get<Timecard>(`/clients/${clientId}/timecard`)
  return response.data
}

export async function logClientTimecardWork(
  clientId: string,
  payload: LogTimecardPayload
): Promise<TimecardEntry> {
  const response = await apiClient.post<TimecardEntry>(`/clients/${clientId}/timecard/log`, payload)
  return response.data
}

export async function fetchClientContinuity(clientId: string): Promise<ContinuityHealth> {
  const response = await apiClient.get<ContinuityHealth>(`/clients/${clientId}/continuity`)
  return response.data
}

export async function pingClientContinuity(clientId: string): Promise<ContinuityHealth> {
  const response = await apiClient.post<ContinuityHealth>(`/clients/${clientId}/continuity/ping`)
  return response.data
}

export async function clearLeadsApi(): Promise<{ cleared_count: number; message: string }> {
  const response = await apiClient.delete<{ cleared_count: number; message: string }>('/leads')
  return response.data
}

export async function fetchClientSecrets(clientId: string): Promise<ClientSecretMetadata[]> {
  const response = await apiClient.get<ClientSecretMetadata[]>(`/clients/${clientId}/secrets`)
  return response.data
}

export async function storeClientSecret(
  clientId: string,
  payload: ClientSecretPayload
): Promise<ClientSecretMetadata> {
  const response = await apiClient.post<ClientSecretMetadata>(`/clients/${clientId}/secrets`, payload)
  return response.data
}

export async function revealClientSecret(
  clientId: string,
  secretId: string
): Promise<{ plaintext: string }> {
  const response = await apiClient.post<{ plaintext: string }>(
    `/clients/${clientId}/secrets/${secretId}/reveal`
  )
  return response.data
}

export async function deleteClientSecret(clientId: string, secretId: string): Promise<void> {
  await apiClient.delete(`/clients/${clientId}/secrets/${secretId}`)
}

export async function fetchLeadContacts(leadId: string): Promise<ContactPerson[]> {
  const response = await apiClient.get<ContactPerson[]>(`/leads/${leadId}/contacts`)
  return response.data
}

export async function createLeadContact(
  leadId: string,
  payload: CreateContactPayload
): Promise<ContactPerson> {
  const response = await apiClient.post<ContactPerson>(`/leads/${leadId}/contacts`, payload)
  return response.data
}

export async function deleteLeadContact(leadId: string, contactId: string): Promise<void> {
  await apiClient.delete(`/leads/${leadId}/contacts/${contactId}`)
}

export async function fetchLeadActivities(leadId: string): Promise<OutreachActivity[]> {
  const response = await apiClient.get<OutreachActivity[]>(`/leads/${leadId}/activities`)
  return response.data
}

export async function logLeadActivity(
  leadId: string,
  payload: CreateActivityPayload
): Promise<OutreachActivity> {
  const response = await apiClient.post<OutreachActivity>(`/leads/${leadId}/activities`, payload)
  return response.data
}

export async function updateLeadStage(leadId: string, stage: string): Promise<Prospect> {
  const response = await apiClient.patch<Prospect>(`/leads/${leadId}/stage`, { stage })
  return response.data
}

export async function fetchOpportunityPlaybook(leadId: string): Promise<OpportunityPlaybook> {
  const response = await apiClient.get<OpportunityPlaybook>(`/leads/${leadId}/playbook`)
  return response.data
}

export async function discoverLeadContacts(leadId: string): Promise<ContactPerson[]> {
  const response = await apiClient.post<ContactPerson[]>(`/leads/${leadId}/contacts/discover`)
  return response.data
}



