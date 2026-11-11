<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Button from '../Button/Button.vue'
import RelativeTime from '../RelativeTime/RelativeTime.vue'
import { type NotificationAction, type NotificationInput, type NotificationType } from './notifications'

/**
 * One notification: an icon for its type, a title, a description, an
 * optional action button, and a close ×.
 *
 * - appearance "card" (default): a white panel with a border. On a page, or
 *   as a toast (Toaster adds the shadow).
 * - appearance "row": no border, for lists, e.g. NotificationPane. Shows the
 *   time, and a dot when unread.
 *
 * The description can be formatted with a render function, e.g.
 * `() => ['Your password expires in ', h('b', '7 days'), '.']`, or the
 * default slot.
 */
export interface NotificationProps {
  type?: NotificationType
  title: string
  description?: NotificationInput['description']
  action?: NotificationAction
  /** When it happened. Shown in the row appearance, e.g. "2 hours ago", with the exact time on hover. */
  createdAt?: Date
  /** Row appearance: show the unread dot. */
  unread?: boolean
  appearance?: 'card' | 'row'
  /**
   * Card appearance: one line, for quick confirmations, e.g. "✓ Student
   * disabled [Undo] ×". The title only (no description); the action sits on
   * the right, before the ×.
   */
  compact?: boolean
  /** Show the close ×. */
  dismissible?: boolean
  /** The ×'s accessible name. Default "Dismiss: {title}". */
  dismissLabel?: string
  /** What "now" is for the relative time. Default the live time. */
  now?: Date
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<NotificationProps>(), {
  type: 'info',
  appearance: 'card',
  dismissible: true
})

const emit = defineEmits<{ dismiss: []; action: [] }>()

defineSlots<{
  default?(): unknown
  actions?(): unknown
}>()

const titleId = `${useId()}-title`

const types = {
  info: { icon: Info, colour: 'text-blue', word: 'Information' },
  success: { icon: CircleCheck, colour: 'text-green', word: 'Success' },
  warning: { icon: TriangleAlert, colour: 'text-orange', word: 'Warning' },
  error: { icon: CircleX, colour: 'text-red', word: 'Error' }
} as const

// A string, or a render function (for bold text, links).
const Description = () => (typeof props.description === 'function' ? props.description() : props.description)

// Compact only changes the card; in a list (row) it reads like the others.
const oneLine = computed(() => props.compact && props.appearance === 'card')

function runAction() {
  props.action?.onSelect?.()
  emit('action')
}
</script>

<template>
  <div
    :aria-labelledby="titleId"
    role="group"
    :class="
      cn(
        'relative flex text-sm text-black',
        oneLine ? 'items-center gap-2' : 'gap-3',
        appearance === 'row' ? 'px-4 py-3' : 'rounded border border-black/15 bg-white',
        appearance === 'card' && (oneLine ? cn('py-1.5 pl-3', dismissible ? 'pr-1.5' : 'pr-3') : 'p-4'),
        appearance === 'row' && unread && 'bg-blue/5',
        props.class
      )
    "
  >
    <component :is="types[type].icon" :class="cn('size-4 shrink-0', !oneLine && 'mt-0.5', types[type].colour)" aria-hidden="true" />

    <div :class="cn('flex min-w-0 flex-1', oneLine ? 'items-center gap-3' : 'flex-col gap-1')">
      <p :id="titleId" :class="cn('font-bold', oneLine && 'min-w-0 flex-1 py-1')">
        <span class="sr-only">{{ types[type].word }}: </span>{{ title }}
      </p>

      <div v-if="!oneLine && (description || $slots.default)" class="text-black/65 [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_b]:font-bold [&_b]:text-black [&_strong]:font-bold [&_strong]:text-black">
        <slot><Description /></slot>
      </div>

      <p v-if="appearance === 'row' && (createdAt || unread)" class="flex items-center gap-1.5 text-xs text-black/65">
        <span v-if="unread" class="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        <span v-if="unread" class="sr-only">Unread, </span>
        <RelativeTime v-if="createdAt" :date="createdAt" :now="now" />
      </p>

      <div v-if="action || $slots.actions" :class="cn('flex gap-2', oneLine ? 'shrink-0' : 'mt-2 flex-wrap')">
        <slot name="actions">
          <Button v-if="action?.href" size="sm" as-child @click="runAction">
            <a :href="action.href">{{ action.label }}</a>
          </Button>
          <Button v-else-if="action" size="sm" @click="runAction">{{ action.label }}</Button>
        </slot>
      </div>
    </div>

    <Button
      v-if="dismissible"
      variant="ghost"
      size="sm"
      square
      :class="cn('shrink-0', !oneLine && '-mt-1 -mr-1.5')"
      data-dismiss
      :aria-label="dismissLabel ?? `Dismiss: ${title}`"
      @click="emit('dismiss')"
    >
      <X />
    </Button>
  </div>
</template>
