<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'
import type { LogTimecardPayload, TimecardEntryType } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    show: boolean
    clientName: string
    hasActiveCarePlan?: boolean
    isSaving?: boolean
  }>(),
  {
    hasActiveCarePlan: true,
    isSaving: false
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: LogTimecardPayload): void
}>()

const minutesSpent = ref<number>(15)
const entryType = ref<TimecardEntryType>(props.hasActiveCarePlan ? 'retainer_maintenance' : 'billable_extra')
const description = ref('')
const author = ref('lead_operator')

const modalTitle = computed(() => `Log Maintenance Work — ${props.clientName}`)

const categoryOptions = computed(() => [
  {
    value: 'retainer_maintenance',
    label: 'Monthly Retainer Maintenance',
    disabled: props.hasActiveCarePlan === false
  },
  {
    value: 'billable_extra',
    label: 'Billable Extra Hours (Out-of-Scope)'
  },
  {
    value: 'internal_overhead',
    label: 'Internal Non-Billable Overhead'
  }
])

function handleSubmit(): void {
  if (minutesSpent.value <= 0 || !description.value.trim()) return
  emit('save', {
    description: description.value.trim(),
    minutes_spent: minutesSpent.value,
    entry_type: entryType.value,
    author: author.value
  })
}
</script>

<template>
  <BaseModal :show="show" :title="modalTitle" @close="$emit('close')">
    <form id="log-work-form" class="modal-form-layout" @submit.prevent="handleSubmit">
      <div class="form-row-2col">
        <BaseInput
          id="log-work-minutes"
          v-model="minutesSpent"
          type="number"
          label="Minutes Spent *"
          placeholder="15"
          required
        />

        <BaseSelect
          id="log-work-category"
          v-model="entryType"
          label="Work Category *"
          :options="categoryOptions"
        />
      </div>

      <div v-if="!hasActiveCarePlan" class="careplan-notice">
        ℹ️ Client has no active care plan retainer. Work is categorized as billable extra or internal overhead.
      </div>

      <BaseTextarea
        id="log-work-description"
        v-model="description"
        label="Work Description"
        placeholder="Details of triage, code adjustments, or patch deployment..."
        :rows="3"
        required
      />
    </form>

    <template #footer>
      <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
      <BaseButton
        label="Save Entry"
        button-type="submit"
        form="log-work-form"
        :loading="isSaving"
      />
    </template>
  </BaseModal>
</template>

<style scoped>
.modal-form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.careplan-notice {
  font-size: 0.75rem;
  color: #d97706;
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  line-height: 1.4;
}
</style>
