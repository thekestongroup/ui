# CardSelect

> One choice from a few, shown as side-by-side cards with a title and short description.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/CardSelect

## When to use

- Two to five options where each needs a line of explanation and seeing them together helps, e.g. a preset: Baseline, Recommended, Strict, Custom.

## When not to use

- Plain options with little or no description: use RadioGroup.
- More than five options: use Select.
- Several options at once: use CheckboxGroup.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label | Yes | The question, above the cards. The group's accessible name; can be visually hidden. |
| helper | No | Under the label, or behind a `?` (InfoTip). |
| card | Yes | One per option: optional icon, title, optional description, and a round indicator. |
| indicator | Yes | A 16px circle at the end of the card. Always present; the chosen card fills it with a dot. |
| message | No | Error text under the cards. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | string \| number | — | The chosen card's value; undefined until one is chosen. |
| label | string | — | Required. |
| options | { title, value, description?, icon?, disabled? }[] | — | Required. |
| hideLabel | boolean | false | Hide the label visually; it stays the accessible name. |
| helper / helperPlacement | string / below \| icon | — / below | As on every field. |
| errorText | string | — | |
| columns | 1 \| 2 \| 3 \| 4 | auto | Cards per row on wide screens. Auto fits as many as possible at 10rem or wider. |
| name | string | — | For native form submission. |
| required / disabled | boolean | false | |

## States

| State | Appearance | Notes |
|---|---|---|
| Not chosen | White card, 1px black 15% border, empty circle. | |
| Hovered | Elevated surface background. | Web / desktop only. Not on the chosen card. |
| Chosen | Primary border plus an inset 1px primary line, light primary tint, dot in the circle. | **Same size as not chosen.** |
| Focused | 2px focus ring, 2px out. | Keyboard only. |
| Error | Red borders on cards not chosen, red message with icon. | |
| Disabled | 40% opacity: the whole group, or one card. | |

## Spacing and layout

- Cards 8px apart; padding 12px; icon / text / circle 12px apart.
- **Choosing must never move anything.** Chosen and not chosen cards have the same border width (1px), padding, text weight and number of elements. The chosen look is colour plus an inset line drawn with a box-shadow, which takes no space, and the circle's space is always reserved.
- Cards in a row are as tall as the tallest one.

## Behaviour

- Tab moves into the group (to the chosen card, or the first) and out again; the arrow keys move and choose.
- Once chosen, a card can't be unchosen.
- Motion: the dot scales in, colours fade (150ms). Not with reduced motion.

## Content guidelines

- Titles one or two words; descriptions one short sentence, ideally the same length across cards.

## Accessibility

- `role="radiogroup"` named by the label; each card is `role="radio"`, named by its title and described by its description.
- Chosen is shown by the dot and border as well as the tint, so it doesn't rely on colour alone.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `CardSelect.vue` | Reka UI `RadioGroup`. |
| iOS (SwiftUI) | — | Selectable cards in a `ForEach` with `.accessibilityAddTraits(.isSelected)`. |
| Android (Compose) | — | `Modifier.selectable(role = Role.RadioButton)` cards. |

## Tokens used

| Token | Used for |
|---|---|
| `color-primary` | Chosen border, tint, dot |
| `color-surface-elevated` | Hover |
| `color-red` | Error |
| `color-focus` | Focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Keep every description about the same length. | Add or remove content in a card when it is chosen. |
| Use for a handful of meaningful presets. | Use for a long list. |
