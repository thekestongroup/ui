<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, type HTMLAttributes } from 'vue'
import { Eye, EyeOff } from '@lucide/vue'
import FormField, { type FormFieldStatus } from '../FormField/FormField.vue'

/**
 * A password field: Input with a Show / Hide button at the end, a "Caps Lock
 * is on" note while typing, and the password hidden again when its form is
 * submitted (so it's never left on screen, and password managers still see
 * a password field).
 */

// Attributes like name, autocomplete and placeholder go to the <input>.
defineOptions({ inheritAttrs: false })

export type InputPasswordStatus = FormFieldStatus

export interface InputPasswordProps {
  /** Visible label. Always set it: it is also the input's accessible name. */
  label: string
  /** Extra guidance, e.g. the password rules when choosing a new one. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /**
   * Error message, e.g. from a Zod / VeeValidate schema or "Incorrect
   * password". When set (and not empty) the field shows as an error with this
   * text. Overrides `status`, `statusText` and the Caps Lock note.
   */
  errorText?: string
  /** Colours the field and the status text. */
  status?: InputPasswordStatus
  /** Message under the field. Overrides the Caps Lock note. */
  statusText?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<InputPasswordProps>(), {
  helperPlacement: 'below'
})

const model = defineModel<string>({ default: '' })
const attrs = useAttrs()

// Signing in is the common case; pass autocomplete="new-password" when
// choosing one, so password managers offer to generate and save it.
const autocomplete = computed(() => (attrs.autocomplete as string | undefined) ?? 'current-password')

const input = ref<HTMLInputElement>()
const visible = ref(false)

// ── Hide on submit ──────────────────────────────────────────────────────────
// Submitting with the password shown would leave it on screen, and some
// password managers only save fields that are type="password".
const hide = () => (visible.value = false)
let form: HTMLFormElement | null = null
onMounted(() => {
  form = input.value?.form ?? null
  form?.addEventListener('submit', hide)
})
onBeforeUnmount(() => form?.removeEventListener('submit', hide))

// ── Caps Lock ───────────────────────────────────────────────────────────────
// Browsers only report Caps Lock on key and pointer events, so the note shows
// from the first key press and clears when the field loses focus.
const capsLock = ref(false)
function checkCapsLock(event: KeyboardEvent) {
  capsLock.value = event.getModifierState?.('CapsLock') ?? false
}

const statusText = computed(() => props.statusText ?? (capsLock.value ? 'Caps Lock is on' : undefined))

// Same square end segment as InputNumber's + button, so the field reads
// [ password | 👁 ]. Pressing it keeps focus (and the caret) in the input.
const toggle = [
  'flex w-9 shrink-0 -my-2 -mr-3 self-stretch items-center justify-center',
  'bg-white rounded-r border-l border-black/15 cursor-pointer transition',
  'not-disabled:hover:brightness-90 not-disabled:active:brightness-80 [&_svg]:opacity-100!',
  'outline-none focus-visible:bg-black/5 disabled:cursor-not-allowed'
]
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
    :class="props.class"
  >
    <template v-if="$slots.leading" #leading><slot name="leading" /></template>
    <!-- e.g. "Forgot password?": shown by the label, reached by Tab after the field. -->
    <template v-if="$slots['label-trailing']" #label-trailing><slot name="label-trailing" /></template>
    <template #default="{ id, describedBy, invalid }">
      <input
        :id="id"
        ref="input"
        v-model="model"
        v-bind="$attrs"
        :type="visible ? 'text' : 'password'"
        :autocomplete="autocomplete"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        :disabled="disabled"
        :aria-invalid="invalid"
        :aria-describedby="describedBy"
        class="h-5 min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/55 disabled:cursor-not-allowed"
        @keydown="checkCapsLock"
        @keyup="checkCapsLock"
        @blur="capsLock = false"
      />
      <button
        type="button"
        :class="toggle"
        :aria-controls="id"
        :aria-pressed="visible"
        :disabled="disabled"
        @pointerdown.prevent
        @click="visible = !visible"
      >
        <span class="sr-only">Show password</span>
        <EyeOff v-if="visible" aria-hidden="true" />
        <Eye v-else aria-hidden="true" />
      </button>
    </template>
  </FormField>
</template>
