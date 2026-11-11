<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { PinInputInput, PinInputRoot } from 'reka-ui'
import { cn } from '../../lib/cn'
import InfoTip from '../InfoTip/InfoTip.vue'
import FieldMessage, { type FieldStatus } from '../FormField/FieldMessage.vue'

/**
 * A one-time code, e.g. from an authenticator app, an email or a text
 * message: one box per character. Typing moves to the next box, Backspace to
 * the one before, and pasting (or the code suggested by the phone's keyboard)
 * fills every box at once. Built on Reka UI's PinInput.
 */

export type InputCodeStatus = FieldStatus

export interface InputCodeProps {
  /** Visible label, e.g. "Code from your authenticator app". */
  label: string
  /** Extra guidance, e.g. where the code was sent. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Number of characters. */
  length?: number
  /** Allow letters as well as digits. Codes are digits only by default. */
  alphanumeric?: boolean
  /**
   * Error message, e.g. "That code didn't work". When set (and not empty)
   * every box shows as an error with this text. Overrides `status` and
   * `statusText`.
   */
  errorText?: string
  /** Colours the boxes and the status text; `loading` while the code is checked. */
  status?: InputCodeStatus
  /** Message under the boxes, e.g. "Checking code…". */
  statusText?: string
  /** Form field name, so the code is sent with a native form. */
  name?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<InputCodeProps>(), {
  helperPlacement: 'below',
  length: 6
})

/** The code as one string, e.g. "042317". Shorter while it's being typed. */
const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  /** Every box is filled: a good moment to submit the code. */
  complete: [code: string]
}>()

const id = useId()
const labelId = `${id}-label`
const helperId = `${id}-helper`
const statusId = `${id}-status`

const currentStatus = computed<InputCodeStatus | undefined>(() => (props.errorText ? 'error' : props.status))
const currentStatusText = computed(() => props.errorText || props.statusText)
const describedBy = computed(
  () => [props.helper && helperId, currentStatusText.value && statusId].filter(Boolean).join(' ') || undefined
)

// Reka keeps one entry per box (numbers in digit mode); the app gets a plain
// string. Letters are upper-cased, as codes are shown that way and aren't
// case sensitive.
type Box = string | number | undefined
const boxes = computed<Box[]>(() =>
  Array.from({ length: props.length }, (_, i) => {
    const char = model.value[i]
    if (props.alphanumeric) return char ?? ''
    return char === undefined ? undefined : Number(char)
  })
)
function toCode(value: Box[]) {
  return value
    .map((char) => (char == null ? '' : String(char)))
    .join('')
    .replace(props.alphanumeric ? /[^a-z0-9]/gi : /\D/g, '')
    .toUpperCase()
    .slice(0, props.length)
}
const onUpdate = (value: Box[]) => (model.value = toCode(value))
const onComplete = (value: Box[]) => emit('complete', toCode(value))

// Each box looks like FormField's box (a medium basic Button), with the
// focus ring on the box being typed in.
const box = [
  'size-10 shrink-0 rounded border border-black/15 bg-white text-center text-lg tabular-nums text-black transition',
  'outline-2 outline-offset-1 outline-transparent focus:outline-focus forced-colors:not-focus:outline-0',
  'placeholder:text-black/25 disabled:cursor-not-allowed'
]
const statusBorder: Record<InputCodeStatus, string> = {
  error: 'border-red',
  success: 'border-green',
  loading: ''
}
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 text-black', props.class)">
    <div class="flex flex-col gap-0.5">
      <div class="flex items-center gap-1">
        <label :id="labelId" :for="`${id}-0`" class="text-sm">{{ label }}</label>
        <InfoTip v-if="helper && helperPlacement === 'icon'" :text="helper" :label="`About ${label}`" />
      </div>
      <!-- Behind the ?: hidden, but still the boxes' description. -->
      <p v-if="helper" :id="helperId" :hidden="helperPlacement === 'icon'" class="text-xs text-black/65">
        {{ helper }}
      </p>
    </div>

    <PinInputRoot
      :model-value="boxes as any"
      :type="alphanumeric ? 'text' : 'number'"
      :name="name"
      :disabled="disabled"
      otp
      placeholder="·"
      role="group"
      :aria-labelledby="labelId"
      :class="cn('flex gap-2', disabled && 'opacity-40')"
      @update:model-value="onUpdate"
      @complete="onComplete"
    >
      <PinInputInput
        v-for="(_, i) in length"
        :id="`${id}-${i}`"
        :key="i"
        :index="i"
        :aria-label="i === 0 ? undefined : `Character ${i + 1} of ${length}`"
        :aria-labelledby="i === 0 ? labelId : undefined"
        :aria-describedby="describedBy"
        :aria-invalid="currentStatus === 'error' || undefined"
        :class="cn(box, currentStatus && statusBorder[currentStatus])"
      />
    </PinInputRoot>

    <FieldMessage :id="statusId" :status="currentStatus" :text="currentStatusText" />
  </div>
</template>
