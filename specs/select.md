# Select

> Choose one or more options from a list that opens below the field.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Select

## When to use

| Use Select for | Use instead |
|---|---|
| One of about 4–30 known options: year group, school, subject | 2–3 options that should all be visible: radio buttons |
| Longer lists (about 10 or more): `searchable` | Lists too long to load, or searched on the server: a server-backed search |
| Several options from a list (`multiple`): subjects, recipients | Several from 2–6 options that should all be visible: checkboxes |
| Trees of options (`children`): Classes › Year 8 › 11Y/En2 › student | Navigating or running actions: a menu |

## Modes

Combine freely, e.g. searchable + multiple + nested.

| Mode | Prop | The field is | Web implementation |
|---|---|---|---|
| Single | — | A button showing the chosen option | Reka UI Select |
| Searchable | `searchable` | A text box that filters the list | Reka UI Combobox |
| Multiple | `multiple` | Chips for the chosen options | Either |
| Nested | `children` on options | (as above) | Either |

## Anatomy

| Part | Required | Notes |
|---|---|---|
| label | Yes | Above the field. Also its accessible name. |
| helper | No | Below the label, or behind a `?` icon. |
| field | Yes | Same box as Input: shows the chosen option (or placeholder) and a chevron. When searchable it is a text box. |
| leading | No | The chosen option's icon, or slot `leading`. |
| list | Yes (when open) | Floating panel with the options, styled like Popover. |
| group heading | No | Small bold uppercase heading, with an optional icon; groups are separated by a line. |
| option | Yes | Label (required), with an optional description under it and an optional icon before it, in any combination. A tick marks the chosen one. |
| back row | Nested only | First row inside a nested level: ‹ and the level's name (bold), then a divider. Goes up one level. |
| chosen chips | Multiple only | A small Chip (20px, 4px corners, with the option's icon) per chosen option, in the field, wrapping onto more lines. When searchable each has × to remove it. |
| empty message | Searchable only | "No matches" when a search finds nothing. |
| status message | No | Error or success message under the field, as on Input. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| label | string | — | Required. |
| modelValue | string \| number, or an array of them when `multiple` (v-model) | — | The chosen value; undefined when nothing is chosen. With `multiple`, the chosen values in the order they were chosen ([] when none). |
| multiple | boolean | false | Choose any number of options. |
| options | (string \| { label, value?, description?, icon?, disabled?, children? })[] | [] | Options in one list. A string is both label and value. Only the label and icon show in the field once chosen. `value` defaults to the label. An option with `children` opens them instead of being chosen. |
| groups | { label?, icon?, options }[] | [] | Options under headings, shown after `options`. |
| searchable | boolean | false | Type in the field to filter the options. |
| placeholder | string | Choose… (Search… when searchable) | Shown when nothing is chosen. |
| emptyText | string | No matches | Shown when a search finds nothing. |
| helper / helperPlacement | string / below \| icon | — / below | As on Input. |
| errorText / status / statusText | | | As on Input. |
| name / required | string / boolean | — | For native form submission and validation. |
| disabled | boolean | false | |

## Sizes

One size, matching Input and a md Button.

| Part | Height | Padding (y / x) | Gap | Icon | Text style |
|---|---|---|---|---|---|
| field | 38px (+24px per extra line of chips) | 8px / 12px | 8px | 16px (70% opacity) | 14px / 20px, regular |
| list panel | up to the space available | 4px | 2px between options | — | — |
| scrollbar | — | — | — | — | Thin system scrollbar when the list scrolls. |
| option | 32px with a label only; 48px with a one-line description (+16px per extra line) | 6px / 8px | 8px | 16px, level with the label | label 14px / 20px (bold when chosen); description 12px / 16px, black 65%, wraps |
| chip (multiple) | 20px | — / 6px | 4px between chips | 12px; × 16px | 12px / 16px, regular |
| label to field | — | — | 6px | — | — |
| group heading | 24px | — / 8px | 6px | 14px, black 65% | 12px / 16px, bold, uppercase, black 65% |
| group divider | 1px | 2px above and below | — | — | black 15%; full width of the panel |

| Panel | Value |
|---|---|
| Minimum width | The field's width |
| Maximum width | 320px, or the field's width if wider; longer text wraps |
| Position | 5px below the field; above it if there's no room below |
| Height | Up to the space available on screen, then scrolls |

## Typography

Lato, sentence case, no letter spacing.

| Text | Size / line height | Weight | Colour |
|---|---|---|---|
| Label, chosen option, option label | 14px / 20px | 400 (option label 700 when chosen) | black `#050505` |
| Placeholder | 14px / 20px | 400 | black 55% |
| Back row | 14px / 20px | 700 | black |
| Option description, search path | 12px / 16px | 400 | black 65% |
| Group heading | 12px / 16px | 700, uppercase | black 65% |
| Chip | 12px / 16px | 400 | black |
| Helper, status message | 12px / 16px | 400 | black 65% / red / green |

## States

| State | Appearance | Notes |
|---|---|---|
| Enabled | White field, black 15% border. Placeholder in black 55%. | |
| Focused | 2px focus ring `#007FC9`, 1px outside the border. | |
| Open | Chevron turns over (150ms); list fades in. | |
| Option highlighted | Black 10% fill. | Mouse hover or arrow keys. |
| Option chosen | Bold, with a tick at the right. | |
| Option disabled | 40% opacity, can't be chosen. | |
| Parent option | › at the right instead of ✓. | Nested. |
| Chip | Black 5% fill, black 15% border; × darkens to black 10% on hover. | Multiple. |
| Error / success | Red / green border and message, as on Input. | |
| Disabled | 40% opacity, not-allowed cursor. | |

## Behaviour

### Keyboard

| Key | Closed | Open |
|---|---|---|
| Enter / Space | Opens | Chooses (Space: not when searchable) |
| ↓ / ↑ | Opens | Moves |
| Home / End | — | First / last option |
| Letters | Chooses the next option starting with them, without opening; searchable: opens and filters | Highlights the next option starting with them; searchable: filters |
| → | — | Opens the highlighted parent (searchable: only while nothing is typed) |
| ← | — | Back one level (searchable: only while nothing is typed) |
| Backspace | — | Searchable multiple, empty search box: removes the last chip |
| Escape / Tab | — | Closes |

### Pointer and choosing

| Action | Single | Multiple |
|---|---|---|
| Press the field | Opens the list | Opens the list |
| Press an option | Chooses it, closes, focus back on the field | Ticks or unticks it; the list stays open |
| Press outside | Closes | Closes |
| × on a chip | — | Removes it (searchable only; without search, untick in the list) |
| v-model | The value, or undefined | An array in the order chosen; `[]` when none |

### Searchable

| Action | Result |
|---|---|
| Type | Opens the list; keeps options whose label or description contains the text, ignoring case and accents |
| Groups with no matches | Hidden, with their divider |
| Nothing matches | "No matches" (`emptyText`) |
| Press or focus the field | Selects its text, so typing replaces it |
| Leave the field | Shows the chosen label again, or clears if nothing is chosen |
| Tick (multiple) | The search clears, ready for the next |

### Nested

| Action | Result |
|---|---|
| Choose a parent (›), or → | Shows its children, with a back row (‹ and the level's name, bold) and a divider at the top |
| Choose the back row, or ← | Goes up one level |
| After opening a level | Highlight on its first option |
| After going back | Highlight on the option just left |
| Reopen | Single: starts at the chosen option's level. Multiple: starts at the top |
| Search | Searches every level; each match shows its path ("Classes › Year 8 › 11Y/En2"); the path is searched too |
| Field | Shows only the chosen label, not its path |

### Shared options

The same option in several places (e.g. a student in two classes) must have the same `value`.

| Where | Result |
|---|---|
| Chosen in one place | Ticked everywhere it appears |
| Field (multiple) | One chip |
| Chosen again anywhere | Unticks it, so it can't be added twice |
| Search | One row, listing every place: "Classes › Year 8 › 11Y/En2 · Classes › Year 8 › 8X/Ma1" |

### Motion

| What | Duration | Easing |
|---|---|---|
| List fades in / out | 150ms | ease-in-out |
| Chevron turns over | 150ms | ease-in-out; none with reduced motion |
| Status message opens / closes | 150ms + 150ms text fade | ease-out (as Input) |

## Content guidelines

| Text | Guideline | Example |
|---|---|---|
| Label | Says what is being chosen | "Year group", not "Select year group" |
| Options | Sentence case, in a sensible order (natural, else alphabetical) | Year 7, Year 8, Year 9 |
| Placeholder | A prompt, never an option | "Choose…", "Search…" |

## Accessibility

| Part | Announced as |
|---|---|
| Field | `combobox` named by `<label for>`: a button, or a text input with `aria-autocomplete="list"` when searchable |
| Helper / status message | Linked with `aria-describedby`; errors set `aria-invalid` |
| List | `listbox` of `option`s; groups named by their heading |
| Parent option | "{label}, more options" |
| Back row | "Back from {level}" |
| Chip × | "Remove {label}" |
| While open | The rest of the page is hidden from screen readers and can't be focused |

| Contrast | Ratio |
|---|---|
| Text on white | 19.5:1 |
| Placeholder (black 55%) on white | about 4.5:1 |
| Focus ring on white | 4.1:1 (minimum 3:1) |

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Select.vue` (Reka UI Select; Combobox when searchable) | — |
| iOS (SwiftUI) | — | `Picker` with `.menu` style inside a labelled row; searchable: a pushed list with `.searchable`. |
| Android (Compose) | — | `ExposedDropdownMenuBox` (read-only; editable when searchable). |

## Tokens used

| Token | Used for |
|---|---|
| color white, black | field and list background, text |
| color black (15%) | borders, group separators |
| color black (10%) | highlighted option, chip × hover |
| color black (5%) | chip fill |
| color focus | focus ring |
| color red / green | error / success border and message |

## Do / Don't

| Do | Don't |
|---|---|
| Keep lists short enough to scan, make them searchable, or nest them (e.g. year › class › student). | Use a select for 2 options (use radios). |
| Give options with icons a label too. | Put actions ("Add new…") among the options. |
| Give every option in a list an icon, or none. Descriptions can vary per option. | Mix options with and without icons: the labels won't line up, and indenting them makes them look nested. |
| Use the same `value` for the same thing in several places. | Give each copy its own value: it will be treated as a different option. |
