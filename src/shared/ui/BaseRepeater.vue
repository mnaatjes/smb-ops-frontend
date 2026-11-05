<script setup lang="ts">
import BaseButton from './BaseButton.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    label?: string
    placeholder?: string
    addButtonLabel?: string
    removeButtonLabel?: string
    disabled?: boolean
    minItems?: number
    maxItems?: number
    error?: string | boolean
  }>(),
  {
    label: '',
    placeholder: 'Enter item...',
    addButtonLabel: 'Add Another',
    removeButtonLabel: 'Remove',
    disabled: false,
    minItems: 0,
    maxItems: Infinity,
    error: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'add', index: number): void
  (e: 'remove', index: number): void
}>()

function updateItem(index: number, val: string) {
  const updated = [...props.modelValue]
  updated[index] = val
  emit('update:modelValue', updated)
}

function handleAdd() {
  if (props.disabled || props.modelValue.length >= props.maxItems) return
  const updated = [...props.modelValue, '']
  emit('update:modelValue', updated)
  emit('add', updated.length - 1)
}

function handleRemove(index: number) {
  if (props.disabled || props.modelValue.length <= props.minItems) return
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
  emit('remove', index)
}
</script>

<template>
  <div class="base-repeater" :class="{ 'is-disabled': disabled }">
    <div v-if="label" class="repeater-header">
      <label class="repeater-label">{{ label }}</label>
      <span v-if="maxItems !== Infinity" class="item-counter">
        {{ modelValue.length }} / {{ maxItems }}
      </span>
    </div>

    <div v-if="modelValue.length === 0" class="empty-state">
      <slot name="empty">
        <p class="empty-text">No items added yet.</p>
      </slot>
    </div>

    <div v-else class="repeater-list">
      <div
        v-for="(item, index) in modelValue"
        :key="index"
        class="repeater-row"
        data-testid="repeater-row"
      >
        <div class="input-wrapper">
          <input
            type="text"
            :value="item"
            :placeholder="placeholder"
            :disabled="disabled"
            :class="['repeater-input', { 'input-error': Boolean(error) }]"
            data-testid="repeater-input"
            @input="updateItem(index, ($event.target as HTMLInputElement).value)"
          />
        </div>

        <button
          type="button"
          class="remove-button"
          :disabled="disabled || modelValue.length <= minItems"
          data-testid="remove-button"
          :aria-label="`${removeButtonLabel} item ${index + 1}`"
          @click="handleRemove(index)"
        >
          <svg
            class="remove-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 001.5.06l.3-7.5z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="remove-label">{{ removeButtonLabel }}</span>
        </button>
      </div>
    </div>

    <div class="repeater-footer">
      <BaseButton
        :label="addButtonLabel"
        variant="secondary"
        button-type="button"
        :disabled="disabled || modelValue.length >= maxItems"
        data-testid="add-button"
        @click="handleAdd"
      />
      <span v-if="typeof error === 'string' && error" class="repeater-error-msg">
        {{ error }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.base-repeater {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.repeater-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.repeater-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary, #94a3b8);
}

.item-counter {
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
  font-variant-numeric: tabular-nums;
}

.empty-state {
  padding: 0.85rem 1rem;
  border: 1px dashed var(--border-subtle, #334155);
  border-radius: 6px;
  background-color: var(--bg-surface-soft, rgba(30, 41, 59, 0.4));
  text-align: center;
}

.empty-text {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted, #64748b);
  font-style: italic;
}

.repeater-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.repeater-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-wrapper {
  flex: 1;
}

.repeater-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  background-color: var(--bg-surface, #1e293b);
  color: var(--text-primary, #f8fafc);
  border: 1px solid var(--border-color, #334155);
  border-radius: 6px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.repeater-input:focus {
  outline: none;
  border-color: var(--accent-primary, #3b82f6);
  box-shadow: 0 0 0 2px var(--accent-subtle, rgba(59, 130, 246, 0.2));
}

.repeater-input.input-error {
  border-color: var(--accent-danger, #ef4444);
}

.repeater-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--bg-surface-subtle, #0f172a);
}

.remove-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.48rem 0.75rem;
  background-color: transparent;
  color: var(--text-muted, #94a3b8);
  border: 1px solid var(--border-subtle, #334155);
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.remove-button:hover:not(:disabled) {
  background-color: rgba(239, 68, 68, 0.12);
  color: var(--accent-danger, #ef4444);
  border-color: rgba(239, 68, 68, 0.3);
}

.remove-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.remove-icon {
  width: 14px;
  height: 14px;
}

.remove-label {
  display: inline-block;
}

.repeater-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.repeater-error-msg {
  font-size: 0.75rem;
  color: var(--accent-danger, #ef4444);
}

.is-disabled {
  opacity: 0.75;
}
</style>
