---
"@thekestongroup/ui": patch
---

`Table` gains `inset`, for a table under a title in a `Card` with `padding="none"`: the outer columns have 24px at the edges (from sm) and, below the last row (which keeps its line), the same space again. Without it, tables are unchanged. The row lines still run edge to edge.
