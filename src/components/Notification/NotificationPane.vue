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
// The name uses the same text as the badge ("99+"), so voice control users
// can say what they see.
const countText = computed(() => (unread.value > 99 ? '99+' : String(unread.value)))
const triggerLabel = computed(() => (unread.value ? `${props.label}, ${countText.value} unread` : props.label))

const headingId = `${useId()}-heading`
const heading = ref<HTMLElement>()
const list = ref<HTMLElement>()

// Tell the list, so the Toaster puts toasts away while the pane shows them.
watch(open, (isOpen) => store.value.setPaneOpen(isOpen), { immediate: true })

// Open when something else asks, e.g. the Toaster's "+3 more", and move
// focus into the pane (the button pressed is gone with the toasts).
watch(
  () => store.value.paneRequests,
  async () => {
    open.value = true
    await nextTick()
    requestAnimationFrame(() => requestAnimationFrame(() => heading.value?.focus()))
  }
)

// Mark everything read when the panel closes, so the dots show while open.
watch(open, (isOpen, wasOpen) => {
  if (!isOpen && wasOpen) store.value.markAllRead()
})

// Clear all fades the list out first, then clears it when the fade ends and
// eases the pane's height down to the empty state's. `emptied` plays the
// empty state's arrival, only when the last one was just removed here, not
// every time the pane opens empty.
const pane = ref<HTMLElement>()
const clearing = ref(false)
const emptied = ref(false)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Closing mid-fade unmounts the list before its animation ends, so finish
// the clear now.
watch(open, (isOpen) => {
  if (isOpen) emptied.value = false
  else if (clearing.value) finishClear()
})

// After removing one, focus moves to the × of the one that took its place
// (or the one before), so keyboard users keep their place. With none left,
// focus goes to the heading.
async function dismiss(id: string, index: number) {
  store.value.dismiss(id)
  if (!items.value.length) emptied.value = true
  await nextTick()
  const buttons = list.value?.querySelectorAll<HTMLElement>('[data-dismiss]') ?? []
  const next = buttons[Math.min(index, buttons.length - 1)]
  ;(next ?? heading.value)?.focus()
}

function clearAll() {
  if (clearing.value) return
  // With reduced motion there's no fade (and so no animationend): clear now.
  if (reducedMotion()) finishClear()
  else clearing.value = true
}

async function finishClear() {
  const from = pane.value?.offsetHeight
  clearing.value = false
  store.value.clear()
  emptied.value = true
  await nextTick()
  heading.value?.focus()
  // The height is only known once the empty state is in, so animate from the
  // old height to the new one (Tailwind's 300ms ease-out, as `empty-in`).
  const to = pane.value?.offsetHeight
  if (pane.value && from && to && from !== to && !reducedMotion()) {
    pane.value.animate(
      [
        { height: `${from}px`, overflow: 'hidden' },
        { height: `${to}px`, overflow: 'hidden' }
      ],
      { duration: 300, easing: 'cubic-bezier(0, 0, 0.2, 1)' }
    )
  }
}
</script>

<template>
  <Popover
    v-model:open="open"
    :content="{ align: 'end', collisionPadding: 8 }"
    :ui="{ content: cn('flex max-h-(--reka-popover-content-available-height) w-96 overflow-clip max-w-[calc(100vw-1rem)] flex-col', ui?.content) }"
  >
    <Button variant="ghost" square :aria-label="triggerLabel" :class="cn('relative overflow-visible', ui?.trigger)">
      <Bell />
      <span
        v-if="unread"
        class="absolute top-1 left-1/2 ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-xs leading-none font-bold text-white ring-2 ring-white"
        aria-hidden="true"
      >
        {{ countText }}
      </span>
    </Button>

    <template #content="{ close }">
      <section ref="pane" :aria-labelledby="headingId" class="flex min-h-0 flex-col">
        <div class="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-black/15 pr-2 pl-4">
          <h2 :id="headingId" ref="heading" tabindex="-1" class="font-bold outline-none">{{ label }}</h2>
          <Button v-if="items.length" variant="ghost" size="sm" :disabled="clearing" @click="clearAll">
            Clear all
          </Button>
        </div>

        <!-- inert while fading, so nothing in it can be clicked or focused on its way out. -->
        <ul
          v-if="items.length"
          ref="list"
          :inert="clearing"
          :class="cn('min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:thin]', clearing && 'animate-fade-out')"
          @animationend.self="clearing && finishClear()"
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

        <div
          v-else
          :class="cn('flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-black/65', emptied && 'motion-safe:animate-empty-in')"
        >
          <BellOff
            :class="cn('size-6 origin-top text-black/40', emptied && 'motion-safe:animate-bell-wobble')"
            aria-hidden="true"
          />
          {{ emptyText }}
        </div>
      </section>
    </template>
  </Popover>
</template>
