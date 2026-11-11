# InputCode

> A one-time code from an authenticator app, an email or a text message, with one box per character.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/InputCode

## When to use

- Two-step sign-in, confirming an email address or phone number, backup codes.

## When not to use

- Passwords and PINs people choose themselves: use InputPassword.
- Long or variable-length values (reference numbers, IDs): use Input.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label, helper, message | — | As every field. |
| boxes | Yes | One 40×40px box per character, 8px apart; border like FormField's box. 18px tabular figures, centred. A faint dot in empty boxes. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | string | '' | The code so far, e.g. "042317". |
| label | string | — | Required. Say where the code comes from. |
| helper / helperPlacement | string / below \| icon | — / below | e.g. where it was sent and when it expires. |
| length | number | 6 | Number of boxes. |
| alphanumeric | boolean | false | Allow letters (upper-cased). Digits only otherwise. |
| errorText / status / statusText | | — | As every field; `loading` while the code is checked. |
| name | string | — | Sends the code with a native form. |
| disabled | boolean | false | 40% opacity, not editable. |

| Event | Payload | When |
|---|---|---|
| complete | string | Every box is filled. |

## States

| State | Appearance | Notes |
|---|---|---|
| Empty | Faint dot in each box. | |
| Focused | Focus ring around the box being typed in. | |
| Checking | Spinner and message below. | Usually disabled while checking. |
| Error / success | Every box's border and the message coloured. | |
| Disabled | 40% opacity. | |

## Behaviour

- Typing fills a box and moves to the next; Backspace clears and moves back; arrow keys move between boxes.
- Pasting a code, or picking the one the phone's keyboard suggests from a message (`autocomplete="one-time-code"`), fills every box.
- Characters that can't be in the code are ignored. Letters are upper-cased.
- When the last box is filled, `complete` fires: check the code then, with no separate button needed (keep one for people who prefer it).
- After a failed check, clear the boxes so the next attempt starts from the first.

## Content guidelines

- Label: where the code is, e.g. "Code from your authenticator app", "Code from your email".
- Helper: where it was sent (partly hidden) and how long it lasts.
- Error: "That code didn't work. Check it and try again." Don't say whether it was wrong or expired.

## Accessibility

- The boxes are a group named by the label. The first box is named by the label too; the others are "Character 2 of 6" and so on.
- Helper and message describe every box; the message is announced politely.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `InputCode.vue` | Reka UI PinInput. |
| iOS (SwiftUI) | — | One hidden `TextField` with `.textContentType(.oneTimeCode)` drawn as boxes, so SMS autofill works. |
| Android (Compose) | — | One `BasicTextField` drawn as boxes; SMS User Consent / Retriever API for autofill. |

## Tokens used

| Token | Used for |
|---|---|
| `color-focus` | Focus ring |
| `color-red` / `color-green` | Error / success |
