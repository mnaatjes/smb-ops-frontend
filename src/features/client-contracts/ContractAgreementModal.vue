<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
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
const billingRate = ref<number>(150)
const contractType = ref<'retainer' | 'fixed_fee'>('retainer')

watch(
  () => props.initialServiceCode,
  (newCode) => {
    if (newCode) {
      selectedServiceCode.value = newCode
    } else if (props.services.length > 0 && !selectedServiceCode.value) {
      selectedServiceCode.value = props.services[0].code
    }
  },
  { immediate: true }
)

const modalTitle = computed(() => {
  if (props.clientName) {
    return `Attach Service Contract — ${props.clientName}`
  }
  return 'Service Contract Agreement'
})

const activeService = computed(() => {
  return props.services.find((s) => s.code === selectedServiceCode.value)
})

const deliverablesList = computed<string[]>(() => {
  if (!activeService.value) return ['Standard deliverables per service catalog description.']
  if (activeService.value.code.includes('RETAINER') || contractType.value === 'retainer') {
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
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-1">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider" for="contract-service-select">
          Service Offering <span class="text-rose-400">*</span>
        </label>
        <select
          id="contract-service-select"
          v-model="selectedServiceCode"
          class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
          required
        >
          <option v-for="s in services" :key="s.code" :value="s.code">
            {{ s.name }} ({{ s.code }})
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider" for="contract-type-select">
            Agreement Type <span class="text-rose-400">*</span>
          </label>
          <select
            id="contract-type-select"
            v-model="contractType"
            class="w-full mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
          >
            <option value="retainer">Monthly Retainer</option>
            <option value="fixed_fee">One-Time Project</option>
          </select>
        </div>

        <BaseInput
          id="contract-billing-rate"
          v-model="billingRate"
          type="number"
          label="Agreed Rate ($)"
          placeholder="150"
          required
        />
      </div>

      <div class="rounded-lg border border-slate-800 bg-slate-950/40 p-3 space-y-2">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400">Contracted Deliverables Scope</h4>
        <ul class="space-y-1 text-xs text-slate-300">
          <li v-for="(item, idx) in deliverablesList" :key="idx" class="flex items-start gap-2">
            <span class="text-emerald-400">✓</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
        <BaseButton label="Confirm Contract" button-type="submit" :loading="isSaving" />
      </div>
    </form>
  </BaseModal>
</template>
