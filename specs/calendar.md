# Calendar

> A month of days to choose one from, with the month and year opening grids of months and years.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/Calendar

## When to use

- On a page where the date is the main thing, e.g. choosing an interview day with that day's details beside it.
- InputDate uses it in its popover; most forms should use InputDate.

## When not to use

- A date field in a form: use InputDate (people can type, and it's compact).
- Dates far from today, like a date of birth: use InputDate; typing is quicker.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| heading | Yes | ‹ previous, month ▾ and year ▾ buttons, › next. |
| day grid | Yes | Weekday names, then 6 weeks of 32px days, starting Monday. |
| month / year grid | — | 3 × 4 grids of 48px-tall cells, shown from the heading. |

No frame: put it in a Card (or a popover, as InputDate does).

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | string (`YYYY-MM-DD`) | — | The chosen date. |
| min / max | string (`YYYY-MM-DD`) | — | Days, months and years outside are greyed out. |
| locale | string | en-GB | Names of days and months. |
| initialFocus | boolean | false | Focus the chosen day (or today) when it appears. |
| disabled | boolean | false | |

## States

| State | Appearance | Notes |
|---|---|---|
| Day | Black text; days outside the month 35%. | |
| Hovered | Black 10% fill. | |
| Chosen | Primary fill, white text. | |
| Today | Bold, with a 4px dot underneath. | Also on today's month and year. |
| Unavailable | 25% text. | Outside min / max. |
| Focused | 2px focus ring. | Keyboard only. |

## Behaviour

- Arrow keys move between days, Page Up / Down between months; Enter or Space chooses.
- Opens on the chosen date, else today, else the nearest allowed month.
- Picking a month or year goes back to the days.

## Accessibility

- A grid of buttons with full dates as names; today is `aria-current="date"`.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Calendar.vue` | Reka UI `Calendar`. |
| iOS (SwiftUI) | — | `DatePicker` with `.graphical` style. |
| Android (Compose) | — | `DatePicker` (Material 3). |

## Tokens used

| Token | Used for |
|---|---|
| `color-primary` | Chosen day, month, year |
| `color-focus` | Focus ring |
