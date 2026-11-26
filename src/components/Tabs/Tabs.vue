<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { cn } from '../../lib/cn'

export interface Tab {
  /** Identifies the tab: v-model's value, and the name of its content slot. */
  value: string
  label: string
  /** A Lucide (or any) icon component, shown before the label. */
  icon?: Component
  disabled?: boolean
}

/**
 * Sections of one page, one shown at a time, e.g. a user's Account and
 * Licences & Apps. Built on Reka UI's Tabs: a tab list (arrow keys move
 * between tabs, Home / End jump), each tab's content in a slot named after
 * its value. Use v-model to know or set the open tab (e.g. to keep it in
 * the URL).
 */
export interface TabsProps {
  tabs: Tab[]
  /** The tab list's accessible name, e.g. "User details". */
  label: string
  class?: HTMLAttributes['class']
}

const props = defineProps<TabsProps>()
/** The open tab's value. Defaults to the first tab. */
const model = defineModel<string>()

defineSlots<Record<string, () => unknown>>()

// Like Sidebar's items: muted until hovered or chosen; the chosen one is
// primary, with a bar under it that slides between tabs.
const trigger = [
  'relative inline-flex h-10 items-center gap-2 px-3 text-sm whitespace-nowrap text-ink/65 outline-none',
  '[&_svg]:size-4 [&_svg]:shrink-0',
  'not-data-disabled:hover:text-ink',
  'data-[state=active]:font-bold data-[state=active]:text-primary-fg',
  'focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary',
  'data-disabled:cursor-not-allowed data-disabled:opacity-40'
]
</script>

<template>
  <TabsRoot
    :model-value="model ?? tabs[0]?.value"
    :class="cn('flex flex-col gap-6', props.class)"
    @update:model-value="model = String($event)"
  >
    <!-- Scrolls sideways on narrow screens rather than wrapping. -->
    <TabsList :aria-label="label" class="relative flex overflow-x-auto overflow-y-hidden border-b border-ink/10">
      <TabsTrigger v-for="t in tabs" :key="t.value" :value="t.value" :disabled="t.disabled" :class="trigger">
        <component :is="t.icon" v-if="t.icon" aria-hidden="true" />
        {{ t.label }}
      </TabsTrigger>
      <TabsIndicator
        class="absolute bottom-0 left-0 h-0.5 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) rounded-full transition-[width,translate] duration-200 motion-reduce:transition-none"
      >
        <span class="block size-full rounded-full bg-primary" />
      </TabsIndicator>
    </TabsList>
    <TabsContent v-for="t in tabs" :key="t.value" :value="t.value" class="outline-none">
      <slot :name="t.value" />
    </TabsContent>
  </TabsRoot>
</template>
