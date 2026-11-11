import { describe, expect, it } from 'vitest'
import { nextSort, sortRows, type TableColumn } from './table'

type Row = { name: string; year: string; count?: number | null; date?: Date }

const rows: Row[] = [
  { name: 'noah', year: 'Year 10', count: 3 },
  { name: 'Amelia', year: 'Year 2', count: null },
  { name: 'zara', year: 'Year 7', count: 12 },
  { name: 'Ben', year: 'Year 7', count: 3 },
]
const columns: TableColumn<Row>[] = [
  { key: 'name', label: 'Name' },
  { key: 'year', label: 'Year' },
  { key: 'count', label: 'Count' },
  { key: 'joined', label: 'Joined', sortValue: (row) => row.date },
]

const names = (list: Row[]) => list.map((row) => row.name)

describe('sortRows', () => {
  it('returns a copy in the original order without a sort', () => {
    const result = sortRows(rows, columns, null)
    expect(result).toEqual(rows)
    expect(result).not.toBe(rows)
  })

  it('ignores an unknown column', () => {
    expect(sortRows(rows, columns, { key: 'nope', direction: 'asc' })).toEqual(rows)
  })

  it('sorts text ignoring case', () => {
    expect(names(sortRows(rows, columns, { key: 'name', direction: 'asc' }))).toEqual(['Amelia', 'Ben', 'noah', 'zara'])
    expect(names(sortRows(rows, columns, { key: 'name', direction: 'desc' }))).toEqual(['zara', 'noah', 'Ben', 'Amelia'])
  })

  it('sorts numbers in text naturally, and keeps ties in order', () => {
    expect(names(sortRows(rows, columns, { key: 'year', direction: 'asc' }))).toEqual(['Amelia', 'zara', 'Ben', 'noah'])
  })

  it('sorts numbers, with empty values last both ways', () => {
    expect(names(sortRows(rows, columns, { key: 'count', direction: 'asc' }))).toEqual(['noah', 'Ben', 'zara', 'Amelia'])
    expect(names(sortRows(rows, columns, { key: 'count', direction: 'desc' }))).toEqual(['zara', 'noah', 'Ben', 'Amelia'])
  })

  it('uses sortValue, e.g. for dates', () => {
    const dated = [
      { name: 'b', year: '', date: new Date(2026, 5, 1) },
      { name: 'a', year: '', date: new Date(2025, 0, 1) },
    ]
    expect(names(sortRows(dated, columns, { key: 'joined', direction: 'asc' }))).toEqual(['a', 'b'])
  })
})

describe('nextSort', () => {
  it('cycles ascending, descending, unsorted', () => {
    expect(nextSort(null, 'name')).toEqual({ key: 'name', direction: 'asc' })
    expect(nextSort({ key: 'name', direction: 'asc' }, 'name')).toEqual({ key: 'name', direction: 'desc' })
    expect(nextSort({ key: 'name', direction: 'desc' }, 'name')).toBeNull()
  })

  it('starts ascending on a different column', () => {
    expect(nextSort({ key: 'name', direction: 'desc' }, 'year')).toEqual({ key: 'year', direction: 'asc' })
  })
})
