# Switch

> Turns a setting on or off straight away, with no Save button.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/Switch

## When to use

- Settings and preferences that apply as soon as they're flipped, e.g. "Email me when an application arrives".

## When not to use

- A yes / no answer saved with a form: use Checkbox. Mixing the two in one form makes people unsure what's saved.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| track | Yes | 36 × 20px, fully rounded. Off: black 45%. On: primary. |
| thumb | Yes | 16px white circle, slides 16px. |
| label | Yes | Beside the switch. Pressing it flips the switch too. |
| description | No | Smaller text under the label. |
| message | No | How saving went: "Saving…", "Saved", or an error. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| modelValue | boolean | false | On or off. |
| label | string | — | Required. |
| description | string | — | |
| errorText | string | — | Overrides `status` / `statusText`. |
| status | error \| success \| loading | — | As the change saves immediately, show how it went. |
| statusText | string | — | |
| name | string | — | |
| disabled | boolean | false | |

## States

| State | Appearance | Notes |
|---|---|---|
| Off | Black 45% track, thumb at the left. | Dark enough to meet 3:1 contrast. |
| On | Primary track, thumb at the right. | |
| Hovered | Off: black 55% track. | Web / desktop only. |
| Focused | 2px focus ring, 2px out. | Keyboard only. |
| Saving | Spinner and "Saving…" under it. | `status="loading"`. |
| Error | Red message; put the switch back if the save failed. | |
| Disabled | 40% opacity. | |

## Spacing and layout

- Switch to label: 8px. The switch sits on the left, like Checkbox, so a column of settings lines up.
- A list of settings: 16px apart.

## Behaviour

- Space or Enter flips it. The thumb slides in 150ms (none with reduced motion).
- The whole row is pressable: the switch, its label and its description. The description is not part of the accessible name; it stays the description.
- Save on change. If saving fails, put the switch back and say so.

## Accessibility

- `role="switch"` with `aria-checked`, named by its `<label>`; description and status linked with `aria-describedby`, status announced politely.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Switch.vue` | Reka UI `Switch`. |
| iOS (SwiftUI) | — | `Toggle` (switch on the right, as iOS expects). |
| Android (Compose) | — | `Switch` in a row with the label. |

## Tokens used

| Token | Used for |
|---|---|
| `color-primary` | On track |
| `color-white` | Thumb |
| `color-focus` | Focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Label the setting, not the action ("Weekly summary"). | Write "Turn on weekly summary". |
| Show "Saving…" and confirm. | Leave people wondering whether it saved. |
