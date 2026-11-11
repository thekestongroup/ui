<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch, type ComponentPublicInstance, type HTMLAttributes } from 'vue'
import { ToastProvider, ToastRoot, ToastViewport } from 'reka-ui'
import { cn } from '../../lib/cn'
import Notification from './Notification.vue'
import { useNotifications, type Notifications } from './notifications'

/**
 * Shows new notifications as toasts: cards that slide in at the edge of the
 * screen and close by themselves. Put one in the app (e.g. beside AppShell),
 * then call `notify()` from anywhere:
 *
 *   const { notify } = useNotifications()
 *   notify({ type: 'success', title: 'Saved' })
 *
 * New toasts slide in from the bottom (top for top-right) and push the
 * others along smoothly. Toasts that don't fit in `maxHeight` collapse into
 * a "+5 more" pill on top of the stack saying how many aren't in view (they
 * shrink into it, and grow out of it again); hovering the toasts, tapping the pill, or
 * keyboard focus in them (F8), spreads them all out.
 *
 * If there are more than fit on the screen spread out, the oldest wait, and
 * a "+3 more"
 * row at the end opens NotificationPane, which has them all.
 *
 * Built on Reka UI's Toast: screen readers hear each one (errors and
 * warnings straight away, others when they're idle), timers pause while the
 * pointer is over them or the window isn't focused, and they swipe away.
 *
 * Closing a toast leaves the notification in the list (NotificationPane).
 */
export interface ToasterProps {
  /** The list to show. Default the shared one from `useNotifications()`. */
  notifications?: Notifications
  /** Where they appear. top-right sits under the 48px Header. */
  position?: 'bottom-right' | 'top-right' | 'bottom-center'
  /**
   * How tall the toasts can be, spread out, before older ones collapse into
   * a stack (in px). The newest always shows in full.
   */
  maxHeight?: number
  /** The most toasts kept at once; older ones beyond this wait until one closes. */
  limit?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'bottom-right',
  maxHeight: 320,
  limit: 10
})

const GAP = 8 // between spread-out toasts
const INTO_MORE = 0.5 // toasts going into "+N more" shrink to this, and grow from it coming out
const MORE = 36 // the "+3 more" row when spread out (h-9)
const PILL = 28 // the "+5 more" pill on the collapsed stack (h-7)
// Space kept clear: the 48px Header and 16px below it, and 16px at the far edge.
const SCREEN_MARGIN = 80

const emit = defineEmits<{ more: [] }>()

const store = computed(() => props.notifications ?? useNotifications())
const fromTop = computed(() => props.position === 'top-right')

// The window's height, for fitting the toasts on screen.
const windowHeight = ref(typeof window === 'undefined' ? 800 : window.innerHeight)
const onResize = () => (windowHeight.value = window.innerHeight)
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
const available = computed(() => Math.max(windowHeight.value - SCREEN_MARGIN, MORE * 3))

// ── Which toasts show ───────────────────────────────────────────────────────
// As many as fit on the screen spread out, newest first, in the order they
// came in. The others wait (their timers don't start) and are counted in
// "+3 more".
// Before a toast has been shown its height isn't known, so guess.
const estimate = (item: { compact?: boolean; action?: unknown; description?: unknown }) =>
  item.compact ? 42 : item.action ? 116 : item.description ? 78 : 56

const selection = computed(() => {
  const candidates = store.value.toasts.slice(-props.limit).reverse() // newest first
  const height = (toast: (typeof candidates)[number]) => heights.get(toast.id) ?? estimate(toast.item)
  const open = candidates.filter((toast) => !closing.has(toast.id))
  const all = open.reduce((sum, toast) => sum + height(toast) + GAP, -GAP)

  const chosen = new Set<string>()
  if (all <= available.value) {
    open.forEach((toast) => chosen.add(toast.id))
  } else {
    let used = MORE + GAP // room for the "+3 more" row
    for (const toast of open) {
      const next = used + height(toast) + (chosen.size ? GAP : 0)
      // Stop at the first that doesn't fit, so the ones shown are always the
      // newest, with nothing older slotted in after a gap.
      if (chosen.size && next > available.value) break
      chosen.add(toast.id)
      used = next
    }
  }
  const hidden = store.value.toasts.filter((toast) => !closing.has(toast.id)).length - chosen.size
  // Closing ones stay until they've faded.
  return { shown: candidates.filter((toast) => chosen.has(toast.id) || closing.has(toast.id)), hidden }
})
// Newest first: the newest sits at the edge, older ones further in.
const shown = computed(() => selection.value.shown)
const hidden = computed(() => selection.value.hidden)

