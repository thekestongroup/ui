import { describe, expect, it } from 'vitest'
import { age, daysToBirthday, formatDate, formatDateTime, relativeTime, toDate } from './dates'

describe('relativeTime', () => {
  const now = new Date(2026, 10, 11, 12, 0, 0)
  const ago = (seconds: number) => relativeTime(new Date(now.getTime() - seconds * 1000), now)
  it('words the time since', () => {
    expect(ago(10)).toBe('Just now')
    expect(ago(60)).toBe('1 minute ago')
    expect(ago(5 * 60)).toBe('5 minutes ago')
    expect(ago(2 * 3600)).toBe('2 hours ago')
    expect(ago(24 * 3600)).toBe('Yesterday')
    expect(ago(3 * 24 * 3600)).toBe('3 days ago')
    expect(ago(14 * 24 * 3600)).toBe('2 weeks ago')
    expect(ago(400 * 24 * 3600)).toBe('Last year')
  })
  it('words the future, and takes strings', () => {
    expect(ago(-2 * 24 * 3600)).toBe('In 2 days')
    expect(relativeTime(now.toISOString(), now)).toBe('Just now')
  })
})

describe('formatDateTime / formatDate', () => {
  it('writes the date out in full', () => {
    const d = new Date(2026, 10, 11, 9, 52)
    expect(formatDateTime(d)).toBe('Wednesday 11 November 2026 at 09:52')
    expect(formatDate(new Date(2013, 2, 14))).toBe('14 March 2013')
  })
})

describe('age', () => {
  const born = new Date(2013, 2, 14)
  it('counts whole years, going up on the birthday', () => {
    expect(age(born, new Date(2026, 2, 13))).toBe(12)
    expect(age(born, new Date(2026, 2, 14))).toBe(13)
    expect(age(born, new Date(2026, 10, 11))).toBe(13)
  })
  it('29 February birthdays go up on 1 March in other years', () => {
    const leap = new Date(2012, 1, 29)
    expect(age(leap, new Date(2026, 1, 28))).toBe(13)
    expect(age(leap, new Date(2026, 2, 1))).toBe(14)
  })
})

describe('daysToBirthday', () => {
  const born = new Date(2013, 2, 14)
  it('counts days to the next one', () => {
    expect(daysToBirthday(born, new Date(2026, 2, 14, 15))).toBe(0)
    expect(daysToBirthday(born, new Date(2026, 2, 13))).toBe(1)
    expect(daysToBirthday(born, new Date(2026, 2, 15))).toBe(364)
  })
  it('29 February falls on 1 March in other years', () => {
    expect(daysToBirthday(new Date(2012, 1, 29), new Date(2026, 1, 27))).toBe(2)
  })
})

describe('toDate', () => {
  it('reads date-only strings as that local day', () => {
    const d = toDate('2013-03-14')
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2013, 2, 14, 0])
  })
  it('passes Dates through and reads timestamps and full ISO strings', () => {
    const d = new Date(2026, 0, 1)
    expect(toDate(d)).toBe(d)
    expect(toDate(d.getTime()).getTime()).toBe(d.getTime())
    expect(toDate(d.toISOString()).getTime()).toBe(d.getTime())
  })
})
