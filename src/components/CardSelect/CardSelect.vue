<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, useId, type Component, type HTMLAttributes } from 'vue'
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { cn } from '../../lib/cn'
import InfoTip from '../InfoTip/InfoTip.vue'
import FieldMessage from '../FormField/FieldMessage.vue'

/**
 * One choice from a few, shown as side-by-side cards, e.g. a preset ("Baseline",
 * "Recommended", "Strict", "Custom"). Behaves as a radio group: Tab moves into
 * it, the arrow keys move and choose. Choosing never moves anything: every
 * card keeps the same size, border width and padding whether chosen or not,
 * and the space for the round indicator is always reserved.
 *
 * For a plain list of options with small text, use RadioGroup.
 */
export type CardSelectValue = string | number

export interface CardSelectOption {
  /** The card's heading, e.g. "Recommended". */
  title: string
  value: CardSelectValue
  /** A line or two under the title. */
  description?: string
  /** A Lucide icon (or any component) shown before the title. */
  icon?: Component
  disabled?: boolean
}

export interface CardSelectProps {
  /** The question. Also the group's accessible name. */
  label: string
  options: CardSelectOption[]
  /** Visually hide the label (it stays the accessible name). */
  hideLabel?: boolean
  /** Extra guidance about the choice. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Error message. */
  errorText?: string
  /**
   * Cards per row on wide screens (1–4). Always one or two per row on
   * narrow screens. By default as many as fit, at least 10rem each.
   */
  columns?: 1 | 2 | 3 | 4
  /** Name for native form submission. */
  name?: string
  required?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const { t } = useI18n()
const props = withDefaults(defineProps<CardSelectProps>(), {
  helperPlacement: 'below'
})

/** The chosen card's value; undefined until one is chosen. */
const model = defineModel<CardSelectValue | undefined>()

const id = useId()
const labelId = `${id}-label`
const helperId = `${id}-helper`
const statusId = `${id}-status`

const describedBy = computed(
  () => [props.helper && helperId, props.errorText && statusId].filter(Boolean).join(' ') || undefined
)

const grid = computed(() => {
  switch (props.columns) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-1 sm:grid-cols-2'
    case 3:
      return 'grid-cols-1 sm:grid-cols-3'
    case 4:
      return 'grid-cols-2 md:grid-cols-4'
    default:
      return 'grid-cols-[repeat(auto-fit,minmax(min(10rem,100%),1fr))]'
  }
})

// Chosen and not chosen have the same 1px border and padding. The chosen
// card only changes colours and gets a second, inset 1px line drawn with a
// box-shadow, which takes no space. Text keeps the same weight. Nothing is
// added or removed in the card, so nothing can move.
//
// 10px on top, 12px elsewhere: the radio and icon sit 2px down to line up
// with the title, so this puts them 12px from the top, the same as the sides.
const card = [
  'group relative flex w-full cursor-pointer items-start gap-3 rounded-lg border border-ink/10 bg-surface p-3 pt-2.5 text-left text-ink shadow-xs transition-colors',
  'outline-2 outline-offset-2 outline-transparent focus-visible:outline-focus',
  'not-disabled:not-data-[state=checked]:hover:bg-surface-hover',
  'data-[state=checked]:border-primary data-[state=checked]:bg-primary/6 data-[state=checked]:shadow-[inset_0_0_0_1px_var(--color-primary)]',
  'disabled:cursor-not-allowed disabled:opacity-40',
  'motion-reduce:transition-none'
]
</script>

<template>
  <div :class="cn('flex flex-col gap-2 text-ink', disabled && 'opacity-40', props.class)">
    <div :class="cn('flex flex-col gap-0.5', hideLabel && 'sr-only')">
      <div class="flex items-center gap-1">
        <span :id="labelId" class="text-sm">{{ label }}</span>
        <InfoTip v-if="helper && helperPlacement === 'icon'" :text="helper" :label="t('ui.formField.about', { label })" />
      </div>
      <p v-if="helper" :id="helperId" :hidden="helperPlacement === 'icon'" class="text-xs text-ink/65">
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
      :class="cn('grid gap-2', grid)"
    >
      <RadioGroupItem
        v-for="(option, i) in options"
        :id="`${id}-${i}`"
        :key="String(option.value)"
        :value="option.value"
        :disabled="option.disabled"
        :aria-describedby="option.description ? `${id}-${i}-description` : undefined"
        :class="cn(card, errorText && 'not-data-[state=checked]:border-red')"
      >
        <component :is="option.icon" v-if="option.icon" aria-hidden="true" class="mt-0.5 size-4 shrink-0 text-ink/65 group-data-[state=checked]:text-primary-fg" />
        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
          <span class="text-sm font-bold">{{ option.title }}</span>
          <span v-if="option.description" :id="`${id}-${i}-description`" class="text-xs text-ink/65">
            {{ option.description }}
          </span>
        </span>
        <!-- Always there, so the card is the same size either way: the dot only fades and scales in. -->
        <span
          aria-hidden="true"
          class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-ink/45 bg-surface group-data-[state=checked]:border-primary"
        >
          <span class="size-2 scale-0 rounded-full bg-primary transition-transform group-data-[state=checked]:scale-100 motion-reduce:transition-none" />
        </span>
      </RadioGroupItem>
    </RadioGroupRoot>

    <FieldMessage :id="statusId" :status="errorText ? 'error' : undefined" :text="errorText" />
  </div>
</template>
