<script setup lang="ts">
import { h, type FunctionalComponent, type HTMLAttributes } from 'vue'
import {
  injectTooltipProviderContext,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  type TooltipContentProps
} from 'reka-ui'
import { cn } from '../../lib/cn'

/**
 * A short label that appears on hover or keyboard focus: the exact date
 * behind "3 hours ago", a birthday behind an age, the name of an icon
 * button.
 *
 * Only for extra, non-essential detail: it doesn't open on touch screens,
 * so anything people need must be on the page too. Nothing interactive
 * inside it (use a Popover).
 *
 * The trigger (default slot) must be focusable, so keyboard users can open
 * it: a Button, a link, or an element with `tabindex="0"`. The tooltip is
 * linked to it with `aria-describedby`, so screen readers read it after the
 * trigger's name.
 *
 * Slots: default (the trigger), content (instead of `text`).
 */
export interface TooltipProps {
  /** The tooltip's text. */
  text?: string
  /** Which side of the trigger. */
  side?: TooltipContentProps['side']
  align?: TooltipContentProps['align']
  /** Wait this long before showing, in ms. Moving to another tooltip soon after shows it at once. */
  delay?: number
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<TooltipProps>(), {
  side: 'top',
  align: 'center',
  delay: 400
})

defineSlots<{
  default?(): unknown
  content?(): unknown
}>()

// Reka needs a TooltipProvider above every tooltip. AppShell has one for the
// whole app (so moving from one tooltip to the next shows it straight away);
// elsewhere each tooltip brings its own.
const hasProvider = injectTooltipProviderContext(null) !== null
const MaybeProvider: FunctionalComponent = (_, { slots }) =>
  hasProvider ? slots.default?.() : h(TooltipProvider, { delayDuration: props.delay, skipDelayDuration: 300 }, slots)
</script>

<template>
  <MaybeProvider>
    <TooltipRoot :disabled="disabled" :delay-duration="delay">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :align="align"
          :side-offset="8"
          :collision-padding="8"
          :class="
            cn(
              'z-100 max-w-72 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs/4 font-medium text-white shadow-lg ring-1 ring-white/10',
              'data-[state=closed]:animate-fade-out data-[state=delayed-open]:animate-fade-in data-[state=instant-open]:animate-fade-in',
              props.class
            )
          "
        >
          <slot name="content">{{ text }}</slot>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </MaybeProvider>
</template>
