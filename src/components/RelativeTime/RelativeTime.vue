<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import { formatDateTime, relativeTime, toDate, type DateInput } from '../../lib/dates'
import { useNow } from '../../lib/useNow'
import Tooltip from '../Tooltip/Tooltip.vue'

/**
 * A time as people say it, "3 hours ago", with the exact date and time
 * ("Wednesday 11 November 2026 at 09:52") in a tooltip on hover or focus.
 * Keeps itself up to date (every 30 seconds).
 *
 * Use it wherever an app shows a relative date: notifications, "last
 * edited", activity, comments.
 */
export interface RelativeTimeProps {
  /** A Date, an ISO string, or a timestamp. */
  date: DateInput
  /** What "now" is, e.g. for tests or a fixed screenshot. Default the live time. */
  now?: Date
  /** Tooltip text. Default the full date and time; e.g. "Edited on {date}". */
  tooltip?: (date: Date) => string
  class?: HTMLAttributes['class']
}

const props = defineProps<RelativeTimeProps>()

const liveNow = useNow()
const value = computed(() => toDate(props.date))
const text = computed(() => relativeTime(value.value, props.now ?? liveNow.value))
const full = computed(() => (props.tooltip ? props.tooltip(value.value) : formatDateTime(value.value)))
</script>

<template>
  <Tooltip :text="full">
    <!-- Focusable, so keyboard users can open the tooltip too. -->
    <time
      :datetime="value.toISOString()"
      tabindex="0"
      :class="
        cn(
          'cursor-default rounded-sm underline decoration-current/40 decoration-dotted underline-offset-2',
          'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus forced-colors:not-focus-visible:outline-0',
          props.class
        )
      "
    >
      {{ text }}
    </time>
  </Tooltip>
</template>
