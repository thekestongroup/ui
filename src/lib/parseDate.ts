import { CalendarDate, endOfMonth, startOfMonth } from '@internationalized/date'

/**
 * Reads a date typed in almost any English form and returns it as a
 * CalendarDate, or undefined if it can't be understood.
 *
 * The text is read as a starting day plus any adjustments, in any order:
 *
 *   Written dates   26/01/2009 · 26-01-2009 · 26.01.2009 · 26012009 · 2009-01-26
 *                   26 jan 2009 · 26th of January 2009 · jan 26 2009 · 2009 jan 26
 *                   twelfth of may · 5/12 · 5th december · the 5th · march
 *   Relative days   today · now · tonight · tomorrow / tmrw · yesterday
 *                   the day after tomorrow · the day before yesterday
 *   Weekdays        tuesday · next tuesday · this friday · last tuesday
 *                   tuesday next week · last week friday · tuesday after next
 *                   monday week · a week on friday · a month on friday
 *   Parts of time   end of the month · start of next week · mid december
 *                   end of the year · eow / eom / eoy
 *                   first monday of next month · last friday of december
 *                   this weekend · next weekend
 *   Holidays        christmas · christmas eve · boxing day · new year's day / eve
 *                   easter · good friday · easter monday · valentine's day
 *                   halloween · bonfire night · mother's day · father's day …
 *   Adjustments     next / last week, month, year · in 3 days · 3 days ago
 *                   2 weeks from now · a week from tomorrow · in a couple of days
 *                   in 1 year 2 months · a week today
 *   Times           ignored: "5th december at 3pm", "tomorrow morning"
 *
 * Weeks run Monday to Sunday. Dates that don't say which year, month or week
 * ("5th march", "the 5th", "tuesday", "christmas") are resolved by `prefer`.
 */

export type DatePart = 'day' | 'month' | 'year'
export type DatePreference = 'future' | 'past' | 'nearest'

export interface ParseDateOptions {
  /** The date to count from. */
  today: CalendarDate
  /** Order of day / month / year in numeric dates. Default day, month, year. */
  order?: DatePart[]
  /**
   * How to resolve dates that don't say which year, month or week:
   * 'future' (default) picks the next one, 'past' the last one, 'nearest' the closest.
   */
  prefer?: DatePreference
}

// ── Vocabulary ──────────────────────────────────────────────────────────────

const weekdayNumbers: Record<string, number> = {
  monday: 1, mon: 1,
  tuesday: 2, tue: 2, tues: 2,
  wednesday: 3, wed: 3, weds: 3,
  thursday: 4, thu: 4, thur: 4, thurs: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6,
  sunday: 7, sun: 7
}
const WD = `(${Object.keys(weekdayNumbers).join('|')})`

const monthNumbers: Record<string, number> = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sept: 9, sep: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12
}
// Longest first, so "september" is tried before "sep".
const MONTH = `(${Object.keys(monthNumbers).sort((a, b) => b.length - a.length).join('|')})`

const numberWords: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  thirty: 30
}
const AMOUNT = `(\\d+|${Object.keys(numberWords).join('|')})`
const UNIT = '(day|week|fortnight|month|year)s?'

const ordinalWords: Record<string, number> = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7,
  eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12, thirteenth: 13,
  fourteenth: 14, fifteenth: 15, sixteenth: 16, seventeenth: 17, eighteenth: 18,
  nineteenth: 19, twentieth: 20, thirtieth: 30
}
const ORDINAL_WORD = Object.keys(ordinalWords).join('|')

type Unit = 'days' | 'weeks' | 'months' | 'years'
type Shift = Record<Unit, number>

// ── Small date helpers ──────────────────────────────────────────────────────

