import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { parseDateText, type ParseDateOptions } from './parseDate'

// Every test counts from Tuesday 10 November 2026 (week: Mon 9 – Sun 15).
const today = new CalendarDate(2026, 11, 10)

function parse(text: string, options: Partial<ParseDateOptions> = {}) {
  return parseDateText(text, { today, ...options })?.toString()
}

function cases(table: Record<string, string | undefined>, options: Partial<ParseDateOptions> = {}) {
  it.each(Object.entries(table))('%s → %s', (text, expected) => {
    expect(parse(text, options)).toBe(expected)
  })
}

describe('numeric dates', () => {
  cases({
    '26/01/2009': '2009-01-26',
    '26-01-2009': '2009-01-26',
    '26.01.2009': '2009-01-26',
    '26 01 2009': '2009-01-26',
    '26/1/2009': '2009-01-26',
    '26/01/09': '2009-01-26',
    '26/01/85': '1985-01-26',
    '26012009': '2009-01-26',
    '2009-01-26': '2009-01-26',
    '2009-1-26': '2009-01-26',
    '  26/01/2009  ': '2009-01-26',
    '29/02/2028': '2028-02-29'
  })

  describe('US order', () => {
    cases({ '01/26/2009': '2009-01-26', '26/01/2009': undefined }, { order: ['month', 'day', 'year'] })
  })
})

describe('month names', () => {
  cases({
    '26 jan 2009': '2009-01-26',
    '26 Jan 2009': '2009-01-26',
    '26 JANUARY 2009': '2009-01-26',
    '26-jan-2009': '2009-01-26',
    '26/jan/2009': '2009-01-26',
    'jan 26 2009': '2009-01-26',
    'January 26, 2009': '2009-01-26',
    '26th jan 2009': '2009-01-26',
    '26th of January 2009': '2009-01-26',
    'the 26th of january, 2009': '2009-01-26',
    '26 jan 09': '2009-01-26',
    '2009 jan 26': '2009-01-26',
    '2009 January 26th': '2009-01-26',
    'tue 26 jan 2009': '2009-01-26',
    'Monday 26th January 2009': '2009-01-26',
    '1 sept 2026': '2026-09-01',
    '1 sep 2026': '2026-09-01',
    '3rd may 1990': '1990-05-03',
    'jan 2009': '2009-01-01',
    'march 2027': '2027-03-01'
  })

  describe('ordinal words', () => {
    cases({
      'twelfth of may 2027': '2027-05-12',
      'the twenty-first of june 2027': '2027-06-21',
      'twenty first june 2027': '2027-06-21',
      'first of march 2027': '2027-03-01',
      'thirty-first december 2026': '2026-12-31'
    })
  })
})

describe('dates without a year (prefer future)', () => {
  cases({
    '5th december': '2026-12-05',
    '5th of december': '2026-12-05',
    'december 5th': '2026-12-05',
    'dec 5': '2026-12-05',
    '5 dec': '2026-12-05',
    'Friday the 5th of December': '2026-12-05',
    '5th march': '2027-03-05',
    '5/12': '2026-12-05',
    '5.12': '2026-12-05',
    '10/11': '2026-11-10',
    '9/11': '2027-11-09',
    'march': '2027-03-01',
    'december': '2026-12-01',
    '5th march this year': '2026-03-05',
    '26 jan next year': '2027-01-26',
    'next year 26 jan': '2027-01-26',
    '29 feb': '2028-02-29'
  })
})

describe('day of the month', () => {
  cases({
    'the 5th': '2026-12-05',
    'the 15th': '2026-11-15',
    '15th': '2026-11-15',
    'the 10th': '2026-11-10',
    'the 31st': '2026-12-31',
    'the 12th of next month': '2026-12-12',
    '12th next month': '2026-12-12',
    'the 5th this month': '2026-11-05',
    'the 31st of next month': '2026-12-31',
    '31st this month': undefined,
    '32nd': undefined
  })
})

describe('relative days', () => {
  cases({
    'today': '2026-11-10',
    'now': '2026-11-10',
    'tdy': '2026-11-10',
    'tonight': '2026-11-10',
    'this evening': '2026-11-10',
    'eod': '2026-11-10',
    'tomorrow': '2026-11-11',
    'tmrw': '2026-11-11',
    'tmr': '2026-11-11',
    'TMRW': '2026-11-11',
    'Tomorrow.': '2026-11-11',
    'tomorrow morning': '2026-11-11',
    'yesterday': '2026-11-09',
    'yday': '2026-11-09',
    'the day after tomorrow': '2026-11-12',
    'day before yesterday': '2026-11-08'
  })
})

describe('weekdays', () => {
  cases({
    'tuesday': '2026-11-17',
    'tue': '2026-11-17',
    'tues': '2026-11-17',
    'on tuesday': '2026-11-17',
    'wednesday': '2026-11-11',
    'monday': '2026-11-16',
    'sun': '2026-11-15',
    'next tuesday': '2026-11-17',
    'next week tuesday': '2026-11-17',
    'tuesday next week': '2026-11-17',
    'next friday': '2026-11-20',
    'next monday': '2026-11-16',
    'this friday': '2026-11-13',
    'this week friday': '2026-11-13',
    'friday this week': '2026-11-13',
    'this monday': '2026-11-09',
    'last tuesday': '2026-11-03',
    'last friday': '2026-11-06',
    'last week friday': '2026-11-06',
    'friday last week': '2026-11-06',
    'tuesday after next': '2026-11-24',
    'the tuesday after next': '2026-11-24',
    'monday week': '2026-11-23',
    'friday fortnight': '2026-11-27',
    'a week on friday': '2026-11-20',
    'a month on friday': '2026-12-13',
    '2 weeks on monday': '2026-11-30'
  })
})

