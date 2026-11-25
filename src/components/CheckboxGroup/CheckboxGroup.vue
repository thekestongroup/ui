<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from 'vue'
import { useI18n } from 'vue-i18n'
import { cn } from '../../lib/cn'
import Checkbox from '../Checkbox/Checkbox.vue'
import FieldMessage from '../FormField/FieldMessage.vue'
import InfoTip from '../InfoTip/InfoTip.vue'

/**
 * Several yes / no answers under one question, where any number can be
 * ticked, e.g. "Which licences should they have?" or "Send it to". For one
 * choice from a few, use RadioGroup; for a list of more than about eight,
 * use Select with `multiple`.
 */
export type CheckboxGroupValue = string | number

export interface CheckboxOption {
  label: string
  value: CheckboxGroupValue
  /** More detail, in smaller text under the label. */
  description?: string
  disabled?: boolean
}

export interface CheckboxGroupProps {
  /** The question, above the options. Also the group's accessible name. */
  label: string
  options: CheckboxOption[]
  /** Extra guidance about the choice. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Keep the label (and helper) for screen readers only. */
  hideLabel?: boolean
  /** Error message, e.g. "Choose at least one". */
  errorText?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  helperPlacement: 'below'
})
const { t } = useI18n()

/** The values of the ticked options. */
const model = defineModel<CheckboxGroupValue[]>({ default: () => [] })

const id = useId()
const labelId = `${id}-label`
const helperId = `${id}-helper`
const statusId = `${id}-status`

const describedBy = computed(
  () => [props.helper && helperId, props.errorText && statusId].filter(Boolean).join(' ') || undefined
)

function toggle(value: CheckboxGroupValue, on: boolean) {
  model.value = on ? [...model.value, value] : model.value.filter((v) => v !== value)
}
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 text-ink', props.class)">
    <div :class="cn('flex flex-col gap-0.5', hideLabel && 'sr-only')">
      <div class="flex items-center gap-1">
        <span :id="labelId" class="text-sm">{{ label }}</span>
        <InfoTip v-if="helper && helperPlacement === 'icon'" :text="helper" :label="t('ui.formField.about', { label })" />
      </div>
      <!-- Behind the ?: hidden, but still the group's description. -->
      <p v-if="helper" :id="helperId" :hidden="helperPlacement === 'icon'" class="text-xs text-ink/65">
        {{ helper }}
      </p>
    </div>

    <div
      role="group"
      :aria-labelledby="labelId"
      :aria-describedby="describedBy"
      :aria-invalid="errorText ? true : undefined"
      class="flex flex-col gap-3"
    >
      <Checkbox
        v-for="option in options"
        :key="String(option.value)"
        :model-value="model.includes(option.value)"
        :label="option.label"
        :description="option.description"
        :disabled="disabled || option.disabled"
        @update:model-value="toggle(option.value, $event === true)"
      />
    </div>

    <FieldMessage :id="statusId" :status="errorText ? 'error' : undefined" :text="errorText" />
  </div>
</template>
