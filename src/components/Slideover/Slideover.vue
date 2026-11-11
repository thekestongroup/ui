<script setup lang="ts">
import { computed, nextTick, ref, useId, watch, type HTMLAttributes } from 'vue'
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
import { ChevronLeft, ChevronRight, X } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Button, { type ButtonStatus } from '../Button/Button.vue'
import Progress from '../Progress/Progress.vue'

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
 *
 * Multi-step forms: pass `steps` (one name per step) and show the current
 * step's fields in the body slot, which gets `{ step }`. The header shows a
 * segment per step and "Step 2 of 4: Contact details"; the footer gets
 * Cancel / Previous and Next / Finish, unless you fill the footer slot.
 * Enter in a text field presses Next / Finish.
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
  /** Names of the steps, for a multi-step form. Adds the segments, step name and Previous / Next. */
  steps?: string[]
  /**
   * Checks the current step before moving on (Next) or finishing (Finish).
   * Return false to stay, e.g. after showing field errors. Can be async, e.g.
   * to save on the last step; the button shows a spinner meanwhile.
   */
  validateStep?: (step: number) => boolean | Promise<boolean>
  /** Text of the last step's button. */
  finishLabel?: string
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
  initialFocus: 'none',
  finishLabel: 'Finish'
})

const emit = defineEmits<{
  'close:prevent': []
  /** Finish was pressed on the last step and `validateStep` passed. */
  finish: []
}>()

