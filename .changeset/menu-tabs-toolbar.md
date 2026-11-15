---
"@thekestongroup/ui": minor
---

Add Menu: more actions behind an icon-only ghost "⋯" button, e.g. on each row of a table, built on Reka UI's DropdownMenu. Items run `onSelect` or are links (`href`, or `to` through `linkComponent`), with an optional icon; arrow keys move between them and Escape closes the menu.

Add Tabs: sections of one page, one shown at a time, built on Reka UI's Tabs. Each tab's content goes in a slot named after its value; `v-model` is the open tab. The chosen tab is primary with a bar under it that slides between tabs.

PageHeader: a `toolbar` of everyday actions under the title (e.g. Reset password, Block sign-in), as ghost buttons in a white bar like a Card, separate from the main action on the right.

Input, InputNumber, InputDate, InputPassword, InputRichText and Select: `hideLabel` keeps the label (and helper) for screen readers only, for tables of fields with column headings.
