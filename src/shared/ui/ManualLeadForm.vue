<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import type { CreateProspectPayload } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<CreateProspectPayload>
    disabled?: boolean
    idPrefix?: string
  }>(),
  {
    modelValue: () => ({}),
    disabled: false,
    idPrefix: 'manual-lead'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', payload: CreateProspectPayload): void
  (e: 'valid-change', isValid: boolean): void
  (e: 'submit', payload: CreateProspectPayload): void
}>()

const businessName = ref(props.modelValue.business_name || '')
const websiteUrl = ref(props.modelValue.website_url || '')
const phone = ref(props.modelValue.phone || '')
const address = ref(props.modelValue.address || '')

const isValid = computed(() => {
  return businessName.value.trim().length > 0
})

function getCurrentPayload(): CreateProspectPayload {
  return {
    business_name: businessName.value.trim(),
    website_url: websiteUrl.value.trim() || null,
    phone: phone.value.trim() || null,
    address: address.value.trim() || null,
    source: 'MANUAL'
  }
}

watch([businessName, websiteUrl, phone, address], () => {
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
  <form :id="`${idPrefix}-form`" class="manual-lead-form modal-form-layout" @submit.prevent="handleSubmit">
    <BaseInput
      :id="`${idPrefix}-business-name`"
      v-model="businessName"
      label="Business Name *"
      placeholder="e.g. Acme Craft Roasters"
      :disabled="disabled"
      required
    />

    <BaseInput
      :id="`${idPrefix}-website-url`"
      v-model="websiteUrl"
      label="Website URL"
      placeholder="https://example.com"
      :disabled="disabled"
    />

    <div class="form-row-2col">
      <BaseInput
        :id="`${idPrefix}-phone`"
        v-model="phone"
        label="Phone Number"
        placeholder="(555) 000-0000"
        :disabled="disabled"
      />

      <BaseInput
        :id="`${idPrefix}-address`"
        v-model="address"
        label="Physical Address"
        placeholder="123 Main St, City, ST"
        :disabled="disabled"
      />
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
</style>
