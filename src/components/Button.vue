<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
  },
)

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400',
  outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  ghost: 'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

const classes = computed(() =>
  [
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    variantClasses[props.variant],
    sizeClasses[props.size],
  ].join(' '),
)
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