describe('parts of a week, month or year', () => {
  cases({
    'end of the month': '2026-11-30',
    'end of month': '2026-11-30',
    'eom': '2026-11-30',
    'end of next month': '2026-12-31',
    'start of next month': '2026-12-01',
    'beginning of next month': '2026-12-01',
    'middle of the month': '2026-11-15',
    'end of the week': '2026-11-13',
    'eow': '2026-11-13',
    'end of next week': '2026-11-20',
    'start of next week': '2026-11-16',
    'end of the year': '2026-12-31',
    'eoy': '2026-12-31',
    'start of next year': '2027-01-01',
    'mid december': '2026-12-15',
    'early march': '2027-03-01',
    'end of february': '2027-02-28',
    'end of february 2028': '2028-02-29',
    'late december': '2026-12-31',
    'first monday of next month': '2026-12-07',
    'last friday of the month': '2026-11-27',
    'last friday of month': '2026-11-27',
    '2nd tuesday of december': '2026-12-08',
    'third thursday in march 2027': '2027-03-18',
    '5th monday of february': undefined
  })
})

describe('weekends', () => {
  cases({
    'this weekend': '2026-11-14',
    'next weekend': '2026-11-21',
    'last weekend': '2026-11-07',
    'the weekend': '2026-11-14',
    'weekend': '2026-11-14',
    'on the weekend': '2026-11-14'
  })
})

describe('holidays', () => {
  cases({
    'christmas': '2026-12-25',
    'xmas': '2026-12-25',
    'christmas day': '2026-12-25',
    'christmas eve': '2026-12-24',
    'boxing day': '2026-12-26',
    "new year's eve": '2026-12-31',
    'nye': '2026-12-31',
    "new year's day": '2027-01-01',
    'new years': '2027-01-01',
    "valentine's day": '2027-02-14',
    'halloween': '2027-10-31',
    'bonfire night': '2027-11-05',
    'remembrance day': '2026-11-11',
    'easter': '2027-03-28',
    'good friday': '2027-03-26',
    'easter monday': '2027-03-29',
    "mother's day": '2027-03-07',
    "father's day": '2027-06-20',
    "st patrick's day": '2027-03-17',
    'christmas next year': '2027-12-25',
    'christmas 2027': '2027-12-25',
    'easter next year': '2027-03-28',
    'easter this year': '2026-04-05',
    'easter 2028': '2028-04-16'
  })
})

describe('adjustments', () => {
  cases({
    'next week': '2026-11-17',
    'next month': '2026-12-10',
    'next year': '2027-11-10',
    'next year today': '2027-11-10',
    'today next year': '2027-11-10',
    'last week': '2026-11-03',
    'last month': '2026-10-10',
    'last year today': '2025-11-10',
    'in 3 days': '2026-11-13',
    'in three days': '2026-11-13',
    'in a couple of days': '2026-11-12',
    'in a few days': '2026-11-13',
    'in a fortnight': '2026-11-24',
    'next fortnight': '2026-11-24',
    'in 2 weeks': '2026-11-24',
    'in two weeks': '2026-11-24',
    '2 weeks from now': '2026-11-24',
    '3 days ago': '2026-11-07',
    'a week ago': '2026-11-03',
    '3 days later': '2026-11-13',
    'in 1 year 2 months': '2028-01-10',
    'in 1 week and 3 days': '2026-11-20',
    'in two weeks and a day': '2026-11-25',
    'a week from tomorrow': '2026-11-18',
    '2 weeks after next friday': '2026-12-04',
    'a week today': '2026-11-17',
    'a fortnight tomorrow': '2026-11-25',
    'yesterday next month': '2026-12-09',
    'next month yesterday': '2026-12-09',
    'tomorrow next week': '2026-11-18',
    'next tuesday next month': '2026-12-17',
    '26/01/2009 next year': '2010-01-26'
  })
})

describe('times are ignored', () => {
  cases({
    '5th december at 3pm': '2026-12-05',
    '5th december 3pm': '2026-12-05',
    'tomorrow at 15:30': '2026-11-11',
    'tomorrow at noon': '2026-11-11',
    'monday at 9': '2026-11-16',
    'friday 9am': '2026-11-13',
    'at 26/01/2009': '2009-01-26'
  })
})

describe('prefer past', () => {
  cases(
    {
      '5th march': '2026-03-05',
      '5th december': '2025-12-05',
      'tuesday': '2026-11-03',
      'the 5th': '2026-11-05',
      'the 15th': '2026-10-15',
      'christmas': '2025-12-25',
      'march': '2026-03-01',
      // Explicit phrases ignore prefer
      'next tuesday': '2026-11-17',
      'tomorrow': '2026-11-11',
      'christmas next year': '2027-12-25'
    },
    { prefer: 'past' }
  )
})

describe('prefer nearest', () => {
  cases(
    {
      '5th march': '2027-03-05', // 115 days ahead vs 250 back
      '5th june': '2026-06-05', // 158 days back vs 207 ahead
      'friday': '2026-11-13', // 3 ahead vs 4 back
      'saturday': '2026-11-07' // 4 ahead vs 3 back
    },
    { prefer: 'nearest' }
  )
})

describe('not understood', () => {
  cases({
    '': undefined,
    '   ': undefined,
    'hello': undefined,
    'next blursday': undefined,
    '31 feb 2009': undefined,
    '26/13/2009': undefined,
    '26 janu 2009': undefined,
    'tomorrow yesterday': undefined,
    'tomorrow 26 jan': undefined,
    '2 weeks': undefined,
    'next': undefined,
    '5': undefined,
    '2009': undefined
  })
})
