<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CircleAlert, CircleCheck } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Spinner from '../Spinner/Spinner.vue'

/**
 * Internal (not exported): the status message under a form control, shared
 * by FormField, Checkbox, RadioGroup and Switch so every field's error /
 * success / loading message looks and moves the same.
 */

export type FieldStatus = 'error' | 'success' | 'loading'

const props = defineProps<{
  /** id of the screen-reader copy, for the control's aria-describedby. */
  id: string
  status?: FieldStatus
  text?: string
}>()

// The message slides open when there is text and closed when it clears. While
// closing, keep showing the last message so it doesn't vanish mid-slide.
const open = computed(() => !!props.text)
const shownText = ref(props.text)
const shownStatus = ref(props.status)
watch(
  () => [props.text, props.status] as const,
  ([text, status]) => {
    if (!text) return
    shownText.value = text
    shownStatus.value = status
  }
)

const colour: Record<FieldStatus, string> = {
  error: 'text-red',
  success: 'text-green',
  loading: 'text-black/65'
}

const icon = { error: CircleAlert, success: CircleCheck } as const
</script>

<template>
  <!--
    Visual message. Its row animates from 0 to full height (grid rows
    0fr → 1fr), so content below moves smoothly instead of jumping.
    -mt-1.5 cancels the parent's gap while closed; pt-1.5 puts it back when open.

    The two steps run in sequence so the text is never seen clipped:
      opening: the row grows (150ms), then the text fades in and slides
               down 4px (150ms, starting at 100ms)
      closing: the text fades out (100ms), then the row closes (150ms,
               starting at 100ms)
  -->
  <div
    aria-hidden="true"
    :class="cn(
      '-mt-1.5 grid transition-[grid-template-rows,visibility] duration-150 ease-out motion-reduce:transition-none',
      open ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr] delay-100'
    )"
  >
    <div class="overflow-hidden">
      <p
        :class="cn(
          'flex items-center gap-1 pt-1.5 text-xs transition-[translate,opacity,color] ease-out motion-reduce:transition-none [&_svg]:size-3.5 [&_svg]:shrink-0',
          shownStatus && colour[shownStatus],
          open ? 'duration-150 delay-100' : '-translate-y-1 opacity-0 duration-100'
        )"
      >
        <Spinner v-if="shownStatus === 'loading'" size="sm" class="size-3.5" />
        <component :is="icon[shownStatus]" v-else-if="shownStatus" />
        {{ shownText }}
      </p>
    </div>
  </div>

  <!-- What screen readers hear: linked to the control and announced when it changes. -->
  <p :id="id" aria-live="polite" class="sr-only">{{ text }}</p>
</template>
