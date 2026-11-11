<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { cn } from '../../lib/cn'
import InfoTip from '../InfoTip/InfoTip.vue'
import FieldMessage from '../FormField/FieldMessage.vue'

/**
 * One choice from a few (two to five) that people should see side by side,
 * e.g. "Mark as leavers" or "Keep on roll". For more options, or when the
 * choice is less important than the space it takes, use Select.
 */
export type RadioValue = string | number

export interface RadioOption {
  label: string
  value: RadioValue
  /** More detail, in smaller text under the label. */
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  /** The question, above the options. Also the group's accessible name. */
  label: string
  options: RadioOption[]
  /** Extra guidance about the choice. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Error message, e.g. "Choose what happens to Year 13". */
  errorText?: string
  /** Name for native form submission. */
  name?: string
  required?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  helperPlacement: 'below'
})

/** The chosen option's value; undefined until one is chosen. */
const model = defineModel<RadioValue | undefined>()

const id = useId()
const labelId = `${id}-label`
const helperId = `${id}-helper`
const statusId = `${id}-status`

const describedBy = computed(
  () => [props.helper && helperId, props.errorText && statusId].filter(Boolean).join(' ') || undefined
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

// 16px circle, level with the first line of the label; the chosen one gets a
// dot. The border is darker than a text box's so each circle is easy to see.
const circle = [
  'mt-0.5 flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white transition',
  'not-disabled:hover:border-black disabled:cursor-not-allowed',
  'data-[state=checked]:border-primary data-[state=checked]:hover:border-primary',
  'outline-2 outline-offset-2 outline-transparent focus-visible:outline-focus'
]
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 text-black', disabled && 'opacity-40', props.class)">
    <div class="flex flex-col gap-0.5">
      <div class="flex items-center gap-1">
        <span :id="labelId" class="text-sm">{{ label }}</span>
        <InfoTip v-if="helper && helperPlacement === 'icon'" :text="helper" :label="`About ${label}`" />
      </div>
      <!-- Behind the ?: hidden, but still the group's description. -->
      <p v-if="helper" :id="helperId" :hidden="helperPlacement === 'icon'" class="text-xs text-black/65">
        {{ helper }}
      </p>
    </div>

    <RadioGroupRoot
      v-model="model"
      :name="name"
      :required="required"
      :disabled="disabled"
      :aria-labelledby="labelId"
      :aria-describedby="describedBy"
      :aria-invalid="errorText ? true : undefined"
      class="flex flex-col gap-2"
    >
      <div v-for="(option, i) in options" :key="String(option.value)" class="flex items-start gap-2">
        <RadioGroupItem
          :id="`${id}-${i}`"
          :value="option.value"
          :disabled="option.disabled"
          :aria-describedby="option.description ? `${id}-${i}-description` : undefined"
          :class="cn(circle, errorText ? 'border-red' : 'border-black/55', option.disabled && !disabled && 'opacity-40')"
        >
          <RadioGroupIndicator class="size-2 rounded-full bg-primary" />
        </RadioGroupItem>
        <div
          :class="cn(
            'flex min-w-0 flex-col gap-0.5',
            disabled || option.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            option.disabled && !disabled && 'opacity-40'
          )"
          @click="pressControl($event, `${id}-${i}`)"
        >
          <label
            :for="`${id}-${i}`"
            :class="cn('text-sm', disabled || option.disabled ? 'cursor-not-allowed' : 'cursor-pointer')"
          >
            {{ option.label }}
          </label>
          <p v-if="option.description" :id="`${id}-${i}-description`" class="text-xs text-black/65">
            {{ option.description }}
          </p>
        </div>
      </div>
    </RadioGroupRoot>

    <FieldMessage :id="statusId" :status="errorText ? 'error' : undefined" :text="errorText" />
  </div>
</template>
