<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true">
      <header class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button type="button" class="close-btn" @click="$emit('close')">&times;</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-card {
  background: var(--bg-surface);
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1.25rem;
  color: var(--text-primary);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 0.75rem 1.25rem;
  background-color: var(--bg-surface-hover);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}
</style>
