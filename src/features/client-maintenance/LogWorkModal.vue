<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
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
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          id="log-work-minutes"
          v-model="minutesSpent"
          type="number"
          label="Minutes Spent *"
          placeholder="15"
          required
        />

        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider" for="log-work-category">
            Work Category *
          </label>
          <select
            id="log-work-category"
            v-model="entryType"
            class="w-full mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
          >
            <option value="retainer_maintenance" :disabled="hasActiveCarePlan === false">
              Monthly Retainer Maintenance
            </option>
            <option value="billable_extra">
              Billable Extra Hours (Out-of-Scope)
            </option>
            <option value="internal_overhead">
              Internal Non-Billable Overhead
            </option>
          </select>
        </div>
      </div>

      <div v-if="!hasActiveCarePlan" class="text-xs text-amber-400/90 bg-amber-400/10 border border-amber-400/30 rounded p-2.5">
        ℹ️ Client has no active care plan retainer. Work is categorized as billable extra or internal overhead.
      </div>

      <div class="space-y-1">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider" for="log-work-description">
          Work Description *
        </label>
        <textarea
          id="log-work-description"
          v-model="description"
          rows="3"
          placeholder="Details of triage, code adjustments, or patch deployment..."
          class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
        <BaseButton label="Save Entry" button-type="submit" :loading="isSaving" />
      </div>
    </form>
  </BaseModal>
</template>
