<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import Breadcrumb, { type BreadcrumbItem } from '../Breadcrumb/Breadcrumb.vue'
import Button from '../Button/Button.vue'

/** One of the page's everyday actions, in the toolbar under the title. */
export interface PageHeaderAction {
  label: string
  icon?: Component
  /** Runs on click, e.g. opens a Slideover. */
  onSelect?: () => void
  /** Link with a plain <a href>. */
  href?: string
  /** Link through `linkComponent` (e.g. RouterLink), which receives `to`. */
  to?: unknown
  disabled?: boolean
}

/**
 * The top of a page: where it is (breadcrumb), what it is (the h1 title, with
 * an optional status badge and description), and its main actions on the
 * right. Actions wrap under the title on narrow screens.
 *
 * `toolbar`: the everyday things people do to what the page is about (e.g.
 * on a user: Reset password, Unblock sign-in, Delete user), as a row of quiet
 * buttons under the title. Keep the one main action (Save, Add…) in the
 * actions slot on the right; the toolbar is for the rest.
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
  /** Everyday actions, in a row under the title. */
  toolbar?: PageHeaderAction[]
  class?: HTMLAttributes['class']
  /** Extra classes for the parts. */
  ui?: {
    title?: HTMLAttributes['class']
    description?: HTMLAttributes['class']
    actions?: HTMLAttributes['class']
    toolbar?: HTMLAttributes['class']
  }
}

const props = withDefaults(defineProps<PageHeaderProps>(), { linkComponent: 'a' })

// Links render as links, the rest as buttons.
function as(item: PageHeaderAction) {
  if (item.to !== undefined) return props.linkComponent
  if (item.href !== undefined) return 'a'
  return 'button'
}

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

    <!-- Ghost buttons in a white bar, like a Card. -->
    <div
      v-if="toolbar?.length"
      role="group"
      :aria-label="`${title} actions`"
      :class="cn('flex flex-wrap items-center gap-1 rounded-lg border border-black/15 bg-white p-1', ui?.toolbar)"
    >
      <Button
        v-for="item in toolbar"
        :key="item.label"
        :as="as(item)"
        :to="item.to"
        :href="item.href"
        variant="ghost"
        :disabled="item.disabled"
        @click="item.onSelect?.()"
      >
        <template v-if="item.icon" #leading><component :is="item.icon" aria-hidden="true" /></template>
        {{ item.label }}
      </Button>
    </div>

    <slot />
  </header>
</template>
