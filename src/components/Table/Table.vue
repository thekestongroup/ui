<script setup lang="ts" generic="Row extends Record<string, any>">
import { computed, onBeforeUnmount, onMounted, ref, useId, type HTMLAttributes } from 'vue'
import { ArrowDown, ArrowUp, ChevronsUpDown } from '@lucide/vue'
import { cn } from '../../lib/cn'
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
  /** Keep the header row in view while the table scrolls. Give the table a max height (`class="max-h-96"`). */
  stickyHeader?: boolean
  /** Don't sort the rows: just update `sort`, e.g. to sort on the server. */
  manualSort?: boolean
  class?: HTMLAttributes['class']
  ui?: {
    table?: HTMLAttributes['class']
    header?: HTMLAttributes['class']
    row?: HTMLAttributes['class']
  }
}

const props = withDefaults(defineProps<TableProps<Row>>(), {
  emptyText: 'Nothing to show.',
  size: 'md'
})

const sort = defineModel<TableSort | null>('sort', { default: null })

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

const cellPadding = computed(() => (props.size === 'sm' ? 'px-4 py-2' : 'px-4 py-3'))

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
    :aria-label="scrolls && !caption && !$slots.caption ? 'Table' : undefined"
  >
    <table
      :class="cn('w-full border-separate border-spacing-0 text-left text-sm text-black', ui?.table)"
      :aria-busy="loading || undefined"
    >
      <caption v-if="caption || $slots.caption" :id="captionId" :class="showCaption ? 'px-4 pt-4 pb-2 text-left text-base font-bold' : 'sr-only'">
        <slot name="caption">{{ caption }}</slot>
      </caption>

      <thead :class="cn(stickyHeader && 'sticky top-0 z-10 bg-white', ui?.header)">
        <tr>
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
          <td :colspan="columns.length" class="px-4 py-8 text-center text-black/65">
            <span v-if="loading" class="inline-flex items-center gap-2">
              <Spinner size="sm" />
              Loading…
            </span>
            <slot v-else name="empty">{{ emptyText }}</slot>
          </td>
        </tr>
        <tr v-for="(row, index) in shownRows" :key="keyOf(row, index)" :class="cn('group/row', ui?.row)">
          <component
            :is="column.rowHeader ? 'th' : 'td'"
            v-for="column in columns"
            :key="column.key"
            :scope="column.rowHeader ? 'row' : undefined"
            :class="
              cn(
                'border-b border-black/15 align-middle group-last/row:border-b-0',
                column.rowHeader ? 'font-bold' : 'font-normal',
                column.align === 'end' && 'tabular-nums',
                cellPadding,
                columnClasses(column)
              )
            "
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :index="index">
              {{ row[column.key] ?? '' }}
            </slot>
          </component>
        </tr>
      </tbody>

      <!-- Footer cells get the same padding and a top border, so totals line up. -->
      <tfoot
        v-if="$slots.footer"
        :class="
          cn(
            'font-bold *:*:border-t *:*:border-black/15',
            size === 'sm' ? '*:*:px-4 *:*:py-2' : '*:*:px-4 *:*:py-3'
          )
        "
      >
        <slot name="footer" />
      </tfoot>
    </table>
  </div>
</template>
