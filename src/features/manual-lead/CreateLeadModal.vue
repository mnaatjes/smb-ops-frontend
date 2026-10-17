<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useLeadStore } from '@/entities/lead/store'
import type { CreateProspectPayload } from '@/entities/lead/model'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const leadStore = useLeadStore()

const businessName = ref('')
const websiteUrl = ref('')
const phone = ref('')
const address = ref('')
const formError = ref<string | null>(null)

function resetForm() {
  businessName.value = ''
  websiteUrl.value = ''
  phone.value = ''
  address.value = ''
  formError.value = null
}

async function handleSubmit() {
  if (!businessName.value.trim()) {
    formError.value = 'Business name is required'
    return
  }

  const payload: CreateProspectPayload = {
    business_name: businessName.value.trim(),
    website_url: websiteUrl.value.trim() || null,
    phone: phone.value.trim() || null,
    address: address.value.trim() || null,
    source: 'MANUAL'
  }

  try {
    await leadStore.addManualLead(payload)
    resetForm()
    emit('close')
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Failed to create lead'
  }
}
</script>

<template>
  <BaseModal :show="show" title="Create Manual Lead" @close="emit('close')">
    <form class="lead-form" @submit.prevent="handleSubmit">
      <div v-if="formError" class="error-banner">{{ formError }}</div>

      <BaseInput
        v-model="businessName"
        label="Business Name *"
        placeholder="e.g. Bella Italia Bistro"
        :disabled="leadStore.loading"
      />
      <BaseInput
        v-model="websiteUrl"
        label="Website URL"
        placeholder="https://example.com"
        :disabled="leadStore.loading"
      />
      <BaseInput
        v-model="phone"
        label="Phone Number"
        placeholder="(269) 555-0199"
        :disabled="leadStore.loading"
      />
      <BaseInput
        v-model="address"
        label="Address"
        placeholder="123 Main St, Kalamazoo, MI"
        :disabled="leadStore.loading"
      />
    </form>

    <template #footer>
      <button type="button" class="cancel-btn" @click="emit('close')">Cancel</button>
      <BaseButton
        label="Save Prospect"
        :disabled="leadStore.loading || !businessName.trim()"
        @click="handleSubmit"
      />
    </template>
  </BaseModal>
</template>

<style scoped>
.lead-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-banner {
  padding: 0.5rem;
  background-color: var(--banner-error-bg);
  color: var(--banner-error-text);
  border: 1px solid var(--banner-error-border);
  border-radius: 4px;
  font-size: 0.85rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-primary);
  transition: background-color 0.15s ease;
}

.cancel-btn:hover {
  background-color: var(--bg-surface-hover);
}
</style>
