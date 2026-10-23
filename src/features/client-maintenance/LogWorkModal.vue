<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import LogWorkForm from '@/shared/ui/LogWorkForm.vue'
import type { LogTimecardPayload } from '@/shared/types/lead'

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

const isFormValid = ref(false)

const modalTitle = computed(() => `Log Maintenance Work — ${props.clientName}`)

function handleFormSubmit(payload: LogTimecardPayload): void {
  emit('save', payload)
}
</script>

<template>
  <BaseModal :show="show" :title="modalTitle" @close="$emit('close')">
    <LogWorkForm
      id-prefix="log-work-modal"
      :has-active-care-plan="hasActiveCarePlan"
      :disabled="isSaving"
      @valid-change="isFormValid = $event"
      @submit="handleFormSubmit"
    />

    <template #footer>
      <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
      <BaseButton
        label="Save Entry"
        button-type="submit"
        form="log-work-modal-form"
        :loading="isSaving"
        :disabled="!isFormValid || isSaving"
      />
    </template>
  </BaseModal>
</template>
