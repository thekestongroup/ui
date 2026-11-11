<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import Breadcrumb, { type BreadcrumbItem } from '../Breadcrumb/Breadcrumb.vue'

/**
 * The top of a page: where it is (breadcrumb), what it is (the h1 title, with
 * an optional status badge and description), and its main actions on the
 * right. Actions wrap under the title on narrow screens.
 *
 * Slots: badge (after the title, e.g. a Badge), description (instead of the
 * prop, for links or formatting), actions (e.g. Buttons), default (anything
 * under, e.g. an alert or tabs).
 */
export interface PageHeaderProps {
  /** The page's name: its h1. */
  title: string
  /** A sentence under the title. */
  description?: string
  /** Where the page is. Pass `sidebarTrail(items)` to follow a nested Sidebar. */
  breadcrumb?: BreadcrumbItem[]
  /** Component used for breadcrumb steps with `to`, e.g. RouterLink. */
  linkComponent?: string | Component
  class?: HTMLAttributes['class']
  /** Extra classes for the parts. */
  ui?: {
    title?: HTMLAttributes['class']
    description?: HTMLAttributes['class']
    actions?: HTMLAttributes['class']
  }
}

const props = defineProps<PageHeaderProps>()

defineSlots<{
  badge?(): unknown
  description?(): unknown
  actions?(): unknown
  default?(): unknown
}>()
</script>

<template>
  <header :class="cn('flex flex-col gap-2', props.class)">
    <!-- Only worth showing once there's somewhere to go back to. -->
    <Breadcrumb v-if="breadcrumb && breadcrumb.length > 1" :items="breadcrumb" :link-component="linkComponent" />

    <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div class="flex min-w-0 flex-col gap-1">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h1 :class="cn('min-w-0 text-2xl font-bold break-words', ui?.title)">{{ title }}</h1>
          <slot name="badge" />
        </div>
        <p v-if="description || $slots.description" :class="cn('max-w-prose text-sm text-black/65', ui?.description)">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>

      <div v-if="$slots.actions" :class="cn('flex flex-wrap items-center gap-2', ui?.actions)">
        <slot name="actions" />
      </div>
    </div>

    <slot />
  </header>
</template>
