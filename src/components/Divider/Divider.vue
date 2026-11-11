<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Separator } from 'reka-ui'
import { cn } from '../../lib/cn'

/**
 * A thin line between groups of content, in the same black 15% as every
 * border. Horizontal (between stacked content) or vertical (between items in
 * a row, e.g. toolbar buttons). Optionally with a short label in the middle,
 * e.g. "or".
 *
 * Decorative by default (hidden from screen readers), as the content either
 * side usually has headings. Set `decorative` to false when the split itself
 * carries meaning.
 *
 * Slots: default (the label, instead of the `label` prop).
 */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  /** Short text in the middle of a horizontal divider, e.g. "or". */
  label?: string
  /** Hidden from screen readers (the default). False: announced as a separator. */
  decorative?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
  decorative: true
})

defineSlots<{ default?(): unknown }>()
</script>

<template>
  <!-- With a label: a line either side of the text. -->
  <div
    v-if="orientation === 'horizontal' && (label || $slots.default)"
    :role="decorative ? 'presentation' : 'separator'"
    :aria-label="decorative ? undefined : label"
    :class="cn('flex w-full items-center gap-3 text-xs text-black/65', props.class)"
  >
    <span aria-hidden="true" class="h-px flex-1 bg-black/15" />
    <span class="shrink-0"><slot>{{ label }}</slot></span>
    <span aria-hidden="true" class="h-px flex-1 bg-black/15" />
  </div>

  <Separator
    v-else
    :orientation="orientation"
    :decorative="decorative"
    :class="cn(
      'shrink-0 bg-black/15',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
      props.class
    )"
  />
</template>
