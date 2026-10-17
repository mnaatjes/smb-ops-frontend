<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { RankedLead } from '@/entities/lead/model'

defineProps<{
  show: boolean
  lead: RankedLead | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', payload: { reason: string; notes?: string }): void
}>()

const reason = ref<string>('')
const notes = ref<string>('')
const isSubmitting = ref<boolean>(false)

const reasons = [
  'Out of Business',
  'No Website Needed',
  'Enterprise / Non-SMB',
  'Invalid Phone / Address',
  'Other'
]

const canSubmit = computed(() => {
  return reason.value.trim().length > 0 && !isSubmitting.value
})

function handleClose(): void {
  reason.value = ''
  notes.value = ''
  isSubmitting.value = false
  emit('close')
}

function handleConfirm(): void {
  if (!canSubmit.value) return
  isSubmitting.value = true
  emit('confirm', {
    reason: reason.value,
    notes: notes.value ? notes.value.trim() : undefined
  })
  handleClose()
}
</script>

<template>
  <BaseModal :show="show" :title="`Disqualify Lead: ${lead?.prospect.business_name || ''}`" @close="handleClose">
    <div class="disqualify-form">
      <p class="description">
        Please specify why this prospect is being disqualified from active triage.
      </p>

      <div class="form-group">
        <label for="disqualify-reason" class="form-label">
          Disqualification Reason <span class="required">*</span>
        </label>
        <select id="disqualify-reason" v-model="reason" class="form-select">
          <option value="" disabled>Select a reason...</option>
          <option v-for="r in reasons" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="disqualify-notes" class="form-label">Internal Notes (Optional)</label>
        <textarea
          id="disqualify-notes"
          v-model="notes"
          rows="3"
          class="form-textarea"
          placeholder="Additional context or verification findings..."
        ></textarea>
      </div>
    </div>

    <template #footer>
      <BaseButton label="Cancel" variant="secondary" @click="handleClose" />
      <BaseButton
        label="Confirm Disqualify"
        variant="danger"
        :disabled="!canSubmit"
        :loading="isSubmitting"
        @click="handleConfirm"
      />
    </template>
  </BaseModal>
</template>

<style scoped>
.disqualify-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.required {
  color: var(--accent-danger, #ef4444);
}

.form-select,
.form-textarea {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-select:focus,
.form-textarea:focus {
  border-color: var(--accent-primary);
}

.form-textarea {
  resize: vertical;
}
</style>
