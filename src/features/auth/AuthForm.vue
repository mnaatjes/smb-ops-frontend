<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

import { useUserStore } from '@/entities/user/store'


const emit = defineEmits<{
  (e: 'login-success'): void
}>()


const userStore = useUserStore()

const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  try {
    
    userStore.setUser({
      id: 'usr_1',
      name: 'System Operator',
      email: 'operator@example.com',
      role: 'admin'
    })
    
    emit('login-success')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <h3>User Authentication</h3>
    <BaseButton
      label="Sign In as Operator"
      :disabled="isLoading"
      @click="handleLogin"
    />
  </div>
</template>

<style scoped>
.auth-card {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
}
</style>
