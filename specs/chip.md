# Chip

> A small item someone has chosen or entered, e.g. a recipient or a filter, optionally with × to remove it.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Chip

## When to use

- Showing chosen items in a row that wraps: Select's chosen options (`multiple`), recipients, applied filters.

## When not to use

- A status, count or category label: use Badge (fully rounded, bold, coloured by meaning).
- An action: use Button.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| container | Yes | 4px corners (as Button and Input), 1px border, light grey fill. |
| leading | No | e.g. an icon. |
| label | Yes | Short text; truncates with … if the chip is narrower than its text. |
| remove | No | × button at the right (`removable`). |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| size | sm \| md | md | See Sizes. |
| removable | boolean | false | Show × (emits `remove`). |
| removeLabel | string | Remove | Accessible name of ×, e.g. "Remove Ben Blissett". |
| removeFocusable | boolean | true | Whether Tab reaches ×. Turn off only when there's another keyboard way to remove it. |
| disabled | boolean | false | 40% opacity; × can't be pressed. |

## Sizes

| Size | Height | Padding (x) | Gap | Icon size | × button | Text style |
|---|---|---|---|---|---|---|
| sm | 20px | 6px (2px right with ×) | 4px | 12px | 16px | 12px / 16px, regular |
| md | 24px | 8px (4px right with ×) | 4px | 14px | 20px | 14px / 20px, regular |

## States

| State | Appearance | Notes |
|---|---|---|
| Enabled | Black 5% fill, black 15% border, black text. | |
| × hovered / pressed | Black 10% / 15% fill behind the ×. | |
| × focused | 2px focus ring `#007FC9`. | Keyboard only. |
| Disabled | 40% opacity. | |

## Spacing and layout

- In a row: 4px apart (`gap-1`), wrapping onto more lines with 4px between them.

## Accessibility

- Plain text, read in place. The × is a native button named by `removeLabel`; always include the item ("Remove Ben Blissett"), not just "Remove".

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Chip.vue` | — |
| iOS (SwiftUI) | — | Rounded rectangle label with an optional `xmark` button. |
| Android (Compose) | — | `InputChip` with a trailing close icon. |

## Tokens used

| Token | Used for |
|---|---|
| color black (5%) | fill |
| color black (15%) | border |
| color black (10% / 15%) | × hover / pressed |
| color focus | focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Use chips for things people chose. | Use chips for statuses (use Badge). |
| Name × after the item. | Leave × as just "Remove". |
