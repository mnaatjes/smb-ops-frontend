<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseRepeater from '@/shared/ui/BaseRepeater.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'
import type { CreateAddOnPayload } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<CreateAddOnPayload>
    disabled?: boolean
    idPrefix?: string
  }>(),
  {
    modelValue: () => ({}),
    disabled: false,
    idPrefix: 'create-add-on'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', payload: CreateAddOnPayload): void
  (e: 'valid-change', isValid: boolean): void
  (e: 'submit', payload: CreateAddOnPayload): void
}>()

const capOptions = [
  { value: '0', label: '0 Minutes (Automated background tool / No ad-hoc time)' },
  { value: '30', label: '30 Minutes / month (Essential care tier)' },
  { value: '60', label: '60 Minutes / month (Professional care tier)' },
  { value: '90', label: '90 Minutes / month (Priority operations tier)' },
  { value: '120', label: '120 Minutes / month (Custom enterprise tier)' }
]

const code = ref(props.modelValue.code || '')
const name = ref(props.modelValue.name || '')
const description = ref(props.modelValue.description || '')
const monthlyRate = ref(props.modelValue.monthly_rate ?? 99)
const retainerCap = ref(String(props.modelValue.monthly_retainer_cap_minutes ?? 30))
const targetProfile = ref(props.modelValue.target_profile || '')
const scopeItems = ref<string[]>(
  props.modelValue.scope
    ? [...props.modelValue.scope]
    : ['Weekly offsite S3 backup', '5-minute uptime probe', 'Security patch rollback']
)
const deliverablesItems = ref<string[]>(
  props.modelValue.deliverables
    ? [...props.modelValue.deliverables]
    : ['Monthly continuity report', 'Uptime & SLA ledger']
)
const exclusionsItems = ref<string[]>(
  props.modelValue.exclusions
    ? [...props.modelValue.exclusions]
    : ['Zero graphic design redesign', 'Zero photo editing']
)
const auditParamsRaw = ref((props.modelValue.audit_parameters || ['ssl_active', 'status_code']).join(', '))
const minOppScore = ref(props.modelValue.minimum_opportunity_score ?? 40)

function parseCsv(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function cleanItems(items: string[]): string[] {
  return items.map((s) => s.trim()).filter((s) => s.length > 0)
}

const isValid = computed(() => {
  return (
    code.value.trim().length > 0 &&
    name.value.trim().length > 0 &&
    description.value.trim().length > 0 &&
    Number(monthlyRate.value) >= 0 &&
    Number(retainerCap.value) >= 0 &&
    Number(minOppScore.value) >= 0 &&
    Number(minOppScore.value) <= 100
  )
})

function getCurrentPayload(): CreateAddOnPayload {
  return {
    code: code.value.trim(),
    name: name.value.trim(),
    description: description.value.trim(),
    rank: 'Rank 2',
    pricing_model: 'MONTHLY_RETAINER',
    monthly_rate: Number(monthlyRate.value) || 0,
    monthly_retainer_cap_minutes: Number(retainerCap.value) || 0,
    target_profile: targetProfile.value.trim(),
    scope: cleanItems(scopeItems.value),
    deliverables: cleanItems(deliverablesItems.value),
    exclusions: cleanItems(exclusionsItems.value),
    audit_parameters: parseCsv(auditParamsRaw.value),
    minimum_opportunity_score: Number(minOppScore.value) || 0
  }
}

watch(
  [
    code,
    name,
    description,
    monthlyRate,
    retainerCap,
    targetProfile,
    scopeItems,
    deliverablesItems,
    exclusionsItems,
    auditParamsRaw,
    minOppScore
  ],
  () => {
    emit('update:modelValue', getCurrentPayload())
  },
  { deep: true }
)


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
</script>

<template>
  <form class="create-add-on-form" @submit.prevent="handleSubmit">
    <div class="form-row grid-2">
      <BaseInput
        :id="`${idPrefix}-code`"
        v-model="code"
        label="Add-on Plan Code *"
        placeholder="e.g. CARE_PLAN_30 or SUB-POS-SYNC"
        :disabled="disabled"
      />
      <BaseInput
        :id="`${idPrefix}-name`"
        v-model="name"
        label="Plan Display Name *"
        placeholder="e.g. Essential Website Care Plan"
        :disabled="disabled"
      />
    </div>

    <div class="form-row">
      <BaseTextarea
        :id="`${idPrefix}-description`"
        v-model="description"
        label="Subscription Description *"
        placeholder="Recurring maintenance and continuity commitments..."
        :rows="2"
        :disabled="disabled"
      />
    </div>

    <div class="form-row grid-2">
      <BaseInput
        :id="`${idPrefix}-monthly-rate`"
        v-model.number="monthlyRate"
        type="number"
        label="Monthly Retainer Rate (USD / mo) *"
        placeholder="99"
        :disabled="disabled"
      />
      <BaseSelect
        :id="`${idPrefix}-retainer-cap`"
        v-model="retainerCap"
        label="Included Monthly Support Cap *"
        :options="capOptions"
        :disabled="disabled"
      />
    </div>

    <div class="form-row grid-2">
      <BaseInput
        :id="`${idPrefix}-opp-score`"
        v-model.number="minOppScore"
        type="number"
        label="Min Opportunity Score (0-100) *"
        placeholder="40"
        :disabled="disabled"
      />
      <BaseInput
        :id="`${idPrefix}-audit-params`"
        v-model="auditParamsRaw"
        label="Trigger Audit Parameters *"
        placeholder="ssl_active, status_code"
        :disabled="disabled"
      />
    </div>

    <div class="form-row">
      <BaseInput
        :id="`${idPrefix}-target-profile`"
        v-model="targetProfile"
        label="Target Client Profile"
        placeholder="e.g. Independent restaurants requiring hands-off digital reliability..."
        :disabled="disabled"
      />
    </div>

    <div class="form-row grid-3">
      <BaseRepeater
        :id="`${idPrefix}-scope`"
        v-model="scopeItems"
        label="Included Ongoing Scope"
        placeholder="Enter scope item..."
        add-button-label="Add Scope Item"
        :disabled="disabled"
      />
      <BaseRepeater
        :id="`${idPrefix}-deliverables`"
        v-model="deliverablesItems"
        label="Monthly Deliverables"
        placeholder="Enter deliverable..."
        add-button-label="Add Deliverable"
        :disabled="disabled"
      />
      <BaseRepeater
        :id="`${idPrefix}-exclusions`"
        v-model="exclusionsItems"
        label="Strict Exclusions"
        placeholder="Enter exclusion..."
        add-button-label="Add Exclusion"
        :disabled="disabled"
      />
    </div>
  </form>

</template>

<style scoped>
.create-add-on-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }

  .grid-3 {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
