<script setup lang="ts">
import AuthForm from '@/features/auth/AuthForm.vue'

import { useUserStore } from '@/entities/user/store'
const userStore = useUserStore()

</script>

<template>
  <main class="page-container">
    <header class="header">
      <h1>smb-ops-ui</h1>
      <p class="subtitle">Vue 3 Single Page Application for SMB Operations</p>
    </header>

    <section class="content">
      
      <div v-if="userStore.isAuthenticated" class="user-greeting">
        <p>Welcome back, <strong>{{ userStore.currentUser?.name }}</strong> ({{ userStore.currentUser?.role }})</p>
        <button type="button" @click="userStore.clearUser">Sign Out</button>
      </div>
      <AuthForm v-else />
      
    </section>
  </main>
</template>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}
.subtitle {
  color: #6b7280;
}
.user-greeting {
  padding: 1.5rem;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}
</style>
