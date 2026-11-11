# Card

> A white panel that groups related content on a page: a form section, a summary, a stat, a table.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Element/Card, Examples/App pages

## When to use

| Use a Card for | Use instead |
|---|---|
| A section of a page or form, with a heading | Content inside a popover or slideover (they're already panels) |
| A stat or summary beside other content | A whole page's content (put it on the page background) |
| A table, at full width (`padding="none"`) | Something people press as a whole (use a Button or link) |

## Anatomy

| Part | Required | Notes |
|---|---|---|
| container | Yes | White, 1px black 15% border, 8px corners. A size container for its children. |
| title | No | Heading (h2 by default). Names the card as a region. |
| description | No | Grey text under the title. |
| actions | No | Top right, beside the title, e.g. an Edit button. |
| body | Yes | The content (default slot). |
| footer | No | Under a divider, right-aligned, e.g. Cancel / Save. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| title | string | — | Heading and accessible name. |
| description | string | — | Under the title. |
| headingLevel | 2 \| 3 \| 4 | 2 | To fit the page outline. |
| padding | md \| sm \| none | md | See Sizes. |
| as | section \| aside \| article \| div | section with a title, else div | Element to render. |
| ui | { header, body, footer } | — | Extra classes per part. |

## Sizes

| Padding | Inside | Footer padding | Use for |
|---|---|---|---|
| md | 16px; 24px from the sm breakpoint (640px) | 12px / 16px; 16px / 24px from sm | Sections, forms |
| sm | 16px | 12px / 16px | Stats, summaries |
| none | 0 | 12px / 16px | Tables, lists that run to the edges (clipped to the corners) |

| Part | Value |
|---|---|
| Gap between header and content | 16px |
| Gap between title and description | 4px |
| Title | 16px / 24px, bold |
| Description | 14px / 20px, regular, black 65% |
| Corner radius | 8px (`rounded-lg`), larger than controls' 4px, as a container |
| Border | 1px black 15% (also the footer divider) |

## States

Not interactive: one state.

## Layout

| Rule | Value |
|---|---|
| Space between cards | 16px in a grid, 24px stacked in a column |
| Background behind cards | Page background `#E1E1E1` |
| Children's layout | Use container queries (`@sm:`, `@lg:` …), so content lays out by the card's width, not the window's |

## Accessibility

| Part | Announced as |
|---|---|
| Card with a title | `region` (a `<section>`), named by its heading |
| Card without a title | Plain container, not a landmark |
| `as="aside"` | `complementary` landmark, e.g. a summary beside a form |

| Contrast | Ratio |
|---|---|
| Title on white | 19.5:1 |
| Description (black 65%) on white | about 6.5:1 |
| Card border | Decorative: the white on grey also marks the edge |

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Card.vue` | — |
| iOS (SwiftUI) | — | `GroupBox`, or a grouped `List` section with a header. |
| Android (Compose) | — | `OutlinedCard`. |

## Tokens used

| Token | Used for |
|---|---|
| color white | background |
| color black (15%) | border, footer divider |
| color black (65%) | description |

## Do / Don't

| Do | Don't |
|---|---|
| Give section cards a title, so they're findable as regions | Nest cards inside cards |
| Put a page's main actions at the top of the page | Put the page's only Save in one card's footer when it saves the whole page |
| Use `padding="none"` for tables | Wrap a table in padding and a second border |
