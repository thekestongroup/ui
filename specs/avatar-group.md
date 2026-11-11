# AvatarGroup

> Several people as overlapping avatars, each with a profile on hover, with the rest as "+N".

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/AvatarGroup

## When to use

| Use an AvatarGroup for | Use instead |
|---|---|
| Who's involved: a class's teachers, who can sign off, who's editing | A list people need to read or act on (use a table or list) |

## Anatomy

| Part | Required | Notes |
|---|---|---|
| avatars | Yes | Avatar each (with `profile` by default), overlapping, each with a white ring. |
| counter | No | "+N" circle in surface grey, when there are more than `max`. Opens a list of the rest. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| users | AvatarUser[] | — | Required. |
| size | xs \| sm \| md \| lg \| xl | md | As Avatar. |
| max | number | 4 | Avatars shown before "+N". If only one would be hidden, all are shown ("+1" saves no space). |
| profile | boolean | true | Profile card on each avatar. |
| label | string | "{n} people" | Name of the group for screen readers. |

## Sizes

| Size | Avatar | Overlap | Ring | Counter text |
|---|---|---|---|---|
| xs | 20px | 2px | 1px | 12px |
| sm | 28px | 4px | 2px | 12px |
| md | 36px | 6px | 2px | 12px |
| lg | 48px | 8px | 2px | 14px |
| xl | 64px | 12px | 2px | 16px |

Overlaps are as large as they can be without the ring reaching the initials. "+N" list: 224px wide, up to 288px tall then scrolls; a 20px avatar, name and role per person.

## Behaviour

| Action | Result |
|---|---|
| Hover or focus an avatar | It comes to the front (its ring and focus outline show), and its profile opens |
| Hover, click or Enter on "+N" | A list of everyone not shown |

## Accessibility

| Part | Announced as |
|---|---|
| Group | `group` named by `label` ("7 people") |
| Each avatar | As Avatar with `profile` |
| Counter | Button named "{n} more: {names}" |

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `AvatarGroup.vue` | — |
| iOS (SwiftUI) | — | `HStack(spacing: -overlap)` of avatars; tap opens a sheet listing everyone. |
| Android (Compose) | — | `Row` with negative spacing; tap opens a bottom sheet listing everyone. |

## Tokens used

| Token | Used for |
|---|---|
| color white | rings |
| color surface | counter background |
| color primary | avatars |

## Do / Don't

| Do | Don't |
|---|---|
| Give the group a label that says who they are ("People who can sign off") | Rely on "{n} people" where the context isn't clear |
| Keep `max` small (3–5) | Show twenty overlapping avatars |
