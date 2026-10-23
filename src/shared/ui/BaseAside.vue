<script setup lang="ts">
withDefaults(
  defineProps<{
    collapsed?: boolean
    width?: string
    collapsedWidth?: string
    brandTitle?: string
    brandSubtitle?: string
  }>(),
  {
    collapsed: false,
    width: '240px',
    collapsedWidth: '64px',
    brandTitle: 'SMB Ops',
    brandSubtitle: 'Practice Engine'
  }
)

const emit = defineEmits<{
  (e: 'update:collapsed', val: boolean): void
  (e: 'toggle-collapse'): void
}>()

function toggle(): void {
  emit('toggle-collapse')
}
</script>

<template>
  <aside
    class="base-aside"
    :class="{ 'is-collapsed': collapsed }"
    :style="{ width: collapsed ? collapsedWidth : width }"
    aria-label="Application Navigation"
  >
    <!-- Brand / Header Slot -->
    <header class="aside-header">
      <slot name="header" :collapsed="collapsed">
        <div class="brand-cluster">
          <div class="brand-logo" aria-hidden="true">⚡</div>
          <div v-if="!collapsed" class="brand-text">
            <span class="brand-title">{{ brandTitle }}</span>
            <span class="brand-subtitle">{{ brandSubtitle }}</span>
          </div>
        </div>
      </slot>

      <!-- Collapse Toggle Button (Expanded Mode) -->
      <button
        v-if="!collapsed"
        type="button"
        class="collapse-toggle-btn"
        title="Collapse Sidebar"
        aria-label="Collapse Sidebar"
        @click="toggle"
      >
        <span class="toggle-icon">◀</span>
      </button>
    </header>

    <!-- Dedicated Expand Strip (Collapsed Mode - Never overlaps logo) -->
    <div v-if="collapsed" class="collapsed-expand-bar">
      <button
        type="button"
        class="expand-rail-btn"
        title="Expand Sidebar"
        aria-label="Expand Sidebar"
        @click="toggle"
      >
        <span class="toggle-icon">▶</span>
      </button>
    </div>

    <!-- Navigation Spine Slot -->
    <nav class="aside-nav-body">
      <slot :collapsed="collapsed" />
    </nav>

    <!-- Footer Controls Slot -->
    <footer v-if="$slots.footer" class="aside-footer">
      <slot name="footer" :collapsed="collapsed" />
    </footer>
  </aside>
</template>

<style scoped>
.base-aside {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-color);
  color: var(--text-primary);
  flex-shrink: 0;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  user-select: none;
}

.aside-header {
  height: 3.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.brand-cluster {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
}

.brand-logo {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background-color: var(--accent-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  white-space: nowrap;
}

.brand-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.collapse-toggle-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}

.collapse-toggle-btn:hover {
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
}

.toggle-icon {
  font-size: 0.65rem;
  line-height: 1;
}

/* Collapsed Header & Non-overlapping Expand Strip */
.is-collapsed .aside-header {
  padding: 0;
  justify-content: center;
}

.collapsed-expand-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-surface-subtle);
}

.expand-rail-btn {
  width: 1.75rem;
  height: 1.4rem;
  border-radius: 4px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.expand-rail-btn:hover {
  background-color: var(--accent-primary);
  color: #ffffff;
  border-color: var(--accent-primary);
}

.aside-nav-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  position: relative;
}

/* Allow tooltips to fly out freely over the adjacent stage canvas in collapsed mode */
.base-aside.is-collapsed {
  overflow: visible;
}

.base-aside.is-collapsed .aside-nav-body {
  overflow: visible;
}

/* Tooltip hints for collapsed rail buttons penetrating slotted items */
.is-collapsed :deep([data-tooltip]) {
  position: relative;
}

.is-collapsed :deep([data-tooltip])::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 0.65rem);
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--text-primary);
  color: var(--bg-surface);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.is-collapsed :deep([data-tooltip])::before {
  content: '';
  position: absolute;
  left: calc(100% + 0.35rem);
  top: 50%;
  transform: translateY(-50%);
  border-width: 4px 5px 4px 0;
  border-style: solid;
  border-color: transparent var(--text-primary) transparent transparent;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease;
  z-index: 1000;
}

.is-collapsed :deep([data-tooltip]:hover)::after,
.is-collapsed :deep([data-tooltip]:hover)::before {
  opacity: 1;
  visibility: visible;
}

.is-collapsed :deep([data-tooltip]:hover)::after {
  transform: translateY(-50%) translateX(2px);
}

.aside-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
