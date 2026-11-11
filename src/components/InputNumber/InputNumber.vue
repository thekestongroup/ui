<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput, NumberFieldRoot } from 'reka-ui'
import { Minus, Plus } from '@lucide/vue'
import FormField, { type FormFieldStatus } from '../FormField/FormField.vue'

// Attributes like placeholder and name go to the <input>, not the wrapper.
defineOptions({ inheritAttrs: false })

export interface InputNumberProps {
  /** Visible label. Always set it: it is also the input's accessible name. */
  label: string
  /** Extra guidance about what to enter. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Error message, e.g. from a Zod schema. Overrides `status` / `statusText`. */
  errorText?: string
  /** Colours the field and the status text. */
  status?: FormFieldStatus
  /** Message under the field. */
  statusText?: string
  /** Lowest allowed value. The − button is disabled when reached. */
  min?: number
  /** Highest allowed value. The + button is disabled when reached. */
  max?: number
  /** How much − / + and the arrow keys change the value. */
  step?: number
  /** How the number is displayed, e.g. `{ style: 'currency', currency: 'GBP' }`. */
  formatOptions?: Intl.NumberFormatOptions
  /** Locale for formatting. Defaults to the browser's. */
  locale?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<InputNumberProps>(), {
  helperPlacement: 'below',
  step: 1
})

/** The number, or undefined when the field is empty. */
const model = defineModel<number | undefined>()

// What screen readers say for the value. Without it, VoiceOver reads a number
// field that has a min and max as a percentage of that range (year group 9 of
// 7–13 → "33%"). This is the number as displayed, e.g. "9" or "£12.50".
const valueText = computed(() =>
  model.value === undefined
    ? undefined
    : new Intl.NumberFormat(props.locale, props.formatOptions).format(model.value)
)

// The − / + buttons are full-height square segments at each end of the box,
// split from the value by a divider, so the field looks like
// [ − | value | + ]. Negative margins cancel the box's padding (px-3 py-2), so
// each button is 36×36 inside the 38px box. They behave like a basic Button:
// white fill that darkens on hover / press, icon at full colour (the box mutes
// decorative icons). When disabled (min / max reached) only the icon fades.
const stepButton = [
  'flex w-9 shrink-0 -my-2 self-stretch items-center justify-center bg-white cursor-pointer transition',
  'not-disabled:hover:brightness-90 not-disabled:active:brightness-80 [&_svg]:opacity-100!',
  'disabled:cursor-not-allowed disabled:[&_svg]:opacity-40!'
]
const decrement = '-ml-3 rounded-l border-r border-black/15'
const increment = '-mr-3 rounded-r border-l border-black/15'
</script>

<template>
  <FormField
    :label="label"
    :helper="helper"
    :helper-placement="helperPlacement"
    :error-text="errorText"
    :status="status"
    :status-text="statusText"
    :disabled="disabled"
    :class="$props.class"
  >
    <template #default="{ id, describedBy, invalid }">
      <!-- `contents` lets the buttons and input sit directly in the box's row. -->
      <NumberFieldRoot
        :id="id"
        v-model="model"
        :min="min"
        :max="max"
        :step="step"
        :format-options="formatOptions"
        :locale="locale"
        :disabled="disabled"
        class="contents"
      >
        <NumberFieldDecrement :class="[stepButton, decrement]">
          <Minus />
        </NumberFieldDecrement>
        <NumberFieldInput
          v-bind="$attrs"
          :aria-invalid="invalid"
          :aria-describedby="describedBy"
          :aria-valuetext="valueText"
          class="h-5 min-w-0 flex-1 bg-transparent text-center tabular-nums outline-none placeholder:text-black/55 disabled:cursor-not-allowed"
        />
        <NumberFieldIncrement :class="[stepButton, increment]">
          <Plus />
        </NumberFieldIncrement>
      </NumberFieldRoot>
    </template>
  </FormField>
</template>
