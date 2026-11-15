<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { Ellipsis } from '@lucide/vue'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger
} from 'reka-ui'
import { cn } from '../../lib/cn'
import Button from '../Button/Button.vue'
import { popoverContent } from '../Popover/popover'

export interface MenuItem {
  label: string
  /** A Lucide (or any) icon component, shown before the label. */
  icon?: Component
  /** Called when it's chosen (click, Enter or Space). */
  onSelect?: () => void
  /** Link with a plain <a href>. */
  href?: string
  /** Link through `linkComponent` (e.g. RouterLink), which receives `to`. */
  to?: unknown
  disabled?: boolean
}

/**
 * More actions behind a "⋯" button, e.g. on each row of a table: Open,
 * Reset password, Delete… Built on Reka UI's DropdownMenu, so it's a proper
 * menu: arrow keys move between items, typing jumps to one, Escape closes
 * it and focus goes back to the button.
 *
 * Items run `onSelect`, or are links (`href`, or `to` through
 * `linkComponent`).
 */
export interface MenuProps {
  items: MenuItem[]
  /** The button's accessible name, e.g. "Actions for Jo Bloggs". It has no visible text. */
  label: string
  /** The button's size; `sm` in compact tables. */
  size?: 'sm' | 'md'
  /** Component used for items with `to`, e.g. RouterLink or NuxtLink. */
  linkComponent?: string | Component
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<MenuProps>(), {
  size: 'md',
  linkComponent: 'a'
})

function tagFor(item: MenuItem) {
  if (item.to !== undefined) return props.linkComponent
  if (item.href !== undefined) return 'a'
  return 'div'
}

function attrsFor(item: MenuItem) {
  if (item.to !== undefined) return { to: item.to }
  if (item.href !== undefined) return { href: item.href }
  return {}
}

// Like Select's options: 32px rows, 8px either side, tinted like a ghost
// Button when highlighted.
const item = [
  'flex min-h-8 cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-black no-underline outline-none select-none',
  '[&_svg]:size-4 [&_svg]:shrink-0',
  'data-highlighted:bg-black/10',
  'data-disabled:cursor-not-allowed data-disabled:opacity-40'
]
</script>

<template>
  <DropdownMenuRoot :modal="false">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" square :size="size" :aria-label="label" :class="props.class">
        <Ellipsis />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        align="end"
        :side-offset="4"
        :collision-padding="8"
        :class="cn(popoverContent, 'min-w-48 p-1')"
      >
        <DropdownMenuItem
          v-for="i in items"
          :key="i.label"
          :as="tagFor(i)"
          v-bind="attrsFor(i)"
          :disabled="i.disabled"
          :class="item"
          @select="i.onSelect?.()"
        >
          <component :is="i.icon" v-if="i.icon" aria-hidden="true" />
          {{ i.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
