<script setup lang="ts">
import { computed, ref, watch, type HTMLAttributes } from 'vue'
import { DatePickerContent, DatePickerRoot, DatePickerTrigger } from 'reka-ui'
import { getLocalTimeZone, parseDate, today, type DateValue } from '@internationalized/date'
import { CalendarDays } from '@lucide/vue'
import FormField, { type FormFieldStatus } from '../FormField/FormField.vue'
import Calendar from '../Calendar/Calendar.vue'
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

const dateValue = computed(() => toDate(model.value))
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

// Enter first settles the text, like leaving the field: "tmrw" or "26/1"
// becomes the full date it means, and the form isn't submitted. Once the text
// already shows that date (or is empty), Enter does its usual job, e.g.
// submitting the form. Text that isn't a date shows the example and stays.
function onTextEnter(event: KeyboardEvent) {
  if (event.isComposing || !text.value.trim()) return
  const date = parseText(text.value)
  if (date && text.value === formatShort(date)) return
  event.preventDefault()
  onTextBlur()
}

// errorText is handled by FormField; then status / statusText, the format check
// and the range check.
const fieldError = computed(() => formatError.value ?? rangeError.value)
const status = computed(() => props.status ?? (fieldError.value ? 'error' : undefined))
const statusText = computed(() => props.statusText ?? fieldError.value)

// ── Calendar ────────────────────────────────────────────────────────────────
// Opens on the chosen date (or today, or the nearest allowed date); choosing
// a day closes it. Reka's DatePicker is used only for the popover, so the
// chosen day (or today) gets focus when it opens.
const open = ref(false)

function onCalendarPick(value: string | undefined) {
  model.value = value
  open.value = false
}

// Calendar button: a full-height square segment at the right of the box, like
// InputNumber's + button. Negative margins cancel the box's padding.
const trigger = [
  'flex w-9 shrink-0 -my-2 -mr-3 self-stretch items-center justify-center',
  'rounded-r border-l border-black/15 bg-white cursor-pointer transition',
  'not-disabled:hover:brightness-90 not-disabled:active:brightness-80 [&_svg]:opacity-100!',
  'data-[state=open]:brightness-90 disabled:cursor-not-allowed',
  'outline-2 -outline-offset-2 outline-transparent focus-visible:outline-focus'
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
      <DatePickerRoot v-model:open="open" :disabled="disabled">
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
          @keydown.enter="onTextEnter"
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
          <Calendar :model-value="model" :min="min" :max="max" :locale="locale" @update:model-value="onCalendarPick" />
        </DatePickerContent>
      </DatePickerRoot>
    </template>
  </FormField>
</template>
