---
"@thekestongroup/ui": minor
---

Table: `selectable` adds a checkbox at the start of each row and "select all" in the header, for acting on several rows. `true` for every row, or a function saying which rows can be ticked; ticked rows' keys are in `v-model:selected`, and `rowLabel` names each box for screen readers. Clicking anywhere in a checkbox's cell ticks it, without opening a clickable row.

Checkbox: `hideLabel` keeps the label for screen readers only.

Card: with `padding="none"`, the title (and its actions) keep 16px of padding, like the footer, while the content still runs to the edges.
