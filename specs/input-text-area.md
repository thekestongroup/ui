# InputTextArea

> Several lines of plain text.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/InputTextArea

## When to use

- A reason, an address, a list with one item per line.

## When not to use

- One line: Input.
- Notes that need bold, italic or underline: InputRichText.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | string | '' | The text. |
| label | string | — | Required. |
| helper / helperPlacement | string / below \| icon | — / below | As every field. |
| hideLabel | boolean | false |  |
| errorText / status / statusText |  | — | As every field. |
| maxLength | number | — | Shows an error as soon as the text is longer. Typing is not blocked. |
| disabled | boolean | false | 40% opacity. |
| placeholder, name, rows… |  | — | Passed to the `<textarea>`. |

## Spacing and layout

- At least 4 lines (96px); grows with the text to 15 lines (320px), then scrolls. No drag handle.

## Accessibility

- A native `<textarea>` named by the label; helper and message are its description.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `InputTextArea.vue` | — |
| iOS (SwiftUI) | — | — |
| Android (Compose) | — | — |
