# Table

> Rows of data with column headings, which people can sort: applicants, classes, invoices.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Table, Examples/App pages

## When to use

| Use a Table for | Use instead |
|---|---|
| Many records with the same fields, to compare or scan | One record's details (SummaryList) |
| Data people sort or look across by column | A few items with mixed content (a list in a Card) |
| Totals under a list of amounts | A single headline number (StatTile) |

## Anatomy

| Part | Required | Notes |
|---|---|---|
| scroll area | Yes | Scrolls sideways when the columns don't fit; up and down too with a max height. |
| caption | Recommended | Names the table. Hidden unless `showCaption`. |
| header row | Yes | Column headings, black 65%, bold. Sortable ones are buttons with a sort icon. |
| rows | Yes | One per record, with a line between. |
| row header | No | One column (usually the first, e.g. a name) can head its row. Bold. |
| footer | No | Rows in a `<tfoot>`, e.g. totals. Bold, with a line above. |
| empty / loading | No | One centred row when there are no rows. |

No border or background of its own: put it in a `Card` with `padding="none"`.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| columns | TableColumn[] | — | Required. See Columns. |
| rows | object[] | — | Required. |
| rowKey | string \| (row, index) => key | index | A unique field, so rows stay stable when sorted. |
| caption | string | — | The table's accessible name. |
| showCaption | boolean | false | Show the caption above the table. |
| sort | { key, direction } \| null | null | `v-model:sort`. |
| manualSort | boolean | false | Only report the sort (e.g. to sort on the server); don't re-order rows. |
| size | md \| sm | md | See Sizes. |
| stickyHeader | boolean | false | Keep the headings in view. Give the table a max height. |
| loading | boolean | false | No rows: a spinner. With rows: rows dimmed to 50%. |
| emptyText | string | "Nothing to show." | Slot `empty` for richer content. |
| ui | { table, header, row } | — | Extra classes per part. |

## Columns

| Field | Type | Default | Description |
|---|---|---|---|
| key | string | — | Required. The field shown, and the slot name `cell-{key}`. |
| label | string | — | Required. Heading text. |
| hideLabel | boolean | false | Heading read out but not shown, e.g. an actions column. |
| align | start \| end | start | End for numbers and amounts, so digits line up (they also use tabular figures). |
| sortable | boolean | false | Heading becomes a sort button. |
| sortValue | (row) => value | `row[key]` | What to sort by, e.g. a date's timestamp. |
| rowHeader | boolean | false | Cells are row headings (`<th scope="row">`). One column at most. |
| nowrap | boolean | true | Keep cells on one line. Turn off for long text. |
| class | string | — | Extra classes for the column, e.g. a width. |

## Sizes

| Size | Cell padding | Row height (one line) |
|---|---|---|
| md | 16px sides, 12px top and bottom | 44px |
| sm | 16px sides, 8px top and bottom | 36px |

| Part | Value |
|---|---|
| Text | 14px / 20px; headings bold, black 65%; the sorted heading black |
| Sort icon | 16px, 4px after the label; unsorted black 40% |
| Lines | 1px black 15%, under the header and between rows (not after the last) |
| Empty / loading row | 32px top and bottom, centred, black 65% |

## Sorting

| Action | Result |
|---|---|
| Click a sortable heading | Ascending, then descending, then back to the original order |
| Text | Natural order ("Year 2" before "Year 10"), ignoring case |
| Empty values | Last, whichever direction |
| Ties | Keep their original order |

## States

| State | Appearance |
|---|---|
| Heading hover | Text goes from black 65% to black |
| Heading focused | 2px focus ring `#007FC9`, 1px outside (keyboard only) |
| Scroll area focused | The same ring, 2px inside the edge so a Card's corners don't clip it (only when it scrolls) |
| Loading, no rows | 16px spinner and "Loading…" |
| Loading, with rows | Rows at 50% opacity |

## Accessibility

| Part | Announced as |
|---|---|
| Table | `table`, named by its caption; `aria-busy` while loading |
| Sortable heading | `columnheader` with `aria-sort` (none / ascending / descending), containing a button named by the label |
| Row header cells | `rowheader`, so each cell is read with its row's name |
| Scroll area (when it scrolls) | `region` named by the caption, focusable so the keyboard can scroll it |
| Icon-only cells (e.g. a ⋯ menu) | Name the button with the row, e.g. "More for Amelia Clarke" |

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Table.vue` | — |
| iOS (SwiftUI) | — | `Table` on iPad and Mac; a `List` of rows on iPhone. |
| Android (Compose) | — | A `LazyColumn` of rows; columns become label / value pairs on phones. |

## Tokens used

| Token | Used for |
|---|---|
| color black | text, sorted heading |
| color black (65%) | headings, empty text |
| color black (40%) | unsorted icon |
| color black (15%) | lines |
| color white | sticky header background |
| color focus | focus rings |

## Do / Don't

| Do | Don't |
|---|---|
| Give every table a caption | Rely on the surrounding heading alone |
| Right-align numbers and amounts | Centre-align columns |
| Make the name column the row header | Make a whole row clickable with no link or button in it |
| Use slots for Badges, links and menus | Put more than one or two actions in a row |