/** 1 = Monday … 7 = Sunday */
function weekdayOf(date: CalendarDate) {
  return new Date(date.year, date.month - 1, date.day).getDay() || 7
}
function mondayOf(date: CalendarDate) {
  return date.subtract({ days: weekdayOf(date) - 1 })
}
/** A real date, or undefined (e.g. 31 February). */
function makeDate(year: number, month: number, day: number): CalendarDate | undefined {
  if (!Number.isInteger(year) || month < 1 || month > 12 || day < 1) return undefined
  const first = new CalendarDate(year, month, 1)
  if (day > first.calendar.getDaysInMonth(first)) return undefined
  return new CalendarDate(year, month, day)
}
/** The nth (1–5, or -1 for last) weekday of a month. */
function nthWeekday(year: number, month: number, weekday: number, n: number) {
  if (n === -1) {
    const last = endOfMonth(new CalendarDate(year, month, 1))
    return last.subtract({ days: (weekdayOf(last) - weekday + 7) % 7 })
  }
  const first = new CalendarDate(year, month, 1)
  const date = first.add({ days: (weekday - weekdayOf(first) + 7) % 7 + (n - 1) * 7 })
  return date.month === month ? date : undefined
}
/** Easter Sunday (Gregorian calendar). */
function easterSunday(year: number) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new CalendarDate(year, month, day)
}
function expandYear(year: string, today: CalendarDate) {
  if (year.length === 4) return Number(year)
  if (year.length !== 2) return NaN
  // Two-digit years: up to this year → 2000s, otherwise 1900s (09 → 2009, 85 → 1985).
  const n = Number(year)
  return n <= today.year % 100 ? 2000 + n : 1900 + n
}

// ── Holidays ────────────────────────────────────────────────────────────────
// Typed without apostrophes (they are removed before matching). Order matters:
// "christmas eve" must be tried before "christmas".
const holidays: [string, (year: number) => CalendarDate | undefined][] = [
  ['(?:christmas|xmas) eve', (y) => makeDate(y, 12, 24)],
  ['(?:christmas|xmas)(?: day)?', (y) => makeDate(y, 12, 25)],
  ['boxing day', (y) => makeDate(y, 12, 26)],
  ['(?:new years eve|nye)', (y) => makeDate(y, 12, 31)],
  ['new years?(?: day)?', (y) => makeDate(y, 1, 1)],
  ['valentines(?: day)?', (y) => makeDate(y, 2, 14)],
  ['(?:st )?(?:patricks|paddys) day', (y) => makeDate(y, 3, 17)],
  ['good friday', (y) => easterSunday(y).subtract({ days: 2 })],
  ['easter monday', (y) => easterSunday(y).add({ days: 1 })],
  ['easter(?: sunday| day)?', (y) => easterSunday(y)],
  // UK Mothering Sunday: three weeks before Easter
  ['(?:mothers day|mothering sunday)', (y) => easterSunday(y).subtract({ weeks: 3 })],
  ['fathers day', (y) => nthWeekday(y, 6, 7, 3)],
  ['halloween', (y) => makeDate(y, 10, 31)],
  ['(?:bonfire night|guy fawkes(?: night| day)?)', (y) => makeDate(y, 11, 5)],
  ['(?:remembrance|armistice) day', (y) => makeDate(y, 11, 11)]
]

// ── Starting day kinds ──────────────────────────────────────────────────────
// How the starting day is pinned down decides how `prefer` applies to it.
type Start =
  | { kind: 'date'; date: CalendarDate }
  /** No year given: "5th march", "christmas", "5/12" */
  | { kind: 'yearless'; resolve: (year: number) => CalendarDate | undefined }
  /** No month given: "the 5th" */
  | { kind: 'dayOfMonth'; day: number }
  /** No week given: "tuesday" */
  | { kind: 'weekday'; weekday: number }

function pick(candidates: (CalendarDate | undefined)[], today: CalendarDate, prefer: DatePreference) {
  const dates = candidates.filter((d): d is CalendarDate => !!d).sort((a, b) => a.compare(b))
  if (prefer === 'future') return dates.find((d) => d.compare(today) >= 0)
  if (prefer === 'past') return [...dates].reverse().find((d) => d.compare(today) <= 0)
  // nearest; ties go to the future
  return dates.reduce<CalendarDate | undefined>((best, d) => {
    if (!best) return d
    const distance = Math.abs(d.compare(today))
    const bestDistance = Math.abs(best.compare(today))
    return distance < bestDistance || (distance === bestDistance && d.compare(today) > 0) ? d : best
  }, undefined)
}

