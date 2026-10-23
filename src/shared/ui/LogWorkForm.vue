<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'
import type { LogTimecardPayload, TimecardEntryType } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    hasActiveCarePlan?: boolean
    initialMinutes?: number
    initialEntryType?: TimecardEntryType
    initialDescription?: string
    author?: string
    disabled?: boolean
    idPrefix?: string
  }>(),
  {
    hasActiveCarePlan: true,
    initialMinutes: 15,
    initialEntryType: undefined,
    initialDescription: '',
    author: 'lead_operator',
    disabled: false,
    idPrefix: 'log-work'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', payload: LogTimecardPayload): void
  (e: 'valid-change', isValid: boolean): void
  (e: 'submit', payload: LogTimecardPayload): void
}>()

const minutesSpent = ref<number>(props.initialMinutes)
const entryType = ref<TimecardEntryType>(
  props.initialEntryType || (props.hasActiveCarePlan ? 'retainer_maintenance' : 'billable_extra')
)
const description = ref(props.initialDescription)

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

const isValid = computed(() => {
  return Boolean(minutesSpent.value > 0 && description.value.trim().length > 0)
})

function getCurrentPayload(): LogTimecardPayload {
  return {
    description: description.value.trim(),
    minutes_spent: minutesSpent.value,
    entry_type: entryType.value,
    author: props.author
  }
}

watch([minutesSpent, entryType, description], () => {
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
  <form :id="`${idPrefix}-form`" class="log-work-form modal-form-layout" @submit.prevent="handleSubmit">
    <div class="form-row-2col">
      <BaseInput
        :id="`${idPrefix}-minutes`"
        v-model="minutesSpent"
        type="number"
        label="Minutes Spent *"
        placeholder="15"
        :disabled="disabled"
        required
      />

      <BaseSelect
        :id="`${idPrefix}-category`"
        v-model="entryType"
        label="Work Category *"
        :options="categoryOptions"
        :disabled="disabled"
      />
    </div>

    <div v-if="!hasActiveCarePlan" class="careplan-notice">
      ℹ️ Client has no active care plan retainer. Work is categorized as billable extra or internal overhead.
    </div>

    <BaseTextarea
      :id="`${idPrefix}-description`"
      v-model="description"
      label="Work Description *"
      placeholder="Details of triage, code adjustments, or patch deployment..."
      :rows="3"
      :disabled="disabled"
      required
    />
  </form>
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
