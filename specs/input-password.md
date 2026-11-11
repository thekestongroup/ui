# InputPassword

> A password field with a Show / Hide button, for signing in and choosing a password.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/InputPassword

## When to use

- Signing in, confirming an action with a password, or choosing a new password.

## When not to use

- One-time codes from an authenticator app, email or SMS: they aren't secret once used, and people need to see what they type.
- Recovery codes, API keys and other secrets that are shown once: show them as text with a copy button.
- Anything that isn't a password: use Input.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label, helper, message | — | As every field (FormField). |
| box | Yes | FormField's box. |
| leading icon | No | e.g. a lock. |
| input | Yes | Dots while hidden, plain text while shown. |
| toggle | Yes | Square end segment, divided by a black 15% line, like InputNumber's + button. Eye while hidden, eye with a slash while shown. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | string | '' | The password. |
| label | string | — | Required. |
| helper / helperPlacement | string / below \| icon | — / below | As every field. Put password rules here when choosing one. |
| errorText / status / statusText | | — | As every field. Each overrides the Caps Lock note. |
| disabled | boolean | false | 40% opacity, not editable, toggle disabled. |
| autocomplete (attribute) | string | current-password | Pass `new-password` when choosing a password. |

## States

| State | Appearance | Notes |
|---|---|---|
| Hidden | Dots, eye icon. | Default. |
| Shown | Plain text, eye-with-slash icon. | Toggle is pressed. |
| Caps Lock on | "Caps Lock is on" under the field, no colour. | While focused, from the first key press. |
| Focused | Focus ring around the whole box. | |
| Error / success | Box border and message coloured. | |
| Disabled | 40% opacity. | |

## Behaviour

- Pressing the toggle shows or hides the password and leaves focus and the caret in the input. It is in the tab order after the input.
- The password is hidden again when its form is submitted.
- Spellcheck, autocorrect and autocapitalise are off, so the password isn't sent to a spelling service or changed while shown.
- Caps Lock can only be detected from a key press, so the note appears on the first key and clears when the field loses focus.

## Accessibility

- The input is named by the label; helper and message are its description.
- The toggle is a button named "Show password" with `aria-pressed` and `aria-controls` pointing at the input.
- The Caps Lock note is announced politely, like every field message.

## Security

- Never prefill the value from the server, or log it.
- Don't block paste: it stops people using password managers.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `InputPassword.vue` | — |
| iOS (SwiftUI) | — | `SecureField` swapped with `TextField` by the toggle; `.textContentType(.password / .newPassword)`. No Caps Lock note. |
| Android (Compose) | — | `TextField` with `PasswordVisualTransformation` and a trailing icon button; `KeyboardType.Password`. No Caps Lock note. |

## Tokens used

| Token | Used for |
|---|---|
| `color-focus` | Focus ring |
| `color-red` / `color-green` | Error / success |

## Do / Don't

| Do | Don't |
|---|---|
| Say what's wrong after a failed sign-in without saying which of email or password it was. | Add a second "confirm password" field: the toggle lets people check what they typed. |
