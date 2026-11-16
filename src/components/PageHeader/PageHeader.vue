<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Component, type HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import Breadcrumb, { type BreadcrumbItem } from '../Breadcrumb/Breadcrumb.vue'
import Button from '../Button/Button.vue'
import Menu, { type MenuItem } from '../Menu/Menu.vue'

/** One of the page's everyday actions, in the toolbar under the title. */
export interface PageHeaderAction {
  label: string
  icon?: Component
  /** Runs on click, e.g. opens a Slideover. */
  onSelect?: () => void
  /** Link with a plain <a href>. */
  href?: string
  /** Link through `linkComponent` (e.g. RouterLink), which receives `to`. */
  to?: unknown
  disabled?: boolean
}

/**
 * The top of a page: where it is (breadcrumb), what it is (the h1 title, with
 * an optional status badge and description), and its main actions on the
 * right. Actions wrap under the title on narrow screens.
 *
 * `toolbar`: the everyday things people do to what the page is about (e.g.
 * on a user: Reset password, Unblock sign-in, Delete user), as a row of quiet
 * buttons under the title. Those that don't fit go in a "⋯" Menu at its
 * right-hand end (and come back as it widens). `toolbar-start` and `toolbar-end` slots put
 * something before or after them, e.g. "2 users selected". Keep the one main action (Save, Add…) in the
 * actions slot on the right; the toolbar is for the rest.
 *
 * Slots: badge (after the title, e.g. a Badge), description (instead of the
 * prop, for links or formatting), actions (e.g. Buttons), toolbar-start and
 * toolbar-end (in the toolbar, before and after its buttons), default
 * (anything under, e.g. an alert or tabs).
 */
export interface PageHeaderProps {
  /** The page's name: its h1. */
  title: string
  /** A sentence under the title. */
  description?: string
  /** Where the page is. Pass `sidebarTrail(items)` to follow a nested Sidebar. */
  breadcrumb?: BreadcrumbItem[]
  /** Component used for breadcrumb steps with `to`, e.g. RouterLink. */
  linkComponent?: string | Component
  /** Everyday actions, in a row under the title. */
  toolbar?: PageHeaderAction[]
  class?: HTMLAttributes['class']
  /** Extra classes for the parts. */
  ui?: {
    title?: HTMLAttributes['class']
    description?: HTMLAttributes['class']
    actions?: HTMLAttributes['class']
    toolbar?: HTMLAttributes['class']
  }
}

const { t } = useI18n()
const props = withDefaults(defineProps<PageHeaderProps>(), { linkComponent: 'a' })

// Links render as links, the rest as buttons.
function as(item: PageHeaderAction) {
  if (item.to !== undefined) return props.linkComponent
  if (item.href !== undefined) return 'a'
  return 'button'
}

const slots = defineSlots<{
  badge?(): unknown
  description?(): unknown
  actions?(): unknown
  'toolbar-start'?(): unknown
  'toolbar-end'?(): unknown
  default?(): unknown
}>()

const hasToolbar = computed(() => !!props.toolbar?.length || !!slots['toolbar-start'] || !!slots['toolbar-end'])

// ── Toolbar overflow ────────────────────────────────────────────────────────
// A hidden copy of every button is measured; as many as fit are shown, and
// the rest go in the "⋯" Menu (whose width is kept free for it).
const fitArea = ref<HTMLElement>()
const measure = ref<HTMLElement>()
const shown = ref(Infinity)

function fit() {
  const area = fitArea.value
  const copy = measure.value
  const items = props.toolbar ?? []
  if (!area || !copy || !items.length) return
  const buttons = Array.from(copy.children) as HTMLElement[]
  const more = buttons.pop()! // the ⋯ button, last in the copy
  const gap = parseFloat(getComputedStyle(copy).columnGap) || 0
  const widths = buttons.map((b) => b.getBoundingClientRect().width)
  const available = area.clientWidth
  const all = widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(widths.length - 1, 0)
  if (all <= available) {
    shown.value = items.length
    return
  }
  let used = more.getBoundingClientRect().width
  let n = 0
  while (n < widths.length && used + gap + widths[n]! <= available) used += gap + widths[n++]!
  shown.value = n
}

