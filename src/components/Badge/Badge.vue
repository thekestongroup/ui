<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'

/**
 * A small label for a status, count or category, e.g. "Active", "3", "Year 9".
 * Not interactive: for something people can press, use a Button.
 *
 * Slots: default (the text), leading and trailing (e.g. an icon).
 */
export interface BadgeProps {
  /**
   * Colour, by meaning:
   * - basic: neutral information, e.g. a category or count
   * - primary: emphasis, e.g. "New"
   * - green: positive / done, e.g. "Paid"
   * - blue: informational, e.g. "In progress"
   * - yellow: needs attention, e.g. "Due soon"
   * - red: a problem, e.g. "Overdue"
   *
   * Colour alone doesn't carry meaning for everyone, so the text should say
   * it too.
   */
  color?: 'basic' | 'primary' | 'red' | 'green' | 'blue' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<BadgeProps>(), {
  color: 'basic',
  size: 'md'
})

defineSlots<{
  default?(): unknown
  leading?(): unknown
  trailing?(): unknown
}>()

// The same border and colours as Button's variants (basic white, the rest
// solid with white text, except yellow, which needs black text to be readable).
const base = 'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-black/15 font-bold'

const colors: Record<NonNullable<BadgeProps['color']>, string> = {
  basic: 'bg-white text-black',
  primary: 'bg-primary text-white',
  red: 'bg-red text-white',
  green: 'bg-green text-white',
  blue: 'bg-blue text-white',
  yellow: 'bg-yellow text-black'
}

// Heights 20 / 24 / 28px, including the border.
const sizes: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'h-5 px-1.5 text-xs gap-1 [&_svg]:size-3',
  md: 'h-6 px-2 text-xs gap-1 [&_svg]:size-3.5',
  lg: 'h-7 px-2.5 text-sm gap-1.5 [&_svg]:size-4'
}
</script>

<template>
  <span :class="cn(base, colors[color], sizes[size], props.class)">
    <slot name="leading" />
    <slot />
    <slot name="trailing" />
  </span>
</template>
