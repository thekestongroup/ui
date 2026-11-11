# InfoTip

> A `?` that explains the thing beside it: a field's label, a table column, a figure.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Overlay/InfoTip

## When to use

- A short explanation most people won't need, beside the label it explains.
- Fields have it built in: `helperPlacement="icon"` on Input, InputNumber, InputDate, Select and RadioGroup.

## When not to use

- Anything people need to complete the task: put it on the page (e.g. helper text below the label).
- Naming an icon button: use Tooltip.
- Anything interactive: use Popover.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| button | Yes | 16px `?` icon with 2px padding, fully rounded. |
| panel | Yes | Popover panel above it, up to 256px wide, 12px text. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| text | string | — | Required. A sentence or two. |
| label | string | — | Required. Accessible name, e.g. "About attendance". |

## States

| State | Appearance | Notes |
|---|---|---|
| Enabled | Black icon. | |
| Hovered / open | Black 10% circle behind it. | |
| Focused | 2px focus ring. | Keyboard only. |

## Behaviour

- Opens on hover, and on click / tap, which keeps it open (so it works on touch). Escape or clicking outside closes it.
- Focus never moves into it, so typing in a nearby field isn't interrupted.

## Accessibility

- A button named by `label`, with `text` as its description, so screen readers hear the explanation without opening it.
- In a field, the field's control is described by the same text, so it's heard there too.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `InfoTip.vue` | Built on Popover (hover mode). |
| iOS (SwiftUI) | — | `questionmark.circle` button showing a `.popover`. |
| Android (Compose) | — | Icon button with a `RichTooltip`. |

## Tokens used

| Token | Used for |
|---|---|
| `color-focus` | Focus ring |
