<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ServiceCatalogItem } from '@/entities/lead/model'

const props = defineProps<{
  services: ServiceCatalogItem[]
  modelValue: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const isAllSelected = computed(() => props.modelValue.length === 0)

const labelText = computed(() => {
  if (props.modelValue.length === 0) {
    return 'All Services'
  }
  if (props.modelValue.length === 1) {
    const matched = props.services.find((s) => s.code === props.modelValue[0])
    return matched ? matched.name : props.modelValue[0]
  }
  return `${props.modelValue.length} Services Selected`
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectAll() {
  emit('update:modelValue', [])
}

function toggleService(code: string) {
  const current = [...props.modelValue]
  const idx = current.indexOf(code)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(code)
  }
  emit('update:modelValue', current)
}

function isServiceSelected(code: string): boolean {
  return props.modelValue.includes(code)
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="service-multiselect-dropdown">
    <label class="dropdown-label" for="service-select-btn">Service Focus:</label>
    <div class="dropdown-wrapper">
      <button
        id="service-select-btn"
        type="button"
        class="dropdown-trigger"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        @click="toggleDropdown"
      >
        <span class="trigger-text">{{ labelText }}</span>
        <svg
          class="chevron"
          :class="{ open: isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          width="16"
          height="16"
        >
          <path
            fill-rule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div v-if="isOpen" class="dropdown-popover" role="listbox">
        <div class="popover-actions">
          <button
            type="button"
            class="action-link"
            :class="{ active: isAllSelected }"
            @click="selectAll"
          >
            All Services (Default)
          </button>
          <button
            v-if="!isAllSelected"
            type="button"
            class="action-link text-muted"
            @click="selectAll"
          >
            Reset
          </button>
        </div>

        <div class="options-list">
          <label
            v-for="svc in services"
            :key="svc.code"
            class="option-item"
            :class="{ selected: isServiceSelected(svc.code) }"
          >
            <input
              type="checkbox"
              :checked="isServiceSelected(svc.code)"
              class="service-checkbox"
              @change="toggleService(svc.code)"
            />
            <div class="service-meta">
              <span class="service-name">{{ svc.name }}</span>
              <span v-if="svc.rank" class="service-rank">{{ svc.rank }}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-multiselect-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.dropdown-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  width: 260px;
  justify-content: space-between;
}

.dropdown-trigger:hover {
  background-color: var(--bg-surface-hover);
  border-color: var(--accent-primary);
}

.trigger-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  transition: transform 0.2s ease;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.chevron.open {
  transform: rotate(180deg);
}

.dropdown-popover {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  min-width: 280px;
  max-width: 400px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
}

.popover-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.75rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.action-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-primary);
  cursor: pointer;
}

.action-link:hover {
  text-decoration: underline;
}

.action-link.text-muted {
  color: var(--text-secondary);
}

.options-list {
  max-height: 240px;
  overflow-y: auto;
  padding: 0.3rem 0;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  user-select: none;
}

.option-item:hover {
  background-color: var(--bg-surface-hover);
}

.option-item.selected {
  background-color: var(--bg-surface-subtle);
}

.service-checkbox {
  margin-top: 0.2rem;
  cursor: pointer;
  accent-color: var(--accent-primary);
}

.service-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.service-name {
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.25;
}

.service-rank {
  font-size: 0.7rem;
  color: var(--text-secondary);
}
</style>
