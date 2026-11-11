<script setup lang="ts">
import { computed, ref, useId, watch, type HTMLAttributes } from 'vue'
import { CircleAlert, CircleCheck, CircleHelp } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Popover from '../Popover/Popover.vue'
import Spinner from '../Spinner/Spinner.vue'

/**
 * Shared shell for form controls: label, helper text (below or behind a `?`),
 * the bordered box styled like a medium basic Button, and the status message
 * that slides out underneath. Input, InputNumber and InputDate use it; the
 * control itself goes in the default slot, which receives the ids and ARIA
 * values to put on it.
 */

export type FormFieldStatus = 'error' | 'success' | 'loading'

export interface FormFieldProps {
  /** Visible label. Always set it: it is also the control's accessible name. */
  label: string
  /** Extra guidance about what to enter. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /**
   * Error message, e.g. from a Zod / VeeValidate schema. When set (and not
   * empty) the field shows as an error with this text; leave it undefined
   * when the value is valid. Overrides `status` and `statusText`.
   */
  errorText?: string
  /**
   * Colours the field and the status text. `loading` shows a small spinner
   * by the status text while something is checked, e.g. "Checking
   * availability…", and leaves the border as it is.
   */
  status?: FormFieldStatus
  /** Message under the field, e.g. why the value is invalid. */
  statusText?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  helperPlacement: 'below'
})

defineSlots<{
  default(props: { id: string; labelId: string; describedBy?: string; invalid?: true }): unknown
  leading?(): unknown
  trailing?(): unknown
}>()

const id = useId()
const controlId = `${id}-control`
const labelId = `${id}-label`
const helperId = `${id}-helper`
const statusId = `${id}-status`

// ── Status ──────────────────────────────────────────────────────────────────
// Priority: errorText, then status / statusText.
const currentStatus = computed<FormFieldStatus | undefined>(() =>
  props.errorText ? 'error' : props.status
)
const currentStatusText = computed(() => props.errorText || props.statusText)

const describedBy = computed(() =>
  [props.helper && helperId, currentStatusText.value && statusId].filter(Boolean).join(' ') || undefined
)

// The message slides open when there is text and closed when it clears. While
// closing, keep showing the last message so it doesn't vanish mid-slide.
const statusOpen = computed(() => !!currentStatusText.value)
const shownText = ref(currentStatusText.value)
const shownStatus = ref(currentStatus.value)
watch([currentStatusText, currentStatus], ([text, status]) => {
  if (!text) return
  shownText.value = text
  shownStatus.value = status
})


// ── Box ─────────────────────────────────────────────────────────────────────
// Clicking the box's padding or decorative icons focuses the control. Clicks
// on the control itself or on buttons inside (e.g. − / +) are left alone.
const focusable = 'input, textarea, [role="spinbutton"]'
function focusControl(event: PointerEvent) {
  const target = event.target as Element
  if (props.disabled || target.closest(`${focusable}, button`)) return
  event.preventDefault()
  ;(event.currentTarget as Element).querySelector<HTMLElement>(focusable)?.focus()
}

// Same look as a medium basic Button. The focus ring follows :focus-visible,
// so it shows for keyboard use only: text boxes always count (you're typing),
// but buttons inside don't after a click, or when a closing list (Select)
// hands focus back after the mouse was used.
const box = [
  'flex items-center gap-2 px-3 py-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-70',
  'bg-white text-black border border-black/15 rounded cursor-text transition',
  'outline-2 outline-offset-1 outline-transparent forced-colors:not-has-focus-visible:outline-0',
  'has-focus-visible:outline-focus',
  // A control can mark itself data-pointer-focus to hide the ring while it
  // holds focus that came from the mouse (Select, after its list closes).
  'has-[[data-pointer-focus]]:outline-transparent!'
]

const statusBorder: Record<FormFieldStatus, string> = {
  error: 'border-red',
  success: 'border-green',
  loading: ''
}

const statusColour: Record<FormFieldStatus, string> = {
  error: 'text-red',
  success: 'text-green',
  loading: 'text-black/65'
}

const statusIcon = { error: CircleAlert, success: CircleCheck } as const
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 text-black', props.class)">
    <div class="flex flex-col gap-0.5">
      <div class="flex items-center gap-1">
        <label :id="labelId" :for="controlId" class="text-sm">{{ label }}</label>

        <!--
          Hover mode: opens on hover, click / tap keeps it open, and focus is
          never moved, so typing in the control isn't interrupted. Screen
          readers already get the text via the control's aria-describedby.
        -->
        <Popover
          v-if="helper && helperPlacement === 'icon'"
          mode="hover"
          :content="{ side: 'top', sideOffset: 6 }"
        >
          <button
            type="button"
            :aria-label="`About ${label}`"
            class="inline-flex rounded-full p-0.5 text-black transition hover:bg-black/10 data-[state=open]:bg-black/10 outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus [&_svg]:size-4"
          >
            <CircleHelp />
          </button>
          <template #content>
            <p class="max-w-64 px-3 py-2 text-xs">{{ helper }}</p>
          </template>
        </Popover>
      </div>

      <p
        v-if="helper"
        :id="helperId"
        :class="helperPlacement === 'below' ? 'text-xs text-black/65' : 'sr-only'"
      >
        {{ helper }}
      </p>
    </div>

    <div
      :class="cn(box, currentStatus && statusBorder[currentStatus], disabled && 'opacity-40 cursor-not-allowed')"
      @pointerdown="focusControl"
    >
      <slot name="leading" />
      <slot
        :id="controlId"
        :label-id="labelId"
        :described-by="describedBy"
        :invalid="currentStatus === 'error' || undefined"
      />
      <slot name="trailing" />
    </div>

    <!--
      Visual message. Its row animates from 0 to full height (grid rows
      0fr → 1fr), so content below moves smoothly instead of jumping.
      -mt-1.5 cancels the parent's gap while closed; pt-1.5 puts it back when open.

      The two steps run in sequence so the text is never seen clipped:
        opening: the row grows (150ms), then the text fades in and slides
                 down 4px (150ms, starting at 100ms)
        closing: the text fades out (100ms), then the row closes (150ms,
                 starting at 100ms)
    -->
    <div
      aria-hidden="true"
      :class="cn(
        '-mt-1.5 grid transition-[grid-template-rows,visibility] duration-150 ease-out motion-reduce:transition-none',
        statusOpen ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr] delay-100'
      )"
    >
      <div class="overflow-hidden">
        <p
          :class="cn(
            'flex items-center gap-1 pt-1.5 text-xs transition-[translate,opacity,color] ease-out motion-reduce:transition-none [&_svg]:size-3.5 [&_svg]:shrink-0',
            shownStatus && statusColour[shownStatus],
            statusOpen ? 'duration-150 delay-100' : '-translate-y-1 opacity-0 duration-100'
          )"
        >
          <Spinner v-if="shownStatus === 'loading'" size="sm" class="size-3.5" />
          <component :is="statusIcon[shownStatus]" v-else-if="shownStatus" />
          {{ shownText }}
        </p>
      </div>
    </div>

    <!-- What screen readers hear: linked to the control and announced when it changes. -->
    <p :id="statusId" aria-live="polite" class="sr-only">{{ currentStatusText }}</p>
  </div>
</template>
