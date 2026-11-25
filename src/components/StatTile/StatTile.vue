<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, watchEffect, type Component, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Card from '../Card/Card.vue'

/**
 * One number that matters, in a small Card: "Open applications 48".
 * Put several in a grid. Optionally with how it's changed ("+12% on last
 * year") and a short description.
 *
 * Give it an `href` (or `as`, e.g. a router link, with its own `to`) and the
 * whole tile becomes one link: an arrow in the corner shows it's clickable,
 * and it darkens its border on hover and its background when pressed.
 *
 * Slots: value (e.g. a value with a unit in smaller text), description,
 * footer (e.g. a "View all" link; not in a tile that is itself a link).
 */
export interface StatTileProps {
  /** What the number is, e.g. "Open applications". */
  label: string
  /** The number, already formatted, e.g. "1,204" or "96%". */
  value?: string | number
  /** Icon before the label. Decorative. */
  icon?: Component
  /** How it's changed, already formatted, e.g. "+12%" or "−3". */
  change?: string
  /** What the change is against, e.g. "on last year". Read after the change. */
  changeLabel?: string
  /** Which way it went. Sets the arrow. */
  trend?: 'up' | 'down' | 'flat'
  /**
   * Whether the change is good, which sets the colour: green good, red bad,
   * grey neutral. Defaults to up good, down bad, flat neutral. Set it when
   * down is good, e.g. absences.
   */
  sentiment?: 'positive' | 'negative' | 'neutral'
  /** Grey text under the value. */
  description?: string
  /** Makes the whole tile a link to here. */
  href?: string
  /** Element or component to render the link as, e.g. RouterLink (then pass its `to`). Makes the tile a link. */
  as?: PrimitiveProps['as']
  class?: HTMLAttributes['class']
}

const { t } = useI18n()
const props = defineProps<StatTileProps>()

const slots = defineSlots<{
  value?(): unknown
  description?(): unknown
  footer?(): unknown
}>()

const isLink = computed(() => Boolean(props.href || props.as))
// A link can't hold another link or button, so the footer is for static tiles.
watchEffect(() => {
  if (import.meta.env.DEV && isLink.value && slots.footer) {
    console.warn('[StatTile] The footer slot is ignored when the tile is a link (href or as).')
  }
})

const tone = computed(() => {
  if (props.sentiment) return props.sentiment
  if (props.trend === 'up') return 'positive'
  if (props.trend === 'down') return 'negative'
  return 'neutral'
})

const toneClasses = { positive: 'text-green-fg', negative: 'text-red-fg', neutral: 'text-ink/65' } as const
const trendIcon = computed(() =>
  props.trend === 'up' ? ArrowUpRight : props.trend === 'down' ? ArrowDownRight : props.trend === 'flat' ? ArrowRight : undefined
)
// The arrow is decorative, so say the direction in words for screen readers.
const trendWords = computed(() => ({ up: t('ui.statTile.up'), down: t('ui.statTile.down'), flat: t('ui.statTile.flat') }))
</script>

<template>
  <!-- A link wraps the card; a static tile is just the card (as="template" hands the attributes to it). -->
  <Primitive
    :as="isLink ? (as ?? 'a') : 'template'"
    :href="isLink ? href : undefined"
    :class="isLink && 'group block h-full cursor-pointer rounded-lg outline-2 outline-offset-2 outline-transparent focus-visible:outline-focus'"
  >
  <Card
    padding="sm"
    :class="
      cn(
        isLink &&
          'relative h-full transition-[border-color,box-shadow,background-color] duration-150 motion-reduce:transition-none group-hover:border-ink/20 group-hover:shadow-sm group-active:bg-surface-hover',
        props.class
      )
    "
    :ui="{ body: 'gap-1' }"
  >
    <!-- Still, decorative: the link role is what screen readers get. -->
    <ArrowUpRight v-if="isLink" class="absolute end-4 top-4 size-4 text-ink/65" aria-hidden="true" />

    <p :class="cn('flex items-center gap-2 text-sm text-ink/65', isLink && 'pe-6')">
      <component :is="icon" v-if="icon" class="size-4 shrink-0" aria-hidden="true" />
      {{ label }}
    </p>

    <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <p class="text-2xl font-bold tabular-nums">
        <slot name="value">{{ value ?? '—' }}</slot>
      </p>
      <p v-if="change || trend" :class="cn('inline-flex items-center gap-0.5 text-sm', toneClasses[tone])">
        <component :is="trendIcon" v-if="trendIcon" class="size-4 shrink-0" aria-hidden="true" />
        <span v-if="trend" class="sr-only">{{ trendWords[trend] }}</span>
        <span v-if="change" class="font-bold tabular-nums">{{ change }}</span>
        <span v-if="changeLabel" class="text-ink/65">&nbsp;{{ changeLabel }}</span>
      </p>
    </div>

    <p v-if="description || $slots.description" class="text-sm text-ink/65">
      <slot name="description">{{ description }}</slot>
    </p>

    <div v-if="$slots.footer && !isLink" class="mt-2 text-sm">
      <slot name="footer" />
    </div>
  </Card>
  </Primitive>
</template>
