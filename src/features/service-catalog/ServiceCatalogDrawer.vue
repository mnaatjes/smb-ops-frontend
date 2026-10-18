<script setup lang="ts">
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { ServiceCatalogItem } from '@/entities/lead/model'

defineProps<{
  show: boolean
  services: ServiceCatalogItem[]
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <BaseModal
    :show="show"
    title="Service Catalog & Audit Offerings"
    @close="$emit('close')"
  >
    <div class="catalog-modal-body">
      <p class="catalog-intro">
        Registered consulting services that govern automated audit parameters and high-opportunity prospect scoring.
      </p>

      <div class="services-list">
        <div
          v-for="svc in services"
          :key="svc.code"
          class="service-card"
        >
          <div class="service-head">
            <span class="service-code">{{ svc.code }}</span>
            <span class="service-min-score">Min Score: &ge; {{ svc.minimum_opportunity_score }}</span>
          </div>
          <h4 class="service-name">{{ svc.name }}</h4>
          <p class="service-desc">{{ svc.description }}</p>

          <div class="audit-params-box">
            <span class="params-label">Audit Parameters Checked:</span>
            <div class="params-chips">
              <span
                v-for="param in svc.audit_parameters"
                :key="param"
                class="param-chip"
              >
                {{ param }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton label="Close" variant="secondary" @click="$emit('close')" />
    </template>
  </BaseModal>
</template>

<style scoped>
.catalog-modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.catalog-intro {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.service-card {
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-code {
  font-size: 0.75rem;
  font-family: monospace;
  font-weight: 700;
  color: var(--accent-primary);
  background: var(--bg-surface);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.service-min-score {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.service-name {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.service-desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.audit-params-box {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.params-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.params-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.param-chip {
  font-size: 0.7rem;
  background: var(--bg-surface);
  color: var(--text-secondary);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  font-family: monospace;
}
</style>