// ── Into and out of "+N more" ───────────────────────────────────────────────
// A toast that has to wait (newer ones took its place) shrinks into "+N
// more" before it goes; one whose turn comes grows out of it, rather than
// sliding in from the edge like a new one.
type Shown = (typeof shown.value)[number]
const leaving = reactive(new Map<string, Shown>())
const waited = reactive(new Set<string>())
watch(
  selection,
  (now, before) => {
    const showing = new Set(now.shown.map((toast) => toast.id))
    for (const toast of store.value.toasts) if (!showing.has(toast.id) && !closing.has(toast.id)) waited.add(toast.id)
    for (const toast of before?.shown ?? []) {
      const stillThere = store.value.toasts.some((t) => t.id === toast.id)
      if (showing.has(toast.id) || !stillThere || closing.has(toast.id) || leaving.has(toast.id)) continue
      leaving.set(toast.id, toast)
      setTimeout(() => {
        leaving.delete(toast.id)
        // Placed again from "+N more" when its turn comes.
        if (!selection.value.shown.some((t) => t.id === toast.id)) placed.delete(toast.id)
      }, 300)
    }
  },
  { flush: 'sync' }
)
// What's rendered: those showing, and those on their way into "+N more".
const rendered = computed(() => [...shown.value, ...[...leaving.values()].filter((t) => !shown.value.some((s) => s.id === t.id))])

// The pane opening shows them all, so put the toasts away: those showing
// fade out, those waiting go.
watch(
  () => store.value.paneOpen,
  (paneOpen) => {
    if (!paneOpen) return
    const showing = new Set(shown.value.map((toast) => toast.id))
    for (const toast of [...store.value.toasts]) {
      if (showing.has(toast.id)) setOpen(toast.id, false)
      else store.value.hideToast(toast.id)
    }
  }
)

function showAll() {
  store.value.openPane()
  emit('more')
}

// ── Measuring ───────────────────────────────────────────────────────────────
// Each toast's natural height, so they can be placed (absolutely) and moved.
const heights = reactive(new Map<string, number>())
const elements = new Map<string, Element>()
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const id = (entry.target as HTMLElement).dataset.toastId
    if (id) heights.set(id, (entry.target as HTMLElement).offsetHeight)
  }
})
function track(id: string, instance: Element | ComponentPublicInstance | null) {
  const el = instance && ('$el' in instance ? (instance.$el as HTMLElement) : (instance as HTMLElement))
  const previous = elements.get(id)
  if (previous === el) return
  if (previous) observer.unobserve(previous)
  if (el instanceof HTMLElement) {
    el.dataset.toastId = id
    elements.set(id, el)
    heights.set(id, el.offsetHeight)
    observer.observe(el)
    onShown(id)
  } else {
    // Keep its height: it may only be waiting, and the choice of which
    // toasts fit shouldn't flip back and forth.
    elements.delete(id)
  }
}
onBeforeUnmount(() => observer.disconnect())

// ── Entering and closing ────────────────────────────────────────────────────
// A new toast starts just off the edge, then moves into place on the next
// frame, so it slides in (and the others move along at the same time).
const placed = reactive(new Set<string>())
function onShown(id: string) {
  if (placed.has(id)) return
  nextTick(() =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        placed.add(id)
        waited.delete(id)
      })
    )
  )
}

// Closing: it stops taking up space at once (the others close the gap) and
// fades where it is; then it's removed from the list.
const closing = reactive(new Set<string>())
const lastPlace = new Map<string, Place>()
function setOpen(id: string, open: boolean) {
  if (open || closing.has(id)) return
  closing.add(id)
  setTimeout(() => {
    store.value.hideToast(id)
    closing.delete(id)
    placed.delete(id)
    lastPlace.delete(id)
    heights.delete(id)
  }, 200)
}

// ── Layout ──────────────────────────────────────────────────────────────────
interface Place {
  /** Distance from the edge when spread out, and when collapsed. */
  spread: number
  stacked: number
  scale: number
  opacity: number
  z: number
}

