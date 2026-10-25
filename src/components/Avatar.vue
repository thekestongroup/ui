<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../lib/cn'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    name?: string
    email?: string
    src?: string
    size?: Size
    class?: string
  }>(),
  {
    name: '',
    email: '',
    src: '',
    size: 'md',
  },
)

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
}

const initials = computed(() => {
  const source = (props.name || props.email || '').trim()
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
})
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 font-medium text-white',
        sizeClasses[props.size],
        props.class,
      )
    "
  >
    <img v-if="props.src" :src="props.src" alt="" class="h-full w-full object-cover" />
    <span v-else>{{ initials }}</span>
  </span>
</template>
