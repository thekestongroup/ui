<script setup lang="ts" generic="Item extends SummaryListItem">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'

/**
 * Labelled values, e.g. a record's details or a summary before you submit:
 * "Email  office@keston.school". A description list (`<dl>`) underneath.
 *
 * Layouts:
 * - rows (default): label on the left, value beside it, a line between rows.
 *   Stacks the label above the value when the container is narrow (under
 *   384px). With an action per row (e.g. Change) for check-your-answers pages.
 * - compact: label left, value right-aligned, no lines. For figures in a
 *   sidebar or summary card ("Moving up a year  1,204").
 * - stacked: label above value, in a grid of up to 3 columns as space
 *   allows. For a lot of short facts.
 *
 * Slots: value (scoped `{ item, index }`, for a Badge, link, etc.), action
 * (scoped, e.g. a Change button).
 */
export interface SummaryListItem {
  label: string
  /** Shown as text. Empty shows "—" (read as "Not set"). Use the value slot for anything richer. */
  value?: string | number | null
  /** Smaller grey text under the value. */
  description?: string
  /** Bold value, e.g. a total. */
  emphasis?: boolean
}

export interface SummaryListProps<Item extends SummaryListItem = SummaryListItem> {
  items: Item[]
  layout?: 'rows' | 'compact' | 'stacked'
  /** Width of the label column in the rows layout. */
  labelWidth?: 'sm' | 'md' | 'lg'
  /** What an empty value is read as. */
  emptyLabel?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<SummaryListProps<Item>>(), {
  layout: 'rows',
  labelWidth: 'md',
  emptyLabel: 'Not set'
})

defineSlots<{
  value?(props: { item: Item; index: number }): unknown
  action?(props: { item: Item; index: number }): unknown
}>()

const isEmpty = (value: SummaryListItem['value']) => value === null || value === undefined || value === ''

// 128 / 192 / 256px label column, from the container's @sm (384px).
const labelWidths = {
  sm: '@sm:grid-cols-[8rem_1fr_auto]',
  md: '@sm:grid-cols-[12rem_1fr_auto]',
  lg: '@sm:grid-cols-[16rem_1fr_auto]'
} as const
</script>

<template>
  <div :class="cn('@container text-sm text-black', props.class)">
    <dl
      :class="
        cn(
          layout === 'rows' && 'flex flex-col',
          layout === 'compact' && 'grid grid-cols-[1fr_auto] gap-x-4 gap-y-2',
          layout === 'stacked' && 'grid grid-cols-1 gap-x-6 gap-y-4 @sm:grid-cols-2 @2xl:grid-cols-3'
        )
      "
    >
      <!-- rows -->
      <template v-if="layout === 'rows'">
        <div
          v-for="(item, index) in items"
          :key="item.label"
          :class="
            cn(
              'grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-black/15 py-3 first:pt-0 last:border-b-0 last:pb-0',
              labelWidths[labelWidth]
            )
          "
        >
          <dt class="col-span-2 text-black/65 @sm:col-span-1">{{ item.label }}</dt>
          <dd :class="cn('min-w-0 break-words', item.emphasis && 'font-bold', !$slots.action && 'col-span-2')">
            <slot name="value" :item="item" :index="index">
              <template v-if="!isEmpty(item.value)">{{ item.value }}</template>
              <template v-else><span class="text-black/40" aria-hidden="true">—</span><span class="sr-only">{{ emptyLabel }}</span></template>
            </slot>
            <span v-if="item.description" class="mt-0.5 block text-black/65">{{ item.description }}</span>
          </dd>
          <dd v-if="$slots.action" class="justify-self-end">
            <slot name="action" :item="item" :index="index" />
          </dd>
        </div>
      </template>

      <!-- compact and stacked: one div per pair keeps dt/dd together for screen readers -->
      <template v-else>
        <div
          v-for="(item, index) in items"
          :key="item.label"
          :class="layout === 'compact' ? 'col-span-2 grid grid-cols-subgrid items-baseline' : 'flex min-w-0 flex-col gap-1'"
        >
          <dt class="text-black/65">{{ item.label }}</dt>
          <dd
            :class="
              cn(
                'min-w-0 break-words',
                layout === 'compact' && 'text-right font-bold tabular-nums',
                item.emphasis && 'font-bold'
              )
            "
          >
            <slot name="value" :item="item" :index="index">
              <template v-if="!isEmpty(item.value)">{{ item.value }}</template>
              <template v-else><span class="text-black/40" aria-hidden="true">—</span><span class="sr-only">{{ emptyLabel }}</span></template>
            </slot>
            <span v-if="item.description" class="mt-0.5 block font-normal text-black/65">{{ item.description }}</span>
            <span v-if="$slots.action" class="mt-1 block font-normal"><slot name="action" :item="item" :index="index" /></span>
          </dd>
        </div>
      </template>
    </dl>
  </div>
</template>
