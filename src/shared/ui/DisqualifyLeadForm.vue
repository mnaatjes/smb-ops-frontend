<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'

export interface DisqualifyLeadPayload {
  reason: string
  notes?: string
  suppress?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<DisqualifyLeadPayload>
    disabled?: boolean
    idPrefix?: string
  }>(),
  {
    modelValue: () => ({}),
    disabled: false,
    idPrefix: 'disqualify-lead'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', payload: DisqualifyLeadPayload): void
  (e: 'valid-change', isValid: boolean): void
  (e: 'submit', payload: DisqualifyLeadPayload): void
}>()

const reasonOptions = [
  { value: 'Out of Business', label: 'Out of Business' },
  { value: 'No Website Needed', label: 'No Website Needed' },
  { value: 'Enterprise / Non-SMB', label: 'Enterprise / Non-SMB' },
  { value: 'Invalid Phone / Address', label: 'Invalid Phone / Address' },
  { value: 'Other', label: 'Other (Specify in Notes)' }
]

const reason = ref(props.modelValue.reason || 'Out of Business')
const notes = ref(props.modelValue.notes || '')
const suppress = ref(props.modelValue.suppress || false)

const isValid = computed(() => {
  return reason.value.trim().length > 0
})

function getCurrentPayload(): DisqualifyLeadPayload {
  return {
    reason: reason.value.trim(),
    notes: notes.value.trim() ? notes.value.trim() : undefined,
    suppress: suppress.value
  }
}

watch([reason, notes, suppress], () => {
  emit('update:modelValue', getCurrentPayload())
})

watch(isValid, (newValid) => {
  emit('valid-change', newValid)
})

onMounted(() => {
  emit('valid-change', isValid.value)
})

function handleSubmit(): void {
  if (!isValid.value || props.disabled) return
  emit('submit', getCurrentPayload())
}

defineExpose({
  submit: handleSubmit,
  isValid
})
</script>

<template>
  <form :id="`${idPrefix}-form`" class="disqualify-lead-form modal-form-layout" @submit.prevent="handleSubmit">
    <BaseSelect
      :id="`${idPrefix}-reason`"
      v-model="reason"
      label="Disqualification Reason *"
      :options="reasonOptions"
      :disabled="disabled"
    />

    <BaseTextarea
      :id="`${idPrefix}-notes`"
      v-model="notes"
      label="Triage Notes / Context"
      placeholder="Provide optional rationale for triage archives..."
      :rows="3"
      :disabled="disabled"
    />

    <div class="checkbox-row">
      <label class="checkbox-label">
        <input
          :id="`${idPrefix}-suppress`"
          v-model="suppress"
          type="checkbox"
          :disabled="disabled"
          class="checkbox-input"
        >
        <span>Suppress future discovery for this domain / address</span>
      </label>
    </div>
  </form>
</template>

<style scoped>
.modal-form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.checkbox-row {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.checkbox-input {
  cursor: pointer;
  accent-color: var(--accent-primary);
}
</style>
