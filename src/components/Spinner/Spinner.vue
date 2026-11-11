<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { ProgressRoot } from 'reka-ui'
import { cn } from '../../lib/cn'

/**
 * A circular progress indicator.
 *
 * - No `value` (or `null`): continuous spinner, for waits of unknown length.
 * - `value` from 0 to `max`: a ring that fills as the value goes up.
 *
 * It takes the surrounding text colour, like an icon, so put a text colour
 * class on it or its parent (e.g. `class="text-primary"`).
 */
export interface SpinnerProps {
  /** Progress from 0 to `max`. Leave out (or null) for a continuous spinner. */
  value?: number | null
  /** The value that means complete. */
  max?: number
  /** sm 16px (button icon size) · md 24px · lg 48px */
  size?: 'sm' | 'md' | 'lg'
  /** What is loading, read by screen readers, e.g. "Uploading report". */
  label?: string
  /** Show the percentage in the middle. Only on `lg`, and only with a value. */
  showValue?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  max: 100,
  size: 'md',
  label: 'Loading'
})

const indeterminate = computed(() => props.value === null || props.value === undefined)
// 0–1, kept within range so a value over max still draws a full ring.
const fraction = computed(() =>
  indeterminate.value ? 0 : Math.min(Math.max((props.value as number) / props.max, 0), 1)
)
const percent = computed(() => Math.round(fraction.value * 100))

// Ring geometry, in a 24×24 viewBox.
const radius = 10
const circumference = 2 * Math.PI * radius
// Continuous: a quarter of the ring spins. Otherwise the arc grows with the value.
const dashOffset = computed(() => circumference * (indeterminate.value ? 0.75 : 1 - fraction.value))

const sizes: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-12'
}
</script>

<template>
  <ProgressRoot
    as="span"
    :model-value="indeterminate ? null : fraction * max"
    :max="max"
    :aria-label="label"
    :class="cn('relative inline-flex shrink-0 items-center justify-center', sizes[size], props.class)"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      :class="cn(
        'size-full -rotate-90',
        indeterminate && 'animate-spin motion-reduce:animate-[spin_2s_linear_infinite]'
      )"
    >
      <!-- Track -->
      <circle cx="12" cy="12" :r="radius" stroke="currentColor" stroke-opacity="0.2" stroke-width="2.5" />
      <!-- Arc. Hidden at exactly 0%, where a round line cap would still draw a dot. -->
      <circle
        cx="12"
        cy="12"
        :r="radius"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :stroke-opacity="!indeterminate && fraction === 0 ? 0 : 1"
        class="transition-[stroke-dashoffset] duration-300 ease-out motion-reduce:transition-none"
      />
    </svg>

    <span
      v-if="showValue && size === 'lg' && !indeterminate"
      aria-hidden="true"
      class="absolute text-xs tabular-nums"
    >
      {{ percent }}%
    </span>
  </ProgressRoot>
</template>
