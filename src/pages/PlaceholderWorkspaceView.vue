<script setup lang="ts">
import BasePageContainer from '@/shared/ui/BasePageContainer.vue'
import BasePageHeader from '@/shared/ui/BasePageHeader.vue'

defineProps<{
  title: string
  subtitle: string
  sectionName: string
}>()
</script>

<template>
  <BasePageContainer>
    <BasePageHeader
      :title="title"
      :subtitle="subtitle"
      :breadcrumbs="[{ label: 'Home', to: '/leads' }, { label: sectionName, current: true }]"
    />
    <div class="placeholder-stage-card">
      <div class="placeholder-badge">📐 SDD-0014 Scaffolded Workspace</div>
      <h2 class="placeholder-title">{{ title }}</h2>
      <p class="placeholder-desc">
        Pure Stage View: Enclosed cleanly within <code>BasePageContainer</code> and oriented via <code>BasePageHeader</code>. Ready for downstream workflow authoring following ADR-0031.
      </p>
    </div>
  </BasePageContainer>
</template>

<style scoped>
.placeholder-stage-card {
  background-color: var(--bg-surface);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
}

.placeholder-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-primary);
  background-color: var(--badge-primary-bg);
  border: 1px solid var(--badge-primary-border);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.placeholder-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.placeholder-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  max-width: 540px;
  line-height: 1.6;
  margin: 0;
}
</style>
