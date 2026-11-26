<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Circle, CircleCheck } from '@lucide/vue'
import { cn } from '../../lib/cn'

/**
 * Steps towards something, ticked off as they're done: what's left before a
 * form can be submitted, or setting up a new school year. It shows progress;
 * people don't tick it themselves (use Checkbox for that).
 */
export interface ChecklistItem {
  /** What needs doing, e.g. "Term dates". */
  label: string
  done: boolean
}

export interface ChecklistProps {
  items: ChecklistItem[]
  /** Turns the circles of items not done yet red, e.g. after submitting a form that doesn't meet them. */
  invalid?: boolean
  class?: HTMLAttributes['class']
}

const props = defineProps<ChecklistProps>()
</script>

<template>
  <ul :class="cn('flex flex-col gap-2 text-sm', props.class)">
    <li v-for="item in items" :key="item.label" class="flex items-start gap-2">
      <!-- h-5 keeps the icon level with the first line of a label that wraps. -->
      <span class="flex h-5 shrink-0 items-center">
        <CircleCheck v-if="item.done" class="size-4 text-green-fg" aria-hidden="true" />
        <Circle v-else :class="cn('size-4', invalid ? 'text-red-fg' : 'text-ink/40')" aria-hidden="true" />
      </span>
      <span :class="item.done ? 'text-ink' : 'text-ink/65'">
        {{ item.label }}<span class="sr-only">{{ item.done ? ' (done)' : ' (to do)' }}</span>
      </span>
    </li>
  </ul>
</template>
