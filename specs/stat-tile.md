# StatTile

> One number that matters, in a small Card, with how it's changed.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Data/StatTile, Examples/App pages

## When to use

| Use a StatTile for | Use instead |
|---|---|
| Headline numbers at the top of a dashboard or app page | Several figures inside one card (SummaryList, `compact`) |
| A number with a trend ("+12% on last year") | A number over time (a chart) |

## Anatomy

| Part | Required | Notes |
|---|---|---|
| container | Yes | A Card with `padding="sm"`. |
| icon | No | 16px, before the label. Decorative. |
| label | Yes | What the number is. |
| value | Yes | The number. Shows "—" if missing. |
| change | No | Arrow, the change in bold, then what it's against, coloured by sentiment. |
| description | No | A sentence under the value. |
| footer | No | e.g. a "View all" link. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| label | string | — | Required. |
| value | string \| number | — | Already formatted ("1,204", "96%"). Slot `value` for a unit in smaller text. |
| icon | Component | — | |
| change | string | — | Already formatted, with its sign ("+12%", "−3"). |
| changeLabel | string | — | e.g. "on last year". |
| trend | up \| down \| flat | — | Sets the arrow. |
| sentiment | positive \| negative \| neutral | from trend | Sets the colour. Up is positive and down negative by default; set it when down is good (absences). |
| description | string | — | |

## Sizes

| Part | Value |
|---|---|
| Padding | 16px |
| Label | 14px / 20px, black 65%; icon 16px, 8px gap |
| Value | 24px / 32px, bold, tabular figures |
| Change | 14px; 16px arrow, 2px gap; 8px after the value, wraps under it when narrow |
| Gap between rows | 4px; footer 8px more |

## States

| Sentiment | Colour | Contrast on white |
|---|---|---|
| positive | green `#007A16` | 5.2:1 |
| negative | red `#D2042D` | 5.0:1 |
| neutral | black 65% | 6.5:1 |

## Accessibility

| Part | Announced as |
|---|---|
| Label, value | Text, in reading order (label first) |
| Arrow | Hidden; the direction is read as "Up", "Down" or "No change" before the change |
| Colour | Never the only signal: the sign and the arrow say it too |

## Layout

| Rule | Value |
|---|---|
| In a row | A grid: 1 column on phones, 2–4 as space allows, 16px gap |
| How many | 3–4 per row; more and none stands out |

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `StatTile.vue` | — |
| iOS (SwiftUI) | — | A `GroupBox` with `LabeledContent`; a `Gauge` for percentages. |
| Android (Compose) | — | An `OutlinedCard` with the same parts. |

## Tokens used

| Token | Used for |
|---|---|
| color green | positive change |
| color red | negative change |
| color black (65%) | label, neutral change, description |

## Do / Don't

| Do | Don't |
|---|---|
| Say what the change is against ("on last year") | Show a percentage with no comparison |
| Set `sentiment` when down is good | Let a fall in absences show red |
| Format numbers before passing them | Show "1204.0000" |
