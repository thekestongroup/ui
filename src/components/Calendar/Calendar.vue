<script setup lang="ts">
import { computed, ref, shallowRef, watch, type HTMLAttributes } from 'vue'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarNext,
  CalendarPrev,
  CalendarRoot
} from 'reka-ui'
import {
  CalendarDate,
  getLocalTimeZone,
  isToday,
  parseDate,
  toCalendarDate,
  today,
  type DateValue
} from '@internationalized/date'
import { ChevronDown, ChevronLeft, ChevronRight } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Button from '../Button/Button.vue'

/**
 * A month of days to pick one from, with the month and year in the heading
 * opening grids of months and years. InputDate shows it in a popover; on its
 * own it suits a page where the date is the main thing, e.g. choosing an
 * interview day. It has no frame: put it in a Card.
 */
export interface CalendarProps {
  /** Earliest allowed date, as `YYYY-MM-DD`. */
  min?: string
  /** Latest allowed date, as `YYYY-MM-DD`. */
  max?: string
  /** Sets the weekday names, month names and the calendar's language. */
  locale?: string
  /** Move focus to the chosen day (or today) when the calendar appears. */
  initialFocus?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<CalendarProps>(), {
  locale: 'en-GB'
})

/** The date as `YYYY-MM-DD`, or undefined when none is chosen. */
const model = defineModel<string | undefined>()

// Reka works with date objects; the component's value is a plain ISO string,
// like InputDate's.
function toDate(iso: string | undefined): DateValue | undefined {
  if (!iso) return undefined
  try {
    return parseDate(iso)
  } catch {
    return undefined
  }
}

const dateValue = computed(() => toDate(model.value))
const minValue = computed(() => toDate(props.min))
const maxValue = computed(() => toDate(props.max))

// Reka passes undefined when the chosen day is pressed again; keep it chosen.
function setValue(value: DateValue | undefined) {
  if (value) model.value = value.toString()
}

// ── Views ───────────────────────────────────────────────────────────────────
// The heading's month and year are buttons that act like dropdowns: the month
// opens a grid of months, the year a grid of years. Picking either goes back
// to the days.
// `placeholder` is the month the calendar is showing.
type View = 'days' | 'months' | 'years'
const view = ref<View>('days')
// shallowRef: dates are replaced, never mutated, and a deep ref would strip
// CalendarDate's private fields from its type.
const placeholder = shallowRef<CalendarDate>(startingMonth())

// Where the calendar opens: the selected date, or today, or (if today is
// outside min / max) the nearest allowed date, so it never opens on a month
// where every day is greyed out.
function startingMonth(): CalendarDate {
  if (dateValue.value) return toCalendarDate(dateValue.value)
  const now = today(getLocalTimeZone())
  if (minValue.value && now.compare(minValue.value) < 0) return toCalendarDate(minValue.value)
  if (maxValue.value && now.compare(maxValue.value) > 0) return toCalendarDate(maxValue.value)
  return now
}

// Follow a date set from elsewhere (e.g. typed into InputDate).
watch(dateValue, (value) => {
  if (value) placeholder.value = toCalendarDate(value)
})

function onPlaceholderChange(value: DateValue) {
  placeholder.value = toCalendarDate(value)
}

const monthNames = computed(() => {
  const format = new Intl.DateTimeFormat(props.locale, { month: 'short' })
  return Array.from({ length: 12 }, (_, i) => format.format(new Date(2000, i, 1)))
})
const monthLongName = computed(() =>
  new Intl.DateTimeFormat(props.locale, { month: 'long' }).format(
    new Date(placeholder.value.year, placeholder.value.month - 1, 1)
  )
)

// Years are shown 12 at a time.
const yearPageStart = ref(0)
const years = computed(() => Array.from({ length: 12 }, (_, i) => yearPageStart.value + i))

