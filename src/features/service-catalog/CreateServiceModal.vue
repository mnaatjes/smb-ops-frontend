<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import type { CreateServicePayload } from '@/entities/lead/model'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', payload: CreateServicePayload): void
}>()

const code = ref('')
const name = ref('')
const description = ref('')
const paramsInput = ref('')
const minScore = ref<number>(50)
const isSubmitting = ref(false)

const canSubmit = computed(() => {
  return (
    code.value.trim().length >= 2 &&
    name.value.trim().length >= 2 &&
    description.value.trim().length >= 5 &&
    minScore.value >= 0 &&
    minScore.value <= 100 &&
    !isSubmitting.value
  )
})

function handleClose(): void {
  code.value = ''
  name.value = ''
  description.value = ''
  paramsInput.value = ''
  minScore.value = 50
  isSubmitting.value = false
  emit('close')
}

function handleSubmit(): void {
  if (!canSubmit.value) return
  isSubmitting.value = true

  const parsedParams = paramsInput.value
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  emit('create', {
    code: code.value.trim().toUpperCase(),
    name: name.value.trim(),
    description: description.value.trim(),
    audit_parameters: parsedParams,
    minimum_opportunity_score: Number(minScore.value) || 50
  })

  handleClose()
}
</script>

<template>
  <BaseModal :show="show" title="Register New Consulting Service Offering" @close="handleClose">
    <form class="service-form" @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group flex-1">
          <label class="form-label" for="svc-code">
            Service Code <span class="required">*</span>
          </label>
          <BaseInput
            id="svc-code"
            v-model="code"
            placeholder="e.g. SVC-ADA"
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
            placeholder="e.g. Accessibility Compliance Audit"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="svc-desc">
          Deliverables & Scope <span class="required">*</span>
        </label>
        <textarea
          id="svc-desc"
          v-model="description"
          rows="3"
          class="form-textarea"
          placeholder="Detailed consulting scope, deliverable specifications, and client value proposition..."
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="svc-params">
          Audit Parameters (Comma-separated)
        </label>
        <BaseInput
          id="svc-params"
          v-model="paramsInput"
          placeholder="e.g. aria_labels, color_contrast, keyboard_nav"
        />
        <span class="field-hint">
          Technical checks and audit flags associated with this consulting offering.
        </span>
      </div>

      <div class="form-group">
        <label class="form-label" for="svc-min-score">
          Minimum Opportunity Score Threshold (0–100)
        </label>
        <BaseInput
          id="svc-min-score"
          v-model="minScore"
          type="number"
          min="0"
          max="100"
        />
        <span class="field-hint">
          Threshold at which prospects automatically qualify as candidates for this service.
        </span>
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
}

.form-row {
  display: flex;
  gap: 0.75rem;
}

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.required {
  color: var(--accent-danger, #ef4444);
}

.form-textarea {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.15s ease;
}

.form-textarea:focus {
  border-color: var(--accent-primary);
}

.field-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
