<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    id?: string
    error?: string | boolean
    required?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    rows: 3,
    disabled: false,
    id: '',
    error: false,
    required: false
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="base-textarea-group">
    <label v-if="label" :for="id" class="textarea-label">
      {{ label }}
      <span v-if="required" class="required-star">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      :class="['base-textarea', { 'textarea-error': Boolean(error) }]"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="typeof error === 'string' && error" class="textarea-error-msg">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.base-textarea-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.textarea-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.required-star {
  color: #ef4444;
}

.base-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  outline: none;
  resize: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background-color 0.15s ease-in-out;
}

.base-textarea:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--focus-ring);
}

.base-textarea.textarea-error {
  border-color: #ef4444;
}

.base-textarea.textarea-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
}

.textarea-error-msg {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.15rem;
}

.base-textarea:disabled {
  background-color: var(--bg-surface-subtle);
  color: var(--text-muted);
  cursor: not-allowed;
}
</style>