function showMonths() {
  view.value = 'months'
}
function showYears() {
  yearPageStart.value = placeholder.value.year - (placeholder.value.year % 12)
  view.value = 'years'
}
function pickMonth(month: number) {
  placeholder.value = placeholder.value.set({ month })
  view.value = 'days'
}
// Month and year act as separate dropdowns: picking a year keeps the month
// and goes back to the days. If that month is outside min / max in the new
// year, move to the nearest allowed month instead.
function pickYear(year: number) {
  let next = placeholder.value.set({ year })
  const min = minValue.value && toCalendarDate(minValue.value).set({ day: 1 })
  const max = maxValue.value && toCalendarDate(maxValue.value).set({ day: 1 })
  if (min && next.compare(min) < 0) next = next.set({ month: min.month })
  if (max && next.compare(max) > 0) next = next.set({ month: max.month })
  placeholder.value = next
  view.value = 'days'
}
// The arrows move by a year in the month view and by 12 years in the year view.
function page(direction: 1 | -1) {
  if (view.value === 'months') placeholder.value = placeholder.value.add({ years: direction })
  else yearPageStart.value += 12 * direction
}

function monthDisabled(month: number) {
  const start = new CalendarDate(placeholder.value.year, month, 1)
  const end = start.add({ months: 1 }).subtract({ days: 1 })
  return Boolean(
    (minValue.value && end.compare(minValue.value) < 0) ||
      (maxValue.value && start.compare(maxValue.value) > 0)
  )
}
function yearDisabled(year: number) {
  return Boolean(
    (minValue.value && year < minValue.value.year) || (maxValue.value && year > maxValue.value.year)
  )
}
const pageBackDisabled = computed(() =>
  view.value === 'months'
    ? yearDisabled(placeholder.value.year - 1)
    : yearDisabled(yearPageStart.value - 1)
)
const pageForwardDisabled = computed(() =>
  view.value === 'months'
    ? yearDisabled(placeholder.value.year + 1)
    : yearDisabled(yearPageStart.value + 12)
)

const isSelectedMonth = (month: number) =>
  dateValue.value?.year === placeholder.value.year && dateValue.value?.month === month
const isSelectedYear = (year: number) => dateValue.value?.year === year

// Is this month / year the current one? Marks it with aria-current (see todayMark).
const isCurrentMonth = (month: number) => {
  const now = today(getLocalTimeZone())
  return placeholder.value.year === now.year && month === now.month
}
const isCurrentYear = (year: number) => year === today(getLocalTimeZone()).year

// "October ▾" / "2026 ▾" in the heading.
const headingButton = [
  'inline-flex items-center gap-0.5 rounded px-1.5 py-1 text-sm cursor-pointer transition',
  'hover:bg-black/10 active:bg-black/15 [&_svg]:size-3.5',
  'disabled:cursor-not-allowed disabled:hover:bg-transparent',
  'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus'
]

// Today's day, month and year: bold with a small dot underneath. Driven by
// aria-current="date", which also tells screen readers it is today. The dot
// uses the text colour, so it turns white on the selected (filled) cell.
const todayMark = [
  'relative aria-[current=date]:font-bold',
  'aria-[current=date]:after:absolute aria-[current=date]:after:left-1/2 aria-[current=date]:after:size-1',
  'aria-[current=date]:after:-translate-x-1/2 aria-[current=date]:after:rounded-full aria-[current=date]:after:bg-current'
]

// Month / year cells: 3 columns, sized so the calendar keeps the same width
// (7 day columns × 32px = 224px) when switching views.
const pickCell = [
  ...todayMark,
  'aria-[current=date]:after:bottom-2',
  'flex h-12 items-center justify-center rounded text-sm tabular-nums cursor-pointer transition',
  'hover:bg-black/10',
  'aria-pressed:bg-primary aria-pressed:text-white aria-pressed:hover:bg-primary',
  'disabled:cursor-not-allowed disabled:text-black/25 disabled:hover:bg-transparent',
  'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus'
]

const day = [
  ...todayMark,
  'aria-[current=date]:after:bottom-0.5',
  'flex size-8 items-center justify-center rounded text-sm tabular-nums cursor-pointer transition',
  'hover:bg-black/10',
  'data-[outside-view]:text-black/35',
  'data-[selected]:bg-primary data-[selected]:text-white data-[selected]:hover:bg-primary',
  'data-[disabled]:cursor-not-allowed data-[disabled]:text-black/25 data-[disabled]:hover:bg-transparent',
  'data-[unavailable]:line-through',
  'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus'
]
</script>

