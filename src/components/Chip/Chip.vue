<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { X } from '@lucide/vue'
import { cn } from '../../lib/cn'

/**
 * A small item someone has chosen or entered, e.g. a recipient or a filter,
 * usually shown in a row that wraps. Unlike Badge (a fully rounded status
 * label), a chip has the same 4px corners as Button and Input, and can have a
 * × to remove it.
 *
 * Slots: default (the text), leading (e.g. an icon).
 */
export interface ChipProps {
  size?: 'sm' | 'md'
  /** Show a × that emits `remove`. */
  removable?: boolean
  /** Accessible name of the ×, e.g. "Remove Ben Blissett". Default "Remove". */
  removeLabel?: string
  /**
   * Let keyboard users Tab to the ×. Off when something else offers a
   * keyboard way to remove it (e.g. Backspace in Select's search box).
   */
  removeFocusable?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ChipProps>(), {
  size: 'md',
  removeLabel: 'Remove',
  removeFocusable: true
})

const emit = defineEmits<{ remove: [] }>()

defineSlots<{
  default?(): unknown
  leading?(): unknown
}>()

// Light grey fill and the shared border, so it reads as a chosen item on a
// white field without competing with buttons.
const base = [
  'inline-flex max-w-full shrink-0 items-center whitespace-nowrap rounded border border-black/15 bg-black/5 text-black',
  '[&_svg]:shrink-0'
]

// Heights 20 / 24px, including the border. With a ×, the right padding
// shrinks so the × sits close to the edge.
const sizes: Record<NonNullable<ChipProps['size']>, string> = {
  sm: 'h-5 gap-1 px-1.5 text-xs [&_svg]:size-3',
  md: 'h-6 gap-1 px-2 text-sm [&_svg]:size-3.5'
}
const removableSizes: Record<NonNullable<ChipProps['size']>, string> = {
  sm: 'pr-0.5',
  md: 'pr-1'
}
const removeSizes: Record<NonNullable<ChipProps['size']>, string> = {
  sm: 'size-4',
  md: 'size-5'
}
</script>

<template>
  <span :class="cn(base, sizes[size], removable && removableSizes[size], disabled && 'opacity-40', props.class)">
    <slot name="leading" />
    <span class="min-w-0 truncate"><slot /></span>
    <button
      v-if="removable"
      type="button"
      :tabindex="removeFocusable ? undefined : -1"
      :aria-label="removeLabel"
      :disabled="disabled"
      :class="cn(
        'flex shrink-0 cursor-pointer items-center justify-center rounded-sm transition',
        'not-disabled:hover:bg-black/10 not-disabled:active:bg-black/15 disabled:cursor-not-allowed',
        'outline-2 outline-offset-0 outline-transparent focus-visible:outline-focus',
        removeSizes[size]
      )"
      @click="emit('remove')"
    >
      <X aria-hidden="true" />
    </button>
  </span>
</template>
