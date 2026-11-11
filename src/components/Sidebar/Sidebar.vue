<script setup lang="ts">
import { computed, nextTick, ref, useId, watch, type Component, type HTMLAttributes } from 'vue'
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Badge, { type BadgeProps } from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'
import { sidebarTrail } from './sidebar'

export interface SidebarItem {
  label: string
  /** A Lucide (or any) icon component. Needed for the item to make sense when collapsed. */
  icon?: Component
  /** Link with a plain <a href>. */
  href?: string
  /** Link through `linkComponent` (e.g. RouterLink), which receives `to`. */
  to?: unknown
  /** The current page. Shown highlighted, and announced as aria-current="page". */
  active?: boolean
  /** A count or short note on the right, e.g. unread messages. */
  badge?: string | number
  /** Colour of the badge (default basic), e.g. red for something overdue. */
  badgeColor?: BadgeProps['color']
  disabled?: boolean
  /** Called when the item is chosen (for items that aren't links, or as well as navigating). */
  onSelect?: (event: MouseEvent) => void
  /**
   * Sub-pages. Choosing this item shows them in place of the list, with a
   * back row (‹ and this item's label) at the top, instead of navigating.
   * e.g. School › School Structure › New School Year Setup.
   */
  children?: SidebarItem[]
}

export interface SidebarSection {
  /** Heading above the section's items. */
  label?: string
  items: SidebarItem[]
}

/**
 * The app's main navigation, down the left of the page. Items can be links
 * (`href`, or `to` with a router link component) or buttons (`onSelect`), and
 * can be grouped into labelled sections, and nested (`children`): choosing
 * an item with children shows them, with a back row to return. Opens at the
 * level of the current page. Can collapse to a narrow strip of icons.
 *
 * For a Breadcrumb that follows it, use `sidebarTrail(items, sections)`.
 *
 * On small screens, put it inside a Slideover (`side="left"`) opened from the
 * Header's menu button. See Examples/App shell.
 *
 * Slots: header (top, e.g. a logo), footer (bottom, e.g. settings or a
 * profile), item (replaces each item's content: `{ item, active, collapsed }`).
 */
export interface SidebarProps {
  /** Items in a single section. Use `sections` for headings. */
  items?: SidebarItem[]
  /** Groups of items, each with an optional heading. Shown after `items`. */
  sections?: SidebarSection[]
  /** Accessible name of the navigation landmark. */
  label?: string
  /** Show the collapse / expand button in the footer. */
  collapsible?: boolean
  /** Component used for items with `to`, e.g. RouterLink or NuxtLink. */
  linkComponent?: string | Component
  class?: HTMLAttributes['class']
  /** Extra classes for the parts. */
  ui?: {
    header?: HTMLAttributes['class']
    body?: HTMLAttributes['class']
    footer?: HTMLAttributes['class']
    item?: HTMLAttributes['class']
  }
}

const props = withDefaults(defineProps<SidebarProps>(), {
  items: () => [],
  sections: () => [],
  label: 'Main',
  collapsible: false,
  linkComponent: 'a'
})

const emit = defineEmits<{
  /** An item was chosen (not emitted for disabled items). */
  select: [item: SidebarItem, event: MouseEvent]
}>()

defineSlots<{
  header?(props: { collapsed: boolean }): unknown
  footer?(props: { collapsed: boolean }): unknown
  item?(props: { item: SidebarItem; active: boolean; collapsed: boolean }): unknown
}>()

/** Narrow, icons only. Optional: use v-model:collapsed to control it. */
const collapsed = defineModel<boolean>('collapsed', { default: false })

// Unique per sidebar, so two on one page (e.g. inline and in a Slideover) don't clash.
const uid = useId()

const topSections = computed<SidebarSection[]>(() => [
  ...(props.items.length ? [{ items: props.items }] : []),
  ...props.sections
])

// ── Nesting ─────────────────────────────────────────────────────────────────
// `trail` is the labels of the parents opened, top first; empty at the top.
// Labels (not objects) so it survives the app rebuilding its items.
const trail = ref<string[]>([])

// The parent items along the trail. Stops early if one has gone away.
const opened = computed(() => {
  const found: SidebarItem[] = []
  let level = topSections.value.flatMap((section) => section.items)
  for (const label of trail.value) {
    const item = level.find((i) => i.label === label && i.children?.length)
    if (!item) break
    found.push(item)
    level = item.children!
  }
  return found
})
const current = computed(() => opened.value[opened.value.length - 1])

// What the list shows: the top-level sections, or the open item's children.
const allSections = computed<SidebarSection[]>(() =>
  current.value ? [{ items: current.value.children! }] : topSections.value
)

// Parents of the current page, so the list opens where it is, and so those
// parents can be marked (they contain the current page).
const activeTrail = computed(() => sidebarTrail(props.items, props.sections))
const activeParents = computed(() => new Set(activeTrail.value.slice(0, -1).map((item) => item.label)))

