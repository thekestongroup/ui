# Divider

> A thin line between groups of content, optionally with a short label in the middle.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Element/Divider

## When to use

| Use a Divider for | Use instead |
|---|---|
| Separating groups inside a Card, panel or menu | Separating whole sections of a page (use Cards, or spacing) |
| "or" between two alternative actions | A border that's part of a component (Card, Header, Slideover draw their own) |
| Vertical: between groups of toolbar buttons | |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| orientation | horizontal \| vertical | horizontal | Vertical stretches to the row's height. |
| label | string | — | Short text in the middle (horizontal only). Slot `default` for richer content. |
| decorative | boolean | true | Hidden from screen readers. False: announced as a separator. |

## Sizes

| Part | Value |
|---|---|
| Line | 1px, black 15% (the same as every border) |
| Length | Full width (horizontal) or full height of the row (vertical) |
| Label | 12px / 16px, black 65%, 12px gap to the lines either side |
| Spacing around | None built in: use the parent's `gap`, or margins (e.g. `mx-1 my-2` in a toolbar) |

## Accessibility

| Case | Announced as |
|---|---|
| Decorative (default) | Nothing (`role="none"` / `presentation`) |
| `decorative="false"` | `separator`, with `aria-orientation` (and the label as its name) |

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Divider.vue` (Reka UI Separator) | — |
| iOS (SwiftUI) | — | `Divider()` |
| Android (Compose) | — | `HorizontalDivider` / `VerticalDivider` |

## Tokens used

| Token | Used for |
|---|---|
| color black (15%) | line |
| color black (65%) | label |

## Do / Don't

| Do | Don't |
|---|---|
| Use spacing first; add a Divider when spacing alone doesn't separate enough | Put a Divider between every item in a list |
| Keep labels to a word or two ("or", "Older") | Use a Divider as a heading |
