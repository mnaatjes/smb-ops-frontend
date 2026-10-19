<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import type { LogTimecardPayload } from '@/shared/types/lead'

defineProps<{
  show: boolean
  clientId: string
  clientName: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: LogTimecardPayload): void
}>()

const description = ref('')
const minutesSpent = ref<number>(15)
const entryType = ref<'retainer_maintenance' | 'billable_extra' | 'internal_non_billable'>('retainer_maintenance')
const author = ref('operator')
const errorMessage = ref<string | null>(null)

function handleSubmit(): void {
  errorMessage.value = null
  if (!description.value.trim()) {
    errorMessage.value = 'Task description cannot be empty'
    return
  }
  if (minutesSpent.value <= 0) {
    errorMessage.value = 'Minutes spent must be greater than zero'
    return
  }

  emit('submit', {
    description: description.value.trim(),
    minutes_spent: Number(minutesSpent.value),
    entry_type: entryType.value,
    author: author.value.trim() || 'operator'
  })

  description.value = ''
  minutesSpent.value = 15
  entryType.value = 'retainer_maintenance'
}
</script>

<template>
  <BaseModal
    :show="show"
    title="Log Maintenance Work"
    @close="emit('close')"
  >
    <div class="log-maintenance-form">
      <p class="modal-intro">
        Log support or maintenance minutes worked for
        <strong>{{ clientName }}</strong>.
      </p>

      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <div class="field-group">
        <label for="entry-type" class="field-label">Work Category *</label>
        <select id="entry-type" v-model="entryType" class="field-select">
          <option value="retainer_maintenance">Monthly Care Plan Check (Retainer)</option>
          <option value="billable_extra">Extra Billable Work (Invoice Line Item)</option>
          <option value="internal_non_billable">Internal / Non-Billable</option>
        </select>
      </div>

      <div class="field-group">
        <label for="task-desc" class="field-label">Task Description *</label>
        <textarea
          id="task-desc"
          v-model="description"
          rows="3"
          placeholder="e.g. Updated holiday business hours on footer & Google Maps sync"
          class="field-textarea"
        />
      </div>

      <div class="form-row">
        <div class="field-group half">
          <label for="minutes-spent" class="field-label">Minutes Spent *</label>
          <BaseInput
            id="minutes-spent"
            v-model.number="minutesSpent"
            type="number"
            min="1"
            placeholder="15"
          />
        </div>

        <div class="field-group half">
          <label for="author-field" class="field-label">Operator Handle</label>
          <BaseInput
            id="author-field"
            v-model="author"
            placeholder="operator"
          />
        </div>
      </div>


      <div class="modal-actions">
        <BaseButton label="Cancel" variant="secondary" @click="emit('close')" />
        <BaseButton label="Log Work Entry" variant="primary" @click="handleSubmit" />
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.log-maintenance-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-intro {
  font-size: 0.85rem;
  color: var(--color-text-muted, #94a3b8);
  margin: 0;
}

.error-banner {
  background-color: rgba(239, 68, 68, 0.15);
  color: var(--color-danger, #ef4444);
  border: 1px solid var(--color-danger, #ef4444);
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-group.half {
  flex: 1;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text, #f1f5f9);
}

.field-select {
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  color: var(--color-text, #f1f5f9);
  padding: 0.6rem 0.8rem;
  font-family: inherit;
  font-size: 0.85rem;
}

.field-select:focus {
  outline: none;
  border-color: var(--color-primary, #3b82f6);
}

.field-textarea {
  background-color: var(--color-surface, #0f172a);
  border: 1px solid var(--color-border, #334155);
  border-radius: 6px;
  color: var(--color-text, #f1f5f9);
  padding: 0.6rem 0.8rem;
  font-family: inherit;
  font-size: 0.85rem;
  resize: vertical;
}


.field-textarea:focus {
  outline: none;
  border-color: var(--color-primary, #3b82f6);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