const layout = computed(() => {
  const open = shown.value.filter((toast) => !closing.has(toast.id))
  const places = new Map<string, Place>()

  // Spread out: one after another.
  const offsets: number[] = []
  let total = 0
  for (const toast of open) {
    offsets.push(total)
    total += (heights.get(toast.id) ?? 0) + GAP
  }
  const spreadHeight = Math.max(total - GAP, 0)

  // How many fit in maxHeight, or the screen if that's smaller (at least the newest).
  const limit = Math.min(props.maxHeight, available.value)
  let fit = 0
  while (fit < open.length && (fit === 0 || offsets[fit] + (heights.get(open[fit].id) ?? 0) <= limit)) fit++
  const front = open[fit - 1]
  const frontOffset = offsets[fit - 1] ?? 0
  const frontHeight = front ? (heights.get(front.id) ?? 0) : 0

  // Collapsed: the ones that don't fit shrink into the "+N more" pill (out of
  // sight), and grow out of it when spread out.
  const pillOffset = frontOffset + frontHeight + GAP
  open.forEach((toast, i) => {
    const intoPill = i >= fit
    places.set(toast.id, {
      spread: offsets[i],
      stacked: intoPill ? pillOffset : offsets[i],
      scale: intoPill ? INTO_MORE : 1,
      opacity: intoPill ? 0 : 1,
      z: open.length - i
    })
  })
  for (const [id, place] of places) lastPlace.set(id, place)

  // Everything not fully in view when collapsed: in the pill, or waiting.
  const notInView = open.length - fit + hidden.value
  const stackedHeight = frontOffset + frontHeight + (notInView ? GAP + PILL : 0)
  // The "+3 more" row goes after the last one when spread out.
  const more = hidden.value > 0 ? GAP + MORE : 0
  return {
    places,
    spreadHeight: spreadHeight + more,
    stackedHeight,
    moreOffset: spreadHeight + (spreadHeight ? GAP : 0),
    notInView,
    pillOffset
  }
})

function styleFor(id: string) {
  const place = closing.has(id) ? lastPlace.get(id) : layout.value.places.get(id)
  const sign = fromTop.value ? 1 : -1
  const px = (value: number) => `${sign * value}px`
  // In "+N more": the row when spread out, the pill when collapsed.
  const inMore = {
    '--toast-spread': px(layout.value.moreOffset),
    '--toast-stacked': px(layout.value.pillOffset),
    '--toast-scale': INTO_MORE,
    '--toast-opacity': 0,
    '--toast-spread-opacity': 0,
    '--toast-spread-scale': INTO_MORE,
    '--toast-z': 0
  }
  if (!place && leaving.has(id)) return inMore
  if (place && !placed.has(id) && waited.has(id)) return inMore
  if (!place || !placed.has(id)) {
    // Bottom: just off the screen (its own height plus the 16px gap), so it
    // slides up into place. Top: a short drop with a fade, rather than
    // sliding across the Header.
    const offscreen = fromTop.value ? '-1rem' : 'calc(100% + 1rem)'
    return { '--toast-spread': offscreen, '--toast-stacked': offscreen, '--toast-scale': 1, '--toast-opacity': 0, '--toast-spread-opacity': 0, '--toast-spread-scale': 1, '--toast-z': 999 }
  }
  return {
    '--toast-spread': px(place.spread),
    '--toast-stacked': px(place.stacked),
    '--toast-scale': place.scale,
    '--toast-opacity': place.opacity,
    '--toast-spread-opacity': 1,
    '--toast-spread-scale': 1,
    '--toast-z': place.z
  }
}

const edge = computed(() => (fromTop.value ? 1 : -1))
const moreStyle = computed(() => ({
  '--toast-more': `${edge.value * layout.value.moreOffset}px`,
  '--toast-pill': `${edge.value * layout.value.pillOffset}px`
}))

// The same button does two things: collapsed (a pill) it spreads the toasts
// out; spread out (a row) it opens the pane.
function onMore(event: MouseEvent) {
  const spread = (event.currentTarget as HTMLElement).closest('[data-expanded]')
  if (spread) showAll()
  else spreadOut()
}

// Tapping the pill spreads the toasts out (there's no hover on touch screens):
// focus in the toasts is what spreads them, so focus the newest.
function spreadOut() {
  const newest = shown.value.find((toast) => !closing.has(toast.id))
  const li = newest && elements.get(newest.id)?.parentElement
  // No focus ring: this came from a tap or click, not the keyboard.
  li?.focus({ focusVisible: false } as FocusOptions)
}