function resolveStart(
  start: Start | undefined,
  shift: Shift,
  explicit: { year: boolean; month: boolean; yearValue?: number },
  today: CalendarDate,
  prefer: DatePreference
): CalendarDate | undefined {
  if (!start) return explicit.yearValue === undefined ? today.add(shift) : undefined

  switch (start.kind) {
    case 'date':
      return explicit.yearValue === undefined ? start.date.add(shift) : undefined

    case 'yearless': {
      // A year was given ("christmas 2027", "christmas next year", "5th march
      // this year"): resolve in that year, so moveable dates like Easter stay correct.
      if (explicit.yearValue !== undefined) {
        return start.resolve(explicit.yearValue + shift.years)?.add({ ...shift, years: 0 })
      }
      if (explicit.year || shift.years) {
        return start.resolve(today.year + shift.years)?.add({ ...shift, years: 0 })
      }
      // Look 4 years either way, so "29 feb" finds the nearest leap year.
      const years = Array.from({ length: 9 }, (_, i) => today.year - 4 + i)
      return pick(years.map(start.resolve), today, prefer)?.add(shift)
    }

    case 'dayOfMonth': {
      if (explicit.yearValue !== undefined) return undefined
      // A month was given ("the 12th of next month"): use that month.
      if (explicit.month || shift.months) {
        const month = startOfMonth(today).add({ months: shift.months })
        return makeDate(month.year, month.month, start.day)?.add({ ...shift, months: 0 })
      }
      const months = [-1, 0, 1].map((offset) => startOfMonth(today).add({ months: offset }))
      return pick(months.map((m) => makeDate(m.year, m.month, start.day)), today, prefer)?.add(shift)
    }

    case 'weekday': {
      if (explicit.yearValue !== undefined) return undefined
      const ahead = (start.weekday - weekdayOf(today) + 7) % 7 || 7
      const back = (weekdayOf(today) - start.weekday + 7) % 7 || 7
      const next = today.add({ days: ahead })
      const last = today.subtract({ days: back })
      // A weekday on its own never means today: it means the next or last one.
      const chosen =
        prefer === 'past' ? last : prefer === 'nearest' ? (back < ahead ? last : next) : next
      return chosen.add(shift)
    }
  }
}

// ── Written dates ───────────────────────────────────────────────────────────

