<script setup lang="ts">
import { ref, watch, type HTMLAttributes } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps
} from 'reka-ui'
import { X } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Button from '../Button/Button.vue'

/**
 * A full-height panel that slides in from the side of the screen, e.g. to edit
 * a record without leaving the page. Built on Reka UI's Dialog: focus is kept
 * inside while open, Escape and clicking the overlay close it, the page behind
 * doesn't scroll, and it is announced as a dialog.
 *
 * Slots: default (the trigger, e.g. a Button), header (replaces title,
 * description and close), title, description, body (the scrolling middle),
 * footer (e.g. Cancel / Save), content (replaces everything inside the panel).
 * Slots that close it get `{ close }`.
 */
export interface SlideoverProps {
  /** Heading of the panel. Also its accessible name, so always set it (or the title slot). */
  title?: string
  /** Text under the title. */
  description?: string
  /** Edge it slides in from. */
  side?: 'right' | 'left' | 'top' | 'bottom'
  /** Dim the page behind it. */
  overlay?: boolean
  /** Show the × close button in the header. */
  close?: boolean
  /** Close on Escape and on clicking outside. If false, emits close:prevent instead. */
  dismissible?: boolean
  /** Block interaction with the page behind while open. */
  modal?: boolean
  /** Open when first shown. */
  defaultOpen?: boolean
  /**
   * Where focus goes when it opens:
   * - none (default): the panel itself, so screen readers announce the title
   *   and description and read from the top. Tab then moves to the first
   *   control.
   * - auto: an element marked `autofocus`, else the first form field, else
   *   the × button. On touch screens it skips text fields, so the keyboard
   *   doesn't pop up before the panel has been seen.
   * - close: the × button (or the first button, if there's no ×).
   */
  initialFocus?: 'auto' | 'close' | 'none'
  /** Render at the end of the page (true), inside a given element, or in place (false). */
  portal?: boolean | string | HTMLElement
  /** Passed to Reka's DialogContent. */
  content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'>
  /** Extra classes for the parts. */
  ui?: {
    overlay?: HTMLAttributes['class']
    content?: HTMLAttributes['class']
    header?: HTMLAttributes['class']
    title?: HTMLAttributes['class']
    body?: HTMLAttributes['class']
    footer?: HTMLAttributes['class']
  }
}

const props = withDefaults(defineProps<SlideoverProps>(), {
  side: 'right',
  overlay: true,
  close: true,
  dismissible: true,
  modal: true,
  portal: true,
  initialFocus: 'none'
})

const emit = defineEmits<{ 'close:prevent': [] }>()

defineSlots<{
  default?(): unknown
  header?(props: { close: () => void }): unknown
  title?(): unknown
  description?(): unknown
  body?(props: { close: () => void }): unknown
  footer?(props: { close: () => void }): unknown
  content?(props: { close: () => void }): unknown
}>()

/** Whether it is open. Optional: use v-model:open to control it. */
const openModel = defineModel<boolean | undefined>('open', { default: undefined })
const isOpen = ref(openModel.value ?? props.defaultOpen ?? false)
watch(openModel, (value) => {
  if (value !== undefined) isOpen.value = value
})
function setOpen(value: boolean) {
  isOpen.value = value
  openModel.value = value
}
const closePanel = () => setOpen(false)

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

// ── Initial focus ───────────────────────────────────────────────────────────
// Reka moves focus to the first focusable element (usually ×) unless this
// handler prevents it and focuses something else.
const fieldSelector = [
  'input:not([type=hidden]):not(:disabled)',
  'textarea:not(:disabled)',
  'select:not(:disabled)',
  '[role="spinbutton"]:not([aria-disabled="true"])'
].join(', ')

function onOpenAutoFocus(event: Event) {
  const panel = event.target as HTMLElement
  if (props.initialFocus === 'close') return

  if (props.initialFocus === 'none') {
    event.preventDefault()
    panel.focus()
    return
  }

  // auto
  const marked = panel.querySelector<HTMLElement>('[autofocus], [data-autofocus]')
  const touch = window.matchMedia('(pointer: coarse)').matches
  const field = touch ? null : panel.querySelector<HTMLElement>(fieldSelector)
  const target = marked ?? field
  if (!target) return
  event.preventDefault()
  target.focus()
}

const portalTarget = () =>
  typeof props.portal === 'string' || props.portal instanceof HTMLElement ? props.portal : undefined

// Position, edge border and slide animation for each side. Full-height on the
// left / right (full width on small screens, up to max-w-md); full-width at
// the top / bottom, as tall as its content.
const sides: Record<NonNullable<SlideoverProps['side']>, string> = {
  right: 'inset-y-0 right-0 w-full max-w-md border-l data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right',
  left: 'inset-y-0 left-0 w-full max-w-md border-r data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left',
  top: 'inset-x-0 top-0 max-h-full border-b data-[state=open]:animate-slide-in-top data-[state=closed]:animate-slide-out-top',
  bottom: 'inset-x-0 bottom-0 max-h-full border-t data-[state=open]:animate-slide-in-bottom data-[state=closed]:animate-slide-out-bottom'
}

const panel = [
  'fixed z-50 flex flex-col bg-white text-black border-black/15 shadow-xl outline-none',
  // Reduced motion: fade instead of sliding.
  'motion-reduce:data-[state=open]:animate-fade-in motion-reduce:data-[state=closed]:animate-fade-out'
]
</script>

<template>
  <DialogRoot :open="isOpen" :modal="modal" @update:open="setOpen">
    <DialogTrigger v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>

    <DialogPortal :disabled="portal === false" :to="portalTarget()">
      <DialogOverlay
        v-if="overlay"
        :class="cn(
          'fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
          ui?.overlay
        )"
      />

      <DialogContent
        v-bind="content"
        :class="cn(panel, sides[side], ui?.content)"
        @escape-key-down="preventDismiss"
        @interact-outside="preventDismiss"
        @open-auto-focus="onOpenAutoFocus"
      >
        <slot name="content" :close="closePanel">
          <header
            v-if="title || description || close || $slots.header || $slots.title"
            :class="cn('flex items-start gap-4 border-b border-black/15 px-6 py-4', ui?.header)"
          >
            <slot name="header" :close="closePanel">
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <DialogTitle :class="title || $slots.title ? cn('text-lg', ui?.title) : 'sr-only'">
                  <slot name="title">{{ title }}</slot>
                </DialogTitle>
                <DialogDescription v-if="description || $slots.description" class="text-sm text-black/65">
                  <slot name="description">{{ description }}</slot>
                </DialogDescription>
              </div>
              <!-- A ghost icon Button; the negative margins keep it from making
                   the header taller and line its icon up with the panel edge. -->
              <DialogClose v-if="close" as-child>
                <Button variant="ghost" square aria-label="Close" class="-my-1.5 -mr-3 shrink-0">
                  <X />
                </Button>
              </DialogClose>
            </slot>
          </header>

          <div :class="cn('flex-1 overflow-y-auto px-6 py-4', ui?.body)">
            <slot name="body" :close="closePanel" />
          </div>

          <footer
            v-if="$slots.footer"
            :class="cn('flex justify-end gap-2 border-t border-black/15 px-6 py-4', ui?.footer)"
          >
            <slot name="footer" :close="closePanel" />
          </footer>
        </slot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
