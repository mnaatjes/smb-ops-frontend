<script setup lang="ts">
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    modelValue: string | number
    label?: string
    id?: string
    disabled?: boolean
    error?: string | boolean
    options?: SelectOption[]
  }>(),
  {
    label: '',
    id: '',
    disabled: false,
    error: false,
    options: () => []
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()
</script>

<template>
  <div class="base-select-group">
    <label v-if="label" :for="id" class="select-label">{{ label }}</label>
    <div class="select-wrapper">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :class="['base-select', { 'select-error': Boolean(error) }]"
        @change="
          $emit('update:modelValue', ($event.target as HTMLSelectElement).value);
          $emit('change', ($event.target as HTMLSelectElement).value)
        "
      >
        <slot>
          <option
            v-for="opt in options"
            :key="opt.value"
            :value="opt.value"
            :disabled="opt.disabled"
          >
            {{ opt.label }}
          </option>
        </slot>
      </select>
      <svg
        class="select-chevron"
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
    </div>
    <span v-if="typeof error === 'string' && error" class="select-error-msg">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.base-select-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.select-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.select-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.base-select {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background-color 0.15s ease-in-out;
}

.base-select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--focus-ring);
}

.base-select.select-error {
  border-color: #ef4444;
}

.base-select.select-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
}

.select-chevron {
  position: absolute;
  right: 0.75rem;
  pointer-events: none;
  color: var(--text-muted);
}

.select-error-msg {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.15rem;
}

.base-select:disabled {
  background-color: var(--bg-surface-subtle);
  color: var(--text-muted);
  cursor: not-allowed;
}
</style>
