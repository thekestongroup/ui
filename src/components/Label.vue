<script setup lang="ts">
import { cn } from '../lib/cn'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <label v-bind="$attrs" :class="cn('text-sm font-medium text-neutral-700', props.class)">
    <slot />
  </label>
</template>
