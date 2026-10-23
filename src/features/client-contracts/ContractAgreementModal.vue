<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseList from '@/shared/ui/BaseList.vue'
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

const selectedServiceCode = ref(props.initialServiceCode || '')
const contractType = ref<'retainer' | 'fixed_fee'>('retainer')
const billingRate = ref<number>(150)

watch(
  () => props.initialServiceCode,
  (code) => {
    if (code) {
      selectedServiceCode.value = code
    }
  }
)

watch(
  () => props.services,
  (srvs) => {
    if (!selectedServiceCode.value && srvs.length > 0) {
      selectedServiceCode.value = srvs[0].code
    }
  },
  { immediate: true }
)

const modalTitle = computed(() => {
  return props.clientName
    ? `Attach Service Contract — ${props.clientName}`
    : 'Attach Service Contract'
})

const serviceOptions = computed(() => {
  return props.services.map((s) => ({
    value: s.code,
    label: `${s.name} (${s.code})`
  }))
})

const contractTypeOptions = [
  { value: 'retainer', label: 'Monthly Retainer' },
  { value: 'fixed_fee', label: 'One-Time Project' }
]

const deliverablesList = computed(() => {
  if (contractType.value === 'retainer') {
    return [
      '30 minutes monthly proactive maintenance & triage',
      'Security patching and plugin vulnerability updates',
      'Off-site cloud backup retention and health verification'
    ]
  }
  return [
    'Complete technical SEO and web vitals optimization',
    'Mobile viewport responsive remediation',
    'Verification audit report upon project completion'
  ]
})

function handleSubmit(): void {
  if (!selectedServiceCode.value || billingRate.value < 0) return
  emit('save', {
    service_code: selectedServiceCode.value,
    billing_rate: billingRate.value,
    contract_type: contractType.value
  })
}
</script>

<template>
  <BaseModal :show="show" :title="modalTitle" @close="$emit('close')">
    <form id="contract-agreement-form" class="modal-form-layout" @submit.prevent="handleSubmit">
      <BaseSelect
        id="contract-service-select"
        v-model="selectedServiceCode"
        label="Service Offering *"
        :options="serviceOptions"
      />

      <div class="form-row-2col">
        <BaseSelect
          id="contract-type-select"
          v-model="contractType"
          label="Agreement Type *"
          :options="contractTypeOptions"
        />

        <BaseInput
          id="contract-billing-rate"
          v-model="billingRate"
          type="number"
          label="Agreed Rate ($) *"
          placeholder="150"
          required
        />
      </div>

      <div class="deliverables-panel">
        <h4 class="deliverables-title">Contracted Deliverables Scope</h4>
        <BaseList :items="deliverablesList" variant="checkmark" dense />
      </div>
    </form>

    <template #footer>
      <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
      <BaseButton
        label="Confirm Contract"
        button-type="submit"
        form="contract-agreement-form"
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

.deliverables-panel {
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface-subtle);
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.deliverables-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin: 0;
}

.deliverables-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.deliverable-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-primary);
  line-height: 1.3;
}

.checkmark {
  color: var(--accent-primary, #10b981);
  font-weight: bold;
  font-size: 0.85rem;
  line-height: 1.2;
}

.deliverable-text {
  flex: 1;
}
</style>