function parseWritten(input: string, today: CalendarDate, order: DatePart[]): Start | undefined {
  const raw = input.trim()

  // 2009-01-26
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw)
  if (iso) {
    const date = makeDate(Number(iso[1]), Number(iso[2]), Number(iso[3]))
    return date && { kind: 'date', date }
  }

  // Digits only: 26012009, split by the locale's order (2, 2, 4 digits).
  if (/^\d{8}$/.test(raw)) {
    let index = 0
    const parts = Object.fromEntries(
      order.map((part) => {
        const length = part === 'year' ? 4 : 2
        const piece = raw.slice(index, index + length)
        index += length
        return [part, piece]
      })
    ) as Record<DatePart, string>
    const date = makeDate(Number(parts.year), Number(parts.month), Number(parts.day))
    return date && { kind: 'date', date }
  }

  // Numbers with separators: 26/01/2009, 26-1-09, 26.01.2009, or 5/12 (no year).
  const pieces = raw.split(/[/.\-\s]+/)
  if (pieces.every((p) => /^\d+$/.test(p)) && (pieces.length === 3 || pieces.length === 2)) {
    const withoutYear = order.filter((part) => part !== 'year')
    const parts = Object.fromEntries(
      (pieces.length === 3 ? order : withoutYear).map((part, i) => [part, pieces[i]])
    ) as Partial<Record<DatePart, string>>
    const day = Number(parts.day)
    const month = Number(parts.month)
    if (parts.year === undefined) return { kind: 'yearless', resolve: (y) => makeDate(y, month, day) }
    const date = makeDate(expandYear(parts.year, today), month, day)
    return date && { kind: 'date', date }
  }

  // With month names. Ordinals and filler words are dropped: "the 26th of
  // January, 2009" → "26 january 2009".
  const text = raw
    .replace(/(\d)(st|nd|rd|th)\b/g, '$1')
    .replace(/\bof\b/g, ' ')
    .replace(/[,/.\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const named = (day: string, month: string, year?: string): Start | undefined => {
    const d = Number(day)
    const m = monthNumbers[month]
    if (year === undefined) return { kind: 'yearless', resolve: (y) => makeDate(y, m, d) }
    const date = makeDate(expandYear(year, today), m, d)
    return date && { kind: 'date', date }
  }
  let match: RegExpExecArray | null
  if ((match = new RegExp(`^(\\d{1,2}) ${MONTH}(?: (\\d{2}|\\d{4}))?$`).exec(text))) return named(match[1], match[2], match[3])
  if ((match = new RegExp(`^${MONTH} (\\d{1,2})(?: (\\d{2}|\\d{4}))?$`).exec(text))) return named(match[2], match[1], match[3])
  if ((match = new RegExp(`^(\\d{4}) ${MONTH} (\\d{1,2})$`).exec(text))) return named(match[3], match[2], match[1])

  // A month on its own ("march", "march 2027") → the 1st of that month.
  if ((match = new RegExp(`^${MONTH}(?: (\\d{4}))?$`).exec(text))) {
    const m = monthNumbers[match[1]]
    if (match[2]) {
      const date = makeDate(Number(match[2]), m, 1)
      return date && { kind: 'date', date }
    }
    return { kind: 'yearless', resolve: (y) => makeDate(y, m, 1) }
  }

  // A day on its own, with an ordinal: "the 5th", "5th"
  if ((match = /^(\d{1,2})(?:st|nd|rd|th)$/.exec(raw.replace(/\bof\b/g, '').trim()))) {
    const day = Number(match[1])
    return day >= 1 && day <= 31 ? { kind: 'dayOfMonth', day } : undefined
  }

  return undefined
}

// ── Normalising ─────────────────────────────────────────────────────────────

/** 1 → "1st", 2 → "2nd", 3 → "3rd", 11 → "11th", 21 → "21st" … */
function ordinal(n: number) {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'
  return `${n}${suffix}`
}

function normalise(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/,/g, ' ')
      .replace(/\.+$/, '')
      // Ordinal words → numbers: "twelfth" → "12th", "twenty first" → "21st"
      .replace(new RegExp(`\\b(twenty|thirty)[ -](${ORDINAL_WORD})\\b`, 'g'), (_, tens: string, unit: string) =>
        ordinal((tens === 'twenty' ? 20 : 30) + ordinalWords[unit])
      )
      .replace(new RegExp(`\\b(${ORDINAL_WORD})\\b`, 'g'), (word: string) => ordinal(ordinalWords[word]))
      // Loose amounts
      .replace(/\b(?:a )?couple(?: of)?\b/g, '2')
      .replace(/\b(?:a )?few\b/g, '3')
      // Times of day are ignored: "at 3pm", "15:30", "noon", "in the morning".
      // (Not "at 26/01/2009": a number followed by a date separator is a date.)
      .replace(/\b(?:at |@ ?)?\d{1,2}(?::\d{2})? ?(?:am|pm)\b/g, ' ')
      .replace(/\b(?:at |@ ?)\d{1,2}(?::\d{2})?\b(?![/.\-]\d)/g, ' ')
      .replace(/\b\d{1,2}:\d{2}\b/g, ' ')
      .replace(/\b(?:at )?(?:noon|midday|midnight)\b/g, ' ')
      .replace(/\b(?:tonight|this (?:morning|afternoon|evening)|eod|end of (?:the )?day)\b/g, ' today ')
      // ("night" stays in "bonfire night" / "guy fawkes night")
      .replace(/\b(?:in the )?(?:morning|afternoon|evening|(?<!bonfire |fawkes )night)\b/g, ' ')
      .replace(/\bthe\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

// ── Main ────────────────────────────────────────────────────────────────────

export function parseDateText(input: string, options: ParseDateOptions): CalendarDate | undefined {
  const { today, order = ['day', 'month', 'year'], prefer = 'future' } = options
  const normalised = normalise(input)
  if (!normalised) return undefined

  // Padded so every phrase can be matched as " phrase ".
  let text = ` ${normalised} `
  let foundWords = false
  let impossible = false
  const starts: Start[] = []
  let startIsBareWeekday = false
  const shift: Shift = { days: 0, weeks: 0, months: 0, years: 0 }
  const explicit: { year: boolean; month: boolean; yearValue?: number } = { year: false, month: false }
  const thisMonday = mondayOf(today)

  /** Finds a phrase anywhere (as whole words), removes it and returns the match. */
  function take(pattern: string) {
    const match = new RegExp(` ${pattern} `).exec(text)
    if (match) {
      text = text.replace(match[0], ' ')
      foundWords = true
    }
    return match
  }
  // undefined = a phrase that names an impossible date (e.g. the 5th Monday
  // of a month that has four), so the whole text is rejected.
  const addStart = (start: Start | undefined, bareWeekday = false) => {
    if (!start) {
      impossible = true
      return
    }
    starts.push(start)
    startIsBareWeekday = bareWeekday
  }
  const date = (d: CalendarDate | undefined): Start | undefined => d && { kind: 'date', date: d }
  const first = (m: RegExpExecArray, from = 1) => m.slice(from).find((g) => g !== undefined)!
  const toUnit = (word: string): [Unit, number] =>
    word === 'fortnight' ? ['weeks', 2] : [`${word}s` as Unit, 1]
  const toAmount = (word: string) => numberWords[word] ?? Number(word)
  const upcoming = (weekday: number) => today.add({ days: (weekday - weekdayOf(today) + 7) % 7 || 7 })
  let m: RegExpExecArray | null

  // ── Starting day: most specific phrases first ──

  // eow / eom / eoy
  if (take('eow')) addStart(date(thisMonday.add({ days: 4 })))
  if (take('eom')) addStart(date(endOfMonth(today)))
  if (take('eoy')) addStart(date(new CalendarDate(today.year, 12, 31)))

  // first monday of next month · last friday of december · 2nd tuesday in march 2027
  if ((m = take(`(1st|2nd|3rd|4th|5th|last) ${WD} (?:of|in) (?:(this|next|last) month|month|${MONTH}(?: (\\d{4}))?)`))) {
    const n = m[1] === 'last' ? -1 : Number(m[1][0])
    const weekday = weekdayNumbers[m[2]]
    if (m[4]) {
      const month = monthNumbers[m[4]]
      if (m[5]) addStart(date(nthWeekday(Number(m[5]), month, weekday, n)))
      else addStart({ kind: 'yearless', resolve: (y) => nthWeekday(y, month, weekday, n) })
    } else {
      const offset = m[3] === 'next' ? 1 : m[3] === 'last' ? -1 : 0
      const month = startOfMonth(today).add({ months: offset })
      addStart(date(nthWeekday(month.year, month.month, weekday, n)))
    }
  }

  // start / middle / end of (this | next | last) week / month / year
  if ((m = take(`(start|beginning|middle|mid|end) (?:of )?(?:(this|next|last) )?(week|month|year)`))) {
    const offset = m[2] === 'next' ? 1 : m[2] === 'last' ? -1 : 0
    const position = m[1] === 'beginning' ? 'start' : m[1] === 'middle' ? 'mid' : m[1]
    if (m[3] === 'week') {
      // Working week: start Monday, middle Wednesday, end Friday.
      const monday = thisMonday.add({ weeks: offset })
      addStart(date(monday.add({ days: position === 'start' ? 0 : position === 'mid' ? 2 : 4 })))
    } else if (m[3] === 'month') {
      const month = startOfMonth(today).add({ months: offset })
      addStart(date(position === 'start' ? month : position === 'mid' ? month.set({ day: 15 }) : endOfMonth(month)))
    } else {
      const year = today.year + offset
      addStart(date(position === 'start' ? new CalendarDate(year, 1, 1) : position === 'mid' ? new CalendarDate(year, 7, 1) : new CalendarDate(year, 12, 31)))
    }
  }

  // start / early / mid / late / end of december (2027)
  if ((m = take(`(start|beginning|early|middle|mid|late|end) (?:of )?${MONTH}(?: (\\d{4}))?`))) {
    // Copied out of the match: dayIn runs later, after `m` has been reused.
    const position = m[1]
    const month = monthNumbers[m[2]]
    const dayIn = (y: number) => {
      if (['start', 'beginning', 'early'].includes(position)) return makeDate(y, month, 1)
      if (['middle', 'mid'].includes(position)) return makeDate(y, month, 15)
      return endOfMonth(new CalendarDate(y, month, 1))
    }
    addStart(m[3] ? date(dayIn(Number(m[3]))) : { kind: 'yearless', resolve: dayIn })
  }

  // Weekends start on Saturday.
  if (take('this weekend')) addStart(date(thisMonday.add({ days: 5 })))
  if (take('next weekend')) addStart(date(thisMonday.add({ weeks: 1, days: 5 })))
  if (take('last weekend')) addStart(date(thisMonday.subtract({ weeks: 1 }).add({ days: 5 })))
  if (take('(?:on )?weekend')) addStart({ kind: 'weekday', weekday: 6 })

  // Holidays
  for (const [pattern, resolve] of holidays) {
    if (take(pattern)) addStart({ kind: 'yearless', resolve })
  }

  // tuesday after next · monday week · friday fortnight
  if ((m = take(`${WD} after next`))) addStart(date(upcoming(weekdayNumbers[m[1]]).add({ weeks: 1 })))
  if ((m = take(`${WD} (week|fortnight)`))) {
    addStart(date(upcoming(weekdayNumbers[m[1]]).add({ weeks: m[2] === 'fortnight' ? 2 : 1 })))
  }
  // a week on friday · 2 weeks on monday · a month on friday
  if ((m = take(`${AMOUNT} ${UNIT} on ${WD}`))) {
    const [unit, times] = toUnit(m[2])
    addStart(date(upcoming(weekdayNumbers[m[3]]).add({ [unit]: toAmount(m[1]) * times })))
  }
  // a week today · a fortnight tomorrow
  if ((m = take(`${AMOUNT} ${UNIT} (today|tomorrow|tmrw|tmr)`))) {
    const [unit, times] = toUnit(m[2])
    const base = m[3] === 'today' ? today : today.add({ days: 1 })
    addStart(date(base.add({ [unit]: toAmount(m[1]) * times })))
  }

  // next tuesday · next week tuesday · tuesday next week → Tuesday of next week
  if ((m = take(`(?:next week ${WD}|${WD} next week|next ${WD})`))) {
    addStart(date(thisMonday.add({ weeks: 1, days: weekdayNumbers[first(m)] - 1 })))
  }
  // last week friday · friday last week → Friday of last week
  if ((m = take(`(?:last week ${WD}|${WD} last week)`))) {
    addStart(date(thisMonday.subtract({ weeks: 1 }).add({ days: weekdayNumbers[first(m)] - 1 })))
  }
  // this friday · this week friday · friday this week
  if ((m = take(`(?:this week ${WD}|${WD} this week|this ${WD})`))) {
    addStart(date(thisMonday.add({ days: weekdayNumbers[first(m)] - 1 })))
  }
  // last tuesday → the most recent one before today
  if ((m = take(`last ${WD}`))) {
    addStart(date(today.subtract({ days: (weekdayOf(today) - weekdayNumbers[m[1]] + 7) % 7 || 7 })))
  }

  if (take('day after (?:tomorrow|tmrw|tmr)')) addStart(date(today.add({ days: 2 })))
  if (take('day before yesterday')) addStart(date(today.subtract({ days: 2 })))
  if (take('(?:tomorrow|tmrw|tmr|tmw|tomoz)')) addStart(date(today.add({ days: 1 })))
  if (take('(?:yesterday|yday|yest)')) addStart(date(today.subtract({ days: 1 })))
  if (take('(?:today|now|tdy)')) addStart(date(today))

  // A weekday on its own: resolved by `prefer`
  if ((m = take(`(?:on )?${WD}`))) addStart({ kind: 'weekday', weekday: weekdayNumbers[m[1]] }, true)

  // ── Adjustments ──
  if (take('this year')) explicit.year = true
  if (take('this month')) explicit.month = true
  while ((m = take(`(next|last) ${UNIT}`))) {
    const [unit, times] = toUnit(m[2])
    shift[unit] += (m[1] === 'next' ? 1 : -1) * times
  }
  let foundIn = false
  while ((m = take(`in ${AMOUNT} ${UNIT}`))) {
    const [unit, times] = toUnit(m[2])
    shift[unit] += toAmount(m[1]) * times
    foundIn = true
  }
  // More amounts after "in": "in 1 year 2 months", "in 1 week and 3 days"
  while (foundIn && (m = take(`(?:and )?${AMOUNT} ${UNIT}(?! (?:ago|before|earlier|from|after|later))`))) {
    const [unit, times] = toUnit(m[2])
    shift[unit] += toAmount(m[1]) * times
  }
  while ((m = take(`${AMOUNT} ${UNIT} (ago|before|earlier|from|after|later)`))) {
    const [unit, times] = toUnit(m[2])
    const sign = ['ago', 'before', 'earlier'].includes(m[3]) ? -1 : 1
    shift[unit] += sign * toAmount(m[1]) * times
  }
  // Leftover filler words
  while (take('(?:on|of|at|by|for)'));

  // ── Whatever is left must be a written date ──
  let rest = text.trim()
  // A year next to a holiday or other yearless phrase: "christmas 2027"
  if (foundWords && /^\d{4}$/.test(rest)) {
    explicit.yearValue = Number(rest)
    rest = ''
  }
  if (rest) {
    const written = parseWritten(rest, today, order)
    if (!written) return undefined
    // A weekday next to a written date ("tue 26 jan 2009") is just decoration.
    if (starts.length === 1 && startIsBareWeekday) starts.pop()
    starts.push(written)
  } else if (!foundWords) {
    return undefined
  }

  if (impossible || starts.length > 1) return undefined
  return resolveStart(starts[0], shift, explicit, today, prefer)
}
