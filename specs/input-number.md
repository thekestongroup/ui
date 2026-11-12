# InputNumber

> A number with − and + buttons, e.g. a year group, a quantity or an amount.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/InputNumber

## When to use

- Numbers people adjust in small steps, or that have a range: year groups, quantities, amounts of money.

## When not to use

- Numbers that are really identifiers (phone numbers, student IDs, postcodes): use Input. They're never added up, and leading zeros matter.
- A one-time code: use InputCode.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label, helper, message | — | As every field (FormField). |
| box | Yes | FormField's box, laid out as [ − \| value \| + ]. |
| − / + buttons | Yes | 36px square ends of the box, divided from the value by a black 15% line, like a basic Button. |
| value | Yes | Centred, tabular figures, formatted for the locale. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | number \| undefined | — | The number; undefined when empty. |
| label | string | — | Required. |
| helper / helperPlacement | string / below \| icon | — / below | As every field. |
| errorText / status / statusText | | — | As every field. |
| min / max | number | — | The range. The − or + button is disabled at either end. |
| step | number | 1 | How much − / + and the arrow keys change the value. |
| formatOptions | Intl.NumberFormatOptions | — | How it's shown, e.g. `{ style: 'currency', currency: 'GBP' }`. |
| locale | string | browser's | Locale for formatting. |
| disabled | boolean | false | 40% opacity, not editable. |

## States

| State | Appearance | Notes |
|---|---|---|
| At min / max | That end's icon at 40% opacity, button disabled. | |
| Focused | Focus ring around the box. | |
| Error / success | Box border and message coloured. | |
| Disabled | 40% opacity. | |

## Behaviour

- Up / Down arrows step by `step`; Page Up / Page Down by more; Home / End jump to `min` / `max`.
- Typed values are kept within `min` and `max` when the field is left.
- The value is formatted when the field is left, e.g. "12.5" becomes "£12.50".

## Accessibility

- A `spinbutton` named by the label. Its value text is the number as shown (e.g. "9" or "£12.50"); without it, VoiceOver reads a value with a range as a percentage.
- The − / + buttons are labelled "Decrease" and "Increase".

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `InputNumber.vue` | Reka UI NumberField. |
| iOS (SwiftUI) | — | `TextField` with a number format and a `Stepper` beside it. |
| Android (Compose) | — | Number `TextField` with − / + icon buttons. |

## Tokens used

| Token | Used for |
|---|---|
| `color-focus` | Focus ring |
| `color-red` / `color-green` | Error / success |
