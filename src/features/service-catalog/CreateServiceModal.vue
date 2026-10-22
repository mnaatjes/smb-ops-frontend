<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import { fetchAuditParameters } from '@/shared/api/leads'
import type { AuditParameterOption, CreateServicePayload } from '@/shared/types/lead'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', payload: CreateServicePayload): void
}>()

const rankOptions = [
  { value: 'Rank 1A', label: 'Rank 1A: CMS Performance & Security Fix ($150 flat)', min: 150, max: 150, model: 'FLAT_FEE' },
  { value: 'Rank 1B', label: 'Rank 1B: Legacy Static Modernization ($350–$500 flat)', min: 350, max: 500, model: 'FLAT_FEE' },
  { value: 'Rank 2', label: 'Rank 2: Digital Continuity Retainer ($49–$99 / mo)', min: 49, max: 99, model: 'MONTHLY_RETAINER' },
  { value: 'Rank 3', label: 'Rank 3: POS Data Pipeline & Reporting ($300–$500 flat)', min: 300, max: 500, model: 'HYBRID' },
  { value: 'Rank 4', label: 'Rank 4: POS Online Ordering Integration ($250 flat)', min: 250, max: 250, model: 'FLAT_FEE' },
]

const selectedRank = ref(rankOptions[0].value)
const code = ref('')
const name = ref('')
const description = ref('')
const priceMin = ref(rankOptions[0].min)
const priceMax = ref(rankOptions[0].max)
const targetProfile = ref('')
const scopeInput = ref('')
const deliverablesInput = ref('')
const exclusionsInput = ref('')
const selectedParameters = ref<string[]>([])
const minScore = ref<number>(50)
const isSubmitting = ref(false)

const availableAuditParameters = ref<AuditParameterOption[]>([])

watch(selectedRank, (newRank) => {
  const match = rankOptions.find((r) => r.value === newRank)
  if (match) {
    priceMin.value = match.min
    priceMax.value = match.max
  }
})

onMounted(async () => {
  try {
    availableAuditParameters.value = await fetchAuditParameters()
  } catch (err) {
    console.warn('Failed to load audit parameters from backend:', err)
  }
})

const canSubmit = computed(() => {
  return (
    code.value.trim().length >= 2 &&
    name.value.trim().length >= 3 &&
    description.value.trim().length >= 5 &&
    priceMin.value > 0 &&
    priceMax.value >= priceMin.value
  )
})

async function handleSubmit() {
  if (!canSubmit.value) return
  isSubmitting.value = true

  const scopeArray = scopeInput.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const deliverablesArray = deliverablesInput.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const exclusionsArray = exclusionsInput.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const payload: CreateServicePayload = {
    code: code.value.trim().toUpperCase(),
    name: name.value.trim(),
    description: description.value.trim(),
    rank: selectedRank.value,
    price_min: priceMin.value,
    price_max: priceMax.value,
    target_profile: targetProfile.value.trim() || undefined,
    scope: scopeArray.length > 0 ? scopeArray : undefined,
    deliverables: deliverablesArray.length > 0 ? deliverablesArray : undefined,
    exclusions: exclusionsArray.length > 0 ? exclusionsArray : undefined,
    audit_parameters: selectedParameters.value,
    minimum_opportunity_score: minScore.value
  }

  emit('create', payload)
  isSubmitting.value = false
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <BaseModal :show="show" title="Register New Canonical Service Offering" @close="handleClose">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-1">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider" for="svc-rank">
          Governing Service Rank & Pricing Tier <span class="text-rose-400">*</span>
        </label>
        <select
          id="svc-rank"
          v-model="selectedRank"
          class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
        >
          <option v-for="opt in rankOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          id="svc-code"
          v-model="code"
          label="Service Code *"
          placeholder="e.g. SVC-WP-MAINT"
          required
        />
        <BaseInput
          id="svc-name"
          v-model="name"
          label="Display Name *"
          placeholder="e.g. Core WP Maintenance"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider" for="svc-desc">
          Service Description *
        </label>
        <textarea
          id="svc-desc"
          v-model="description"
          rows="2"
          placeholder="Comprehensive summary of service deliverables and operational expectations..."
          class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          id="svc-price-min"
          v-model.number="priceMin"
          type="number"
          label="Minimum Price ($) *"
          required
        />
        <BaseInput
          id="svc-price-max"
          v-model.number="priceMax"
          type="number"
          label="Maximum Price ($) *"
          required
        />
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <BaseButton label="Cancel" variant="secondary" @click="handleClose" />
        <BaseButton
          label="Register Service Offering"
          button-type="submit"
          :disabled="!canSubmit"
          :loading="isSubmitting"
        />
      </div>
    </form>
  </BaseModal>
</template>