// Follow the current page: when it changes (or on first show), open its level.
watch(
  () => activeTrail.value.map((item) => item.label).join('\u0000'),
  () => {
    trail.value = activeTrail.value.slice(0, -1).map((item) => item.label)
  },
  { immediate: true }
)

// ── Sliding between levels ──────────────────────────────────────────────────
// Each level is keyed by its trail, so moving between levels swaps the list
// with a slide: deeper comes in from the right, back from the left. The
// level leaving is taken out of the layout (absolute) and made inert, so it
// can't be clicked or focused while it slides away.
const levelKey = computed(() => opened.value.map((item) => item.label).join('\u0000'))
const direction = ref<'forward' | 'back'>('forward')
watch(
  () => opened.value.length,
  (now, before) => {
    direction.value = now < before ? 'back' : 'forward'
  },
  { flush: 'sync' }
)

const slide = computed(() => {
  const forward = direction.value === 'forward'
  return {
    enterActiveClass: 'transition duration-300 ease-out motion-reduce:transition-none',
    leaveActiveClass: 'absolute inset-x-2 top-2 transition duration-300 ease-out motion-reduce:transition-none',
    enterFromClass: cn('opacity-0', forward ? 'translate-x-full' : '-translate-x-full'),
    leaveToClass: cn('opacity-0', forward ? '-translate-x-1/3' : 'translate-x-1/3')
  }
})

function onLeave(el: Element) {
  ;(el as HTMLElement).inert = true
}

const navRef = ref<HTMLElement>()

// After moving between levels, focus the first item (or, going back, the
// item just left), so keyboard users carry on in the new list.
async function focusAfterMove(label?: string) {
  await nextTick()
  // The level coming in, not the one sliding out.
  const nav = navRef.value?.querySelector<HTMLElement>(`[data-level="${CSS.escape(levelKey.value)}"]`)
  if (!nav) return
  navRef.value!.scrollTop = 0
  const target =
    (label && nav.querySelector<HTMLElement>(`[data-parent="${CSS.escape(label)}"]`)) ||
    nav.querySelector<HTMLElement>('li [data-sidebar-item]:not([disabled]):not([aria-disabled="true"])')
  target?.focus()
}

function openItem(item: SidebarItem) {
  trail.value = [...opened.value.map((i) => i.label), item.label]
  focusAfterMove()
}

function goBack() {
  const from = current.value?.label
  trail.value = opened.value.slice(0, -1).map((i) => i.label)
  focusAfterMove(from)
}

// Links render as <a> (href) or the link component (to); everything else is
// a button. Disabled links lose their href, so they can't be followed.
function tagFor(item: SidebarItem) {
  if (item.children?.length) return 'button'
  if (item.disabled) return item.href || item.to !== undefined ? 'a' : 'button'
  if (item.to !== undefined) return props.linkComponent
  if (item.href) return 'a'
  return 'button'
}

function attrsFor(item: SidebarItem) {
  const tag = tagFor(item)
  if (tag === 'button') return { type: 'button', disabled: item.disabled || undefined }
  if (item.disabled) return { role: 'link', 'aria-disabled': true }
  if (item.to !== undefined) return { to: item.to }
  return { href: item.href }
}

function select(item: SidebarItem, event: MouseEvent) {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  if (item.children?.length) {
    openItem(item)
    return
  }
  item.onSelect?.(event)
  emit('select', item, event)
}

// ── Collapsing ──────────────────────────────────────────────────────────────
// Only the width animates. Nothing else changes position or size between
// expanded and collapsed, so nothing jumps while the width changes:
// - icons stay where they are: in the 56px strip, an item's 12px padding
//   already centres a 16px icon in its 40px width.
// - labels and badges stay in the layout and fade out; the item clips them
//   (overflow-hidden), and screen readers still read them.
// - section headings fade into a divider of the same height.
const fade = 'transition-opacity duration-150 motion-reduce:transition-none'

// The same height, radius, focus ring and hover / press tints as a md ghost
// Button, so items and buttons in the footer line up.
const itemBase = [
  'flex h-9.5 w-full items-center gap-3 overflow-hidden rounded px-3 text-left text-sm whitespace-nowrap select-none',
  'cursor-pointer transition [&_svg]:size-4 [&_svg]:shrink-0',
  // Inset, so the ring isn't clipped by the scrolling body.
  'outline-2 -outline-offset-2 outline-transparent forced-colors:not-focus-visible:outline-0',
  'focus-visible:outline-focus',
  'not-aria-disabled:not-disabled:hover:bg-black/10 not-aria-disabled:not-disabled:active:bg-black/15',
  'disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40'
]

const itemActive = 'bg-primary/10 font-bold text-primary not-aria-disabled:not-disabled:hover:bg-primary/15'

