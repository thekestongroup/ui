# Checkbox

> A yes / no answer that's sent with a form, e.g. "Has a sibling at the school" or agreeing to terms.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/Checkbox

## When to use

- A single yes / no question in a form, saved with the form's Save or Submit.
- Agreeing to something before continuing.
- "Select all" over a list of other checkboxes (with the indeterminate state).

## When not to use

- A setting that takes effect straight away: use Switch.
- One choice from a few: use RadioGroup. Several choices from a long list: use Select with `multiple`.
- Showing progress people don't tick themselves: use Checklist.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| box | Yes | 16px square, 4px corners, 1px border. Ticked: primary fill, white tick. |
| label | Yes | Beside the box. Pressing it ticks the box too. |
| description | No | Smaller text under the label. |
| message | No | Error text under it all, sliding open like a field's. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | boolean \| 'indeterminate' | false | Ticked or not; 'indeterminate' shows a dash. |
| label | string | — | Required. Also the accessible name. |
| description | string | — | |
| errorText | string | — | Shows the error state and message. |
| name / value | string | — / "on" | For native form submission. |
| required | boolean | false | |
| disabled | boolean | false | |

No sizes or variants.

## States

| State | Appearance | Notes |
|---|---|---|
| Unticked | White box, black 55% border. | Darker than a text box's border, so the box meets 3:1 contrast. |
| Hovered | Black border. | Web / desktop only. |
| Ticked | Primary fill and border, white tick. | |
| Indeterminate | Primary fill and border, white dash. | Pressing it ticks it. |
| Focused | 2px focus ring, 2px out. | Keyboard only. |
| Error | Red border, red message with icon. | |
| Disabled | 40% opacity. | |

## Spacing and layout

- Box to label: 8px. Label to description: 2px. The box is 2px down, level with the label's first line (20px).
- Stacked checkboxes: 8px apart. Children of a "select all": indented 24px (box + gap).

## Behaviour

- Space ticks / unticks. Pressing the box or label does the same.
- The whole row is pressable: the box, its label and its description. The description is not part of the accessible name; it stays the description.

## Accessibility

- Native semantics: `role="checkbox"` with `aria-checked` (`mixed` when indeterminate), named by its `<label>`.
- Description and error are linked with `aria-describedby`; errors set `aria-invalid` and are announced.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Checkbox.vue` | Reka UI `Checkbox`. |
| iOS (SwiftUI) | — | `Toggle` with a checkbox style (iOS has no native checkbox). |
| Android (Compose) | — | `Checkbox` / `TriStateCheckbox` in a row with the label. |

## Tokens used

| Token | Used for |
|---|---|
| `color-primary` | Ticked fill and border |
| `color-red` | Error border and text |
| `color-focus` | Focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Word the label so ticked means yes ("Send reminders"). | Use negatives ("Don't send reminders"). |
| Use one checkbox per question. | Use two checkboxes for "Yes" and "No": that's a RadioGroup. |
