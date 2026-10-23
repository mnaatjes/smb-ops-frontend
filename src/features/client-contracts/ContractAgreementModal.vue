<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import ContractAgreementForm from '@/shared/ui/ContractAgreementForm.vue'
import type { ServiceCatalogItem, AttachContractPayload } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    show: boolean
    services: ServiceCatalogItem[]
    clientId?: string
    clientName?: string
    initialServiceCode?: string
    isSaving?: boolean
  }>(),
  {
    clientId: undefined,
    clientName: undefined,
    initialServiceCode: undefined,
    isSaving: false
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: AttachContractPayload): void
}>()

const formRef = ref<InstanceType<typeof ContractAgreementForm> | null>(null)
const isFormValid = ref(true)

const modalTitle = computed(() => {
  return props.clientName
    ? `Attach Service Contract — ${props.clientName}`
    : 'Attach Service Contract'
})

function handleFormSubmit(payload: AttachContractPayload): void {
  emit('save', payload)
}
</script>

<template>
  <BaseModal :show="show" :title="modalTitle" @close="$emit('close')">
    <ContractAgreementForm
      ref="formRef"
      id-prefix="contract-modal"
      :services="services"
      :initial-service-code="initialServiceCode"
      :disabled="isSaving"
      @valid-change="isFormValid = $event"
      @submit="handleFormSubmit"
    />

    <template #footer>
      <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
      <BaseButton
        label="Confirm Contract"
        button-type="submit"
        form="contract-modal-form"
        :loading="isSaving"
        :disabled="!isFormValid || isSaving"
      />
    </template>
  </BaseModal>
</template>
