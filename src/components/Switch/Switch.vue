<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { cn } from '../../lib/cn'
import FieldMessage, { type FieldStatus } from '../FormField/FieldMessage.vue'

/**
 * Turns a setting on or off straight away, with no Save button, e.g. "Email
 * me when an application arrives". For an answer that's sent with a form,
 * use Checkbox.
 *
 * As the change saves immediately, it can show how that went: `status`
 * 'loading' with "Saving…", then 'success' or 'error'.
 */
export interface SwitchProps {
  /** Visible label, beside the switch. Pressing it flips the switch too. */
  label: string
  /** More detail, in smaller text under the label. */
  description?: string
  /** Error message. Overrides `status` and `statusText`. */
  errorText?: string
  /** Colours the status text: e.g. 'loading' while the change saves. */
  status?: FieldStatus
  /** Message under the switch, e.g. "Saving…" or "Couldn't save. Try again." */
  statusText?: string
  /** Name for native form submission. */
  name?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = defineProps<SwitchProps>()

/** On or off. */
const model = defineModel<boolean>({ default: false })

const id = useId()
const controlId = `${id}-control`
const descriptionId = `${id}-description`
const statusId = `${id}-status`

const currentStatus = computed(() => (props.errorText ? 'error' : props.status))
const currentStatusText = computed(() => props.errorText || props.statusText)

const describedBy = computed(
  () => [props.description && descriptionId, currentStatusText.value && statusId].filter(Boolean).join(' ') || undefined
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

// 36 × 20px track, level with the label's first line; the 16px thumb slides
// 16px. Off is a mid grey, dark enough to see against the page.
const track = [
  'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors',
  'bg-black/45 not-disabled:hover:bg-black/55 data-[state=checked]:bg-primary data-[state=checked]:hover:bg-primary',
  'disabled:cursor-not-allowed',
  'outline-2 outline-offset-2 outline-transparent focus-visible:outline-focus'
]
const thumb = 'size-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 motion-reduce:transition-none'
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 text-black', disabled && 'opacity-40', props.class)">
    <div class="flex items-start gap-2">
      <SwitchRoot
        :id="controlId"
        v-model="model"
        :name="name"
        :disabled="disabled"
        :aria-invalid="currentStatus === 'error' || undefined"
        :aria-describedby="describedBy"
        :class="track"
      >
        <SwitchThumb :class="thumb" />
      </SwitchRoot>
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
    <FieldMessage :id="statusId" :status="currentStatus" :text="currentStatusText" />
  </div>
</template>
