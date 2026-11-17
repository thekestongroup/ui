# @thekestongroup/ui

## 0.9.2

### Patch Changes

- 12e5ebd: `Steps` and `Slideover` (with `steps`) now show "Step 2 of 3: Licences" above the progress bar instead of below it. `Checklist` has an `invalid` prop that turns the circles of items not done yet red (for a form submitted without meeting them).
  
  `Header`'s account menu shows the full name, email and organisation on hover (a `title`), since they're cut short when long.

## 0.9.1

### Patch Changes

- 614b101: `Table` with `rowLink`: in Safari (iPhone, iPad, Mac) tapping any row, or the header, opened the last row's link. Each cell now holds its own overlay instead of one stretched across the row, so a row's link only covers that row in every browser.

## 0.9.0

### Minor Changes

- b08ef75: Languages: components now take their words from vue-i18n, and there's a language switcher. **Breaking:** apps must install `vue-i18n` (11 or later) and set it up with `createKestonI18n` (see Guide → Languages); components throw without it. Text props such as `emptyText`, `finishLabel` and `removeLabel` still override the defaults. New components: `LanguageSwitcher`, `SettingsRow` (a setting's label and description beside its control), `CheckboxGroup` (several tick boxes under one question), `Steps` (a step header: segments plus "Step 2 of 3: Licences") and `InputTextArea` (plain multi-line text that grows with what's typed). `Switch` and `Checkbox` gain `hideLabel` (a hidden label leaves the box with a larger area to press). `Link` used as a button (`as="button"`) no longer submits the form it is in: pressing Enter in a field was triggering it.

### Patch Changes

- 2008b17: `Card` with `padding="none"`: the title row now has the same padding as the other sizes (24px from the sm breakpoint), so it lines up with neighbouring cards.
- 13461e7: `Table` gains `inset`, for a table under a title in a `Card` with `padding="none"`: the outer columns have 24px at the edges (from sm) and, below the last row (which keeps its line), enough space that the last row's text is as far from the edge as at the sides. Without it, tables are unchanged. The row lines still run edge to edge.
- b3b2ede: `Table` with `selectable`: pressing anywhere in a row's checkbox cell (its padding and the gap around the box, not only the box) ticks it, and the same for the "select all" header cell.

## 0.8.0

### Minor Changes

- 174cf50: Table: `selectable` adds a checkbox at the start of each row and "select all" in the header, for acting on several rows. `true` for every row, or a function saying which rows can be ticked; ticked rows' keys are in `v-model:selected`, and `rowLabel` names each box for screen readers. Clicking anywhere in a checkbox's cell ticks it, without opening a clickable row.
  
  Checkbox: `hideLabel` keeps the label for screen readers only.
  
  Card: with `padding="none"`, the title (and its actions) keep 16px of padding, like the footer, while the content still runs to the edges.

### Patch Changes

- 8e3c313: PageHeader: a toolbar that appears after the page has loaded (e.g. once its actions arrive) now moves actions in and out of its "⋯" menu as the page is resized, like one that's there from the start.

## 0.7.0

### Minor Changes

- b5417f0: PageHeader's toolbar: actions that don't fit move into a "⋯" Menu at its right-hand end, and come back as it widens. New `toolbar-start` and `toolbar-end` slots put something before or after the buttons, e.g. "2 users selected" (shown bold, spaced like a button, and announced when it changes).

## 0.6.0

### Minor Changes

- dd3995a: Add Menu: more actions behind an icon-only ghost "⋯" button, e.g. on each row of a table, built on Reka UI's DropdownMenu. Items run `onSelect` or are links (`href`, or `to` through `linkComponent`), with an optional icon; arrow keys move between them and Escape closes the menu.
  
  Add Tabs: sections of one page, one shown at a time, built on Reka UI's Tabs. Each tab's content goes in a slot named after its value; `v-model` is the open tab. The chosen tab is primary with a bar under it that slides between tabs.
  
  PageHeader: a `toolbar` of everyday actions under the title (e.g. Reset password, Block sign-in), as ghost buttons in a white bar like a Card, separate from the main action on the right.
  
  Input, InputNumber, InputDate, InputPassword, InputRichText and Select: `hideLabel` keeps the label (and helper) for screen readers only, for tables of fields with column headings.

## 0.5.0

### Minor Changes

- 6c7ddc6: Table rows can be clickable: `rowLink` gives each row a page to go to (with `linkComponent`, e.g. RouterLink). The row-header cell becomes a real link stretched over the row, so the row highlights on hover and a click anywhere on it opens the page, while buttons and links in other cells still work on their own. Header and AppShell get `titleTo`, which makes the app's name a link (e.g. to its dashboard), with hover and focus states.

## 0.4.0

### Minor Changes

- 970a2fd: Add EmptyState, for lists, tables and panels with nothing in them yet: an icon, a title, a description and optional actions, in two sizes. NotificationPane's "You're all caught up" and Table's empty row now use it.

### Patch Changes

- 1fc3386: AppShell: on narrow screens, the menu's title is on the left again (lined up with the menu items' icons), with the close button on the right, instead of both being centred.

## 0.3.0

### Minor Changes

- Rebuild Keston UI from scratch. All earlier 0.x components have been removed and replaced: this release breaks apps using 0.2, which is allowed before 1.0.
- Add Checkbox, RadioGroup, Switch, Calendar, Checklist and InfoTip, and export FormField. InputDate now uses Calendar, and field help icons use InfoTip.
- Add InputCode: a one-time code (authenticator app, email or text message) with one box per character, built on Reka UI's PinInput. Pasting or the phone's suggested code fills every box, and `complete` fires when the last one is filled.
- Add InputPassword: a password field with a Show / Hide button and a Caps Lock note. It hides the password again when its form is submitted.
- Add InputRichText: several lines of notes with bold, italic and underline, built on Tiptap. Its value is HTML.
- FormField and InputPassword: a `label-trailing` slot for something at the end of the label row, e.g. a "Forgot password?" link. It comes after the field in the Tab order.
- Add Link: an underlined text link in the colour and size of the text around it. `newTab` opens it in a new tab with a small external-page icon (`:icon="false"` hides it), and tells screen readers.
- Add Progress: a thin bar that fills up, splits into segments for steps, or sweeps when there's no telling how long something will take.
- Slideover: multi-step forms. Pass `steps` for a segment per step at the top, the step's name, and Cancel / Previous and Next / Finish at the bottom; `validateStep` checks each step before moving on, and `finish` fires after the last.
  Enter in a text field moves to the next step.
- Form fields use 16px text on touch screens, so iPhone no longer zooms in when one is tapped (pinch-zoom still works). Large Buttons have slightly rounder corners (6px); small and medium stay at 4px.

### Patch Changes

- InputDate: the first Enter fills in the full date the text means (e.g. "tmrw" or "26/1") instead of submitting the form; Enter again submits as usual.
