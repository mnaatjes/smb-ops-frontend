<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLeadStore } from '@/entities/lead/store'
import DiscoveryBar from '@/features/lead-discovery/DiscoveryBar.vue'
import BatchAuditTrigger from '@/features/lead-audit/BatchAuditTrigger.vue'
import CreateLeadModal from '@/features/manual-lead/CreateLeadModal.vue'
import LeadTriageTable from '@/features/lead-triage/LeadTriageTable.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'

const leadStore = useLeadStore()
const showCreateModal = ref(false)

onMounted(async () => {
  await leadStore.loadRankedLeads()
})
</script>

<template>
  <main class="page-container">
    <header class="header">
      <div class="header-titles">
        <h1>SMB Lead Operations & Triage</h1>
        <p class="subtitle">Discovery, Technical Audit & High-Opportunity Lead Prioritization</p>
      </div>
      <div class="header-actions">
        <ThemeToggle />
        <BaseButton label="+ Add Lead" @click="showCreateModal = true" />
      </div>
    </header>

    <!-- Metrics Ribbon -->
    <section class="metrics-ribbon">
      <div class="metric-card">
        <span class="metric-label">Total Leads</span>
        <span class="metric-value">{{ leadStore.totalLeadsCount }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Audited Leads</span>
        <span class="metric-value">{{ leadStore.auditedCount }}</span>
      </div>
      <div class="metric-card metric-alert">
        <span class="metric-label">High Priority (Score &ge; 70)</span>
        <span class="metric-value">{{ leadStore.highPriorityCount }}</span>
      </div>
    </section>

    <!-- Operational Action Row -->
    <section class="actions-section">
      <DiscoveryBar class="discovery-flex" />
      <div class="batch-flex">
        <BatchAuditTrigger :limit="15" />
      </div>
    </section>

    <!-- Status / Notification Feedback -->
    <div v-if="leadStore.statusMessage" class="status-banner">
      {{ leadStore.statusMessage }}
    </div>
    <div v-if="leadStore.error" class="error-banner">
      {{ leadStore.error }}
    </div>

    <!-- Triage Filter Controls -->
    <section class="triage-controls">
      <div class="score-filter">
        <label for="score-threshold">Filter Min Opportunity Score:</label>
        <select
          id="score-threshold"
          :value="leadStore.minScore"
          class="score-select"
          @change="leadStore.setMinScore(Number(($event.target as HTMLSelectElement).value))"
        >
          <option :value="0">All Leads (0+)</option>
          <option :value="40">Moderate & High (&ge; 40)</option>
          <option :value="70">High Priority Only (&ge; 70)</option>
        </select>
      </div>
    </section>

    <!-- Ranked Lead Triage Table -->
    <section class="table-section">
      <LeadTriageTable :leads="leadStore.filteredLeads" :loading="leadStore.loading" />
    </section>

    <!-- Manual Create Lead Modal -->
    <CreateLeadModal :show="showCreateModal" @close="showCreateModal = false" />
  </main>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 1.5rem auto;
  padding: 0 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.header-titles h1 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.subtitle {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.metrics-ribbon {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background: var(--bg-surface);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.metric-alert {
  border-color: var(--metric-alert-border);
  background-color: var(--metric-alert-bg);
}

.metric-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 0.25rem;
}

.metric-alert .metric-value {
  color: var(--metric-alert-text);
}

.actions-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.discovery-flex {
  flex: 1;
  min-width: 320px;
}

.batch-flex {
  display: flex;
  align-items: center;
}

.status-banner {
  padding: 0.75rem 1rem;
  background-color: var(--banner-info-bg);
  border: 1px solid var(--banner-info-border);
  color: var(--banner-info-text);
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.error-banner {
  padding: 0.75rem 1rem;
  background-color: var(--banner-error-bg);
  border: 1px solid var(--banner-error-border);
  color: var(--banner-error-text);
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.triage-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
}

.score-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.score-select {
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.table-section {
  margin-bottom: 3rem;
}
</style>
