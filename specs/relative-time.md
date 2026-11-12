# RelativeTime

> A time as people say it, "3 hours ago", with the exact date and time in a tooltip.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Data/RelativeTime

## When to use

- Anywhere an app shows when something happened: notifications, "last edited", activity, comments.

## When not to use

- Dates people need exactly, e.g. a due date or a date of birth: show the full date with the date helpers (`formatDate`).
- Someone's age: use Age.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| text | Yes | e.g. "3 hours ago", "yesterday", "in 2 days", in the surrounding text style. |
| tooltip | Yes | The full date and time, e.g. "Wednesday 11 November 2026 at 09:52". |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| date | Date \| string \| number | — | A Date, an ISO string or a timestamp. |
| now | Date | the live time | What "now" is, e.g. for tests or a fixed screenshot. |
| tooltip | (date) => string | full date and time | Tooltip text, e.g. "Edited on {date}". |

## Behaviour

- Keeps itself up to date, every 30 seconds.
- The tooltip shows on hover and on keyboard focus.

## Accessibility

- A `<time>` element with the exact `datetime`, focusable so keyboard users can reach the tooltip.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `RelativeTime.vue` | `Intl.RelativeTimeFormat`. |
| iOS (SwiftUI) | — | `Text(date, style: .relative)` or `RelativeDateTimeFormatter`; exact date in a context menu. |
| Android (Compose) | — | `DateUtils.getRelativeTimeSpanString`. |

## Tokens used

None of its own: it uses the surrounding text style, and Tooltip's.
