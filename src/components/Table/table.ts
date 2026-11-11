export type SortDirection = 'asc' | 'desc'

export interface TableSort {
  key: string
  direction: SortDirection
}

export interface TableColumn<Row = Record<string, unknown>> {
  /** Field on each row, and the name of the cell slot (`#cell-{key}`). */
  key: string
  /** Header text. */
  label: string
  /**
   * Visually hide the header (it's still read out), e.g. for an actions
   * column. The label is still required.
   */
  hideLabel?: boolean
  /** start (default) or end. Use end for numbers, so the digits line up. */
  align?: 'start' | 'end'
  /** Let people sort by this column. */
  sortable?: boolean
  /** What to sort by, when it isn't `row[key]` (e.g. a date's timestamp). */
  sortValue?: (row: Row) => unknown
  /** The row's heading: its first cell is a `<th scope="row">`. One column at most. */
  rowHeader?: boolean
  /** Keep the text on one line. Default true; turn off for long text. */
  nowrap?: boolean
  /** Extra classes for this column's header and cells, e.g. a width. */
  class?: string
}

const collator = new Intl.Collator('en-GB', { numeric: true, sensitivity: 'base' })

function compare(a: unknown, b: unknown): number {
  // Empty values go last, whichever way the column is sorted.
  const aEmpty = a === null || a === undefined || a === ''
  const bEmpty = b === null || b === undefined || b === ''
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  return collator.compare(String(a), String(b))
}

/**
 * Sorts a copy of `rows`. Stable, so rows that tie keep their order. Text
 * sorts naturally ("Year 2" before "Year 10") and ignores case; empty values
 * go last in both directions.
 */
export function sortRows<Row>(rows: readonly Row[], columns: readonly TableColumn<Row>[], sort?: TableSort | null): Row[] {
  const column = sort && columns.find((c) => c.key === sort.key)
  if (!sort || !column) return [...rows]
  const value = column.sortValue ?? ((row: Row) => (row as Record<string, unknown>)[column.key])
  const sign = sort.direction === 'asc' ? 1 : -1
  return rows
    .map((row, index) => ({ row, index, value: value(row) }))
    .sort((a, b) => {
      const aEmpty = a.value === null || a.value === undefined || a.value === ''
      const bEmpty = b.value === null || b.value === undefined || b.value === ''
      const result = aEmpty || bEmpty ? compare(a.value, b.value) : sign * compare(a.value, b.value)
      return result || a.index - b.index
    })
    .map((entry) => entry.row)
}

/** Clicking a header: ascending, then descending, then back to unsorted. */
export function nextSort(current: TableSort | null | undefined, key: string): TableSort | null {
  if (current?.key !== key) return { key, direction: 'asc' }
  return current.direction === 'asc' ? { key, direction: 'desc' } : null
}
