export type ProspectStatus =
  | 'PENDING'
  | 'AUDITED'
  | 'PURSUED'
  | 'ENRICHED'
  | 'QUALIFIED'
  | 'DISQUALIFIED'
  | 'SUPPRESSED'

export interface Prospect {
  id: string
  business_name: string
  website_url: string | null
  phone: string | null
  address: string | null
  source: string
  status: ProspectStatus
  disqualification_reason: string | null
  created_at: string
  updated_at: string
}

export interface AuditResult {
  id: string
  prospect_id: string
  target_url: string
  status_code: number | null
  response_time_ms: number | null
  ssl_active: boolean
  cms_detected: string | null
  mobile_viewport_present: boolean
  menu_format: string
  pdf_menu_count: number
  pos_integrations: string[]
  tel_link_present: boolean
  critical_issues: string[]
  opportunity_score: number
  audited_at: string
}

export interface RankedLead {
  prospect: Prospect
  audit: AuditResult | null
}

export interface CreateProspectPayload {
  business_name: string
  website_url?: string | null
  phone?: string | null
  address?: string | null
  source?: string
}

export interface DiscoverPayload {
  location: string
  limit?: number
}

export interface BatchAuditPayload {
  limit?: number
}

export interface BatchAuditResponse {
  audited_count: number
  failed_count: number
  results: AuditResult[]
}

export interface DisqualifyPayload {
  reason: string
  notes?: string
  suppress?: boolean
}

export interface ServiceCatalogItem {
  id: string
  code: string
  name: string
  description: string
  audit_parameters: string[]
  minimum_opportunity_score: number
  created_at: string
}

export interface ClientAccount {
  id: string
  source_lead_id: string
  business_name: string
  website_url: string | null
  state: 'onboarding' | 'active' | 'dormant'
  created_at: string
}
