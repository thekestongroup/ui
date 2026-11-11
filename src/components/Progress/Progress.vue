<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { cn } from '../../lib/cn'

/**
 * How far along something is, as a thin bar. Three forms:
 * - a line that fills up, e.g. an upload (`value` out of `max`);
 * - segments, one per step, e.g. a multi-step form (`segments`, with `value`
 *   steps filled out of `max`);
 * - indeterminate, when there's no telling how long it'll take (no `value`).
 * Built on Reka UI's Progress, so it's announced as a progress bar.
 */
export interface ProgressProps {
  /** Done so far, out of `max`. Leave it out (or null) for indeterminate. */
  value?: number | null
  /** The total. With `segments`, the number of segments. */
  max?: number
  /** Split the bar into `max` segments and fill `value` of them. */
  segments?: boolean
  /** What's progressing, e.g. "Uploading report.pdf". Its accessible name; not shown. */
  label: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ProgressProps>(), {
  value: null,
  max: 100
})

const indeterminate = computed(() => props.value === null || props.value === undefined)
const clamped = computed(() => Math.min(Math.max(props.value ?? 0, 0), props.max))
const percent = computed(() => (clamped.value / props.max) * 100)

// What screen readers say for the value: "Step 2 of 4" for segments,
// "40%" for a line, nothing (just "busy") when indeterminate.
const valueText = () =>
  indeterminate.value
    ? undefined
    : props.segments
      ? `Step ${clamped.value} of ${props.max}`
      : `${Math.round(percent.value)}%`

const track = 'h-1.5 overflow-hidden rounded-full bg-black/10'
// Filling and segments colouring in ease over 300ms.
const fill = 'h-full rounded-full bg-primary transition-[translate,background-color] duration-300 ease-out motion-reduce:transition-none'
</script>

<template>
  <ProgressRoot
    :model-value="indeterminate ? null : clamped"
    :max="max"
    :get-value-label="() => label"
    :get-value-text="valueText"
    :aria-busy="indeterminate || undefined"
    :class="cn(segments && !indeterminate ? 'flex gap-1' : track, props.class)"
  >
    <!-- Segments: one short track per step, filled up to the value. -->
    <template v-if="segments && !indeterminate">
      <div v-for="i in max" :key="i" :class="cn(track, 'flex-1')">
        <div :class="cn(fill, i <= clamped ? 'translate-x-0' : '-translate-x-full')" />
      </div>
    </template>

    <!-- Indeterminate: a short bar sweeping across (a gentle pulse with
         reduced motion). -->
    <ProgressIndicator
      v-else-if="indeterminate"
      class="h-full w-2/5 rounded-full bg-primary animate-progress-indeterminate motion-reduce:w-full motion-reduce:translate-x-0 motion-reduce:animate-pulse"
    />

    <!-- Line: slides in from the left to the value. -->
    <ProgressIndicator v-else :class="fill" :style="{ translate: `${percent - 100}% 0` }" />
  </ProgressRoot>
</template>
