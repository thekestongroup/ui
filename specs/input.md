# Input

> A single line of text: a name, an email address, a search.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/Input

## When to use

- Short free text on one line: names, email addresses, IDs, search terms.

## When not to use

- Several lines of notes: use InputRichText.
- A number someone steps through (a year group, a quantity): use InputNumber.
- A date: use InputDate.
- A password: use InputPassword. A one-time code: use InputCode.
- Choosing from a list: use Select or RadioGroup.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label | Yes | 14px, above the box. Also the input's accessible name. |
| helper | No | 12px under the label, or behind a `?` (InfoTip) beside it. |
| box | Yes | FormField's box: like a medium basic Button, 38px tall, 4px corners, 12px / 8px padding. |
| leading / trailing | No | Slots either side of the text, e.g. a search or mail icon. Icons are 16px, 70% opacity. |
| input | Yes | 14px text (16px on touch screens). Placeholder black 55%. |
| message | No | Error, success or loading text that slides open under the box. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | string | '' | The text. Use `v-model`. |
| label | string | — | Required. |
| helper / helperPlacement | string / below \| icon | — / below | Extra guidance, under the label or behind a `?`. |
| errorText | string | — | Error message, e.g. from a Zod schema. Overrides everything below. |
| status / statusText | error \| success \| loading / string | — | Colours the box and the message; `loading` shows a spinner, e.g. "Checking availability…". |
| minLength | number | — | Shows "Must be at least N characters" once the field has been left. |
| maxLength | number | — | Shows "Must be N characters or fewer" straight away. Typing isn't blocked. |
| disabled | boolean | false | 40% opacity, not editable. |

Attributes such as `type`, `name`, `placeholder` and `autocomplete` go to the `<input>`.

## States

| State | Appearance | Notes |
|---|---|---|
| Enabled | White box, black 15% border. | |
| Focused | Focus ring around the box. | |
| Error | Red border and message. | |
| Success | Green border and message. | |
| Loading | Spinner and message; border unchanged. | |
| Disabled | 40% opacity. | |

## Behaviour

- Pressing anywhere in the box, including its padding and icons, focuses the input.
- "Too short" waits until the field has been left once, so it doesn't complain while someone is still typing. "Too long" shows straight away.
- An error clears as soon as the value becomes valid.

## Content guidelines

- Label: a short noun phrase, e.g. "Email address", not a question.
- Put examples and rules in the helper, not the placeholder: placeholders vanish while typing.

## Accessibility

- The label is a real `<label>` for the input. Helper and message are its description (`aria-describedby`); the message is announced politely.
- Errors set `aria-invalid`.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Input.vue` | Built on FormField. |
| iOS (SwiftUI) | — | `TextField` with the label above; the right `textContentType` and keyboard. |
| Android (Compose) | — | `OutlinedTextField`-like field with the label above, not floating. |

## Tokens used

| Token | Used for |
|---|---|
| `color-focus` | Focus ring |
| `color-red` / `color-green` | Error / success |
