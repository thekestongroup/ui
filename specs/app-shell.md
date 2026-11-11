# AppShell

> The layout of every Keston app page: the shared Header on top, the app's Sidebar on the left, the page in the middle.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Layout/AppShell, Examples/App pages

## When to use

- As the root of every app, so all apps share the same header, account menu and responsive behaviour. Each app supplies only its title, sidebar items and pages.

## When not to use

- Sign-in, error or marketing pages that have no navigation.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| skip link | Yes | "Skip to content", visible only when focused. |
| header | Yes | Header: sticky, with menu button and account menu. The menu button opens the mobile menu (narrow) or collapses the sidebar (wide). |
| sidebar | Yes | Sidebar beside the page (wide) or in a left Slideover (narrow). |
| main | Yes | The page. Default slot. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| title | string | — | App name, in the header and as the mobile menu's title. |
| user | HeaderUser | — | Signed-in user, for the account menu. |
| userActions | HeaderUserAction[] | all | Account menu actions. |
| signIn | boolean | true | Show Sign in when signed out. |
| items / sections | SidebarItem[] / SidebarSection[] | [] | Sidebar contents. |
| collapsible | boolean | true | Wide screens: the header's menu button collapses the sidebar. |
| collapsed | boolean (v-model) | false | Sidebar collapsed to icons. |
| menuOpen | boolean (v-model) | false | Mobile menu open. |
| linkComponent | string \| Component | "a" | For sidebar items with `to`. |
| header / sidebar | object | — | Other Header / Sidebar props. |

Events: `account-settings`, `switch-account`, `log-out`, `sign-in`.

## Spacing and layout

- Breakpoint: lg (64rem). Below it the sidebar moves into a Slideover (max width spacing 72).
- The page scrolls, not an inner box: the header sticks at the top, the sidebar sticks below it at full remaining height.
- Page padding is the page's own (e.g. `ui.main: 'p-6'`).

## Behaviour

- Narrow: menu button opens the menu. Choosing an item, or the screen becoming wide, closes it.
- Wide: sidebar collapse state is kept by `v-model:collapsed` (the app can store it).

## Accessibility

- Landmarks: header (banner), nav (inside the sidebar), main.
- Skip link moves focus to main.
- Mobile menu is a dialog titled with the app name.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `AppShell.vue` | — |
| iOS (SwiftUI) | — | NavigationSplitView (iPad), TabView (iPhone). |
| Android (Compose) | — | Scaffold with TopAppBar and NavigationDrawer / Rail. |

## Tokens used

| Token | Used for |
|---|---|
| color background | page background |

## Do / Don't

| Do | Don't |
|---|---|
| Use one AppShell at the root of each app. | Rebuild the header per app. Use slots for app-specific additions. |
