<script setup lang="ts">
import { cn } from '../lib/cn'

const model = defineModel<string>({ default: '' })

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <input
    v-model="model"
    :class="
      cn(
        'h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
