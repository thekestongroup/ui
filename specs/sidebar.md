# Sidebar

> The app's main navigation, down the left of the page, optionally collapsing to icons.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Navigation/Sidebar, Examples/App shell

## When to use

- Moving between the main areas of an app.

## When not to use

- Actions on the current page (use Buttons), or navigation within a page (tabs).

## Anatomy

| Part | Required | Notes |
|---|---|---|
| header | No | Top, same height as Header (e.g. logo). |
| body | Yes | Scrolling list of sections. |
| section label | No | Small bold uppercase heading. A divider when collapsed. |
| item | Yes | Icon, label, optional badge. Items with children show › at the right. |
| back row | Nested only | First row inside a nested item: ‹ and its label (bold), then a divider. Goes up one level. |
| footer | No | Bottom, e.g. profile or help. Holds the collapse button. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| items | SidebarItem[] | [] | Items in one unlabelled section. |
| sections | { label?, items }[] | [] | Labelled groups, after `items`. |
| collapsed | boolean (v-model) | false | Narrow, icons only. |
| collapsible | boolean | false | Show the collapse / expand button. |
| label | string | "Main" | Name of the navigation landmark. |
| linkComponent | string \| Component | "a" | Used for items with `to`, e.g. RouterLink. |
| ui | { header, body, footer, item } | — | Extra classes per part. |

SidebarItem: `label`, `icon`, `href` or `to`, `active`, `badge`, `disabled`, `onSelect`, `children` (sub-pages).

Helper: `sidebarTrail(items, sections)` returns the path to the active item (top first), e.g. for a Breadcrumb.

## Sizes

| Size | Width | Item height | Item padding (x) | Gap | Icon size | Text style |
|---|---|---|---|---|---|---|
| Expanded | spacing 64 (256px) | 38px (md Button) | spacing 3 | spacing 3 | 16px | sm |
| Collapsed | spacing 14 (56px) | 38px | centred | — | 16px | labels hidden |

## States

| State | Appearance | Notes |
|---|---|---|
| Enabled | transparent, black text | |
| Hovered | black 10% | Web / desktop only |
| Pressed | black 15% | |
| Active (current page) | primary 10%, primary bold text | aria-current="page" |
| Parent of current page | primary bold text, no fill | Nested: "you are in here" |
| Focused | inset focus ring | Inset so the scrolling body doesn't clip it |
| Disabled | 40% opacity, not-allowed cursor | Links lose their href |

## Behaviour

- Collapse: width animates over 300ms ease-out; none with reduced motion.
- Scrollbar: thin when expanded; hidden when collapsed (the 40px strip can't spare the width), the list still scrolls.

### Nested items

| Action | Result |
|---|---|
| Choose an item with children (›) | Shows its children in place of the list, with a back row at the top. Doesn't navigate or emit `select` |
| Choose the back row | Goes up one level |
| After opening a level | Focus on its first item |
| After going back | Focus on the item just left |
| Current page changes | The list opens at that page's level |
| Collapsed | Back row shows only ‹ (tooltip "Back from {label}"); give sub-pages icons too |
| In the mobile Slideover | Opening and going back keep it open; choosing a page closes it |
- Small screens: the app hides it and shows it inside a Slideover (left) opened from the Header's menu button. Choosing an item should close the Slideover.

## Accessibility

- `<aside>` containing a `<nav>` named by `label`.
- Each labelled section is a list named by its heading.
- Collapsed: labels and badges stay in the DOM for screen readers; the label is also a native tooltip (`title`).
- Nested: items with children are buttons announced as "{label}, more options"; the back row as "Back from {label}".
- Icons are hidden from assistive tech.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Sidebar.vue` | — |
| iOS (SwiftUI) | — | NavigationSplitView sidebar (iPad), tab bar (iPhone). |
| Android (Compose) | — | NavigationDrawer / NavigationRail. |

## Tokens used

| Token | Used for |
|---|---|
| color white | background |
| color black (15%) | border, dividers |
| color primary (10% / 15%) | active item, active hover |
| color focus | focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Give every item an icon if it can collapse, sub-pages included. | Nest so deep people lose their place: pair nesting with a Breadcrumb. |
| Use labels that are unique within each level. | Repeat a label at the same level (levels are tracked by label). |
