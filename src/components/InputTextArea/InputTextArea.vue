<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { useI18n } from 'vue-i18n'
import FormField, { type FormFieldStatus } from '../FormField/FormField.vue'

// Attributes like placeholder, name, autocomplete and spellcheck go to the
// <textarea>, not the wrapper.
defineOptions({ inheritAttrs: false })

/**
 * Several lines of plain text, e.g. a reason, an address or a list with one
 * item per line. It starts four lines tall and grows with the text up to 15
 * lines, then scrolls. For notes that need bold, italic or underline, use
 * InputRichText; for one line, Input.
 */
export interface InputTextAreaProps {
  /** Visible label. Always set it: it is also the field's accessible name. */
  label: string
  /** Extra guidance about what to enter. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Keep the label for screen readers only, e.g. in a table of fields with column headings. */
  hideLabel?: boolean
  /**
   * Error message, e.g. from a Zod schema. Overrides `status`, `statusText`
   * and the length check.
   */
  errorText?: string
  /** Colours the field and the status text. Overrides the length check. */
  status?: FormFieldStatus
  /** Message under the field. */
  statusText?: string
  /** Shown in the empty field, e.g. "One address per line". */
  placeholder?: string
  /** Shows an error as soon as the text is too long. Typing is not blocked. */
  maxLength?: number
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<InputTextAreaProps>(), {
  helperPlacement: 'below'
})
const { t } = useI18n()

const model = defineModel<string>({ default: '' })

const lengthError = computed(() =>
  props.maxLength !== undefined && model.value.length > props.maxLength
    ? t('ui.input.maxLength', { count: props.maxLength })
    : undefined
)
const status = computed(() => props.status ?? (lengthError.value ? 'error' : undefined))
const statusText = computed(() => props.statusText ?? lengthError.value)

const area = ref<HTMLTextAreaElement>()
defineExpose({ focus: () => area.value?.focus() })
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
    <template #default="{ id, describedBy, invalid }">
      <!-- field-sizing grows it with the text; 4 to 15 lines (96px to 320px),
           like InputRichText. A drag handle would fight that, so there's none. -->
      <textarea
        :id="id"
        ref="area"
        v-model="model"
        v-bind="$attrs"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="invalid"
        :aria-describedby="describedBy"
        class="field-sizing-content -my-0.5 max-h-80 min-h-24 min-w-0 flex-1 resize-none bg-transparent text-sm leading-5 outline-none placeholder:text-ink/55 disabled:cursor-not-allowed pointer-coarse:text-base"
      />
    </template>
  </FormField>
</template>
