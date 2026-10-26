<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import BaseAside, { type NavSectionDef, type NavItemDef } from '@/shared/ui/BaseAside.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import { useLeadStore } from '@/entities/lead/store'

const router = useRouter()
const route = useRoute()
const leadStore = useLeadStore()

const STORAGE_KEY = 'smb_ops_rail_collapsed'

const isRailCollapsed = ref(false)
const isMobileOpen = ref(false)

// Hydrate collapsed state from localStorage
onMounted(() => {
  const savedState = localStorage.getItem(STORAGE_KEY)
  if (savedState !== null) {
    isRailCollapsed.value = savedState === 'true'
  } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
    isRailCollapsed.value = true
  }

  // Initial store hydration for badge telemetry
  leadStore.loadRankedLeads().catch(() => {})
  leadStore.loadServices().catch(() => {})
  leadStore.loadClients().catch(() => {})

  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && isMobileOpen.value) {
    isMobileOpen.value = false
  }
}

function handleToggleCollapse(): void {
  isRailCollapsed.value = !isRailCollapsed.value
  localStorage.setItem(STORAGE_KEY, String(isRailCollapsed.value))
}

function handleSelectItem(item: NavItemDef): void {
  if (item.to && route.path !== item.to) {
    router.push(item.to)
  }
  if (isMobileOpen.value) {
    isMobileOpen.value = false
  }
}

// 3-Tier Data-Driven Navigation Taxonomy per SDD-0014
const navSections = computed<NavSectionDef[]>(() => [
  {
    id: 'primary-funnel',
    tier: 'primary',
    title: 'Core Funnel',
    items: [
      {
        id: 'leads',
        label: 'Leads',
        icon: '🔍',
        to: '/leads',
        badge: leadStore.totalLeadsCount,
        badgeVariant: 'primary'
      },
      {
        id: 'pursued',
        label: 'Pursued',
        icon: '🎯',
        to: '/pursued',
        badge: leadStore.pursuedCount,
        badgeVariant: 'warning'
      },
      {
        id: 'accounts',
        label: 'Accounts',
        icon: '💼',
        to: '/clients',
        badge: leadStore.clientsCount,
        badgeVariant: 'emerald'
      }
    ]
  },
  {
    id: 'secondary-catalogs',
    tier: 'secondary',
    title: 'Catalogs',
    items: [
      {
        id: 'services',
        label: 'Service Catalog',
        icon: '📋',
        to: '/services'
      },
      {
        id: 'addons',
        label: 'Add-ons & Subs',
        icon: '📦',
        to: '/addons'
      }
    ]
  },
  {
    id: 'tertiary-tools',
    tier: 'tertiary',
    title: 'Doctrine & Tools',
    items: [
      {
        id: 'doctrine',
        label: 'Business Doctrine',
        icon: '📖',
        to: '/doctrine'
      }
    ]
  }
])

const activeRouteId = computed<string>(() => {
  const path = route.path
  if (path === '/' || path.startsWith('/leads')) return 'leads'
  if (path.startsWith('/pursued')) return 'pursued'
  if (path.startsWith('/clients')) return 'accounts'
  if (path.startsWith('/services')) return 'services'
  if (path.startsWith('/addons')) return 'addons'
  if (path.startsWith('/doctrine')) return 'doctrine'
  return ''
})
</script>

<template>
  <div class="base-site-shell">
    <!-- Mobile Top Header (< 768px) -->
    <header class="mobile-app-bar" aria-label="Mobile Navigation Bar">
      <button
        type="button"
        class="mobile-hamburger-btn"
        aria-label="Open Navigation Menu"
        @click="isMobileOpen = true"
      >
        <span class="hamburger-icon" aria-hidden="true">☰</span>
      </button>

      <div class="mobile-brand">
        <span class="brand-logo" aria-hidden="true">⚡</span>
        <span class="brand-title">SMB Ops</span>
      </div>

      <div class="mobile-actions">
        <ThemeToggle />
      </div>
    </header>

    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileOpen"
      class="mobile-backdrop"
      aria-label="Close Navigation Menu"
      @click="isMobileOpen = false"
    />

    <!-- Navigation Boundary (BaseAside.vue) -->
    <div
      class="aside-viewport-boundary"
      :class="{ 'mobile-open': isMobileOpen }"
    >
      <BaseAside
        :collapsed="isRailCollapsed"
        :sections="navSections"
        :active-id="activeRouteId"
        brand-title="SMB Ops"
        brand-subtitle="Practice Engine"
        @toggle-collapse="handleToggleCollapse"
        @select-item="handleSelectItem"
      >
        <template #footer="{ collapsed }">
          <div class="aside-footer-cluster">
            <span v-if="!collapsed" class="build-version-tag">v1.2.0 • Active</span>
            <ThemeToggle />
          </div>
        </template>
      </BaseAside>
    </div>

    <!-- Main Stage Viewport (Hosts pure page containers) -->
    <div class="main-stage-viewport">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.base-site-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-app);
  color: var(--text-primary);
  position: relative;
}

/* Mobile App Bar */
.mobile-app-bar {
  display: none;
  height: 3.5rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;
}

.mobile-hamburger-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-brand .brand-logo {
  font-size: 1.1rem;
}

.mobile-brand .brand-title {
  font-weight: 800;
  font-size: 1rem;
}

.mobile-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 80;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Aside Boundary */
.aside-viewport-boundary {
  display: flex;
  height: 100%;
  flex-shrink: 0;
  z-index: 60;
}

.aside-footer-cluster {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.build-version-tag {
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

/* Main Stage Viewport */
.main-stage-viewport {
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Mobile Responsive Adaptation (< 768px) */
@media (max-width: 767px) {
  .mobile-app-bar {
    display: flex;
  }

  .mobile-backdrop {
    display: block;
  }

  .aside-viewport-boundary {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 90;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .aside-viewport-boundary.mobile-open {
    transform: translateX(0);
  }

  .main-stage-viewport {
    padding-top: 3.5rem;
    height: 100vh;
  }
}
</style>
