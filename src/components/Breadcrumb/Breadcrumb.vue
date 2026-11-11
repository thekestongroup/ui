<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { ChevronRight } from '@lucide/vue'
import { cn } from '../../lib/cn'

export interface BreadcrumbItem {
  label: string
  /** A Lucide (or any) icon component, shown before the label. */
  icon?: Component
  /** Link with a plain <a href>. */
  href?: string
  /** Link through `linkComponent` (e.g. RouterLink), which receives `to`. */
  to?: unknown
  /** Called when the step is chosen (for steps that aren't links). */
  onSelect?: (event: MouseEvent) => void
}

/**
 * Where the current page is: its parents, then the page itself, e.g.
 * School › School Structure › New School Year Setup. Earlier steps with a
 * `href`, `to` or `onSelect` are links back; steps without are plain text
 * (e.g. a group that isn't a page itself). The last step is the current page.
 *
 * SidebarItems fit, so it can follow a nested Sidebar:
 * `<Breadcrumb :items="sidebarTrail(items, sections)" />`.
 */
export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** Accessible name of the navigation landmark. */
  label?: string
  /** Component used for steps with `to`, e.g. RouterLink or NuxtLink. */
  linkComponent?: string | Component
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  label: 'Breadcrumb',
  linkComponent: 'a'
})

const emit = defineEmits<{
  /** A step before the current page was chosen. */
  select: [item: BreadcrumbItem, event: MouseEvent]
}>()

// Steps that lead somewhere are links (or buttons, for onSelect); the rest,
// and the current page, are text.
function tagFor(item: BreadcrumbItem) {
  if (item.to !== undefined) return props.linkComponent
  if (item.href) return 'a'
  if (item.onSelect) return 'button'
  return undefined
}

function attrsFor(item: BreadcrumbItem) {
  if (item.to !== undefined) return { to: item.to }
  if (item.href) return { href: item.href }
  return { type: 'button' }
}

function select(item: BreadcrumbItem, event: MouseEvent) {
  item.onSelect?.(event)
  emit('select', item, event)
}

// Every step: one line, cut off with … past 240px (full text on hover).
const step = 'inline-flex max-w-60 min-w-0 items-center gap-1.5 [&_svg]:size-3.5 [&_svg]:shrink-0'

const link = [
  'cursor-pointer rounded-sm text-black/65 underline-offset-2 transition',
  'hover:text-black hover:underline',
  'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus'
]
</script>

<template>
  <nav :aria-label="label" :class="cn('min-w-0 text-sm', props.class)">
    <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <li v-for="(item, i) in items" :key="`${item.label}-${i}`" class="flex min-w-0 items-center gap-1.5">
        <!-- The current page. -->
        <span v-if="i === items.length - 1" aria-current="page" :title="item.label" :class="cn(step, 'text-black')">
          <component :is="item.icon" v-if="item.icon" aria-hidden="true" />
          <span class="truncate">{{ item.label }}</span>
        </span>

        <!-- A step back that leads somewhere. -->
        <component
          :is="tagFor(item)"
          v-else-if="tagFor(item)"
          v-bind="attrsFor(item)"
          :title="item.label"
          :class="cn(step, link)"
          @click="select(item, $event)"
        >
          <component :is="item.icon" v-if="item.icon" aria-hidden="true" />
          <span class="truncate">{{ item.label }}</span>
        </component>

        <!-- A step that isn't a page itself, e.g. a group. -->
        <span v-else :title="item.label" :class="cn(step, 'text-black/65')">
          <component :is="item.icon" v-if="item.icon" aria-hidden="true" />
          <span class="truncate">{{ item.label }}</span>
        </span>

        <ChevronRight v-if="i < items.length - 1" aria-hidden="true" class="size-3.5 shrink-0 text-black/40" />
      </li>
    </ol>
  </nav>
</template>
