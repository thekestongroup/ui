<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, type HTMLAttributes } from 'vue'
import FormField, { type FormFieldStatus } from '../FormField/FormField.vue'

// Attributes like placeholder, type, name and autocomplete go to the <input>,
// not the wrapper.
defineOptions({ inheritAttrs: false })

export type InputStatus = FormFieldStatus

export interface InputProps {
  /** Visible label. Always set it: it is also the input's accessible name. */
  label: string
  /** Extra guidance about what to enter. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Keep the label for screen readers only, e.g. in a table of fields with column headings. */
  hideLabel?: boolean
  /**
   * Error message, e.g. from a Zod / VeeValidate schema. When set (and not
   * empty) the field shows as an error with this text; leave it undefined
   * when the value is valid. Overrides `status`, `statusText` and the length
   * check.
   */
  errorText?: string
  /** Colours the field and the status text. Overrides the length check. */
  status?: InputStatus
  /** Message under the field, e.g. why the value is invalid. */
  statusText?: string
  /** Shows an error once the user leaves a field that is too short. */
  minLength?: number
  /** Shows an error as soon as the value is too long. Typing is not blocked. */
  maxLength?: number
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const { t } = useI18n()
const props = withDefaults(defineProps<InputProps>(), {
  helperPlacement: 'below'
})

const model = defineModel<string>({ default: '' })

// ── Length check ────────────────────────────────────────────────────────────
// "Too short" waits until the user has left the field once, so it doesn't
// complain while they are still typing. "Too long" shows straight away.
const touched = ref(false)

const lengthError = computed(() => {
  const length = model.value.length
  if (props.maxLength !== undefined && length > props.maxLength) {
    return t('ui.input.maxLength', { count: props.maxLength })
  }
  if (touched.value && props.minLength !== undefined && length > 0 && length < props.minLength) {
    return t('ui.input.minLength', { count: props.minLength })
  }
  return undefined
})

// errorText is handled by FormField; status / statusText fall back to the length check.
const status = computed(() => props.status ?? (lengthError.value ? 'error' : undefined))
const statusText = computed(() => props.statusText ?? lengthError.value)
</script>

<template>
  <FormField
    :label="label"
    :helper="helper"
    :helper-placement="helperPlacement"
    :hide-label="hideLabel"
    :error-text="errorText"
    :status="status"
    :status-text="statusText"
    :disabled="disabled"
    :class="props.class"
  >
    <template v-if="$slots.leading" #leading><slot name="leading" /></template>
    <template #default="{ id, describedBy, invalid }">
      <input
        :id="id"
        v-model="model"
        v-bind="$attrs"
        :disabled="disabled"
        :aria-invalid="invalid"
        :aria-describedby="describedBy"
        class="h-5 min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/55 disabled:cursor-not-allowed"
        @blur="touched = true"
      />
    </template>
    <template v-if="$slots.trailing" #trailing><slot name="trailing" /></template>
  </FormField>
</template>
