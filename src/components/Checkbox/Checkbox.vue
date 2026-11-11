<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { Check, Minus } from '@lucide/vue'
import { cn } from '../../lib/cn'
import FieldMessage from '../FormField/FieldMessage.vue'

/**
 * A yes / no answer that's sent with the form, e.g. "Has a sibling at the
 * school" or agreeing to terms. For a setting that takes effect straight
 * away, use Switch; for one choice from a few, use RadioGroup.
 */
export interface CheckboxProps {
  /** Visible label, beside the box. Pressing it ticks the box too. */
  label: string
  /** More detail, in smaller text under the label. */
  description?: string
  /**
   * Error message, e.g. "Agree to the terms to continue". When set (and not
   * empty) the box shows as an error with this text.
   */
  errorText?: string
  /** Name for native form submission. */
  name?: string
  /** Value sent with the form when ticked. Default "on". */
  value?: string
  required?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = defineProps<CheckboxProps>()

/**
 * Ticked or not. 'indeterminate' shows a dash: for a "select all" box when
 * only some of its items are ticked. Pressing it then ticks it.
 */
const model = defineModel<boolean | 'indeterminate'>({ default: false })

const id = useId()
const controlId = `${id}-control`
const descriptionId = `${id}-description`
const statusId = `${id}-status`

const describedBy = computed(
  () => [props.description && descriptionId, props.errorText && statusId].filter(Boolean).join(' ') || undefined
)

// Pressing anywhere in the text (the description, or the gap between it and
// the label) acts like pressing the label. The description isn't inside the
// <label>, which would make it part of the accessible name; it stays the
// description (aria-describedby). The label already presses the control
// itself, so it's skipped here. Keyboard use is unchanged.
function pressControl(event: MouseEvent, id: string) {
  if ((event.target as Element).closest('label')) return
  document.getElementById(id)?.click()
}

// 16px box, level with the first line of the label (20px line: 2px above).
// The border is darker than a text box's so the box itself is easy to see.
const box = [
  'mt-0.5 flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border bg-white text-white transition',
  'not-disabled:hover:border-black disabled:cursor-not-allowed',
  'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:hover:border-primary',
  'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:hover:border-primary',
  'outline-2 outline-offset-2 outline-transparent focus-visible:outline-focus',
  '[&_svg]:size-3.5 [&_svg]:stroke-3'
]
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 text-black', disabled && 'opacity-40', props.class)">
    <div class="flex items-start gap-2">
      <CheckboxRoot
        :id="controlId"
        v-model="model"
        :name="name"
        :value="value"
        :required="required"
        :disabled="disabled"
        :aria-invalid="errorText ? true : undefined"
        :aria-describedby="describedBy"
        :class="cn(box, errorText ? 'border-red' : 'border-black/55')"
      >
        <CheckboxIndicator class="flex">
          <Minus v-if="model === 'indeterminate'" aria-hidden="true" />
          <Check v-else aria-hidden="true" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <div
        :class="cn('flex min-w-0 flex-col gap-0.5', disabled ? 'cursor-not-allowed' : 'cursor-pointer')"
        @click="pressControl($event, controlId)"
      >
        <label :for="controlId" :class="cn('text-sm', disabled ? 'cursor-not-allowed' : 'cursor-pointer')">{{ label }}</label>
        <p v-if="description" :id="descriptionId" class="text-xs text-black/65">
          {{ description }}
        </p>
      </div>
    </div>
    <FieldMessage :id="statusId" :status="errorText ? 'error' : undefined" :text="errorText" />
  </div>
</template>
