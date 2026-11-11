<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import { age, daysToBirthday, formatDate, toDate, type DateInput } from '../../lib/dates'
import { useNow } from '../../lib/useNow'
import Tooltip from '../Tooltip/Tooltip.vue'

/**
 * Someone's age, "13", with their date of birth in a tooltip on hover or
 * focus: "Born 14 March 2013", plus "Birthday today" or "Birthday in 3 days"
 * when it's within a week (handy for teachers).
 */
export interface AgeProps {
  /** Date of birth: a Date, an ISO string ("2013-03-14"), or a timestamp. */
  birthDate: DateInput
  /** Text after the number: "years" gives "13 years". Leave out for just "13" (e.g. in an "Age" column). */
  suffix?: string
  /** What "today" is, e.g. for tests. Default the live date. */
  now?: Date
  class?: HTMLAttributes['class']
}

const props = defineProps<AgeProps>()

const liveNow = useNow()
const born = computed(() => toDate(props.birthDate))
const today = computed(() => props.now ?? liveNow.value)
const years = computed(() => age(born.value, today.value))
const tooltip = computed(() => {
  const days = daysToBirthday(born.value, today.value)
  const soon = days === 0 ? ' · Birthday today' : days === 1 ? ' · Birthday tomorrow' : days <= 7 ? ` · Birthday in ${days} days` : ''
  return `Born ${formatDate(born.value)}${soon}`
})
const iso = computed(() => {
  const d = born.value
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
</script>

<template>
  <Tooltip :text="tooltip">
    <span
      tabindex="0"
      :data-birth-date="iso"
      :class="
        cn(
          'cursor-default rounded-sm tabular-nums underline decoration-current/40 decoration-dotted underline-offset-2',
          'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus forced-colors:not-focus-visible:outline-0',
          props.class
        )
      "
    >
      {{ years }}<template v-if="suffix">&nbsp;{{ suffix }}</template>
    </span>
  </Tooltip>
</template>
