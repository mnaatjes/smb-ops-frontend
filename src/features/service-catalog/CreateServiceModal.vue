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
    name.value.trim().length >= 2 &&
    description.value.trim().length >= 5 &&
    priceMin.value >= 0 &&
    priceMax.value >= priceMin.value &&
    selectedParameters.value.length > 0 &&
    !isSubmitting.value
  )
})

function toggleParameter(key: string): void {
  if (selectedParameters.value.includes(key)) {
    selectedParameters.value = selectedParameters.value.filter((k) => k !== key)
  } else {
    selectedParameters.value.push(key)
  }
}

function handleClose(): void {
  code.value = ''
  name.value = ''
  description.value = ''
  targetProfile.value = ''
  scopeInput.value = ''
  deliverablesInput.value = ''
  exclusionsInput.value = ''
  selectedParameters.value = []
  minScore.value = 50
  isSubmitting.value = false
  emit('close')
}

function handleSubmit(): void {
  if (!canSubmit.value) return
  isSubmitting.value = true

  const rankMatch = rankOptions.find((r) => r.value === selectedRank.value)
  const pricingModel = rankMatch ? rankMatch.model : 'FLAT_FEE'

  const scopeList = scopeInput.value
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const deliverablesList = deliverablesInput.value
    .split('\n')
    .map((d) => d.trim())
    .filter((d) => d.length > 0)

  const exclusionsList = exclusionsInput.value
    .split('\n')
    .map((e) => e.trim())
    .filter((e) => e.length > 0)

  emit('create', {
    code: code.value.trim().toUpperCase(),
    name: name.value.trim(),
    description: description.value.trim(),
    rank: selectedRank.value,
    pricing_model: pricingModel,
    price_min: Number(priceMin.value),
    price_max: Number(priceMax.value),
    target_profile: targetProfile.value.trim(),
    scope: scopeList,
    deliverables: deliverablesList,
    exclusions: exclusionsList,
    audit_parameters: [...selectedParameters.value],
    minimum_opportunity_score: Number(minScore.value) || 50,
  })

  handleClose()
}
</script>

<template>
  <BaseModal :show="show" title="Register New Canonical Service Offering" @close="handleClose">
    <form class="service-form" @submit.prevent="handleSubmit">
      <!-- Rank Hierarchy Selection -->
      <div class="form-group">
        <label class="form-label" for="svc-rank">
          Governing Service Rank & Pricing Tier <span class="required">*</span>
        </label>
        <select id="svc-rank" v-model="selectedRank" class="form-select">
          <option v-for="opt in rankOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <span class="field-hint">
          Offerings strictly align to the approved four-tier operational consulting structure.
        </span>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label class="form-label" for="svc-code">
            Service Code <span class="required">*</span>
          </label>
          <BaseInput
            id="svc-code"
            v-model="code"
            placeholder="e.g. SVC-RANK-1A"
            required
          />
        </div>

        <div class="form-group flex-2">
          <label class="form-label" for="svc-name">
            Service Name <span class="required">*</span>
          </label>
          <BaseInput
            id="svc-name"
            v-model="name"
            placeholder="e.g. Performance & SSL In-Depth Audit"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label class="form-label" for="svc-price-min">
            Price Min ($ USD) <span class="required">*</span>
          </label>
          <BaseInput
            id="svc-price-min"
            v-model="priceMin"
            type="number"
            min="0"
            required
          />
        </div>

        <div class="form-group flex-1">
          <label class="form-label" for="svc-price-max">
            Price Max ($ USD) <span class="required">*</span>
          </label>
          <BaseInput
            id="svc-price-max"
            v-model="priceMax"
            type="number"
            min="0"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="svc-desc">
          Overview & Value Proposition <span class="required">*</span>
        </label>
        <textarea
          id="svc-desc"
          v-model="description"
          rows="2"
          class="form-textarea"
          placeholder="Brief commercial summary..."
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="svc-target">
          Target Client Profile
        </label>
        <BaseInput
          id="svc-target"
          v-model="targetProfile"
          placeholder="e.g. Restaurants running 10+ yr old static HTML with lost webmasters"
        />
      </div>

      <!-- Scope & Deliverables -->
      <div class="form-row">
        <div class="form-group flex-1">
          <label class="form-label" for="svc-scope">
            Scope Items (1 per line)
          </label>
          <textarea
            id="svc-scope"
            v-model="scopeInput"
            rows="2"
            class="form-textarea"
            placeholder="Extract copy and imagery&#10;Refactor to clean HTML5&#10;Deploy to Cloudflare Pages"
          ></textarea>
        </div>

        <div class="form-group flex-1">
          <label class="form-label" for="svc-deliverables">
            Deliverables (1 per line)
          </label>
          <textarea
            id="svc-deliverables"
            v-model="deliverablesInput"
            rows="2"
            class="form-textarea"
            placeholder="1-page health report&#10;Private Git repository&#10;Zero hosting cost deployment"
          ></textarea>
        </div>
      </div>

      <!-- Verified Audit Parameter Multi-Select Checklist -->
      <div class="form-group">
        <label class="form-label">
          Backend Audit Parameters (Required: Select 1 or more) <span class="required">*</span>
        </label>
        <span class="field-hint">
          Parameters are validated against active backend probe collectors.
        </span>

        <div class="parameter-grid">
          <div
            v-for="param in availableAuditParameters"
            :key="param.key"
            class="parameter-chip"
            :class="{ active: selectedParameters.includes(param.key) }"
            @click="toggleParameter(param.key)"
          >
            <input
              type="checkbox"
              :checked="selectedParameters.includes(param.key)"
              class="param-check"
              @click.stop="toggleParameter(param.key)"
            />
            <div class="param-info">
              <span class="param-title">{{ param.label }}</span>
              <span class="param-probe"><code>{{ param.key }}</code> ({{ param.collector_probe }})</span>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <BaseButton label="Cancel" variant="secondary" @click="handleClose" />
      <BaseButton
        label="Register Service"
        variant="primary"
        :disabled="!canSubmit"
        :loading="isSubmitting"
        @click="handleSubmit"
      />
    </template>
  </BaseModal>
</template>

<style scoped>
.service-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text, #1e293b);
}

.required {
  color: var(--color-danger, #ef4444);
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border, #cbd5e1);
  border-radius: var(--radius-md, 6px);
  background-color: var(--color-bg, #ffffff);
  color: var(--color-text, #1e293b);
  font-size: 0.9rem;
  box-sizing: border-box;
}

.field-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted, #64748b);
}

.parameter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.parameter-chip {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0.65rem;
  background-color: var(--color-bg-secondary, #f8fafc);
  border: 1px solid var(--color-border, #cbd5e1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.parameter-chip:hover {
  border-color: #94a3b8;
  background-color: #f1f5f9;
}

.parameter-chip.active {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.param-check {
  margin-top: 0.15rem;
  cursor: pointer;
}

.param-info {
  display: flex;
  flex-direction: column;
}

.param-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text, #1e293b);
}

.param-probe {
  font-size: 0.75rem;
  color: var(--color-text-muted, #64748b);
}
</style>
