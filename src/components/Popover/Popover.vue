<script setup lang="ts">
import { onBeforeUnmount, ref, watch, type HTMLAttributes } from 'vue'
import {
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  type PopoverArrowProps,
  type PopoverContentProps
} from 'reka-ui'
import { cn } from '../../lib/cn'
import { popoverArrow, popoverContent } from './popover'

/**
 * A floating panel attached to a trigger. Built on Reka UI's Popover, which
 * handles positioning, focus, Escape and clicking outside.
 *
 * - mode "click" (default): opens and closes on click / tap / Enter. Focus
 *   moves into the panel, so it suits interactive content (menus, forms).
 * - mode "hover": opens on mouse hover, and also on click / tap, which keeps
 *   it open (so it works on touch screens). Focus stays where it is, so it
 *   suits information, e.g. a field's help text.
 *
 * Slots: default (the trigger, e.g. a Button), content ({ close }), anchor
 * (position against something other than the trigger).
 */
export interface PopoverProps {
  /** How it opens. */
  mode?: 'click' | 'hover'
  /**
   * Where the panel goes and how it behaves, passed to Reka's PopoverContent,
   * e.g. `{ side: 'top', align: 'start' }`. Default
   * `{ side: 'bottom', sideOffset: 8, collisionPadding: 8 }`.
   */
  content?: Omit<PopoverContentProps, 'as' | 'asChild' | 'forceMount'>
  /** Show an arrow pointing at the trigger (or Reka arrow options). */
  arrow?: boolean | Omit<PopoverArrowProps, 'as' | 'asChild'>
  /**
   * Render the panel at the end of the page (true), inside a given element
   * (a selector or element), or in place (false).
   */
  portal?: boolean | string | HTMLElement
  /** Close on Escape and on clicking outside. If false, emits close:prevent instead. */
  dismissible?: boolean
  /** Block interaction with the rest of the page while open. */
  modal?: boolean
  /** Open when first shown. */
  defaultOpen?: boolean
  /** Hover mode: wait this long before opening, in ms. */
  openDelay?: number
  /** Hover mode: wait this long before closing, in ms (at least 100, so the pointer can reach the panel). */
  closeDelay?: number
  /** Extra classes for the panel and the arrow. */
  ui?: { content?: HTMLAttributes['class']; arrow?: HTMLAttributes['class'] }
}

const props = withDefaults(defineProps<PopoverProps>(), {
  mode: 'click',
  arrow: false,
  portal: true,
  dismissible: true,
  modal: false,
  openDelay: 0,
  closeDelay: 0
})

const emit = defineEmits<{ 'close:prevent': [] }>()

defineSlots<{
  default?(): unknown
  content?(props: { close: () => void }): unknown
  anchor?(): unknown
}>()

/** Whether the panel is open. Optional: use v-model:open to control it. */
const openModel = defineModel<boolean | undefined>('open', { default: undefined })
const isOpen = ref(openModel.value ?? props.defaultOpen ?? false)
watch(openModel, (value) => {
  if (value !== undefined) isOpen.value = value
})
function setOpen(value: boolean) {
  isOpen.value = value
  openModel.value = value
}
function close() {
  pinned = false
  setOpen(false)
}

const contentDefaults = { side: 'bottom', sideOffset: 8, collisionPadding: 8 } as const

// ── Hover mode ──────────────────────────────────────────────────────────────
// Mouse hover opens it and leaving closes it (after a short grace period, so
// the pointer can move onto the panel). A click / tap opens it and keeps it
// open ("pinned"); clicking again, Escape or clicking outside closes it.
let pinned = false
let pinOnNextToggle = false
let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined

function hoverOpen(event: PointerEvent) {
  if (props.mode !== 'hover' || event.pointerType !== 'mouse') return
  clearTimeout(closeTimer)
  clearTimeout(openTimer)
  openTimer = setTimeout(() => setOpen(true), props.openDelay)
}
function hoverClose(event: PointerEvent) {
  if (props.mode !== 'hover' || event.pointerType !== 'mouse' || pinned) return
  clearTimeout(openTimer)
  closeTimer = setTimeout(() => setOpen(false), Math.max(props.closeDelay, 100))
}
function triggerPointerDown() {
  if (props.mode === 'hover') pinOnNextToggle = isOpen.value && !pinned
}
onBeforeUnmount(() => {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
})

function onOpenChange(value: boolean) {
  if (props.mode === 'hover') {
    if (!value && pinOnNextToggle) {
      // A click on the trigger while it was open from hover: keep it open.
      pinOnNextToggle = false
      pinned = true
      return
    }
    pinOnNextToggle = false
    pinned = value
  }
  setOpen(value)
}

// ── Not dismissible ─────────────────────────────────────────────────────────
// One outside click can be reported twice by Reka (the press, then focus
// leaving). Both are prevented, but close:prevent is emitted once per attempt.
let lastPrevented = 0
function preventDismiss(event: Event) {
  if (props.dismissible) return
  event.preventDefault()
  const now = performance.now()
  if (now - lastPrevented > 50) emit('close:prevent')
  lastPrevented = now
}

// Hover mode never moves focus: the panel is information, and moving focus
// would pull it away from whatever the user is doing (e.g. typing).
function keepFocus(event: Event) {
  if (props.mode === 'hover') event.preventDefault()
}

const portalTarget = () =>
  typeof props.portal === 'string' || props.portal instanceof HTMLElement ? props.portal : undefined
</script>

<template>
  <PopoverRoot :open="isOpen" :modal="modal" @update:open="onOpenChange">
    <PopoverAnchor v-if="$slots.anchor" as-child>
      <slot name="anchor" />
    </PopoverAnchor>

    <PopoverTrigger
      v-if="$slots.default"
      as-child
      @pointerdown="triggerPointerDown"
      @pointerenter="hoverOpen"
      @pointerleave="hoverClose"
    >
      <slot />
    </PopoverTrigger>

    <PopoverPortal :disabled="portal === false" :to="portalTarget()">
      <PopoverContent
        v-bind="{ ...contentDefaults, ...content }"
        :class="cn(popoverContent, ui?.content)"
        @pointerenter="hoverOpen"
        @pointerleave="hoverClose"
        @escape-key-down="preventDismiss"
        @interact-outside="preventDismiss"
        @open-auto-focus="keepFocus"
        @close-auto-focus="keepFocus"
      >
        <slot name="content" :close="close" />
        <PopoverArrow v-if="arrow" v-bind="typeof arrow === 'object' ? arrow : {}" as-child>
          <span :class="cn(popoverArrow, ui?.arrow)" />
        </PopoverArrow>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
