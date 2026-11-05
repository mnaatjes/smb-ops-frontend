<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseRepeater from '@/shared/ui/BaseRepeater.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'
import type { CreateCoreServicePayload } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<CreateCoreServicePayload>
    disabled?: boolean
    idPrefix?: string
  }>(),
  {
    modelValue: () => ({}),
    disabled: false,
    idPrefix: 'create-core-service'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', payload: CreateCoreServicePayload): void
  (e: 'valid-change', isValid: boolean): void
  (e: 'submit', payload: CreateCoreServicePayload): void
}>()

const rankOptions = [
  { value: 'Rank 1A', label: 'Rank 1A: Site Performance & Security Audit + Fix (CMS Door-Opener)' },
  { value: 'Rank 1B', label: 'Rank 1B: Legacy Static Modernization & Edge Pipeline (Static Door-Opener)' },
  { value: 'Rank 3', label: 'Rank 3: POS Data Pipeline & Automated Reporting (Advanced Backend)' },
  { value: 'Rank 4', label: 'Rank 4: POS Online Ordering Embed / Link Integration (Utility)' }
]

// Canonical fixed price mapping per business doctrine
const RANK_CANONICAL_PRICING: Record<string, { price: number; model: string }> = {
  'Rank 1A': { price: 150, model: 'FLAT_FEE' },
  'Rank 1B': { price: 350, model: 'FLAT_FEE' },
  'Rank 3': { price: 300, model: 'HYBRID' },
  'Rank 4': { price: 250, model: 'FLAT_FEE' }
}

const code = ref(props.modelValue.code || '')
const name = ref(props.modelValue.name || '')
const description = ref(props.modelValue.description || '')
const rank = ref(props.modelValue.rank || 'Rank 1A')

// Computed fixed price derived directly from chosen rank
const mappedPrice = computed<number>(() => {
  return RANK_CANONICAL_PRICING[rank.value]?.price ?? 150
})

const pricingModel = computed<string>(() => {
  return RANK_CANONICAL_PRICING[rank.value]?.model ?? 'FLAT_FEE'
})

const targetProfile = ref(props.modelValue.target_profile || '')
const scopeItems = ref<string[]>(props.modelValue.scope ? [...props.modelValue.scope] : [])
const deliverablesItems = ref<string[]>(props.modelValue.deliverables ? [...props.modelValue.deliverables] : [])
const exclusionsItems = ref<string[]>(props.modelValue.exclusions ? [...props.modelValue.exclusions] : [])
const auditParamsRaw = ref((props.modelValue.audit_parameters || ['ssl_active', 'response_time_ms']).join(', '))
const minOppScore = ref(props.modelValue.minimum_opportunity_score ?? 50)

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
    mappedPrice.value > 0 &&
    Number(minOppScore.value) >= 0 &&
    Number(minOppScore.value) <= 100
  )
})

function getCurrentPayload(): CreateCoreServicePayload {
  return {
    code: code.value.trim(),
    name: name.value.trim(),
    description: description.value.trim(),
    rank: rank.value,
    pricing_model: pricingModel.value,
    price_min: mappedPrice.value,
    price_max: mappedPrice.value,
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
    rank,
    mappedPrice,
    pricingModel,
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
  <form class="create-core-service-form" @submit.prevent="handleSubmit">
    <div class="form-row grid-2">
      <BaseInput
        :id="`${idPrefix}-code`"
        v-model="code"
        label="Service Code *"
        placeholder="e.g. SVC-RANK-1A"
        :disabled="disabled"
      />
      <BaseSelect
        :id="`${idPrefix}-rank`"
        v-model="rank"
        label="Catalog Rank *"
        :options="rankOptions"
        :disabled="disabled"
      />
    </div>

    <div class="form-row">
      <BaseInput
        :id="`${idPrefix}-name`"
        v-model="name"
        label="Service Display Name *"
        placeholder="e.g. Site Performance & Security Audit + Fix"
        :disabled="disabled"
      />
    </div>

    <div class="form-row">
      <BaseTextarea
        :id="`${idPrefix}-description`"
        v-model="description"
        label="Overview Description *"
        placeholder="Door-opener summary and diagnostic context..."
        :rows="2"
        :disabled="disabled"
      />
    </div>

    <div class="pricing-banner">
      <div class="pricing-info">
        <span class="pricing-label">Standardized Package Pricing (Tied to {{ rank }})</span>
        <span class="pricing-amount">${{ mappedPrice.toFixed(2) }} <span class="pricing-badge">{{ pricingModel }}</span></span>
      </div>
      <p class="pricing-subtext">
        Fixed price and pricing model are automatically locked and mapped according to SMB Ops Business Doctrine standards.
      </p>
    </div>

    <div class="form-row grid-2">
      <BaseInput
        :id="`${idPrefix}-opp-score`"
        v-model.number="minOppScore"
        type="number"
        label="Min Opportunity Score (0-100) *"
        placeholder="50"
        :disabled="disabled"
      />
      <BaseInput
        :id="`${idPrefix}-audit-params`"
        v-model="auditParamsRaw"
        label="Audit Parameters (Comma-separated) *"
        placeholder="ssl_active, response_time_ms, cms_detected"
        :disabled="disabled"
      />
    </div>

    <div class="form-row">
      <BaseInput
        :id="`${idPrefix}-target-profile`"
        v-model="targetProfile"
        label="Target Establishment Profile"
        placeholder="e.g. WordPress establishments with slow TTFB or outdated CMS..."
        :disabled="disabled"
      />
    </div>

    <div class="form-row grid-3">
      <BaseRepeater
        :id="`${idPrefix}-scope`"
        v-model="scopeItems"
        label="Included Scope"
        placeholder="Enter scope item..."
        add-button-label="Add Scope Item"
        :disabled="disabled"
      />
      <BaseRepeater
        :id="`${idPrefix}-deliverables`"
        v-model="deliverablesItems"
        label="Deliverables"
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
.create-core-service-form {
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

.pricing-banner {
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.pricing-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.pricing-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

.pricing-amount {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pricing-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.pricing-subtext {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}
</style>
