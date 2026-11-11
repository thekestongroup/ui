# RadioGroup

> One choice from a few options that people should see side by side.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/RadioGroup

## When to use

- Two to five options, when seeing them all helps the choice, e.g. "Mark as leavers" / "Keep on roll".

## When not to use

- More than five options, or a minor choice: use Select.
- A yes / no question: use Checkbox (in a form) or Switch (a setting).

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label | Yes | The question, above the options. The group's accessible name. |
| helper | No | Under the label, or behind a `?` (InfoTip) beside it. |
| option | Yes | A 16px circle, its label and optional description. The chosen one has an 8px primary dot. |
| message | No | Error text under the options. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | string \| number | — | The chosen option's value; undefined until one is chosen. |
| label | string | — | Required. |
| options | { label, value, description?, disabled? }[] | — | Required. |
| helper | string | — | |
| helperPlacement | below \| icon | below | As on every field. |
| errorText | string | — | |
| name | string | — | For native form submission. |
| required / disabled | boolean | false | |

Options always stack vertically: no horizontal layout, so labels and descriptions never crowd.

## States

| State | Appearance | Notes |
|---|---|---|
| Not chosen | White circle, black 55% border. | |
| Hovered | Black border. | Web / desktop only. |
| Chosen | Primary border and dot. | |
| Focused | 2px focus ring, 2px out. | Keyboard only. |
| Error | Red borders, red message with icon. | |
| Disabled | 40% opacity: the whole group, or one option. | |

## Spacing and layout

- Label to helper: 2px. Label block to options: 6px. Options: 8px apart. Circle to option label: 8px.

## Behaviour

- Tab moves into the group (to the chosen option, or the first) and out again; the arrow keys move and choose.
- The whole row is pressable: the circle, its label and its description. The description is not part of the accessible name; it stays the description.
- Once chosen, an option can't be unchosen: start with nothing chosen if "none" isn't a valid answer, or add a "None" option.

## Accessibility

- `role="radiogroup"` named by the label (`aria-labelledby`), described by helper and error; `aria-invalid` on error.
- Each option is `role="radio"`, named by its `<label>`, described by its description.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `RadioGroup.vue` | Reka UI `RadioGroup`. |
| iOS (SwiftUI) | — | `Picker` with `.inline` style in a Form. |
| Android (Compose) | — | `RadioButton` rows with `Modifier.selectableGroup()`. |

## Tokens used

| Token | Used for |
|---|---|
| `color-primary` | Chosen border and dot |
| `color-red` | Error |
| `color-focus` | Focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Keep option labels short, with detail in `description`. | Put a paragraph in the label. |
| Order options logically (most common first, or a natural order). | Order them at random. |
