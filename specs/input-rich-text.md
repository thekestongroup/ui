# InputRichText

> Several lines of text with bold, italic and underline, e.g. notes on a student or an application.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/InputRichText

## When to use

- Notes and comments where people want to stress a word or two.

## When not to use

- A single line: use Input.
- Plain text that's processed or exported (an address, a reason code): a plain text field, as formatting would be lost or get in the way.
- Documents with headings, lists or links: not supported on purpose, so notes look the same everywhere.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label, helper, message | — | As every field (FormField). |
| box | Yes | FormField's box, holding the toolbar and the text area edge to edge. |
| toolbar | Yes | Bold, Italic, Underline: small square ghost Buttons, 6px padding, black 15% line under it. |
| text area | Yes | 12px / 8px padding, 14px text. At least 4 lines (96px); grows to 15 lines (320px), then scrolls. |
| placeholder | No | Black 55%, in the empty text area. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | string (HTML) | '' | Only `<p>`, `<br>`, `<strong>`, `<em>`, `<u>`. Empty is `''`. |
| label | string | — | Required. |
| helper / helperPlacement | string / below \| icon | — / below | As every field. |
| errorText / status / statusText | | — | As every field; `loading` suits saving as you type. |
| placeholder | string | — | e.g. "Add a note…". |
| disabled | boolean | false | 40% opacity, not editable. |

## States

| State | Appearance | Notes |
|---|---|---|
| Format on | Black 15% fill behind the button. | Follows the text at the cursor. |
| Focused | Focus ring around the whole box. | |
| Error / success | Box border and message coloured. | |
| Disabled | 40% opacity. | |

## Behaviour

- ⌘B / ⌘I / ⌘U (Ctrl on Windows and Linux) toggle formatting; ⌘Z undoes.
- Pressing a toolbar button keeps focus and the selection in the text.
- Enter starts a new paragraph (8px apart); Shift+Enter a line break.
- Pasted text keeps bold, italic and underline only.

## Accessibility

- The text area is `role="textbox"` with `aria-multiline`, named by the label; helper and message are its description.
- The toolbar is `role="toolbar"` named "Formatting for {label}". Buttons use `aria-pressed` and `aria-keyshortcuts`, with a Tooltip showing the shortcut.
- Pressing the label focuses the text area.

## Security

The value is HTML from the browser. Sanitise it on the server (allow only `p`, `br`, `strong`, `em`, `u`) before storing or showing it anywhere else.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `InputRichText.vue` | Tiptap (ProseMirror) with only these marks. |
| iOS (SwiftUI) | — | `TextEditor` with `AttributedString` (iOS 26), or a `UITextView` wrapper; formatting from the edit menu and ⌘B / ⌘I / ⌘U. |
| Android (Compose) | — | `BasicTextField` with a rich-text state library; same three marks. |

## Tokens used

| Token | Used for |
|---|---|
| `color-focus` | Focus ring |
| `color-red` / `color-green` | Error / success |
