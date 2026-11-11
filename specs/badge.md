# Badge

> A small label for a status, count or category.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Badge

## When to use

- Showing a status ("Paid", "Overdue"), a count (unread messages) or a category ("Year 9") next to the thing it describes.

## When not to use

- Anything people can press (use Button).
- Long messages or explanations (use text, or a callout).

## Anatomy

| Part | Required | Notes |
|---|---|---|
| container | Yes | Pill shape with a 1px border. |
| label | Yes | Short text or a number. |
| leading | No | e.g. an icon. |
| trailing | No | e.g. an icon. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| color | basic \| primary \| red \| green \| blue \| orange | basic | Colour, by meaning (see Variants). |
| size | sm \| md \| lg | md | |

## Variants

| Color | Use for | Example |
|---|---|---|
| basic | Neutral information, categories, counts | Year 9, 28 students |
| primary | Emphasis | New |
| green | Positive, done | Paid, Enrolled |
| blue | Informational, ongoing | In progress |
| orange | Needs attention soon | Due soon |
| red | A problem | Overdue |

## Sizes

| Size | Height | Padding (x) | Gap | Icon size | Text style |
|---|---|---|---|---|---|
| sm | spacing 5 (20px) | spacing 1.5 | spacing 1 | 12px | xs, bold |
| md | spacing 6 (24px) | spacing 2 | spacing 1 | 14px | xs, bold |
| lg | spacing 7 (28px) | spacing 2.5 | spacing 1.5 | 16px | sm, bold |

## States

Not interactive: one state only.

## Content guidelines

- One or two words, sentence case ("Due soon", not "DUE SOON").
- Never wraps; keep it short rather than truncating.

## Accessibility

- Plain text (`<span>`), read in place with the surrounding content.
- Colour must not be the only signal: the text says what the colour means.
- White text on every solid colour meets WCAG AA (4.5:1 or more).

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Badge.vue` | — |
| iOS (SwiftUI) | — | Capsule-shaped Text. |
| Android (Compose) | — | Badge / AssistChip (non-clickable). |

## Tokens used

| Token | Used for |
|---|---|
| color white, black | basic background, text |
| color black (15%) | border |
| color primary, green, blue, orange, red | solid backgrounds |

## Do / Don't

| Do | Don't |
|---|---|
| Pick the colour by meaning. | Use colours for decoration, or make them clickable. |
