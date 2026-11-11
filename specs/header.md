# Header

> The bar across the top of every Keston app: menu button, app name, an optional middle area, actions and the account menu. The same in every app; each part can be overridden.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Layout/Header

## When to use

- Once per app, at the top of every page, above the Sidebar and content.

## When not to use

- Headings inside a page or panel (use a heading, or the Slideover's header).

## Anatomy

| Part | Required | Notes |
|---|---|---|
| menu | No | Ghost square Button with a menu icon. Opens the Sidebar on small screens. |
| leading | No | Before the title, e.g. a logo. |
| title | No | App or area name. Bold, truncates. |
| middle | No | Fills the space between title and trailing, e.g. breadcrumbs. |
| trailing | No | Actions before the account menu, e.g. notifications. |
| account | No | Round avatar (picture or initials) opening the account menu; Sign in button when signed out. Slot `account` replaces it. |
| account menu | No | Panel under the avatar: organisation, large avatar, name, email, with a small basic Account settings button under them; then a row of basic buttons, Switch account (left) and Log out (right). Slot `account-menu` adds content above that row. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| title | string | — | App or area name. |
| menu | boolean | false | Show the menu button (emits `menu`). |
| menuOpen | boolean | — | Whether what it opens is open (aria-expanded). |
| menuControls | string | — | Id of what it opens (aria-controls). |
| menuLabel | string | "Menu" | Accessible name of the menu button. |
| user | { name, email?, organisation?, avatar? } | — | Signed-in user. Shows the account menu. |
| userActions | ('account-settings' \| 'switch-account' \| 'log-out')[] | all three | Actions in the account menu (positions are fixed). Each emits an event of the same name. |
| signIn | boolean | true | Show Sign in (emits `sign-in`) when there is no user. |
| sticky | boolean | true | Stay at the top while the page scrolls. |
| ui | { menu, title, middle, trailing } | — | Extra classes per part, e.g. `menu: 'lg:hidden'`. |

## Sizes

| Size | Height | Padding (x / y) | Gap | Icon size | Text style |
|---|---|---|---|---|---|
| — | spacing 12 (48px) | spacing 4 / — | spacing 2 | 16px | title: base, bold |

## States

| State | Appearance | Notes |
|---|---|---|
| Enabled | white, bottom border black 15% | |
| Sticky | as enabled, pinned to the top | z-index above content, below dialogs |

## Behaviour

- Menu button: press emits `menu`; the app opens the Sidebar (in a Slideover) itself.
- Account menu: opens on click / tap / Enter below the avatar, aligned to its right edge (w-72). Focus moves into it; Escape or clicking outside closes it. Choosing an action closes it, then emits the event; the app does the navigation or sign-out.
- The menu button's icon lines up with the header's padding (negative margin), like the × in Slideover.

## Accessibility

- Rendered as `<header>` (banner landmark when at the top level of the page).
- The title is not a heading; each page keeps its own `h1`.
- Icon-only buttons in trailing need an `aria-label`.
- The avatar button is named "Account: {name}", or "{initials}, account: {name}" when it shows initials, so its visible text is part of its name (voice control). Pictures and initials are hidden from assistive tech, as the name is in the label.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Header.vue` | — |
| iOS (SwiftUI) | — | Navigation bar / toolbar. |
| Android (Compose) | — | TopAppBar. |

## Tokens used

| Token | Used for |
|---|---|
| color white | background |
| color black (15%) | bottom border, account menu divider |
| color primary | avatar initials background |

## Do / Don't

| Do | Don't |
|---|---|
| Keep trailing to a few icon buttons and one primary action. | Put full forms or labelled fields in the header. |
