<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'

const props = defineProps<{
  score: number | null | undefined
}>()

const variant = computed(() => {
  if (props.score === null || props.score === undefined) return 'neutral'
  if (props.score >= 70) return 'danger'
  if (props.score >= 40) return 'warning'
  return 'success'
})

const label = computed(() => {
  if (props.score === null || props.score === undefined) return 'UNAUDITED'
  return `${props.score} / 100`
})
</script>

<template>
  <BaseBadge :variant="variant">
    {{ label }}
  </BaseBadge>
</template>
