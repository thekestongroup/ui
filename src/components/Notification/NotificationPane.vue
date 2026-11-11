<script setup lang="ts">
import { computed, nextTick, ref, useId, watch, type HTMLAttributes } from 'vue'
import { Bell, BellOff } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Button from '../Button/Button.vue'
import Popover from '../Popover/Popover.vue'
import Notification from './Notification.vue'
import { useNotifications, type Notifications } from './notifications'

/**
 * The bell in the Header, with a count of unread notifications, that opens
 * a panel of past notifications: newest first, each with a × to remove it,
 * and Clear all. Put it in the Header's `trailing` slot (AppShell's
 * `header-trailing`).
 *
 * Opening it shows what's unread (a dot on each); closing it marks them all
 * read.
 */
export interface NotificationPaneProps {
  /** The list to show. Default the shared one from `useNotifications()`. */
  notifications?: Notifications
  /** Panel heading, and the bell's name. */
  label?: string
  /** Shown when there are none. */
  emptyText?: string
  ui?: { content?: HTMLAttributes['class']; trigger?: HTMLAttributes['class'] }
}

const props = withDefaults(defineProps<NotificationPaneProps>(), {
  label: 'Notifications',
  emptyText: "You're all caught up."
})

const open = defineModel<boolean>('open', { default: false })

const store = computed(() => props.notifications ?? useNotifications())
const items = computed(() => store.value.items)
const unread = computed(() => store.value.unreadCount.value)
const countText = computed(() => (unread.value > 9 ? '9+' : String(unread.value)))
const triggerLabel = computed(() => (unread.value ? `${props.label}, ${unread.value} unread` : props.label))

const headingId = `${useId()}-heading`
const heading = ref<HTMLElement>()
const list = ref<HTMLElement>()

// Mark everything read when the panel closes, so the dots show while open.
watch(open, (isOpen, wasOpen) => {
  if (!isOpen && wasOpen) store.value.markAllRead()
})

// After removing one, focus moves to the × of the one that took its place
// (or the one before), so keyboard users keep their place. With none left,
// focus goes to the heading.
async function dismiss(id: string, index: number) {
  store.value.dismiss(id)
  await nextTick()
  const buttons = list.value?.querySelectorAll<HTMLElement>('[data-dismiss]') ?? []
  const next = buttons[Math.min(index, buttons.length - 1)]
  ;(next ?? heading.value)?.focus()
}

async function clearAll() {
  store.value.clear()
  await nextTick()
  heading.value?.focus()
}
</script>

<template>
  <Popover
    v-model:open="open"
    :content="{ align: 'end', collisionPadding: 8 }"
    :ui="{ content: cn('flex max-h-(--reka-popover-content-available-height) w-96 overflow-clip max-w-[calc(100vw-1rem)] flex-col', ui?.content) }"
  >
    <Button variant="ghost" square :aria-label="triggerLabel" :class="cn('relative', ui?.trigger)">
      <Bell />
      <span
        v-if="unread"
        class="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-xs leading-none font-bold text-white ring-2 ring-white"
        aria-hidden="true"
      >
        {{ countText }}
      </span>
    </Button>

    <template #content="{ close }">
      <section :aria-labelledby="headingId" class="flex min-h-0 flex-col">
        <div class="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-black/15 pr-2 pl-4">
          <h2 :id="headingId" ref="heading" tabindex="-1" class="font-bold outline-none">{{ label }}</h2>
          <Button v-if="items.length" variant="ghost" size="sm" @click="clearAll">Clear all</Button>
        </div>

        <ul
          v-if="items.length"
          ref="list"
          class="min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
        >
          <li v-for="(item, index) in items" :key="item.id" class="border-b border-black/15 last:border-b-0">
            <Notification
              appearance="row"
              :type="item.type"
              :title="item.title"
              :description="item.description"
              :action="item.action"
              :created-at="item.createdAt"
              :unread="!item.read"
              @dismiss="dismiss(item.id, index)"
              @action="close()"
            />
          </li>
        </ul>

        <div v-else class="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-black/65">
          <BellOff class="size-6 text-black/40" aria-hidden="true" />
          {{ emptyText }}
        </div>
      </section>
    </template>
  </Popover>
</template>
