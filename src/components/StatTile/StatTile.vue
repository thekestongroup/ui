<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from 'vue'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Card from '../Card/Card.vue'

/**
 * One number that matters, in a small Card: "Open applications 48".
 * Put several in a grid. Optionally with how it's changed ("+12% on last
 * year") and a short description.
 *
 * Slots: value (e.g. a value with a unit in smaller text), description,
 * footer (e.g. a "View all" link).
 */
export interface StatTileProps {
  /** What the number is, e.g. "Open applications". */
  label: string
  /** The number, already formatted, e.g. "1,204" or "96%". */
  value?: string | number
  /** Icon before the label. Decorative. */
  icon?: Component
  /** How it's changed, already formatted, e.g. "+12%" or "−3". */
  change?: string
  /** What the change is against, e.g. "on last year". Read after the change. */
  changeLabel?: string
  /** Which way it went. Sets the arrow. */
  trend?: 'up' | 'down' | 'flat'
  /**
   * Whether the change is good, which sets the colour: green good, red bad,
   * grey neutral. Defaults to up good, down bad, flat neutral. Set it when
   * down is good, e.g. absences.
   */
  sentiment?: 'positive' | 'negative' | 'neutral'
  /** Grey text under the value. */
  description?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<StatTileProps>()

defineSlots<{
  value?(): unknown
  description?(): unknown
  footer?(): unknown
}>()

const tone = computed(() => {
  if (props.sentiment) return props.sentiment
  if (props.trend === 'up') return 'positive'
  if (props.trend === 'down') return 'negative'
  return 'neutral'
})

const toneClasses = { positive: 'text-green', negative: 'text-red', neutral: 'text-black/65' } as const
const trendIcon = computed(() =>
  props.trend === 'up' ? ArrowUpRight : props.trend === 'down' ? ArrowDownRight : props.trend === 'flat' ? ArrowRight : undefined
)
// The arrow is decorative, so say the direction in words for screen readers.
const trendWords = { up: 'Up', down: 'Down', flat: 'No change' } as const
</script>

<template>
  <Card padding="sm" :class="props.class" :ui="{ body: 'gap-1' }">
    <p class="flex items-center gap-2 text-sm text-black/65">
      <component :is="icon" v-if="icon" class="size-4 shrink-0" aria-hidden="true" />
      {{ label }}
    </p>

    <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <p class="text-2xl font-bold tabular-nums">
        <slot name="value">{{ value ?? '—' }}</slot>
      </p>
      <p v-if="change || trend" :class="cn('inline-flex items-center gap-0.5 text-sm', toneClasses[tone])">
        <component :is="trendIcon" v-if="trendIcon" class="size-4 shrink-0" aria-hidden="true" />
        <span v-if="trend" class="sr-only">{{ trendWords[trend] }}</span>
        <span v-if="change" class="font-bold tabular-nums">{{ change }}</span>
        <span v-if="changeLabel" class="text-black/65">&nbsp;{{ changeLabel }}</span>
      </p>
    </div>

    <p v-if="description || $slots.description" class="text-sm text-black/65">
      <slot name="description">{{ description }}</slot>
    </p>

    <div v-if="$slots.footer" class="mt-2 text-sm">
      <slot name="footer" />
    </div>
  </Card>
</template>
