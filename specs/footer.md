# Footer

> The bottom of every Keston app's page: Help & support and the legal links (Privacy Policy, Terms & Conditions), and the app's name, version and build with the copyright. The same in every app.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Layout/Footer

## When to use

- Once per app, at the bottom of the page, under the content. In an app built on AppShell, pass `footer` to AppShell instead of using Footer directly.

## When not to use

- Actions or navigation for the page itself (use PageHeader, Sidebar or a Card's footer).
- A bar of buttons that must always be in view (use UnsavedChangesBar or a sticky bar).

## Anatomy

| Part | Required | Notes |
|---|---|---|
| links | No | On the left. Default: Help & support, Privacy Policy and Terms & Conditions (`kestonFooterLinks`). They leave the app, so they open in a new tab. |
| more links | No | `moreLinks`: after a thin divider, e.g. Contact us, or `kestonGroupLinks` (Keston ID, Admin, Work, Design system) to point at the other Keston apps. |
| app name, version and build | No | "Keston Admin v1.4.2 a1b2c3d". The version reads as "Version 1.4.2" and the build, in monospace, as "Build a1b2c3d", so a bug report can name the exact build. Show it in every app: pass `version` and `build` from the build, not by hand. |
| copyright | Yes | "© 2026 The Keston Group", or a range such as "© 2024–2026 The Keston Group" with `since`. |
| nav | No | Slot instead of the whole list of links. Rarely needed: prefer `moreLinks`. |
| end | No | Slot after the copyright, e.g. a LanguageSwitcher. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| links | FooterLink[] | `kestonFooterLinks` | The links on the left. |
| moreLinks | FooterLink[] | — | More links, after a divider. |
| linkComponent | string \| Component | "a" | For links with `to`, e.g. RouterLink. |
| appName | string | — | The app's name, before its version. |
| version | string | — | The app's version, "1.4.2" or "v1.4.2". |
| build | string | — | The build (a commit or CI run), after the version. |
| holder | string | "The Keston Group" | Who owns the copyright. |
| year | number | this year | The current year (mainly for tests and screenshots). |
| since | number | — | The first year, to show a range. |

A FooterLink is `{ label, href }` or `{ label, to }`, with `newTab` (default: true for `href`, false for `to`).

## Where the version comes from

Each app passes its own version, from its `package.json`, so the footer always shows what is running. In a Vite app:

```ts
// vite.config.ts
import pkg from './package.json'
export default defineConfig({ define: { __APP_VERSION__: JSON.stringify(pkg.version) } })
```

```ts
// env.d.ts
declare const __APP_VERSION__: string
```

Vue templates can't read these build constants directly, so put them in a `const` in `<script>` and pass that:

```vue
<script setup lang="ts">
const footer = { appName: 'Keston Admin', version: __APP_VERSION__, since: 2024 }
</script>

<AppShell :footer="footer" … />
```

The build comes from CI, as another constant: in the build step, `GITHUB_SHA` (or the run number) goes in with `define`, so every deployed build says which commit it is. Locally there is none, so the build is left out.

```ts
define: {
  __APP_VERSION__: JSON.stringify(pkg.version),
  __APP_BUILD__: JSON.stringify((process.env.GITHUB_SHA ?? '').slice(0, 7))
}
```

```ts
const footer = { appName: 'Keston Admin', version: __APP_VERSION__, build: __APP_BUILD__ || undefined, since: 2024 }
```

## Sizes

| Size | Height | Padding (x / y) | Gap | Text style |
|---|---|---|---|---|
| — | content | spacing 4 (6 from `sm`) / spacing 4 | spacing 3 between the two rows; spacing 4 between links | sm, black 65% |

## States

| State | Appearance | Notes |
|---|---|---|
| Enabled | white, top border black 15% | |
| Link hover | text black, thicker underline | web / desktop only, as Link |
| Link focused | 2px focus ring `#007FC9`, keyboard only | as Link |

## Spacing and layout

- Wide screens: links on the left, name, version and copyright on the right, on one row. Narrow screens: stacked, links first.
- Both sides wrap rather than truncate.
- In AppShell, the page grows to fill the screen, so on a short page the footer sits at the bottom of the screen; on a long page it follows the content.

## Behaviour

- Links that leave the app open in a new tab (with the "(opens in a new tab)" hint for screen readers; no icon, to keep the row quiet).
- The footer isn't sticky: it is at the end of the page.

## Content guidelines

- Help is "Help & support", the wording most products use for a link that leads to answers and a way to contact someone. The legal links use the documents' full names: "Privacy Policy", "Terms & Conditions". Keep the list short: add to it with `moreLinks`, don't replace it.
- The links point at thekestongroup.com's pages unless an app has its own help and policies.
- App name: the product name as in the header, e.g. "Keston Admin".

## Accessibility

- Rendered as `<footer>` (the contentinfo landmark at the top level of the page).
- The links are a `<nav>` named "Help and legal", so it is distinct from the app's main navigation.
- The version shows as "v1.4.2" but reads as "Version 1.4.2", and the build as "Build a1b2c3d".
- Text contrast: black 65% on white meets 4.5:1.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Footer.vue` | — |
| iOS (SwiftUI) | — | An "About" screen row with the version and copyright. |
| Android (Compose) | — | An "About" screen row with the version and copyright. |

## Tokens used

| Token | Used for |
|---|---|
| color white | background |
| color black (15%) | top border, divider between group and app links |
| color black (65%, 80%) | text, app name |
| color focus | link focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Pass the version from package.json. | Type the version by hand, so it goes out of date. |
| Add more links with `moreLinks`. | Replace the standard links, so people can't find help or the policies. |
| Pass the build from CI so every deployed build is identifiable. | Leave the build out of a deployed app. |
