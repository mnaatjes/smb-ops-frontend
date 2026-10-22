<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | number
    label?: string
    placeholder?: string
    type?: string
    disabled?: boolean
    id?: string
    error?: string | boolean
  }>(),
  {
    type: 'text',
    disabled: false,
    label: '',
    placeholder: '',
    id: '',
    error: false
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
      :class="['base-input', { 'input-error': Boolean(error) }]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="typeof error === 'string' && error" class="input-error-msg">
      {{ error }}
    </span>
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

.base-input.input-error {
  border-color: #ef4444;
}

.base-input.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
}

.input-error-msg {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.15rem;
}

.base-input:disabled {
  background-color: var(--bg-surface-subtle);
  color: var(--text-muted);
  cursor: not-allowed;
}
</style>
