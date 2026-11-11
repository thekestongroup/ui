<script setup lang="ts">
import { computed, ref, shallowRef, watch, type HTMLAttributes } from 'vue'
import {
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger
} from 'reka-ui'
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  isToday,
  toCalendarDate,
  today,
  type DateValue
} from '@internationalized/date'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from '@lucide/vue'
import FormField, { type FormFieldStatus } from '../FormField/FormField.vue'
import Button from '../Button/Button.vue'
import { popoverContent } from '../Popover/popover'
import { parseDateText, type DatePart, type DatePreference } from '../../lib/parseDate'

// Attributes like name and placeholder go to the text <input>, not the wrapper.
defineOptions({ inheritAttrs: false })

export interface InputDateProps {
  /** Visible label. Always set it: it is also the field's accessible name. */
  label: string
  /** Extra guidance about what to enter. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Error message, e.g. from a Zod schema. Overrides `status` / `statusText`. */
  errorText?: string
  /** Colours the field and the status text. */
  status?: FormFieldStatus
  /** Message under the field. */
  statusText?: string
  /** Earliest allowed date, as `YYYY-MM-DD`. */
  min?: string
  /** Latest allowed date, as `YYYY-MM-DD`. */
  max?: string
  /** Sets the order of day / month / year and the calendar's language. */
  locale?: string
  /**
   * How typed dates that don't say which year, month or week are read
   * ("5th march", "the 5th", "tuesday", "christmas"): 'future' (default)
   * picks the next one, 'past' the last one, 'nearest' the closest. Use
   * 'past' for things that already happened, e.g. an incident date.
   */
  prefer?: DatePreference
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<InputDateProps>(), {
  helperPlacement: 'below',
  locale: 'en-GB',
  prefer: 'future'
})

/** The date as `YYYY-MM-DD`, or undefined when empty or incomplete. */
const model = defineModel<string | undefined>()

// Reka works with date objects; the component's value is a plain ISO string,
// which is easy to validate (e.g. with Zod) and send to a server.
function toDate(iso: string | undefined): DateValue | undefined {
  if (!iso) return undefined
  try {
    return parseDate(iso)
  } catch {
    return undefined
  }
}

const dateValue = computed({
  get: () => toDate(model.value),
  set: (value: DateValue | undefined) => {
    model.value = value ? value.toString() : undefined
  }
})
const minValue = computed(() => toDate(props.min))
const maxValue = computed(() => toDate(props.max))

// ── Range check ─────────────────────────────────────────────────────────────
// A typed date outside min / max is still passed to the model (so the form
// can see it), but the field explains what is allowed. errorText and
// status / statusText override this.
function formatDate(date: DateValue) {
  return new Intl.DateTimeFormat(props.locale, { dateStyle: 'long' }).format(
    new Date(date.year, date.month - 1, date.day)
  )
}

const rangeError = computed(() => {
  const value = dateValue.value
  if (!value) return undefined
  const min = minValue.value
  const max = maxValue.value
  const tooEarly = min && value.compare(min) < 0
  const tooLate = max && value.compare(max) > 0
  if (!tooEarly && !tooLate) return undefined
  if (min && max) return `Choose a date from ${formatDate(min)} to ${formatDate(max)}`
  if (min) return `Choose a date on or after ${formatDate(min)}`
  return `Choose a date on or before ${formatDate(max!)}`
})

