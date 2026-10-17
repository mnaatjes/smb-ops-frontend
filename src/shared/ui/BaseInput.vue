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
  color: #374151;
}

.base-input {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  color: #111827;
  outline: none;
  transition: border-color 0.15s ease-in-out;
}

.base-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.base-input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>
