<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    subtitle?: string
    asideWidth?: string
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    asideWidth: '240px'
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

watch(
  () => props.show,
  (isOpen) => {
    if (typeof window === 'undefined') return
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="base-drawer-overlay"
      :style="{ left: asideWidth, width: `calc(100vw - ${asideWidth})` }"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop Dimmer over Dashboard Stage -->
      <div class="drawer-backdrop" @click="emit('close')" />

      <!-- Drawer Content Canvas translating from right -->
      <section class="drawer-canvas">
        <header class="drawer-header">
          <slot name="header">
            <div class="header-titles">
              <h2 v-if="title" class="drawer-title">{{ title }}</h2>
              <p v-if="subtitle" class="drawer-subtitle">{{ subtitle }}</p>
            </div>
          </slot>

          <button
            type="button"
            class="drawer-close-btn"
            title="Close Drawer (Esc)"
            aria-label="Close Drawer (Esc)"
            @click="emit('close')"
          >
            ✕
          </button>
        </header>

        <div class="drawer-body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="drawer-footer">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.base-drawer-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 45;
  display: flex;
  justify-content: flex-end;
  pointer-events: none;
}

.drawer-backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  pointer-events: auto;
  animation: fadeIn 0.2s ease-out;
}

.drawer-canvas {
  position: relative;
  width: 100%;
  max-width: 680px;
  height: 100%;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border-left: 1px solid var(--border-color);
  box-shadow: -8px 0 24px -4px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.drawer-header {
  height: 4rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background-color: var(--bg-surface);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.drawer-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
}

.drawer-subtitle {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}

.drawer-close-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.drawer-close-btn:hover {
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.drawer-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  background-color: var(--bg-surface-subtle);
  flex-shrink: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideLeft {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
