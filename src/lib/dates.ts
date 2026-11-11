/**
 * Date wording shared by components. UK English throughout.
 *
 * The pattern: show the short, human version ("3 hours ago", "13"), and the
 * exact one ("Wednesday 11 November 2026 at 09:52", "Born 14 March 2013") on
 * hover or focus. See RelativeTime and Age.
 */

export type DateInput = Date | string | number

/**
 * A Date from a Date, a timestamp or a string. Date-only strings
 * ("2013-03-14") are read as that day here: JavaScript would read them as
 * midnight UTC, which is the day before in places behind UTC.
 */
export function toDate(value: DateInput): Date {
  if (value instanceof Date) return value
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(value)
}

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60]
]
const relative = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' })

/** "Just now", "5 minutes ago", "Yesterday", "3 weeks ago", "In 2 days". */
export function relativeTime(date: DateInput, now: Date = new Date()): string {
  const seconds = Math.round((toDate(date).getTime() - now.getTime()) / 1000)
  if (Math.abs(seconds) < 60) return 'Just now'
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      const text = relative.format(Math.trunc(seconds / size), unit)
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
  }
  return 'Just now'
}

/** "Wednesday 11 November 2026 at 09:52". */
export function formatDateTime(date: DateInput): string {
  // Built from parts: browsers differ on the comma after the weekday.
  const d = toDate(date)
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${weekday} ${formatDate(d)} at ${time}`
}

/** "14 March 2013". */
export function formatDate(date: DateInput): string {
  return toDate(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Whole years since `birth`, as people count birthdays. Someone born on
 * 29 February turns a year older on 1 March in other years (UK law).
 */
export function age(birth: DateInput, now: Date = new Date()): number {
  const born = toDate(birth)
  let years = now.getFullYear() - born.getFullYear()
  const month = now.getMonth() - born.getMonth()
  if (month < 0 || (month === 0 && now.getDate() < born.getDate())) years--
  return years
}

/** Days until the next birthday (0 on the day). */
export function daysToBirthday(birth: DateInput, now: Date = new Date()): number {
  const born = toDate(birth)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const next = (year: number) => {
    // 29 February in a non-leap year falls on 1 March.
    const d = new Date(year, born.getMonth(), born.getDate())
    return d.getMonth() === born.getMonth() ? d : new Date(year, 2, 1)
  }
  let birthday = next(today.getFullYear())
  if (birthday < today) birthday = next(today.getFullYear() + 1)
  return Math.round((birthday.getTime() - today.getTime()) / 86_400_000)
}
