# CheckboxGroup

> Several yes / no answers under one question; any number can be ticked.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/CheckboxGroup

## When to use

- "Which licences should they have?", "Send to": two to about eight independent options.

## When not to use

- One choice from a few: RadioGroup.
- More than about eight options: Select with `multiple`.
- One yes / no: Checkbox.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | (string \| number)[] | [] | The values of the ticked options. |
| label | string | — | Required. The question; the group's accessible name. |
| options | { label, value, description?, disabled? }[] | — | Required. |
| helper / helperPlacement | string / below \| icon | — / below | As every field. |
| hideLabel | boolean | false | Label for screen readers only. |
| errorText | string | — | e.g. "Choose at least one". |
| disabled | boolean | false | Every option. |

## Spacing and layout

- Label to helper: 2px. Question to options: 6px. Options: 12px apart.

## Accessibility

- `role="group"` named by the label, described by helper and error; `aria-invalid` on error.
- Each option is a Checkbox: Tab moves between them, Space ticks.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `CheckboxGroup.vue` | — |
| iOS (SwiftUI) | — | — |
| Android (Compose) | — | — |
