<script setup lang="ts" generic="Row extends Record<string, any>">
import { useI18n } from 'vue-i18n'
import { computed, onBeforeUnmount, onMounted, ref, useId, type Component, type HTMLAttributes } from 'vue'
import { ArrowDown, ArrowUp, ChevronsUpDown } from '@lucide/vue'
import { cn } from '../../lib/cn'
import EmptyState from '../EmptyState/EmptyState.vue'
import Checkbox from '../Checkbox/Checkbox.vue'
import Spinner from '../Spinner/Spinner.vue'
import { nextSort, sortRows, type TableColumn, type TableSort } from './table'

/**
 * Rows of data with column headings: applicants, classes, invoices.
 *
 * No border or background of its own: put it in a `<Card padding="none">`,
 * which gives the white panel, and the table runs to its edges.
 *
 * Cells show `row[column.key]` as text. For anything else (a Badge, a link,
 * a menu) use the slot `#cell-{key}`, which gets `{ row, value, index }`.
 *
 * Sorting: mark columns `sortable`. The table sorts the rows itself; with
 * `manualSort` it only reports the sort (`v-model:sort`) so you can sort on
 * the server.
 *
 * Clickable rows: `rowLink` gives each row a page to go to. The row-header
 * cell (or the first column) becomes a real link, stretched over the whole
 * row, so the row highlights on hover and a click anywhere on it follows the
 * link. Buttons and links in other cells still work on their own.
 *
 * Slots: cell-{key}, header-{key}, empty, footer (rows for a `<tfoot>`,
 * e.g. totals), caption.
 */
export interface TableProps<Row = Record<string, any>> {
  columns: TableColumn<Row>[]
  rows: Row[]
  /** Unique field on each row, or a function returning one. Used to keep rows stable when sorting. */
  rowKey?: keyof Row & string | ((row: Row, index: number) => string | number)
  /**
   * What the table shows, e.g. "Applications for September 2027". The
   * table's accessible name. Hidden unless `showCaption`.
   */
  caption?: string
  showCaption?: boolean
  /** Shown when there are no rows. */
  emptyText?: string
  /** Show a spinner (no rows yet), or dim the rows (refreshing). */
  loading?: boolean
  /** md (default) 12px above and below each cell, sm 8px for dense tables. */
  size?: 'sm' | 'md'
  /**
   * For a table that fills a `Card` with `padding="none"` and has a title
   * above it (so the content lines up with the card's padding): the first and
   * last columns have 24px at the table's outer edges (from sm), and there is
   * the same space beneath the last row. The row lines still run edge to
   * edge. Leave it off for a table that is the whole card.
   */
  inset?: boolean
  /** Keep the header row in view while the table scrolls. Give the table a max height (`class="max-h-96"`). */
  stickyHeader?: boolean
  /** Don't sort the rows: just update `sort`, e.g. to sort on the server. */
  manualSort?: boolean
  /**
   * Where each row goes when clicked: passed as `to` to `linkComponent`
   * (e.g. a route), or as `href` without one. Return undefined for rows that
   * don't go anywhere.
   */
  rowLink?: (row: Row, index: number) => unknown
  /** Component for row links, e.g. RouterLink. It receives `to`. Default a plain `<a href>`. */
  linkComponent?: string | Component
  /**
   * A checkbox at the start of each row (and "select all" in the header), for
   * acting on several rows. `true` for every row, or a function saying which
   * rows can be ticked. The whole cell is the click target. Ticked rows'
   * keys (`rowKey`) are in `v-model:selected`.
   */
  selectable?: boolean | ((row: Row) => boolean)
  /** Describes a row for its checkbox, e.g. its name: "Select Jo Bloggs". Default "Select row 2". */
  rowLabel?: (row: Row, index: number) => string
  class?: HTMLAttributes['class']
  ui?: {
    table?: HTMLAttributes['class']
    header?: HTMLAttributes['class']
    row?: HTMLAttributes['class']
  }
}

