# InputDate

> A date, typed in almost any form ("26/01/2009", "tmrw", "next friday") or picked from a calendar.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/InputDate

## When to use

- Any single date: a date of birth, a due date, an incident date.

## When not to use

- A date shown, not chosen: use RelativeTime or the date helpers.
- Browsing a month to pick from: use Calendar on its own.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label, helper, message | — | As every field (FormField). |
| text box | Yes | Plain text, placeholder in the locale's order, e.g. dd/mm/yyyy. |
| understood date | No | While words are typed, the date they mean in black 55% at the end, e.g. "tmrw" → 13/11/2026. |
| calendar button | Yes | 36px square at the right end, divided by a black 15% line. Opens Calendar in a popover. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | string \| undefined | — | The date as `YYYY-MM-DD`; undefined when empty or not understood. |
| label | string | — | Required. |
| helper / helperPlacement | string / below \| icon | — / below | As every field. |
| errorText / status / statusText | | — | As every field. |
| min / max | string (`YYYY-MM-DD`) | — | The allowed range. Dates outside it are kept but explained. |
| locale | string | en-GB | Day / month / year order and the calendar's language. |
| prefer | future \| past \| nearest | future | How dates without a year, month or week are read ("5th march", "tuesday"). Use `past` for things that already happened. |
| disabled | boolean | false | 40% opacity, not editable. |

## Behaviour

- Understands written dates (26/01/2009, 26 jan 2009, 26th of January), relative days (today, tmrw, the day after tomorrow), weekdays (next tuesday, monday week), parts of time (end of the month, eow), holidays (christmas, easter) and adjustments (in 3 days, 2 weeks from now). Times are ignored.
- The value updates as soon as the text is understood. Leaving the field tidies the text to the full date, e.g. 26/01/2009.
- **Enter:** the first press fills in the full date the text means, without submitting the form. Pressing it again submits as usual.
- Text that isn't a date shows "Enter a date like 26/01/2009" once the field is left.
- A date outside `min` / `max` shows "Choose a date from … to …".
- Choosing a day in the calendar sets it and closes the calendar; it opens on the chosen date, or today.

## Accessibility

- The text box is named by the label; helper and message are its description.
- The calendar button is labelled "Open calendar"; the calendar is fully usable with the keyboard (see Calendar).
- The understood date is hidden from screen readers. They hear the full date when the field is left.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `InputDate.vue` | Typed-date parsing in `src/lib/parseDate.ts`; Reka UI DatePicker for the popover. |
| iOS (SwiftUI) | — | `DatePicker` (compact style); no typed phrases. |
| Android (Compose) | — | Text field plus `DatePickerDialog`. |

## Tokens used

| Token | Used for |
|---|---|
| `color-focus` | Focus ring |
| `color-red` / `color-green` | Error / success |