// A parent of the current page: bold primary text, no fill, so it reads as
// "you are in here" without looking like the page itself.
const itemActiveParent = 'font-bold text-primary'
</script>

<template>
  <aside
    :data-collapsed="collapsed || undefined"
    :class="cn(
      'flex h-full shrink-0 flex-col border-r border-black/15 bg-white text-black',
      'w-64 transition-[width] duration-300 ease-out motion-reduce:transition-none',
      collapsed && 'w-14',
      props.class
    )"
  >
    <div
      v-if="$slots.header"
      :class="cn('flex h-12 shrink-0 items-center gap-2 overflow-hidden border-b border-black/15 px-4', ui?.header)"
    >
      <slot name="header" :collapsed="collapsed" />
    </div>

    <nav
      ref="navRef"
      :aria-label="label"
      :class="cn(
        'relative flex-1 overflow-x-hidden overflow-y-auto p-2 [scrollbar-width:thin]',
        // Collapsed, a scrollbar would take a third of the 40px strip and cut
        // the icons off, so it's hidden (the list still scrolls).
        collapsed && '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        ui?.body
      )"
    >
      <Transition v-bind="slide" @leave="onLeave">
        <div :key="levelKey" :data-level="levelKey" class="flex flex-col gap-4">
          <!-- Inside a nested item: ‹ and its label, back to the level above.
               The divider under it keeps the list's gap-4 rhythm with sections. -->
          <div v-if="current" class="-mb-2 flex flex-col gap-1 border-b border-black/15 pb-2">
            <button
              type="button"
              data-back
              :title="collapsed ? `Back from ${current.label}` : undefined"
              :class="cn(itemBase, 'font-bold', ui?.item)"
              @click="goBack"
            >
              <ChevronLeft aria-hidden="true" />
              <span :class="cn('min-w-0 flex-1 truncate', fade, collapsed && 'opacity-0')">
                <span class="sr-only">Back from </span>{{ current.label }}
              </span>
            </button>
          </div>

          <div v-for="(section, s) in allSections" :key="s" class="flex flex-col gap-1">
            <!-- Section headings fade into a divider when collapsed, so the groups
                 stay visible without the text. Same height either way. -->
            <div v-if="section.label" class="relative flex h-6 items-center px-3">
              <div
                :id="`${uid}-section-${s}`"
                :class="cn('truncate text-xs font-bold text-black/65 uppercase', fade, collapsed && 'opacity-0')"
              >
                {{ section.label }}
              </div>
              <div
                aria-hidden="true"
                :class="cn('absolute inset-x-2 top-1/2 border-t border-black/15', fade, !collapsed && 'opacity-0')"
              />
            </div>

            <ul class="flex flex-col gap-1" :aria-labelledby="section.label ? `${uid}-section-${s}` : undefined">
              <li v-for="(item, i) in section.items" :key="`${item.label}-${i}`">
                <component
                  :is="tagFor(item)"
                  v-bind="attrsFor(item)"
                  data-sidebar-item
                  :data-parent="item.children?.length ? item.label : undefined"
                  :aria-current="item.active ? 'page' : undefined"
                  :title="collapsed ? item.label : undefined"
                  :class="cn(itemBase, item.active && itemActive, activeParents.has(item.label) && itemActiveParent, ui?.item)"
                  @click="select(item, $event)"
                >
                  <slot name="item" :item="item" :active="!!item.active" :collapsed="collapsed">
                    <component :is="item.icon" v-if="item.icon" aria-hidden="true" />
                    <span :class="cn('min-w-0 flex-1 truncate', fade, collapsed && 'opacity-0')">
                      {{ item.label }}<span v-if="item.children?.length" class="sr-only">, more options</span>
                    </span>
                    <Badge
                      v-if="item.badge !== undefined && item.badge !== ''"
                      size="sm"
                      :color="item.badgeColor"
                      :class="cn(fade, collapsed && 'opacity-0')"
                    >
                      {{ item.badge }}
                    </Badge>
                    <!-- Parents: an arrow into their sub-pages. -->
                    <ChevronRight
                      v-if="item.children?.length"
                      aria-hidden="true"
                      :class="cn('opacity-70', fade, collapsed && 'opacity-0')"
                    />
                  </slot>
                </component>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </nav>

    <div
      v-if="$slots.footer || collapsible"
      :class="cn('flex shrink-0 flex-col gap-1 overflow-hidden border-t border-black/15 p-2', ui?.footer)"
    >
      <slot name="footer" :collapsed="collapsed" />
      <Button
        v-if="collapsible"
        variant="ghost"
        square
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-expanded="!collapsed"
        class="self-start"
        @click="collapsed = !collapsed"
      >
        <PanelLeftOpen v-if="collapsed" />
        <PanelLeftClose v-else />
      </Button>
    </div>
  </aside>
</template>
