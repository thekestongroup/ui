# Sidebar

> The app's main navigation, down the left of the page, optionally collapsing to icons.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Sidebar, Examples/App shell

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
| item | Yes | Icon, label, optional badge. |
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

SidebarItem: `label`, `icon`, `href` or `to`, `active`, `badge`, `disabled`, `onSelect`.

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
| Focused | inset focus ring | Inset so the scrolling body doesn't clip it |
| Disabled | 40% opacity, not-allowed cursor | Links lose their href |

## Behaviour

- Collapse: width animates over 300ms ease-out; none with reduced motion.
- Small screens: the app hides it and shows it inside a Slideover (left) opened from the Header's menu button. Choosing an item should close the Slideover.

## Accessibility

- `<aside>` containing a `<nav>` named by `label`.
- Each labelled section is a list named by its heading.
- Collapsed: labels and badges stay in the DOM for screen readers; the label is also a native tooltip (`title`).
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
| Give every item an icon if it can collapse. | Nest items more than one level (use sections). |
