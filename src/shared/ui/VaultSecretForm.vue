<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import type { ClientSecretPayload, SecretType } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<ClientSecretPayload>
    disabled?: boolean
    idPrefix?: string
  }>(),
  {
    modelValue: () => ({}),
    disabled: false,
    idPrefix: 'vault-secret'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', payload: ClientSecretPayload): void
  (e: 'valid-change', isValid: boolean): void
  (e: 'submit', payload: ClientSecretPayload): void
}>()

const secretType = ref<SecretType>((props.modelValue.secret_type as SecretType) || 'wordpress_admin')
const label = ref(props.modelValue.label || 'WordPress Admin')
const username = ref(props.modelValue.username || '')
const password = ref(props.modelValue.password || '')
const loginUrl = ref(props.modelValue.login_url || '')

const defaultLabels: Record<SecretType, string> = {
  wordpress_admin: 'WordPress Admin',
  hosting_cpanel: 'cPanel / Hosting Portal',
  sftp_ssh: 'SFTP / SSH Access',
  dns_registrar: 'DNS Registrar Access',
  database_direct: 'MySQL / Database'
}

const secretTypeOptions = [
  { value: 'wordpress_admin', label: 'WordPress Admin' },
  { value: 'hosting_cpanel', label: 'Hosting / cPanel' },
  { value: 'sftp_ssh', label: 'SFTP / SSH' },
  { value: 'dns_registrar', label: 'DNS Registrar' },
  { value: 'database_direct', label: 'Direct Database' }
]

function handleTypeChange(val: string): void {
  const typedVal = val as SecretType
  if (defaultLabels[typedVal]) {
    label.value = defaultLabels[typedVal]
  }
}

const isValid = computed(() => {
  return Boolean(
    label.value.trim() &&
    username.value.trim() &&
    password.value.trim()
  )
})

function getCurrentPayload(): ClientSecretPayload {
  return {
    secret_type: secretType.value,
    label: label.value.trim(),
    username: username.value.trim(),
    password: password.value.trim(),
    login_url: loginUrl.value.trim() || null
  }
}

watch([secretType, label, username, password, loginUrl], () => {
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
  <form :id="`${idPrefix}-form`" class="vault-secret-form modal-form-layout" @submit.prevent="handleSubmit">
    <div class="form-row-2col">
      <BaseSelect
        :id="`${idPrefix}-type`"
        v-model="secretType"
        label="Secret Category *"
        :options="secretTypeOptions"
        :disabled="disabled"
        @change="handleTypeChange"
      />

      <BaseInput
        :id="`${idPrefix}-label`"
        v-model="label"
        label="Secret Label *"
        placeholder="e.g. WP Production Console"
        :disabled="disabled"
        required
      />
    </div>

    <BaseInput
      :id="`${idPrefix}-login-url`"
      v-model="loginUrl"
      label="Portal or Login URL"
      placeholder="https://client.com/wp-admin"
      :disabled="disabled"
    />

    <div class="form-row-2col">
      <BaseInput
        :id="`${idPrefix}-username`"
        v-model="username"
        label="Username / Identifier *"
        placeholder="admin@client.com"
        :disabled="disabled"
        required
      />

      <BaseInput
        :id="`${idPrefix}-password`"
        v-model="password"
        type="password"
        label="Password / Token *"
        placeholder="••••••••••••"
        :disabled="disabled"
        required
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
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .form-row-2col {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
