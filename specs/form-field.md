# FormField

> The shell around every text-like field: label, helper, the bordered box, and the status message underneath.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/FormField

## When to use

- Building a text-like control the library doesn't have yet (e.g. a textarea), so it looks and behaves like Input.

## When not to use

- Anything the library already has: Input, InputNumber, InputDate, Select. They're built on it.
- Checkbox, RadioGroup and Switch: they have no box, but share the same status message.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label | Yes | 14px, above the box. |
| helper | No | 12px below the label, or behind a `?` (InfoTip) beside it. |
| box | Yes | Like a medium basic Button: 1px black 15% border, 4px corners, 12px / 8px padding. Text 14px, or 16px on touch screens. |
| leading / trailing | No | Slots either side of the control, e.g. icons. |
| control | Yes | Default slot; receives `id`, `labelId`, `describedBy` and `invalid` to put on it. |
| message | No | Status text and icon, sliding open under the box. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| label | string | — | Required. |
| helper | string | — | |
| helperPlacement | below \| icon | below | |
| errorText | string | — | Error state and message. Overrides `status` / `statusText`. |
| status | error \| success \| loading | — | |
| statusText | string | — | |
| disabled | boolean | false | 40% opacity. |

## Behaviour

- Pressing the box's padding or icons focuses the control.
- The focus ring shows on the box when the control has keyboard focus.
- The message opens in 150ms then fades in; it fades out then closes. No motion with reduced motion.
- On touch screens the text is 16px, so iPhone doesn't zoom the page in when a field is tapped. Pinch-zoom is never blocked: people who need larger text rely on it.

## Accessibility

- The `<label>` names the control. Helper and message are linked with `aria-describedby`; the message is announced politely.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `FormField.vue` | — |
| iOS (SwiftUI) | — | A view wrapping the label, control and message. |
| Android (Compose) | — | `supportingText` / `isError` on `OutlinedTextField`. |
