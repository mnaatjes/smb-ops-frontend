export type ProspectStatus =
  | 'PENDING'
  | 'AUDITED'
  | 'PURSUED'
  | 'ENRICHED'
  | 'QUALIFIED'
  | 'DISQUALIFIED'
  | 'SUPPRESSED'
  | 'pending'
  | 'audited'
  | 'pursued'
  | 'enriched'
  | 'qualified'
  | 'disqualified'
  | 'suppressed'

export interface Prospect {
  id: string
  business_name: string
  website_url: string | null
  phone: string | null
  address: string | null
  source: string
  status: ProspectStatus
  disqualification_reason: string | null
  opportunity_stage?: OpportunityStage | string | null
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
  auto_audit?: boolean
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

export interface AuditParameterOption {
  key: string
  label: string
  description: string
  collector_probe: string
}

export interface CreateServicePayload {
  code: string
  name: string
  description: string
  rank?: string
  pricing_model?: string
  price_min?: number
  price_max?: number
  target_profile?: string
  scope?: string[]
  deliverables?: string[]
  exclusions?: string[]
  audit_parameters: string[]
  minimum_opportunity_score?: number
}

export interface ServiceCatalogItem {
  id: string
  code: string
  name: string
  description: string
  rank?: string
  pricing_model?: string
  price_min?: number
  price_max?: number
  target_profile?: string
  scope?: string[]
  deliverables?: string[]
  exclusions?: string[]
  audit_parameters: string[]
  minimum_opportunity_score: number
  created_at: string
}

export interface ContractAgreement {
  id: string
  client_id: string
  service_code: string
  contract_type: 'retainer' | 'fixed_fee' | string
  billing_rate: number
  billing_frequency: string
  signature_document_url: string | null
  status: 'draft' | 'active' | 'cancelled' | 'completed' | string
  start_date: string
  renewal_date: string | null
  created_at: string
}

export type TimecardEntryType = 'retainer_maintenance' | 'billable_extra' | 'internal_non_billable'

export interface TimecardEntry {
  id: string
  timecard_id: string
  description: string
  minutes_spent: number
  entry_type?: TimecardEntryType
  performed_at: string
  author: string
}


export interface Timecard {
  id: string
  client_id: string
  contract_id: string | null
  billing_month: number
  billing_year: number
  total_minutes_logged: number
  monthly_retainer_cap_minutes: number
  out_of_scope_flag: boolean
  entries: TimecardEntry[]
}

export interface ContinuityHealth {
  id: string
  client_id: string
  ssl_monitored: boolean
  uptime_healthy: boolean
  last_backup_at: string | null
  backup_bucket: string
  last_ping_at: string
}

export interface ClientAccount {
  id: string
  source_lead_id: string
  business_name: string
  website_url: string | null
  primary_contact_name?: string | null
  primary_contact_email?: string | null
  phone?: string | null
  state: 'onboarding' | 'active' | 'dormant' | string
  contracts?: ContractAgreement[]
  created_at: string
  updated_at?: string
}

export interface OnboardClientPayload {
  lead_id: string
  contact_name: string
  contact_email: string
  contact_phone?: string | null
  service_codes?: string[]
  custom_scope_notes?: string | null
  secrets?: ClientSecretPayload[]
}

export interface LogTimecardPayload {
  description: string
  minutes_spent: number
  entry_type?: TimecardEntryType
  author?: string
}


export type SecretType =
  | 'wordpress_admin'
  | 'hosting_cpanel'
  | 'sftp_ssh'
  | 'dns_registrar'
  | 'database_direct'

export interface ClientSecretMetadata {
  id: string
  client_id: string
  secret_type: SecretType | string
  label: string
  username: string
  login_url?: string | null
  key_version: string
  created_at: string
  updated_at: string
}

export interface ClientSecretPayload {
  secret_type: SecretType | string
  label: string
  username: string
  password: string
  login_url?: string | null
}

export type OpportunityStage =
  | 'claimed'
  | 'contact_attempted'
  | 'engaged'
  | 'appointment_scheduled'
  | 'proposal_presented'
  | 'converted'
  | 'disqualified'

export type ActivityChannel =
  | 'phone_call'
  | 'voicemail'
  | 'email'
  | 'in_person_visit'
  | 'appointment'
  | 'note'

export interface ContactPerson {
  id: string
  lead_id: string
  name: string
  role_title: string
  phone?: string | null
  email?: string | null
  is_primary: boolean
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface CreateContactPayload {
  name: string
  role_title: string
  phone?: string | null
  email?: string | null
  is_primary?: boolean
  notes?: string | null
}

export interface OutreachActivity {
  id: string
  lead_id: string
  contact_id?: string | null
  channel: ActivityChannel | string
  summary: string
  scheduled_at?: string | null
  performed_by: string
  created_at: string
}

export interface CreateActivityPayload {
  channel: ActivityChannel | string
  summary: string
  contact_id?: string | null
  scheduled_at?: string | null
  performed_by?: string
}

export interface PlaybookScript {
  service_code: string
  service_name: string
  hook: string
  phone_pitch: string
  email_template: string
  objection_handler: string
}

export interface OpportunityPlaybook {
  lead_id: string
  business_name: string
  opportunity_score: number
  scripts: PlaybookScript[]
}