// Watched for size changes whenever it's there: the toolbar may only appear
// after the page has loaded (e.g. once its actions arrive).
let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver(() => fit())
  if (fitArea.value) observer.observe(fitArea.value)
  fit()
})
watch(fitArea, (el, old) => {
  if (old) observer?.unobserve(old)
  if (el) {
    observer?.observe(el)
    nextTick(fit)
  }
})
onBeforeUnmount(() => observer?.disconnect())
watch(
  () => props.toolbar?.map((i) => `${i.label}${i.disabled ? '-' : ''}`).join('|'),
  () => nextTick(fit),
)

const visible = computed(() => (props.toolbar ?? []).slice(0, shown.value))
const overflow = computed<MenuItem[]>(() => (props.toolbar ?? []).slice(shown.value))
</script>

<template>
  <header :class="cn('flex flex-col gap-2', props.class)">
    <!-- Only worth showing once there's somewhere to go back to. -->
    <Breadcrumb v-if="breadcrumb && breadcrumb.length > 1" :items="breadcrumb" :link-component="linkComponent" />

    <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div class="flex min-w-0 flex-col gap-1">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h1 :class="cn('min-w-0 text-2xl font-bold break-words', ui?.title)">{{ title }}</h1>
          <slot name="badge" />
        </div>
        <p v-if="description || $slots.description" :class="cn('max-w-prose text-sm text-black/65', ui?.description)">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>

      <div v-if="$slots.actions" :class="cn('flex flex-wrap items-center gap-2', ui?.actions)">
        <slot name="actions" />
      </div>
    </div>

    <!-- Ghost buttons in a white bar, like a Card; those that don't fit go
         in the ⋯ Menu at the end. -->
    <div
      v-if="hasToolbar"
      role="group"
      :aria-label="t('ui.pageHeader.actions', { title })"
      :class="cn('flex items-center gap-1 rounded-lg border border-black/15 bg-white p-1', ui?.toolbar)"
    >
      <!-- Text here reads as the toolbar's own: bold, spaced like a button. -->
      <div v-if="$slots['toolbar-start']" class="flex shrink-0 items-center gap-2 px-3 text-sm font-bold" aria-live="polite">
        <slot name="toolbar-start" />
      </div>
      <div ref="fitArea" class="relative flex min-w-0 flex-1 items-center gap-1">
        <Button
          v-for="item in visible"
          :key="item.label"
          :as="as(item)"
          :to="item.to"
          :href="item.href"
          variant="ghost"
          :disabled="item.disabled"
          class="shrink-0"
          @click="item.onSelect?.()"
        >
          <template v-if="item.icon" #leading><component :is="item.icon" aria-hidden="true" /></template>
          {{ item.label }}
        </Button>
        <!-- Always at the right-hand end. -->
        <Menu v-if="overflow.length" :items="overflow" :label="t('ui.pageHeader.moreActions')" :link-component="linkComponent" class="ml-auto shrink-0" />

        <!-- For measuring only: every button, and the ⋯ one, at full width. -->
        <div aria-hidden="true" inert class="invisible absolute top-0 left-0 size-0 overflow-hidden">
          <div ref="measure" class="flex w-max gap-1">
            <Button v-for="item in toolbar" :key="item.label" variant="ghost" tabindex="-1" class="shrink-0">
              <template v-if="item.icon" #leading><component :is="item.icon" /></template>
              {{ item.label }}
            </Button>
            <Button variant="ghost" square tabindex="-1" class="shrink-0"><span /></Button>
          </div>
        </div>
      </div>
      <div v-if="$slots['toolbar-end']" class="flex shrink-0 items-center gap-2 px-3 text-sm">
        <slot name="toolbar-end" />
      </div>
    </div>

    <slot />
  </header>
</template>
