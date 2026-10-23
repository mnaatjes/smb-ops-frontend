<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import VaultSecretForm from '@/shared/ui/VaultSecretForm.vue'
import type { ClientSecretPayload } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    show: boolean
    clientName?: string
    isSaving?: boolean
  }>(),
  {
    clientName: undefined,
    isSaving: false
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: ClientSecretPayload): void
}>()

const formRef = ref<InstanceType<typeof VaultSecretForm> | null>(null)
const isFormValid = ref(false)
const secretPayload = ref<Partial<ClientSecretPayload>>({})

const modalTitle = computed(() => {
  return props.clientName
    ? `Store Infrastructure Secret — ${props.clientName}`
    : 'Store Infrastructure Secret'
})

function handleFormSubmit(payload: ClientSecretPayload): void {
  emit('save', payload)
}

function triggerSave(): void {
  if (formRef.value) {
    formRef.value.submit()
  }
}
</script>

<template>
  <BaseModal :show="show" :title="modalTitle" @close="$emit('close')">
    <VaultSecretForm
      ref="formRef"
      v-model="secretPayload"
      :disabled="isSaving"
      id-prefix="vault-modal-secret"
      @valid-change="(valid) => isFormValid = valid"
      @submit="handleFormSubmit"
    />

    <template #footer>
      <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
      <BaseButton
        label="Store Credential"
        variant="primary"
        :loading="isSaving"
        :disabled="!isFormValid"
        @click="triggerSave"
      />
    </template>
  </BaseModal>
</template>
