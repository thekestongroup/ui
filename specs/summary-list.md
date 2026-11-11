# SummaryList

> Labelled values: a record's details, figures in a summary, or answers to check before submitting.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Data/SummaryList, Examples/App pages

## When to use

| Use a SummaryList for | Use instead |
|---|---|
| One record's details ("Email: …", "Year group: …") | Many records (Table) |
| Checking answers before submitting, with a Change per row | Editing (form fields) |
| A few figures in a summary card (`compact`) | One headline number (StatTile) |

## Layouts

| Layout | Looks like | Use for |
|---|---|---|
| rows (default) | Label left, value beside it, a line between rows. Label above value when the container is under 384px. | Details, check your answers |
| compact | Label left, value right-aligned and bold, no lines | Figures in a sidebar or summary card |
| stacked | Label above value; 1 column, 2 from 384px, 3 from 672px (container width) | Lots of short facts |

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label | Yes | Black 65%. |
| value | Yes | Text, or the `value` slot (Badge, link). Empty shows "—". |
| description | No | Grey text under the value. |
| action | No | Slot, e.g. a "Change" button, at the end of the row. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| items | { label, value?, description?, emphasis? }[] | — | Required. `emphasis` makes the value bold, e.g. a total. |
| layout | rows \| compact \| stacked | rows | |
| labelWidth | sm \| md \| lg | md | Label column in `rows`: 128 / 192 / 256px. |
| emptyLabel | string | "Not set" | What screen readers hear for an empty value. |

## Sizes

| Part | Value |
|---|---|
| Text | 14px / 20px |
| rows | 12px above and below each row; the first and last flush with the container; 16px between columns; 4px label to value when stacked |
| compact | 8px between rows, 16px between columns |
| stacked | 4px label to value; 16px between rows, 24px between columns |
| Lines (rows) | 1px black 15% |
| Empty value | "—", black 40% |

## Accessibility

| Part | Announced as |
|---|---|
| List | Description list (`<dl>`), each label a term and each value its definition |
| Pairs | Each pair is wrapped together, so they're read together |
| Empty value | "Not set" (the dash is hidden) |
| Change action | Add the row to the button's name, e.g. "Change<span class="sr-only"> email</span>" |

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `SummaryList.vue` | — |
| iOS (SwiftUI) | — | `LabeledContent` rows in a `Form` or `List` section. |
| Android (Compose) | — | `ListItem` with `overlineContent` (label) and `headlineContent` (value). |

## Tokens used

| Token | Used for |
|---|---|
| color black | values |
| color black (65%) | labels, descriptions |
| color black (40%) | empty dash |
| color black (15%) | lines |

## Do / Don't

| Do | Don't |
|---|---|
| Keep labels short and values scannable | Put paragraphs in values |
| Use `compact` for numbers, so they line up on the right | Use `compact` for long text values |
| Say which row a Change button is for | Have several "Change" buttons with the same name |
