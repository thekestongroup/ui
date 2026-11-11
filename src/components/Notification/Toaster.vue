<script setup lang="ts">
import { computed, reactive, type HTMLAttributes } from 'vue'
import { ToastProvider, ToastRoot, ToastViewport } from 'reka-ui'
import { cn } from '../../lib/cn'
import Notification from './Notification.vue'
import { useNotifications, type Notifications } from './notifications'

/**
 * Shows new notifications as toasts: cards that pop up in a corner, stack,
 * and close by themselves. Put one in the app (e.g. beside AppShell), then
 * call `notify()` from anywhere:
 *
 *   const { notify } = useNotifications()
 *   notify({ type: 'success', title: 'Saved' })
 *
 * Built on Reka UI's Toast: screen readers hear each one (errors and
 * warnings straight away, others when they're idle), timers pause while the
 * pointer is over them or the window isn't focused, they swipe away, and F8
 * jumps to them.
 *
 * Closing a toast leaves the notification in the list (NotificationPane).
 */
export interface ToasterProps {
  /** The list to show. Default the shared one from `useNotifications()`. */
  notifications?: Notifications
  /** Where they appear. top-right sits under the 48px Header. */
  position?: 'bottom-right' | 'top-right' | 'bottom-center'
  /** How many show at once. More wait until one closes. */
  limit?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'bottom-right',
  limit: 3
})

const store = computed(() => props.notifications ?? useNotifications())
// The newest `limit`, oldest at the top of the stack (newest nearest the edge).
const shown = computed(() => store.value.toasts.slice(-props.limit))

// Closing animates first, then removes the toast from the list.
const closing = reactive(new Set<string>())
function setOpen(id: string, open: boolean) {
  if (open || closing.has(id)) return
  closing.add(id)
  setTimeout(() => {
    store.value.hideToast(id)
    closing.delete(id)
  }, 200)
}

const positions = {
  'bottom-right': 'right-0 bottom-0 flex-col justify-end sm:w-96',
  'top-right': 'top-12 right-0 flex-col-reverse sm:w-96',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 flex-col justify-end sm:w-96'
} as const

const enter = {
  'bottom-right': 'data-[state=open]:animate-slide-in-right',
  'top-right': 'data-[state=open]:animate-slide-in-right',
  'bottom-center': 'data-[state=open]:animate-slide-in-bottom'
} as const
</script>

<template>
  <!-- label: said before each toast. The viewport's label names the area F8 jumps to. -->
  <ToastProvider swipe-direction="right" label="Notification">
    <ToastRoot
      v-for="toast in shown"
      :key="toast.id"
      :open="!closing.has(toast.id)"
      :duration="toast.duration"
      :type="toast.item.type === 'error' || toast.item.type === 'warning' ? 'foreground' : 'background'"
      :class="
        cn(
          'pointer-events-auto',
          enter[position],
          'data-[state=closed]:animate-fade-out',
          'data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x)',
          'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform',
          'data-[swipe=end]:animate-slide-out-right'
        )
      "
      @update:open="setOpen(toast.id, $event)"
    >
      <Notification
        :type="toast.item.type"
        :title="toast.item.title"
        :description="toast.item.description"
        :action="toast.item.action"
        :compact="toast.item.compact"
        class="shadow-md"
        :dismiss-label="`Close: ${toast.item.title}`"
        @dismiss="setOpen(toast.id, false)"
        @action="setOpen(toast.id, false)"
      />
    </ToastRoot>

    <ToastViewport
      label="Notifications ({hotkey})"
      :class="
        cn(
          'pointer-events-none fixed z-100 flex w-full gap-2 p-4 outline-none',
          positions[position],
          props.class
        )
      "
    />
  </ToastProvider>
</template>
