<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | number
    label?: string
    placeholder?: string
    type?: string
    disabled?: boolean
    id?: string
  }>(),
  {
    type: 'text',
    disabled: false,
    label: '',
    placeholder: '',
    id: ''
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="base-input-group">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="base-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.base-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.base-input {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background-color 0.15s ease-in-out;
}

.base-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--focus-ring);
}

.base-input:disabled {
  background-color: var(--bg-surface-subtle);
  color: var(--text-muted);
  cursor: not-allowed;
}
</style>
