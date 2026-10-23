<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import type { ClientSecretPayload, SecretType } from '@/shared/types/lead'

const props = withDefaults(
  defineProps<{
    show: boolean
    clientName?: string
    isSaving?: boolean
  }>(),
  {
    clientName: undefined,
    isSaving: false
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: ClientSecretPayload): void
}>()

const secretType = ref<SecretType>('wordpress_admin')
const label = ref('WordPress Admin')
const username = ref('')
const password = ref('')
const loginUrl = ref('')

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

const modalTitle = computed(() => {
  return props.clientName
    ? `Store Infrastructure Secret — ${props.clientName}`
    : 'Store Infrastructure Secret'
})

function handleSubmit(): void {
  if (!label.value.trim() || !username.value.trim() || !password.value.trim()) return
  emit('save', {
    secret_type: secretType.value,
    label: label.value.trim(),
    username: username.value.trim(),
    password: password.value.trim(),
    login_url: loginUrl.value.trim() || null
  })
}
</script>

<template>
  <BaseModal :show="show" :title="modalTitle" @close="$emit('close')">
    <form id="vault-secret-form" class="modal-form-layout" @submit.prevent="handleSubmit">
      <div class="form-row-2col">
        <BaseSelect
          id="vault-secret-type"
          v-model="secretType"
          label="Secret Category *"
          :options="secretTypeOptions"
          @change="handleTypeChange"
        />

        <BaseInput
          id="vault-secret-label"
          v-model="label"
          label="Secret Label *"
          placeholder="e.g. WP Production Console"
          required
        />
      </div>

      <BaseInput
        id="vault-secret-login-url"
        v-model="loginUrl"
        label="Portal or Login URL"
        placeholder="https://client.com/wp-admin"
      />

      <div class="form-row-2col">
        <BaseInput
          id="vault-secret-username"
          v-model="username"
          label="Username / Identifier *"
          placeholder="admin@client.com"
          required
        />

        <BaseInput
          id="vault-secret-password"
          v-model="password"
          type="password"
          label="Password / Token *"
          placeholder="••••••••••••"
          required
        />
      </div>
    </form>

    <template #footer>
      <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
      <BaseButton
        label="Store Credential"
        button-type="submit"
        form="vault-secret-form"
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
</style>