defineSlots<{
  default?(): unknown
  header?(props: { close: () => void }): unknown
  title?(): unknown
  description?(): unknown
  body?(props: { close: () => void; step: number }): unknown
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

// ── Steps ───────────────────────────────────────────────────────────────────
/** Current step, from 0. Optional: use v-model:step to control it. Back to 0 each time it opens. */
const step = defineModel<number>('step', { default: 0 })
watch(isOpen, (open) => {
  if (!open || !props.steps) return
  step.value = 0
  announcement.value = ''
})

const stepCount = computed(() => props.steps?.length ?? 0)
const isLastStep = computed(() => step.value >= stepCount.value - 1)
const nextStatus = ref<ButtonStatus>('idle')

// Screen readers are always told which step they're on:
// - focus moves into the new step's first field (after Enter): its fields are
//   a group named "Step 3 of 4: Contact", read out with the field;
// - otherwise (Next / Previous buttons, touch screens): the same words are
//   announced. Never both, so it isn't read twice.
const stepLabelId = `${useId()}-step`
const stepText = computed(() => (props.steps ? `Step ${step.value + 1} of ${stepCount.value}: ${props.steps[step.value]}` : ''))
const announcement = ref('')
const body = ref<HTMLElement>()

async function goTo(index: number) {
  // If focus is in this step's fields (e.g. Enter was pressed in one), they're
  // about to go: carry on in the new step's first control (or the panel, on
  // touch screens, so the keyboard doesn't pop up). Focus on Next / Previous
  // stays where it is.
  const focusInStep = !!body.value?.contains(document.activeElement)
  announcement.value = ''
  step.value = index
  // Start the new step from the top.
  body.value?.scrollTo({ top: 0 })
  await nextTick()
  const touch = window.matchMedia('(pointer: coarse)').matches
  const field = focusInStep && !touch ? body.value?.querySelector<HTMLElement>(stepControlSelector) : null
  if (field) {
    field.focus()
    return
  }
  if (focusInStep) body.value?.closest<HTMLElement>('[role=dialog]')?.focus()
  announcement.value = stepText.value
}

async function next() {
  if (nextStatus.value === 'loading') return
  if (props.validateStep) {
    nextStatus.value = 'loading'
    try {
      if (!(await props.validateStep(step.value))) return
    } finally {
      nextStatus.value = 'idle'
    }
  }
  if (isLastStep.value) emit('finish')
  else goTo(step.value + 1)
}

// Enter in a text field moves on, like submitting a form: Next, or Finish on
// the last step. Not in multi-line text, buttons, checkboxes or radios, and
// not when the field used the Enter itself (InputDate's first Enter fills in
// the date it understood).
const skipEnter = 'textarea, [contenteditable="true"], input[type=checkbox], input[type=radio], input[type=button], input[type=submit]'
function onBodyEnter(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  if (!props.steps || event.defaultPrevented || event.isComposing) return
  if (target.tagName !== 'INPUT' || target.closest(skipEnter)) return
  event.preventDefault()
  next()
}

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

// The first control of a step: a field, or the selected radio, a checkbox,
// switch or select. (In a radio group, the selected radio.)
const stepControlSelector = [
  fieldSelector,
  '[role="radio"][data-state="checked"]:not(:disabled)',
  '[role="checkbox"]:not(:disabled)',
  '[role="switch"]:not(:disabled)',
  '[role="combobox"]:not(:disabled)'
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
            v-if="title || description || close || steps || $slots.header || $slots.title"
            :class="cn('flex flex-col gap-4 border-b border-black/15 px-6 py-4', ui?.header)"
          >
            <Progress v-if="steps" :label="title ?? 'Steps'" segments :value="step + 1" :max="stepCount" />
            <div class="flex items-start gap-4">
            <slot name="header" :close="closePanel">
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <DialogTitle :class="title || $slots.title ? cn('text-lg', ui?.title) : 'sr-only'">
                  <slot name="title">{{ title }}</slot>
                </DialogTitle>
                <!-- The step is part of the description, so it's read out with
                     the title when the panel opens. -->
                <DialogDescription
                  v-if="description || $slots.description || steps"
                  as="div"
                  class="flex flex-col gap-1 text-sm text-black/65"
                >
                  <p v-if="description || $slots.description"><slot name="description">{{ description }}</slot></p>
                  <p v-if="steps" :id="stepLabelId">
                    Step {{ step + 1 }} of {{ stepCount }}: <span class="text-black">{{ steps[step] }}</span>
                  </p>
                </DialogDescription>
                <p v-if="steps" aria-live="polite" class="sr-only">{{ announcement }}</p>
              </div>
              <!-- A ghost icon Button; the negative margins keep it from making
                   the header taller and line its icon up with the panel edge. -->
              <DialogClose v-if="close" as-child>
                <Button variant="ghost" square aria-label="Close" class="-my-1.5 -mr-3 shrink-0">
                  <X />
                </Button>
              </DialogClose>
            </slot>
            </div>
          </header>

          <div
            ref="body"
            :role="steps ? 'group' : undefined"
            :aria-labelledby="steps ? stepLabelId : undefined"
            :class="cn('flex-1 overflow-y-auto px-6 py-4', ui?.body)"
            @keydown.enter="onBodyEnter"
          >
            <slot name="body" :close="closePanel" :step="step" />
          </div>

          <footer
            v-if="$slots.footer || steps"
            :class="cn('flex justify-end gap-2 border-t border-black/15 px-6 py-4', ui?.footer)"
          >
            <slot name="footer" :close="closePanel">
              <!-- Steps: Cancel or Previous on the left, Next or Finish on the right. -->
              <!-- One button that turns from Previous into Cancel on the first
                   step, so keyboard focus stays on it. -->
              <Button
                class="mr-auto"
                :disabled="step > 0 && nextStatus === 'loading'"
                @click="step === 0 ? closePanel() : goTo(step - 1)"
              >
                <template v-if="step > 0" #leading><ChevronLeft /></template>
                {{ step === 0 ? 'Cancel' : 'Previous' }}
              </Button>
              <Button variant="primary" :status="nextStatus" @click="next">
                {{ isLastStep ? finishLabel : 'Next' }}
                <template v-if="!isLastStep" #trailing><ChevronRight /></template>
              </Button>
            </slot>
          </footer>
        </slot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
