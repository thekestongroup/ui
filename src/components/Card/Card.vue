<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'

/**
 * A white panel that groups related content on a page: a form section, a
 * summary, a stat, a table. Same border, radius and white as Button, Input
 * and Popover, so everything on the grey page background matches.
 *
 * With a `title` it's a labelled region (a `<section>` named by its heading),
 * so screen reader users can jump between cards. It's also a size container:
 * children can lay out by the card's width with `@sm:` / `@lg:` etc.
 *
 * Slots: default (the content), header (replaces title and description),
 * actions (top right, beside the title, e.g. an Edit button), footer (under a
 * divider, right-aligned, e.g. Cancel / Save).
 */
export interface CardProps {
  /** Heading. Also the card's accessible name. */
  title?: string
  /** Smaller grey text under the title. */
  description?: string
  /** Heading level, to fit the page outline (h1 is the page title). */
  headingLevel?: 2 | 3 | 4
  /**
   * Space inside:
   * - md (default): 16px, 24px from the sm breakpoint. Sections and forms.
   * - sm: 16px. Small cards, e.g. stats in a grid.
   * - none: content touches the edges, e.g. a table.
   */
  padding?: 'none' | 'sm' | 'md'
  /** Element to render. Defaults to section (with a title) or div. */
  as?: 'section' | 'aside' | 'article' | 'div'
  class?: HTMLAttributes['class']
  /** Extra classes for the parts. */
  ui?: {
    header?: HTMLAttributes['class']
    body?: HTMLAttributes['class']
    footer?: HTMLAttributes['class']
  }
}

const props = withDefaults(defineProps<CardProps>(), {
  headingLevel: 2,
  padding: 'md'
})

defineSlots<{
  default?(): unknown
  header?(): unknown
  actions?(): unknown
  footer?(): unknown
}>()

const headingId = `${useId()}-title`
const tag = computed(() => props.as ?? (props.title ? 'section' : 'div'))

const paddings: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-4 sm:p-6'
}

// The footer lines up with the body's sides; with no padding it keeps 16px.
const footerPaddings: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'px-4 py-3',
  sm: 'px-4 py-3',
  md: 'px-4 py-3 sm:px-6 sm:py-4'
}
</script>

<template>
  <component
    :is="tag"
    :aria-labelledby="title ? headingId : undefined"
    :class="cn('@container flex flex-col rounded-lg border border-black/15 bg-white text-black', props.class)"
  >
    <div :class="cn('flex min-w-0 flex-1 flex-col gap-4', paddings[padding], ui?.body)">
      <div
        v-if="title || description || $slots.header || $slots.actions"
        :class="cn('flex items-start justify-between gap-3', ui?.header)"
      >
        <slot name="header">
          <div class="flex min-w-0 flex-col gap-1">
            <component :is="`h${headingLevel}`" v-if="title" :id="headingId" class="text-base font-bold">
              {{ title }}
            </component>
            <p v-if="description" class="text-sm text-black/65">{{ description }}</p>
          </div>
        </slot>
        <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
          <slot name="actions" />
        </div>
      </div>

      <slot />
    </div>

    <div
      v-if="$slots.footer"
      :class="cn('flex flex-wrap justify-end gap-2 border-t border-black/15', footerPaddings[padding], ui?.footer)"
    >
      <slot name="footer" />
    </div>
  </component>
</template>
