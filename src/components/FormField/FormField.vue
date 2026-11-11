<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import InfoTip from '../InfoTip/InfoTip.vue'
import FieldMessage, { type FieldStatus } from './FieldMessage.vue'

/**
 * Shared shell for form controls: label, helper text (below or behind a `?`),
 * the bordered box styled like a medium basic Button, and the status message
 * that slides out underneath. Input, InputNumber, InputDate and Select use
 * it; use it too for a text control the library doesn't have, so it looks and
 * behaves like the rest. The control goes in the default slot, which receives
 * the id and ARIA values to put on it.
 */

export type FormFieldStatus = FieldStatus

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
  /**
   * At the end of the label row, e.g. a "Forgot password?" link. It comes
   * after the control in the page, so Tab reaches it after the field.
   */
  'label-trailing'?(): unknown
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


// ── Box ─────────────────────────────────────────────────────────────────────
// Clicking the box's padding or decorative icons focuses the control. Clicks
// on the control itself or on buttons inside (e.g. − / +) are left alone.
const focusable = 'input, textarea, [role="spinbutton"], [contenteditable="true"]'
function focusControl(event: PointerEvent) {
  const target = event.target as Element
  if (props.disabled || target.closest(`${focusable}, button`)) return
  event.preventDefault()
  ;(event.currentTarget as Element).querySelector<HTMLElement>(focusable)?.focus()
}

// A <label> only focuses form elements. Others, like InputRichText's
// contenteditable <div>, are focused by hand (they have no `labels` list).
function focusUnlabelable() {
  const control = document.getElementById(controlId)
  if (control && !('labels' in control) && !props.disabled) control.focus()
}

// Same look as a medium basic Button. The focus ring follows :focus-visible,
// so it shows for keyboard use only: text boxes always count (you're typing),
// but buttons inside don't after a click, or when a closing list (Select)
// hands focus back after the mouse was used.
//
// Text is 16px on touch screens: iPhone zooms the page into any field with
// smaller text when it's tapped. 16px stops that without blocking pinch-zoom.
const box = [
  'flex items-center gap-2 px-3 py-2 text-sm pointer-coarse:text-base [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-70',
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

</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 text-black', props.class)">
    <!-- Label row and box in a grid, so label-trailing can come after the
         box in the page (and the Tab order) but show at the end of the label row. -->
    <div :class="cn('grid grid-cols-[minmax(0,1fr)_auto] gap-y-1.5', $slots['label-trailing'] && 'gap-x-3')">
      <div class="col-start-1 row-start-1 flex flex-col gap-0.5">
        <div class="flex items-center gap-1">
          <label :id="labelId" :for="controlId" class="text-sm" @click="focusUnlabelable">{{ label }}</label>

          <!-- Screen readers get the helper from the control's aria-describedby
               (the hidden copy below), so the ? is for sighted users. -->
          <InfoTip v-if="helper && helperPlacement === 'icon'" :text="helper" :label="`About ${label}`" />
        </div>

        <!-- Behind the ?: hidden, but still the control's description. -->
        <p v-if="helper" :id="helperId" :hidden="helperPlacement === 'icon'" class="text-xs text-black/65">
          {{ helper }}
        </p>
      </div>

      <div
        :class="cn(box, 'col-span-2 row-start-2', currentStatus && statusBorder[currentStatus], disabled && 'opacity-40 cursor-not-allowed')"
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

      <div v-if="$slots['label-trailing']" class="col-start-2 row-start-1 flex h-5 items-center text-xs">
        <slot name="label-trailing" />
      </div>
    </div>

    <FieldMessage :id="statusId" :status="currentStatus" :text="currentStatusText" />
  </div>
</template>
