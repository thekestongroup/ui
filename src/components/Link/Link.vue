<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { ExternalLink } from '@lucide/vue'
import { cn } from '../../lib/cn'

/**
 * A text link: underlined, in the colour and size of the text around it, so
 * it fits in a sentence, a footer or a tooltip alike. With `newTab` it opens
 * in a new tab and shows a small external-page icon (and tells screen
 * readers it opens in a new tab).
 *
 * For a router, pass its link component as `as`, e.g.
 * `<Link :as="RouterLink" to="/help">`.
 */
export interface LinkProps {
  href?: string
  /** Open in a new tab, with the external-page icon. Use it for pages outside the current flow (policies, help) so people don't lose their place. */
  newTab?: boolean
  /** With `newTab`, show the external-page icon. Turn it off where it would clutter, e.g. a row of footer links. Screen readers still hear "(opens in a new tab)". */
  icon?: boolean
  /** Element or component to render, e.g. RouterLink. */
  as?: PrimitiveProps['as']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'a',
  icon: true
})

// Underlined in the text's own colour; hovering darkens it to black and
// thickens the line. Keyboard focus gets the usual focus ring.
const base = [
  'cursor-pointer rounded-xs underline underline-offset-2 transition-colors',
  'hover:text-black hover:decoration-2',
  'outline-2 outline-offset-2 outline-transparent focus-visible:outline-focus'
]
</script>

<template>
  <Primitive
    :as="as"
    :href="href"
    :target="newTab ? '_blank' : undefined"
    :rel="newTab ? 'noopener noreferrer' : undefined"
    :class="cn(base, props.class)"
  >
    <slot />
    <template v-if="newTab">
      <!-- Sized to the text (em), sitting on its baseline, after a thin gap. -->
      <ExternalLink v-if="icon" class="ms-0.5 inline size-[0.9em] align-[-0.1em]" aria-hidden="true" />
      <span class="sr-only"> (opens in a new tab)</span>
    </template>
  </Primitive>
</template>
