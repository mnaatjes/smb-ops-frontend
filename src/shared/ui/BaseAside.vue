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

      <!-- Collapse Toggle Button -->
      <button
        type="button"
        class="collapse-toggle-btn"
        :title="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        :aria-label="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        @click="toggle"
      >
        <span class="toggle-icon">{{ collapsed ? '▶' : '◀' }}</span>
      </button>
    </header>

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

.is-collapsed .aside-header {
  padding: 0 0.75rem;
  justify-content: center;
  position: relative;
}

.is-collapsed .collapse-toggle-btn {
  display: none;
}

.is-collapsed:hover .collapse-toggle-btn {
  display: flex;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.aside-nav-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
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