const viewportStyle = computed(() => ({
  '--toast-stack-spread': `${layout.value.spreadHeight}px`,
  '--toast-stack-stacked': `${layout.value.stackedHeight}px`
}))

const positions = {
  'bottom-right': 'right-4 bottom-4 left-4 sm:left-auto sm:w-96',
  'top-right': 'top-16 right-4 left-4 sm:left-auto sm:w-96',
  'bottom-center': 'bottom-4 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 sm:w-96'
} as const
</script>

<template>
  <!-- label: said before each toast. The viewport's label names the area F8 jumps to. -->
  <ToastProvider swipe-direction="right" label="Notification">
    <ToastRoot
      v-for="toast in rendered"
      :key="toast.id"
      :open="!closing.has(toast.id)"
      :duration="toast.duration"
      :type="toast.item.type === 'error' || toast.item.type === 'warning' ? 'foreground' : 'background'"
      :style="styleFor(toast.id)"
      :class="
        cn(
          'absolute inset-x-0 z-(--toast-z) list-none rounded',
          'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus forced-colors:not-focus-visible:outline-0',
          // Shrinking into the more row or pill keeps the edge nearest it in place.
          fromTop ? 'top-0 origin-top' : 'bottom-0 origin-bottom',
          // Collapsed (the default) and spread out (hovered or focused: data-expanded).
          'translate-y-(--toast-stacked) scale-(--toast-scale) opacity-(--toast-opacity)',
          'data-expanded:translate-y-(--toast-spread) data-expanded:scale-(--toast-spread-scale) data-expanded:opacity-(--toast-spread-opacity)',
          'transition-[translate,scale,opacity] duration-300 ease-out motion-reduce:transition-none',
          'data-[state=closed]:animate-fade-out',
          'data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=move]:transition-none',
          'data-[swipe=cancel]:translate-x-0',
          'data-[swipe=end]:animate-slide-out-right'
        )
      "
      @update:open="setOpen(toast.id, $event)"
    >
      <Notification
        :ref="(el) => track(toast.id, el as ComponentPublicInstance | null)"
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
      :style="viewportStyle"
      :class="
        cn(
          'fixed z-100 m-0 list-none p-0 outline-none',
          // As tall as the toasts (so hovering anywhere on them spreads them out).
          'h-(--toast-stack-stacked) data-expanded:h-(--toast-stack-spread)',
          positions[position],
          props.class
        )
      "
    >
      <!-- "+N more": one button that changes shape with the toasts.
           Collapsed, a pill on the stack counting every toast not in view
           (in it, or waiting); tapping it spreads them out. Spread out, a
           full-width row after the last toast counting those still waiting;
           pressing it opens the pane. Moving between the two, it morphs:
           position, width, height, corners and text size all animate. -->
      <li
        v-if="layout.notInView"
        :style="moreStyle"
        :class="
          cn(
            'absolute inset-x-0 z-0 flex list-none justify-center',
            fromTop ? 'top-0' : 'bottom-0',
            'translate-y-(--toast-pill) in-data-expanded:translate-y-(--toast-more)',
            'transition-[translate,opacity,visibility] duration-300 ease-out motion-reduce:transition-none',
            // Spread out with nothing waiting: nothing to count.
            !hidden && 'in-data-expanded:invisible in-data-expanded:opacity-0'
          )
        "
      >
        <button
          type="button"
          :class="
            cn(
              'flex cursor-pointer items-center justify-center overflow-hidden border border-black/15 bg-white font-bold whitespace-nowrap text-black shadow-md hover:bg-surface-elevated',
              'h-7 w-24 rounded-2xl text-xs',
              'in-data-expanded:h-9 in-data-expanded:w-full in-data-expanded:rounded in-data-expanded:text-sm',
              'transition-[width,height,border-radius,font-size,background-color] duration-300 ease-out motion-reduce:transition-none',
              'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus forced-colors:not-focus-visible:outline-0'
            )
          "
          @click="onMore"
        >
          <span class="in-data-expanded:hidden">+{{ layout.notInView }} more</span>
          <span class="hidden in-data-expanded:inline">+{{ hidden }} more</span>
          <span class="sr-only">&nbsp;notifications</span>
        </button>
      </li>
    </ToastViewport>
  </ToastProvider>
</template>
