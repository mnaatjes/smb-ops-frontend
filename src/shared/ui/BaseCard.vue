<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    bordered?: boolean
    elevated?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    bordered: true,
    elevated: false,
    padding: 'md'
  }
)
</script>

<template>
  <article
    class="base-card"
    :class="[
      `padding-${padding}`,
      { 'is-bordered': bordered, 'is-elevated': elevated }
    ]"
  >
    <header v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <div class="header-titles">
          <h3 v-if="title" class="card-title">{{ title }}</h3>
          <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
        </div>
      </slot>
    </header>

    <div class="card-body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
.base-card {
  background-color: var(--bg-surface);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  color: var(--text-primary);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.base-card.is-bordered {
  border: 1px solid var(--border-color);
}

.base-card.is-elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

/* Padding variants */
.padding-none {
  padding: 0;
}

.padding-sm {
  padding: 0.75rem;
}

.padding-md {
  padding: 1.25rem;
}

.padding-lg {
  padding: 2rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.padding-none .card-header {
  padding: 1rem 1rem 0.75rem 1rem;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.card-subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
}

.card-body {
  flex: 1;
}

.card-footer {
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.padding-none .card-footer {
  padding: 0.75rem 1rem 1rem 1rem;
}
</style>
