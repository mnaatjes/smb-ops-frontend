<script setup lang="ts">
import ScoreBadge from './ScoreBadge.vue'
import IssueChips from './IssueChips.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import type { RankedLead } from '@/entities/lead/model'

defineProps<{
  leads: RankedLead[]
  loading?: boolean
}>()
</script>

<template>
  <div class="triage-table-wrapper">
    <div v-if="loading" class="table-overlay">Loading lead intelligence...</div>
    <table class="triage-table">
      <thead>
        <tr>
          <th>Business & Contact</th>
          <th>Status</th>
          <th>Opportunity Score</th>
          <th>Audited Findings & Tech</th>
          <th>Discovered / Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="leads.length === 0">
          <td colspan="5" class="empty-state">No leads available. Run discovery or add a lead manually.</td>
        </tr>
        <tr v-for="lead in leads" :key="lead.prospect.id" class="lead-row">
          <td class="cell-primary">
            <div class="business-name">{{ lead.prospect.business_name }}</div>
            <div v-if="lead.prospect.website_url" class="website-link">
              <a :href="lead.prospect.website_url" target="_blank" rel="noopener noreferrer">
                {{ lead.prospect.website_url }}
              </a>
            </div>
            <div v-if="lead.prospect.phone" class="sub-detail">
              📞 {{ lead.prospect.phone }}
            </div>
            <div v-if="lead.prospect.address" class="sub-detail">
              📍 {{ lead.prospect.address }}
            </div>
          </td>
          <td>
            <BaseBadge :variant="lead.prospect.status === 'AUDITED' ? 'primary' : 'neutral'">
              {{ lead.prospect.status }}
            </BaseBadge>
          </td>
          <td>
            <ScoreBadge :score="lead.audit?.opportunity_score" />
          </td>
          <td>
            <IssueChips :audit="lead.audit" />
          </td>
          <td class="cell-meta">
            <span class="source-tag">{{ lead.prospect.source }}</span>
            <span class="timestamp">{{ new Date(lead.prospect.created_at).toLocaleDateString() }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.triage-table-wrapper {
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow-x: auto;
}

.table-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #2563eb;
  z-index: 10;
}

.triage-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.triage-table th {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.triage-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.lead-row:hover {
  background-color: #f8fafc;
}

.business-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
}

.website-link a {
  color: #2563eb;
  text-decoration: none;
  font-size: 0.8rem;
  word-break: break-all;
}

.website-link a:hover {
  text-decoration: underline;
}

.sub-detail {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.15rem;
}

.cell-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.source-tag {
  font-weight: 500;
  color: #374151;
}

.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #9ca3af;
  font-style: italic;
}
</style>