// ── Typed text ──────────────────────────────────────────────────────────────
// The field is a plain text box. A date typed in almost any form ("26/01/2009",
// "5th of december", "tmrw", "monday week" …, see src/lib/parseDate.ts) sets
// the value straight away; on leaving the field it is tidied to 26/01/2009.
// Anything else leaves the value undefined and, once the user leaves the
// field, shows an example.
const shortFormat = computed(
  () => new Intl.DateTimeFormat(props.locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
)
// Day / month / year order and separator for the locale, e.g. en-GB → d/m/y.
const sample = computed(() => shortFormat.value.formatToParts(new Date(2009, 0, 26)))
const order = computed(
  () => sample.value.filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year').map((part) => part.type) as DatePart[]
)
const separator = computed(() => sample.value.find((part) => part.type === 'literal')?.value ?? '/')
const placeholderText = computed(() =>
  order.value.map((part) => ({ day: 'dd', month: 'mm', year: 'yyyy' })[part]).join(separator.value)
)
const example = computed(() => shortFormat.value.format(new Date(2009, 0, 26)))

function formatShort(date: DateValue) {
  return shortFormat.value.format(new Date(date.year, date.month - 1, date.day))
}

// The words and formats understood are listed in src/lib/parseDate.ts.
function parseText(input: string) {
  return parseDateText(input, {
    today: today(getLocalTimeZone()),
    order: order.value,
    prefer: props.prefer
  })
}

const text = ref(dateValue.value ? formatShort(dateValue.value) : '')

// While words are typed ("tmrw", "26 jan 2009"), show the date they mean
// inside the field. Purely numeric text doesn't need it.
const phrasePreview = computed(() => {
  if (!/[a-z]/i.test(text.value)) return undefined
  const date = parseText(text.value)
  return date ? formatShort(date) : undefined
})
const formatError = ref<string>()
// The last value this text box set, so its own updates don't rewrite the text
// mid-typing; changes from elsewhere (calendar, parent) do update it.
let lastFromText: string | undefined = model.value

watch(model, (value) => {
  if (value === lastFromText) return
  lastFromText = value
  const date = toDate(value)
  text.value = date ? formatShort(date) : ''
  formatError.value = undefined
})

function onTextInput() {
  const date = parseText(text.value)
  const value = date?.toString()
  lastFromText = value
  model.value = value
  // Once an error is showing, clear it as soon as the text becomes valid.
  if (formatError.value && (date || !text.value.trim())) formatError.value = undefined
}

function onTextBlur() {
  if (!text.value.trim()) {
    formatError.value = undefined
    return
  }
  const date = parseText(text.value)
  if (date) {
    text.value = formatShort(date)
    formatError.value = undefined
  } else {
    formatError.value = `Enter a date like ${example.value}`
  }
}

// errorText is handled by FormField; then status / statusText, the format check
// and the range check.
const fieldError = computed(() => formatError.value ?? rangeError.value)
const status = computed(() => props.status ?? (fieldError.value ? 'error' : undefined))
const statusText = computed(() => props.statusText ?? fieldError.value)

// ── Calendar views ──────────────────────────────────────────────────────────
// The heading's month and year are buttons that act like dropdowns: the month
// opens a grid of months, the year a grid of years. Picking either goes back
// to the days.
// `placeholder` is the month the calendar is showing.
type View = 'days' | 'months' | 'years'
const view = ref<View>('days')
const open = ref(false)
// shallowRef: dates are replaced, never mutated, and a deep ref would strip
// CalendarDate's private fields from its type.
const placeholder = shallowRef<CalendarDate>(startingMonth())

// Where the calendar opens: the selected date, or today, or (if today is
// outside min / max) the nearest allowed date, so an empty field never opens
// on a month where every day is greyed out.
function startingMonth(): CalendarDate {
  if (dateValue.value) return toCalendarDate(dateValue.value)
  const now = today(getLocalTimeZone())
  if (minValue.value && now.compare(minValue.value) < 0) return toCalendarDate(minValue.value)
  if (maxValue.value && now.compare(maxValue.value) > 0) return toCalendarDate(maxValue.value)
  return now
}

// Follow a typed date, so the calendar opens on it.
watch(dateValue, (value) => {
  if (value) placeholder.value = toCalendarDate(value)
})

function onOpenChange(value: boolean) {
  open.value = value
  if (value) {
    view.value = 'days'
    if (!dateValue.value) placeholder.value = startingMonth()
  }
}
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

// Calendar button: a full-height square segment at the right of the box, like
// InputNumber's + button. Negative margins cancel the box's padding.
const trigger = [
  'flex w-9 shrink-0 -my-2 -mr-3 self-stretch items-center justify-center',
  'rounded-r border-l border-black/15 bg-white cursor-pointer transition',
  'not-disabled:hover:brightness-90 not-disabled:active:brightness-80 [&_svg]:opacity-100!',
  'data-[state=open]:brightness-90 disabled:cursor-not-allowed',
  'outline-2 -outline-offset-2 outline-transparent focus-visible:outline-focus'
]


// "October ▾" / "2026 ▾" in the heading.
const headingButton = [
  'inline-flex items-center gap-0.5 rounded px-1.5 py-1 text-sm cursor-pointer transition',
  'hover:bg-black/10 active:bg-black/15 [&_svg]:size-3.5',
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

// Month / year cells: 3 columns, sized so the popover keeps the same width
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
  <FormField
    :label="label"
    :helper="helper"
    :helper-placement="helperPlacement"
    :error-text="errorText"
    :status="status"
    :status-text="statusText"
    :disabled="disabled"
    :class="props.class"
  >
    <template #default="{ id, describedBy, invalid }">
      <DatePickerRoot
        v-model="dateValue"
        :min-value="minValue"
        :max-value="maxValue"
        :locale="locale"
        :disabled="disabled"
        granularity="day"
        :week-starts-on="1"
        fixed-weeks
        close-on-select
        :open="open"
        :placeholder="placeholder"
        @update:open="onOpenChange"
        @update:placeholder="onPlaceholderChange"
      >
        <!-- Plain text box: type or paste the whole date, e.g. 26/01/2009. -->
        <input
          :id="id"
          v-model="text"
          type="text"
          autocomplete="off"
          :placeholder="placeholderText"
          v-bind="$attrs"
          :disabled="disabled"
          :aria-invalid="invalid"
          :aria-describedby="describedBy"
          class="h-5 min-w-0 flex-1 bg-transparent tabular-nums outline-none placeholder:text-black/55 disabled:cursor-not-allowed"
          @input="onTextInput"
          @blur="onTextBlur"
        />

        <!-- The date a typed phrase means, e.g. "tmrw" → 11/11/2026. -->
        <span v-if="phrasePreview" aria-hidden="true" class="shrink-0 tabular-nums text-black/55">
          {{ phrasePreview }}
        </span>

        <DatePickerTrigger aria-label="Open calendar" :class="trigger">
          <CalendarDays />
        </DatePickerTrigger>

        <DatePickerContent
          :side-offset="6"
          align="end"
          :class="[popoverContent, 'p-3']"
        >
          <DatePickerCalendar v-slot="{ weekDays, grid }">
            <DatePickerHeader class="flex items-center justify-between gap-1">
              <!-- Days: arrows change month. Months / years: arrows page years. -->
              <DatePickerPrev v-if="view === 'days'" as-child>
                <Button variant="ghost" size="sm" square aria-label="Previous month"><ChevronLeft /></Button>
              </DatePickerPrev>
              <Button
                v-else
                variant="ghost"
                size="sm"
                square
                :aria-label="view === 'months' ? 'Previous year' : 'Previous years'"
                :disabled="pageBackDisabled"
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
                  @click="showMonths"
                >
                  {{ monthLongName }} <ChevronDown />
                </button>
                <button
                  v-if="view !== 'years'"
                  type="button"
                  :class="headingButton"
                  aria-label="Choose year"
                  @click="showYears"
                >
                  {{ placeholder.year }} <ChevronDown />
                </button>
                <span v-else class="px-1.5 py-1 text-sm tabular-nums">
                  {{ years[0] }} – {{ years[years.length - 1] }}
                </span>
              </div>

              <DatePickerNext v-if="view === 'days'" as-child>
                <Button variant="ghost" size="sm" square aria-label="Next month"><ChevronRight /></Button>
              </DatePickerNext>
              <Button
                v-else
                variant="ghost"
                size="sm"
                square
                :aria-label="view === 'months' ? 'Next year' : 'Next years'"
                :disabled="pageForwardDisabled"
                @click="page(1)"
              >
                <ChevronRight />
              </Button>
            </DatePickerHeader>

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
            <DatePickerGrid
              v-for="month in view === 'days' ? grid : []"
              :key="month.value.toString()"
              class="mt-3 border-collapse select-none"
            >
              <DatePickerGridHead>
                <DatePickerGridRow class="flex">
                  <DatePickerHeadCell
                    v-for="weekDay in weekDays"
                    :key="weekDay"
                    class="w-8 pb-1 text-xs font-normal text-black/55"
                  >
                    {{ weekDay }}
                  </DatePickerHeadCell>
                </DatePickerGridRow>
              </DatePickerGridHead>
              <DatePickerGridBody>
                <DatePickerGridRow
                  v-for="(weekDates, index) in month.rows"
                  :key="`week-${index}`"
                  class="flex"
                >
                  <DatePickerCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
                    <DatePickerCellTrigger
                      :day="weekDate"
                      :month="month.value"
                      :aria-current="isToday(weekDate, getLocalTimeZone()) ? 'date' : undefined"
                      :class="day"
                    />
                  </DatePickerCell>
                </DatePickerGridRow>
              </DatePickerGridBody>
            </DatePickerGrid>
          </DatePickerCalendar>
        </DatePickerContent>
      </DatePickerRoot>
    </template>
  </FormField>
</template>