const { t } = useI18n()
const props = withDefaults(defineProps<TableProps<Row>>(), {
  size: 'md',
  linkComponent: 'a'
})

const sort = defineModel<TableSort | null>('sort', { default: null })
/** Ticked rows' keys (see `selectable`). */
const selected = defineModel<(string | number)[]>('selected', { default: () => [] })

defineSlots<
  {
    caption?(): unknown
    empty?(): unknown
    footer?(): unknown
  } & {
    [key: `cell-${string}`]: ((props: { row: Row; value: any; index: number }) => unknown) | undefined
  } & {
    [key: `header-${string}`]: ((props: { column: TableColumn<Row> }) => unknown) | undefined
  }
>()

const captionId = `${useId()}-caption`

// ── Selecting rows ──────────────────────────────────────────────────────────
const canSelect = (row: Row) => (typeof props.selectable === 'function' ? props.selectable(row) : !!props.selectable)
const selectableKeys = computed(() => shownRows.value.flatMap((row, i) => (canSelect(row) ? [keyOf(row, i)] : [])))
const isSelected = (row: Row, index: number) => selected.value.includes(keyOf(row, index))
function setRow(row: Row, index: number, on: boolean) {
  const key = keyOf(row, index)
  selected.value = on ? [...selected.value.filter((k) => k !== key), key] : selected.value.filter((k) => k !== key)
}
/** Header box: ticked when every row is, a dash when some are. */
const allState = computed<boolean | 'indeterminate'>(() => {
  const n = selectableKeys.value.filter((k) => selected.value.includes(k)).length
  return n === 0 ? false : n === selectableKeys.value.length ? true : 'indeterminate'
})
function setAll(on: boolean) {
  const keys = selectableKeys.value
  selected.value = on ? [...new Set([...selected.value, ...keys])] : selected.value.filter((k) => !keys.includes(k))
}
// The checkbox cell is above a row's link, so clicking anywhere in it ticks
// the box rather than opening the row.
const selectCell = 'relative z-1 w-0 cursor-pointer'
/**
 * Pressing anywhere in the cell ticks the box: the cell's padding and the gap
 * around the box, not only the box. The box and its (hidden) label do their
 * own ticking, so they're left alone, or it would tick twice.
 */
function onCellPress(event: MouseEvent, toggle: () => void) {
  if ((event.target as HTMLElement).closest('button, label, .sr-only')) return
  toggle()
}
const colspan = computed(() => props.columns.length + (props.selectable ? 1 : 0))

const shownRows = computed(() => (props.manualSort ? props.rows : sortRows(props.rows, props.columns, sort.value)))

function keyOf(row: Row, index: number) {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  if (props.rowKey) return row[props.rowKey] as string | number
  return index
}

