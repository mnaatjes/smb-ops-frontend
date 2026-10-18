<script setup lang="ts">
import { ref } from 'vue'
import ScoreBadge from './ScoreBadge.vue'
import IssueChips from './IssueChips.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { RankedLead } from '@/entities/lead/model'

defineProps<{
  leads: RankedLead[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'qualify', lead: RankedLead): void
  (e: 'disqualify', lead: RankedLead): void
  (e: 'inspectScore', lead: RankedLead): void
}>()

const pendingActionId = ref<string | null>(null)

function onQualify(lead: RankedLead): void {
  pendingActionId.value = lead.prospect.id
  emit('qualify', lead)
}

function onDisqualify(lead: RankedLead): void {
  emit('disqualify', lead)
}
</script>

<template>
  <div class="triage-table-wrapper">
    <div v-if="loading" class="table-overlay">Loading lead intelligence...</div>
    <table class="triage-table">
      <thead>
        <tr>
          <th>Business & Contact</th>
          <th>Opportunity Score</th>
          <th>Audited Findings & Tech</th>
          <th class="actions-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="leads.length === 0">
          <td colspan="4" class="empty-state">No leads available. Run discovery or add a lead manually.</td>
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
          <td class="cursor-pointer" @click="$emit('inspectScore', lead)">
            <ScoreBadge :score="lead.audit?.opportunity_score" />
          </td>
          <td>
            <IssueChips :audit="lead.audit" />
          </td>
          <td class="cell-actions">
            <div class="action-buttons">
              <BaseButton
                label="Qualify"
                variant="primary"
                :disabled="pendingActionId === lead.prospect.id"
                :loading="pendingActionId === lead.prospect.id"
                @click="onQualify(lead)"
              />
              <BaseButton
                label="Disqualify"
                variant="danger"
                :disabled="pendingActionId === lead.prospect.id"
                @click="onDisqualify(lead)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.triage-table-wrapper {
  position: relative;
  background: var(--bg-surface);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow-x: auto;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.table-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: var(--accent-hover);
  z-index: 10;
}

.triage-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.triage-table th {
  background-color: var(--bg-surface-hover);
  color: var(--text-secondary);
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.triage-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: top;
  color: var(--text-primary);
}

.lead-row:hover {
  background-color: var(--bg-surface-hover);
}

.business-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.website-link a {
  color: var(--accent-hover);
  text-decoration: none;
  font-size: 0.8rem;
  word-break: break-all;
}

.website-link a:hover {
  text-decoration: underline;
}

.sub-detail {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.cell-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.source-tag {
  font-weight: 500;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--text-muted);
  font-style: italic;
}

.actions-header {
  text-align: right;
  min-width: 170px;
}

.cell-actions {
  text-align: right;
  vertical-align: middle;
}

.action-buttons {
  display: inline-flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
