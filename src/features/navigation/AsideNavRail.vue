<script setup lang="ts">
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'

defineProps<{
  activeTab: 'pool' | 'pipeline' | 'clients'
  poolCount: number
  pursuedCount: number
  clientsCount: number
}>()

defineEmits<{
  (e: 'selectTab', tab: 'pool' | 'pipeline' | 'clients'): void
  (e: 'openServiceCatalog'): void
  (e: 'openAddLead'): void
}>()
</script>

<template>
  <aside class="aside-nav-rail">
    <div class="rail-brand">
      <span class="brand-icon">⚡</span>
      <span class="brand-text">SMB Ops</span>
    </div>

    <!-- Primary Workspaces Section -->
    <div class="nav-section">
      <span class="section-title">Workspaces</span>
      <nav class="nav-links">
        <button
          type="button"
          :class="['nav-item', { active: activeTab === 'pool' }]"
          @click="$emit('selectTab', 'pool')"
        >
          <span class="nav-icon">🔍</span>
          <span class="nav-label">Discovery Pool</span>
          <span class="nav-badge">{{ poolCount }}</span>
        </button>

        <button
          type="button"
          :class="['nav-item', { active: activeTab === 'pipeline' }]"
          @click="$emit('selectTab', 'pipeline')"
        >
          <span class="nav-icon">🎯</span>
          <span class="nav-label">Pursued Pipeline</span>
          <span class="nav-badge">{{ pursuedCount }}</span>
        </button>

        <button
          type="button"
          :class="['nav-item', { active: activeTab === 'clients' }]"
          @click="$emit('selectTab', 'clients')"
        >
          <span class="nav-icon">💼</span>
          <span class="nav-label">Client Accounts</span>
          <span class="nav-badge">{{ clientsCount }}</span>
        </button>
      </nav>
    </div>

    <!-- Administrative Meta-Processes Section -->
    <div class="nav-section">
      <span class="section-title">Administration</span>
      <nav class="nav-links">
        <button
          type="button"
          class="nav-item"
          @click="$emit('openServiceCatalog')"
        >
          <span class="nav-icon">📋</span>
          <span class="nav-label">Service Catalog</span>
        </button>

        <button
          type="button"
          class="nav-item"
          @click="$emit('openAddLead')"
        >
          <span class="nav-icon">➕</span>
          <span class="nav-label">Add Lead Manually</span>
        </button>
      </nav>
    </div>

    <div class="rail-footer">
      <ThemeToggle />
    </div>
  </aside>
</template>

<style scoped>
.aside-nav-rail {
  width: 240px;
  min-width: 240px;
  height: 100vh;
  position: sticky;
  top: 0;
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-color);
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.rail-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0 0.5rem 0.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.brand-icon {
  font-size: 1.25rem;
}

.brand-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  padding: 0 0.5rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.65rem;
  border-radius: 6px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  width: 100%;
}

.nav-item:hover {
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: var(--bg-surface-hover);
  color: var(--accent-primary);
  font-weight: 600;
}

.nav-icon {
  font-size: 1rem;
}

.nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-badge {
  font-size: 0.75rem;
  background: var(--border-subtle);
  color: var(--text-secondary);
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;
  font-weight: 600;
}

.nav-item.active .nav-badge {
  background: var(--accent-primary);
  color: white;
}

.rail-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-start;
  padding-left: 0.5rem;
}
</style>
