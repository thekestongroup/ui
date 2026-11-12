# Age

> Someone's age, "13", with their date of birth and any birthday this week in a tooltip.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Data/Age

## When to use

- Showing a person's age, e.g. in a student list or record. The tooltip saves looking up their date of birth.

## When not to use

- When the date of birth itself matters more than the age: show the date with `formatDate`.
- How long ago something happened: use RelativeTime.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| number | Yes | The age, in the surrounding text style, with an optional suffix ("13 years"). |
| tooltip | Yes | "Born 14 March 2013", plus "Birthday today" or "Birthday in 3 days" within a week. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| birthDate | Date \| string \| number | — | Date of birth: a Date, an ISO string ("2013-03-14") or a timestamp. |
| suffix | string | — | Text after the number, e.g. "years". Leave out in an "Age" column. |
| now | Date | today | What "today" is, e.g. for tests. |

## Behaviour

- The age goes up on the birthday itself; people born on 29 February turn a year older on 1 March in other years.
- The tooltip shows on hover and on keyboard focus.

## Accessibility

- Focusable, so keyboard users can reach the tooltip.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Age.vue` | `age()` and `daysToBirthday()` in `src/lib/dates.ts`. |
| iOS (SwiftUI) | — | `Calendar.dateComponents([.year], …)`; date of birth in a context menu. |
| Android (Compose) | — | `Period.between(…).years`. |

## Tokens used

None of its own: it uses the surrounding text style, and Tooltip's.