function ariaSort(column: TableColumn<Row>) {
  if (!column.sortable) return undefined
  if (sort.value?.key !== column.key) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

// The column whose cell holds the row's link: the row header, else the first.
const linkColumn = computed(() => (props.columns.find((c) => c.rowHeader) ?? props.columns[0])?.key)

function linkFor(row: Row, index: number) {
  const target = props.rowLink?.(row, index)
  if (target === undefined || target === null || target === '') return undefined
  return props.linkComponent === 'a' ? { href: target as string } : { to: target }
}

// A click anywhere on the row follows its link. Each cell is `relative` and
// holds its own overlay: the real link's ::after in its cell, and in the
// others a hidden twin (same target, out of the tab order and the
// accessibility tree). Not one overlay stretched across the row: Safari
// (WebKit) doesn't reliably make a <tr> the containing block for absolutely
// positioned children, so it grew to the whole table. Controls in other cells
// are lifted above the overlays, so they still get their own clicks. The focus
// ring is drawn on the real link's ::after, and the row is shaded to match.
const rowLinkClass = [
  'text-inherit no-underline outline-none group-hover/row:underline underline-offset-2',
  'after:absolute after:inset-0 after:outline-2 after:-outline-offset-2 after:outline-transparent',
  'focus-visible:after:outline-focus forced-colors:not-focus-visible:after:outline-0'
]
const linkedRowClass = [
  'cursor-pointer hover:bg-black/5 has-[[data-row-link]:focus-visible]:bg-black/5',
  '[&_:is(a,button,input,select,textarea,label,[tabindex]):not([data-row-link],[data-row-overlay])]:relative',
  '[&_:is(a,button,input,select,textarea,label,[tabindex]):not([data-row-link],[data-row-overlay])]:z-1'
]
const overlayClass = 'absolute inset-0 outline-none'

const cellPadding = computed(() => {
  const base = props.size === 'sm' ? 'px-4 py-2' : 'px-4 py-3'
  return props.inset ? `${base} sm:first:pl-6 sm:last:pr-6` : base
})


function columnClasses(column: TableColumn<Row>) {
  return cn(column.align === 'end' && 'text-right', column.nowrap !== false && 'whitespace-nowrap', column.class)
}

const focusRing =
  'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus forced-colors:not-focus-visible:outline-0'

// Inside the edge, so a Card's rounded corners (which clip) don't cut it off.
const scrollRing =
  'outline-2 -outline-offset-2 outline-transparent focus-visible:outline-focus forced-colors:not-focus-visible:outline-0'

// A wrapper that scrolls needs to be focusable, so keyboard users can scroll
// it, and named, so they know what they're scrolling. Only when it scrolls.
const scroller = ref<HTMLElement>()
const scrolls = ref(false)
let observer: ResizeObserver | undefined
function measure() {
  const el = scroller.value
  if (el) scrolls.value = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
}
onMounted(() => {
  measure()
  observer = new ResizeObserver(measure)
  if (scroller.value) {
    observer.observe(scroller.value)
    if (scroller.value.firstElementChild) observer.observe(scroller.value.firstElementChild)
  }
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    ref="scroller"
    :class="cn('relative overflow-auto', scrolls && scrollRing, props.class)"
    :tabindex="scrolls ? 0 : undefined"
    :role="scrolls ? 'region' : undefined"
    :aria-labelledby="scrolls && (caption || $slots.caption) ? captionId : undefined"
    :aria-label="scrolls && !caption && !$slots.caption ? t('ui.table.table') : undefined"
  >
    <table
      :class="cn('w-full border-separate border-spacing-0 text-left text-sm text-black', ui?.table)"
      :aria-busy="loading || undefined"
    >
      <caption v-if="caption || $slots.caption" :id="captionId" :class="showCaption ? cn('px-4 pt-4 pb-2 text-left text-base font-bold', inset && 'sm:px-6') : 'sr-only'">
        <slot name="caption">{{ caption }}</slot>
      </caption>

      <thead :class="cn(stickyHeader && 'sticky top-0 z-10 bg-white', ui?.header)">
        <tr>
          <th
            v-if="selectable"
            scope="col"
            :class="cn('border-b border-black/15', cellPadding, selectableKeys.length && selectCell)"
            @click="onCellPress($event, () => selectableKeys.length && setAll(allState !== true))"
          >
            <Checkbox
              v-if="selectableKeys.length"
              :model-value="allState"
              :label="t('ui.table.selectAll')"
              hide-label
              @update:model-value="setAll($event === true)"
            />
            <span v-else class="sr-only">{{ t('ui.table.select') }}</span>
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            :aria-sort="ariaSort(column)"
            :class="cn('border-b border-black/15 font-bold text-black/65', cellPadding, columnClasses(column))"
          >
            <slot :name="`header-${column.key}`" :column="column">
              <span v-if="column.hideLabel" class="sr-only">{{ column.label }}</span>
              <button
                v-else-if="column.sortable"
                type="button"
                :class="
                  cn(
                    '-mx-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 font-bold hover:text-black',
                    column.align === 'end' && 'flex-row-reverse',
                    sort?.key === column.key && 'text-black',
                    focusRing
                  )
                "
                @click="sort = nextSort(sort, column.key)"
              >
                {{ column.label }}
                <ArrowUp v-if="sort?.key === column.key && sort.direction === 'asc'" class="size-4 shrink-0" aria-hidden="true" />
                <ArrowDown v-else-if="sort?.key === column.key" class="size-4 shrink-0" aria-hidden="true" />
                <ChevronsUpDown v-else class="size-4 shrink-0 text-black/40" aria-hidden="true" />
              </button>
              <template v-else>{{ column.label }}</template>
            </slot>
          </th>
        </tr>
      </thead>

      <tbody :class="cn(loading && shownRows.length && 'opacity-50 transition-opacity')">
        <tr v-if="!shownRows.length">
          <td :colspan="colspan" class="px-4 py-8 text-center text-black/65">
            <span v-if="loading" class="inline-flex items-center gap-2">
              <Spinner size="sm" />
              Loading…
            </span>
            <slot v-else name="empty">
              <EmptyState size="sm" :description="emptyText ?? t('ui.table.empty')" class="p-0" />
            </slot>
          </td>
        </tr>
        <tr
          v-for="(row, index) in shownRows"
          :key="keyOf(row, index)"
          :class="cn('group/row', linkFor(row, index) && linkedRowClass, ui?.row)"
        >
          <td
            v-if="selectable"
            :class="cn('border-b border-black/15 align-middle', !inset && 'group-last/row:border-b-0', cellPadding, canSelect(row) && selectCell)"
            @click="canSelect(row) && onCellPress($event, () => setRow(row, index, !isSelected(row, index)))"
          >
            <Checkbox
              v-if="canSelect(row)"
              :model-value="isSelected(row, index)"
              :label="rowLabel ? rowLabel(row, index) : t('ui.table.selectRow', { n: index + 1 })"
              hide-label
              @update:model-value="setRow(row, index, $event === true)"
            />
          </td>
          <component
            :is="column.rowHeader ? 'th' : 'td'"
            v-for="column in columns"
            :key="column.key"
            :scope="column.rowHeader ? 'row' : undefined"
            :class="
              cn(
                'border-b border-black/15 align-middle', !inset && 'group-last/row:border-b-0',
                column.rowHeader ? 'font-bold' : 'font-normal',
                column.align === 'end' && 'tabular-nums',
                cellPadding,
                linkFor(row, index) && 'relative',
                columnClasses(column)
              )
            "
          >
            <component
              :is="linkComponent"
              v-if="column.key !== linkColumn && linkFor(row, index)"
              v-bind="linkFor(row, index)"
              data-row-overlay
              tabindex="-1"
              aria-hidden="true"
              :class="overlayClass"
            />
            <component
              :is="linkComponent"
              v-if="column.key === linkColumn && linkFor(row, index)"
              v-bind="linkFor(row, index)"
              data-row-link
              :class="rowLinkClass"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :index="index">
                {{ row[column.key] ?? '' }}
              </slot>
            </component>
            <slot v-else :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :index="index">
              {{ row[column.key] ?? '' }}
            </slot>
          </component>
        </tr>
        <!-- inset: the last row keeps its line, then the space below it is its
             own part, so a hovered last row isn't taller than the others. -->
        <tr v-if="inset && shownRows.length && !$slots.footer" aria-hidden="true">
          <td :colspan="colspan" class="h-2 p-0 sm:h-4"></td>
        </tr>
      </tbody>

      <!-- Footer cells get the same padding and a top border, so totals line up. -->
      <tfoot
        v-if="$slots.footer"
        :class="
          cn(
            'font-bold *:*:border-t *:*:border-black/15',
            size === 'sm' ? '*:*:px-4 *:*:py-2' : '*:*:px-4 *:*:py-3',
            inset && '*:*:sm:first:pl-6 *:*:sm:last:pr-6'
          )
        "
      >
        <slot name="footer" />
      </tfoot>
    </table>
  </div>
</template>
