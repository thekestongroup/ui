<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, type HTMLAttributes } from 'vue'
import { ArrowRight } from '@lucide/vue'
import { cn } from '../../lib/cn'
import { hasChanged, withUnit, type ChangeValue } from './changeIndicator'

/**
 * Shows that a setting has been edited and not yet saved, as old value → new
 * value, e.g. `15 → 5` or `3 → 5 phrases`. Put it next to the setting's label.
 * It renders nothing when `from` and `to` are the same, so it can sit in the
 * template permanently and appear only while the setting is edited.
 */
export interface ChangeIndicatorProps {
  /** The saved value. */
  from: ChangeValue
  /** The edited value. */
  to: ChangeValue
  /** Unit shown after the new value only, e.g. "phrases". */
  unit?: string
  class?: HTMLAttributes['class']
}

const { t } = useI18n()
const props = defineProps<ChangeIndicatorProps>()

const changed = computed(() => hasChanged(props.from, props.to))
// Screen readers get one sentence; the symbols are hidden from them.
const label = computed(() => t('ui.changeIndicator.changed', { from: props.from, to: withUnit(props.to, props.unit) }))
</script>

<template>
  <span
    v-if="changed"
    :class="cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-blue-fg/30 bg-blue-fg/10 px-2 text-xs font-bold text-blue-fg', props.class)"
  >
    <span class="sr-only">{{ label }}</span>
    <span aria-hidden="true" class="font-normal line-through decoration-blue-fg/60">{{ from }}</span>
    <ArrowRight aria-hidden="true" class="size-3 shrink-0" />
    <span aria-hidden="true">{{ to }}<template v-if="unit"> {{ unit }}</template></span>
  </span>
</template>
