<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { I18nT } from 'vue-i18n'
import { cn } from '../../lib/cn'
import Progress from '../Progress/Progress.vue'

/**
 * Where someone is in a set of steps: a segment for each step, filled up to
 * the current one, and "Step 2 of 3: Licences" under it. Put it at the top of
 * a multi-step form. (Slideover's `steps` shows one for you; use this when
 * the steps are on a page, or in a Slideover you drive yourself.) The words
 * are announced when the step changes.
 */
export interface StepsProps {
  /** The name of each step, in order, e.g. `['User info', 'Licences']`. */
  steps: string[]
  /** The current step, counting from 0. */
  step: number
  /** What the steps are for, e.g. "Add a user". The progress bar's accessible name; not shown. */
  label: string
  class?: HTMLAttributes['class']
}

const props = defineProps<StepsProps>()
</script>

<template>
  <div :class="cn('flex flex-col gap-3', props.class)">
    <Progress :label="label" segments :value="step + 1" :max="steps.length" />
    <p class="text-sm text-black/65" aria-live="polite">
      <I18nT keypath="ui.steps.stepOfNamed" scope="global" tag="span">
        <template #current>{{ step + 1 }}</template>
        <template #total>{{ steps.length }}</template>
        <template #name><span class="text-black">{{ steps[step] }}</span></template>
      </I18nT>
    </p>
  </div>
</template>