<template>
  <CalendarRoot
    v-slot="{ weekDays, grid }"
    :model-value="dateValue"
    :placeholder="placeholder"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :disabled="disabled"
    :initial-focus="initialFocus"
    :week-starts-on="1"
    fixed-weeks
    :class="cn('w-fit text-black', disabled && 'opacity-40', props.class)"
    @update:model-value="setValue"
    @update:placeholder="onPlaceholderChange"
  >
    <CalendarHeader class="flex items-center justify-between gap-1">
      <!-- Days: arrows change month. Months / years: arrows page years. -->
      <CalendarPrev v-if="view === 'days'" as-child>
        <Button variant="ghost" size="sm" square aria-label="Previous month"><ChevronLeft /></Button>
      </CalendarPrev>
      <Button
        v-else
        variant="ghost"
        size="sm"
        square
        :aria-label="view === 'months' ? 'Previous year' : 'Previous years'"
        :disabled="disabled || pageBackDisabled"
        @click="page(-1)"
      >
        <ChevronLeft />
      </Button>

      <div class="flex items-center">
        <button
          v-if="view === 'days'"
          type="button"
          :class="headingButton"
          aria-label="Choose month"
          :disabled="disabled"
          @click="showMonths"
        >
          {{ monthLongName }} <ChevronDown />
        </button>
        <button
          v-if="view !== 'years'"
          type="button"
          :class="headingButton"
          aria-label="Choose year"
          :disabled="disabled"
          @click="showYears"
        >
          {{ placeholder.year }} <ChevronDown />
        </button>
        <span v-else class="px-1.5 py-1 text-sm tabular-nums">
          {{ years[0] }} – {{ years[years.length - 1] }}
        </span>
      </div>

      <CalendarNext v-if="view === 'days'" as-child>
        <Button variant="ghost" size="sm" square aria-label="Next month"><ChevronRight /></Button>
      </CalendarNext>
      <Button
        v-else
        variant="ghost"
        size="sm"
        square
        :aria-label="view === 'months' ? 'Next year' : 'Next years'"
        :disabled="disabled || pageForwardDisabled"
        @click="page(1)"
      >
        <ChevronRight />
      </Button>
    </CalendarHeader>

    <!-- Month picker -->
    <div v-if="view === 'months'" class="mt-3 grid w-56 grid-cols-3 gap-1">
      <button
        v-for="(name, index) in monthNames"
        :key="name"
        type="button"
        :class="pickCell"
        :aria-current="isCurrentMonth(index + 1) ? 'date' : undefined"
        :aria-pressed="isSelectedMonth(index + 1)"
        :disabled="monthDisabled(index + 1)"
        @click="pickMonth(index + 1)"
      >
        {{ name }}
      </button>
    </div>

    <!-- Year picker -->
    <div v-else-if="view === 'years'" class="mt-3 grid w-56 grid-cols-3 gap-1">
      <button
        v-for="year in years"
        :key="year"
        type="button"
        :class="pickCell"
        :aria-current="isCurrentYear(year) ? 'date' : undefined"
        :aria-pressed="isSelectedYear(year)"
        :disabled="yearDisabled(year)"
        @click="pickYear(year)"
      >
        {{ year }}
      </button>
    </div>

    <!-- Day grid -->
    <CalendarGrid
      v-for="month in view === 'days' ? grid : []"
      :key="month.value.toString()"
      class="mt-3 border-collapse select-none"
    >
      <CalendarGridHead>
        <CalendarGridRow class="flex">
          <CalendarHeadCell
            v-for="weekDay in weekDays"
            :key="weekDay"
            class="w-8 pb-1 text-xs font-normal text-black/55"
          >
            {{ weekDay }}
          </CalendarHeadCell>
        </CalendarGridRow>
      </CalendarGridHead>
      <CalendarGridBody>
        <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`week-${index}`" class="flex">
          <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
            <CalendarCellTrigger
              :day="weekDate"
              :month="month.value"
              :aria-current="isToday(weekDate, getLocalTimeZone()) ? 'date' : undefined"
              :class="day"
            />
          </CalendarCell>
        </CalendarGridRow>
      </CalendarGridBody>
    </CalendarGrid>
  </CalendarRoot>
</template>
