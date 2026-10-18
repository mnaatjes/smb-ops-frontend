<script setup lang="ts">
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'

defineProps<{
  activeTab: 'pool' | 'pipeline' | 'clients' | 'services' | 'doctrine'
  poolCount: number
  pursuedCount: number
  clientsCount: number
  servicesCount: number
  collapsed?: boolean
  mobileOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'selectTab', tab: 'pool' | 'pipeline' | 'clients' | 'services' | 'doctrine'): void
  (e: 'openAddLead'): void
  (e: 'toggleCollapse'): void
  (e: 'closeMobile'): void
}>()

function handleSelect(tab: 'pool' | 'pipeline' | 'clients' | 'services' | 'doctrine'): void {
  emit('selectTab', tab)
  emit('closeMobile')
}

function handleAddLead(): void {
  emit('openAddLead')
  emit('closeMobile')
}
</script>

<template>
  <div>
    <!-- Mobile Backdrop -->
    <div
      v-if="mobileOpen"
      class="mobile-backdrop"
      aria-label="Close navigation"
      @click="$emit('closeMobile')"
    />

    <aside
      :class="[
        'aside-nav-rail',
        { 'is-collapsed': collapsed, 'mobile-open': mobileOpen }
      ]"
    >
      <div class="rail-brand">
        <div class="brand-left">
          <span class="brand-icon">⚡</span>
          <span v-if="!collapsed" class="brand-text">SMB Ops</span>
        </div>
        <div class="brand-actions">
          <!-- Desktop/Tablet Collapse Toggle -->
          <button
            type="button"
            class="collapse-btn desktop-only"
            :title="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
            aria-label="Toggle rail collapse"
            @click="$emit('toggleCollapse')"
          >
            {{ collapsed ? '▶' : '◀' }}
          </button>
          <!-- Mobile Close Button -->
          <button
            type="button"
            class="close-btn mobile-only"
            aria-label="Close mobile navigation"
            @click="$emit('closeMobile')"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Primary Workspaces Section -->
      <div class="nav-section">
        <span v-if="!collapsed" class="section-title">Workspaces</span>
        <nav class="nav-links">
          <button
            type="button"
            :class="['nav-item', { active: activeTab === 'pool' }]"
            :title="collapsed ? `Discovery Pool (${poolCount})` : undefined"
            @click="handleSelect('pool')"
          >
            <span class="nav-icon">🔍</span>
            <span v-if="!collapsed" class="nav-label">Discovery Pool</span>
            <span class="nav-badge">{{ poolCount }}</span>
          </button>

          <button
            type="button"
            :class="['nav-item', { active: activeTab === 'pipeline' }]"
            :title="collapsed ? `Pursued Pipeline (${pursuedCount})` : undefined"
            @click="handleSelect('pipeline')"
          >
            <span class="nav-icon">🎯</span>
            <span v-if="!collapsed" class="nav-label">Pursued Pipeline</span>
            <span class="nav-badge">{{ pursuedCount }}</span>
          </button>

          <button
            type="button"
            :class="['nav-item', { active: activeTab === 'clients' }]"
            :title="collapsed ? `Client Accounts (${clientsCount})` : undefined"
            @click="handleSelect('clients')"
          >
            <span class="nav-icon">💼</span>
            <span v-if="!collapsed" class="nav-label">Client Accounts</span>
            <span class="nav-badge">{{ clientsCount }}</span>
          </button>
        </nav>
      </div>

      <!-- Administrative Meta-Processes Section -->
      <div class="nav-section">
        <span v-if="!collapsed" class="section-title">Administration</span>
        <nav class="nav-links">
          <button
            type="button"
            :class="['nav-item', { active: activeTab === 'services' }]"
            :title="collapsed ? `Service Catalog (${servicesCount})` : undefined"
            @click="handleSelect('services')"
          >
            <span class="nav-icon">📋</span>
            <span v-if="!collapsed" class="nav-label">Service Catalog</span>
            <span class="nav-badge">{{ servicesCount }}</span>
          </button>

          <button
            type="button"
            :class="['nav-item', { active: activeTab === 'doctrine' }]"
            :title="collapsed ? 'Business Doctrine' : undefined"
            @click="handleSelect('doctrine')"
          >
            <span class="nav-icon">📖</span>
            <span v-if="!collapsed" class="nav-label">Business Doctrine</span>
          </button>

          <button
            type="button"
            class="nav-item"
            :title="collapsed ? 'Add Lead Manually' : undefined"
            @click="handleAddLead"
          >
            <span class="nav-icon">➕</span>
            <span v-if="!collapsed" class="nav-label">Add Lead Manually</span>
          </button>
        </nav>
      </div>

      <div class="rail-footer">
        <ThemeToggle />
      </div>
    </aside>
  </div>
</template>

<style scoped>
.mobile-backdrop {
  display: none;
}

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
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              min-width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.2s ease,
              border-color 0.2s ease,
              transform 0.25s ease-out;
  z-index: 40;
}

/* Collapsed Icon-Only Rail */
.aside-nav-rail.is-collapsed {
  width: 68px;
  min-width: 68px;
  padding: 1.25rem 0.5rem;
}

.aside-nav-rail.is-collapsed .rail-brand {
  justify-content: center;
  padding: 0 0 0.5rem;
}

.aside-nav-rail.is-collapsed .nav-item {
  justify-content: center;
  padding: 0.65rem 0.4rem;
  position: relative;
}

.aside-nav-rail.is-collapsed .nav-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 0.65rem;
  padding: 0.05rem 0.3rem;
}

.rail-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0 0.5rem 0.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.brand-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-icon {
  font-size: 1.25rem;
}

.brand-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.brand-actions {
  display: flex;
  align-items: center;
}

.collapse-btn, .close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: all 0.15s ease;
}

.collapse-btn:hover, .close-btn:hover {
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
}

.mobile-only {
  display: none;
}

.desktop-only {
  display: block;
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
  font-size: 1.1rem;
  flex-shrink: 0;
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

/* Mobile Viewport Adaptation (< 768px) */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
    font-size: 1rem;
    padding: 0.35rem 0.6rem;
  }

  .mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }

  .aside-nav-rail {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    min-width: 280px;
    height: 100vh;
    z-index: 100;
    transform: translateX(-100%);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
  }

  .aside-nav-rail.mobile-open {
    transform: translateX(0);
  }
}
</style>
