<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
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

const modalTitle = computed(() => {
  if (props.clientName) {
    return `Store Infrastructure Secret — ${props.clientName}`
  }
  return 'Store Infrastructure Secret'
})

function handleTypeChange(): void {
  switch (secretType.value) {
    case 'wordpress_admin':
      label.value = 'WordPress Admin'
      break
    case 'hosting_cpanel':
      label.value = 'cPanel / Host Console'
      break
    case 'sftp_ssh':
      label.value = 'SFTP / SSH Access'
      break
    case 'dns_registrar':
      label.value = 'DNS / Domain Registrar'
      break
    case 'database_direct':
      label.value = 'Database Direct (MySQL/Postgres)'
      break
  }
}

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
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider" for="vault-secret-type">
            Secret Category *
          </label>
          <select
            id="vault-secret-type"
            v-model="secretType"
            class="w-full mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
            @change="handleTypeChange"
          >
            <option value="wordpress_admin">WordPress Admin</option>
            <option value="hosting_cpanel">Hosting / cPanel</option>
            <option value="sftp_ssh">SFTP / SSH</option>
            <option value="dns_registrar">DNS Registrar</option>
            <option value="database_direct">Direct Database</option>
          </select>
        </div>

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

      <div class="grid grid-cols-2 gap-4">
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

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <BaseButton label="Cancel" variant="secondary" @click="$emit('close')" />
        <BaseButton label="Store Credential" button-type="submit" :loading="isSaving" />
      </div>
    </form>
  </BaseModal>
</template>
