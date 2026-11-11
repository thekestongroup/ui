<script setup lang="ts">
import { useId, type HTMLAttributes } from 'vue'
import { CircleHelp } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Popover from '../Popover/Popover.vue'

/**
 * A `?` that explains the thing beside it: a field's label, a table column,
 * a figure. Opens on hover, and on click / tap (which keeps it open, so it
 * works on touch screens). Focus is never moved, so typing in a nearby
 * control isn't interrupted.
 */
export interface InfoTipProps {
  /** The explanation. Keep it to a sentence or two. */
  text: string
  /**
   * The button's accessible name: what it explains, e.g. "About Student ID".
   * Screen readers then hear `text` as its description.
   */
  label: string
  class?: HTMLAttributes['class']
}

const props = defineProps<InfoTipProps>()

const descriptionId = `${useId()}-description`
</script>

<template>
  <Popover mode="hover" :content="{ side: 'top', sideOffset: 6 }">
    <button
      type="button"
      :aria-label="label"
      :aria-describedby="descriptionId"
      :class="cn(
        'inline-flex shrink-0 rounded-full p-0.5 align-middle text-black transition hover:bg-black/10 data-[state=open]:bg-black/10',
        'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus [&_svg]:size-4',
        props.class
      )"
    >
      <CircleHelp aria-hidden="true" />
      <!-- Hidden, but still read as the button's description (the
           aria-label replaces the button's content as its name). -->
      <span :id="descriptionId" hidden>{{ text }}</span>
    </button>
    <template #content>
      <p class="max-w-64 px-3 py-2 text-xs">{{ text }}</p>
    </template>
  </Popover>
</template>
