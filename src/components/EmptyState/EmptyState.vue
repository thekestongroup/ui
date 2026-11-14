<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'

/**
 * What to show where a list, table or panel has nothing in it yet: an icon,
 * a short title, a line of explanation, and optionally what to do about it
 * (e.g. a Button). "No connected apps", "You're all caught up", "No
 * applications yet".
 *
 * Slots: title, description, actions (under the text, e.g. a Button),
 * default (anything else, under the description). To animate the icon, pass
 * classes in `ui.icon`.
 */
export interface EmptyStateProps {
  /** Short and specific, e.g. "No connected apps". */
  title?: string
  /** What this space is for, or what to do next. */
  description?: string
  /** A Lucide (or any) icon component, shown above the title. */
  icon?: Component
  /**
   * Make the title a heading, at this level, to fit the page outline (e.g. 2
   * when it fills a page's main area). Without it the title is plain text,
   * as in a panel or table that already has a heading.
   */
  headingLevel?: 2 | 3 | 4
  /**
   * - sm: compact, for panels, popovers and tables.
   * - md (default): for a Card or a page's main area.
   */
  size?: 'sm' | 'md'
  class?: HTMLAttributes['class']
  /** Extra classes for the parts. */
  ui?: {
    icon?: HTMLAttributes['class']
    title?: HTMLAttributes['class']
    description?: HTMLAttributes['class']
    actions?: HTMLAttributes['class']
  }
}

const props = withDefaults(defineProps<EmptyStateProps>(), {
  size: 'md'
})

defineSlots<{
  default?(): unknown
  title?(): unknown
  description?(): unknown
  actions?(): unknown
}>()

const sizes = {
  sm: { root: 'gap-2 px-4 py-10', icon: 'size-6', title: 'text-sm', description: 'text-sm' },
  md: { root: 'gap-2 px-4 py-12', icon: 'size-8', title: 'text-base', description: 'text-sm' }
} as const
</script>

<template>
  <div :class="cn('flex flex-col items-center text-center', sizes[size].root, props.class)">
    <div v-if="icon" :class="cn('flex text-black/45', size === 'md' && 'mb-1', ui?.icon)" aria-hidden="true">
      <component :is="icon" :class="sizes[size].icon" />
    </div>

    <component
      :is="headingLevel ? `h${headingLevel}` : 'p'"
      v-if="$slots.title || title"
      :class="cn('font-bold text-black', sizes[size].title, ui?.title)"
    >
      <slot name="title">{{ title }}</slot>
    </component>

    <p
      v-if="$slots.description || description"
      :class="cn('max-w-sm text-black/65', sizes[size].description, ui?.description)"
    >
      <slot name="description">{{ description }}</slot>
    </p>

    <slot />

    <div v-if="$slots.actions" :class="cn('mt-2 flex flex-wrap justify-center gap-2', ui?.actions)">
      <slot name="actions" />
    </div>
  </div>
</template>
