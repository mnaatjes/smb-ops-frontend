<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseList from '@/shared/ui/BaseList.vue'
import type { ServiceCatalogItem, AttachContractPayload } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    services: ServiceCatalogItem[]
    initialServiceCode?: string
    initialContractType?: 'retainer' | 'fixed_fee'
    initialBillingRate?: number
    disabled?: boolean
    idPrefix?: string
  }>(),
  {
    initialServiceCode: '',
    initialContractType: 'retainer',
    initialBillingRate: 150,
    disabled: false,
    idPrefix: 'contract-agreement'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', payload: AttachContractPayload): void
  (e: 'valid-change', isValid: boolean): void
  (e: 'submit', payload: AttachContractPayload): void
}>()

const selectedServiceCode = ref(props.initialServiceCode || '')
const contractType = ref<'retainer' | 'fixed_fee'>(props.initialContractType)
const billingRate = ref<number>(props.initialBillingRate)

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

const isValid = computed(() => {
  return Boolean(selectedServiceCode.value && billingRate.value >= 0)
})

function getCurrentPayload(): AttachContractPayload {
  return {
    service_code: selectedServiceCode.value,
    billing_rate: billingRate.value,
    contract_type: contractType.value
  }
}

watch([selectedServiceCode, contractType, billingRate], () => {
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
  <form :id="`${idPrefix}-form`" class="contract-agreement-form modal-form-layout" @submit.prevent="handleSubmit">
    <BaseSelect
      :id="`${idPrefix}-service`"
      v-model="selectedServiceCode"
      label="Service Offering *"
      :options="serviceOptions"
      :disabled="disabled"
    />

    <div class="form-row-2col">
      <BaseSelect
        :id="`${idPrefix}-type`"
        v-model="contractType"
        label="Agreement Type *"
        :options="contractTypeOptions"
        :disabled="disabled"
      />

      <BaseInput
        :id="`${idPrefix}-rate`"
        v-model="billingRate"
        type="number"
        label="Agreed Rate ($) *"
        placeholder="150"
        :disabled="disabled"
        required
      />
    </div>

    <div class="deliverables-panel">
      <h4 class="deliverables-title">Contracted Deliverables Scope</h4>
      <BaseList :items="deliverablesList" variant="checkmark" dense />
    </div>
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
</style>
