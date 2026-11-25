# Tokens

Design tokens shared by every platform: colours (light and dark), spacing,
radius, typography, opacity and motion.

**Today:** the web values live in `src/styles/theme.css` as a Tailwind v4
`@theme` block. Values that match Tailwind's defaults are not repeated there.

**Later:** when native apps start, the tokens move here as a single
platform-neutral JSON file (W3C Design Tokens format), and a build step
generates:

- `theme.css` for Tailwind (web, desktop)
- Swift constants for SwiftUI (iOS)
- Kotlin values for Jetpack Compose (Android)

Until then, record any token added to `theme.css` in the table below so
nothing is lost.

| Token | Value (light) | Value (dark) | Notes |
|---|---|---|---|
| `--animate-fade-in` | fade from 0 to 100% opacity, 150ms, `cubic-bezier(0.4, 0, 0.2, 1)` | same | Popovers / tooltips appearing. Uses Tailwind's default transition duration and easing. |
| `--animate-fade-out` | fade from 100% to 0 opacity, 150ms, `cubic-bezier(0.4, 0, 0.2, 1)` | same | Popovers / tooltips disappearing. |
| `--animate-slide-in-{right,left,top,bottom}` | slide in from that edge (100% of own size), 300ms, ease-out `cubic-bezier(0, 0, 0.2, 1)` | same | Slideover opening. |
| `--animate-slide-out-{right,left,top,bottom}` | slide out to that edge, 200ms, ease-in `cubic-bezier(0.4, 0, 1, 1)` | same | Slideover closing. |
| `--color-white` | `#fafafa` | same | Never changes: white text on coloured fills. |
| `--color-black` | `#050505` | same | Never changes: black text on yellow, the Slideover backdrop (40%). |
| `--color-ink` | `#050505` | `#fafafa` (neutral-50) | Text, icons, borders and tints, usually at an opacity: 100% body text, 65% secondary text, 55% placeholders, 45% form field / checkbox / radio outlines (3:1, WCAG 1.4.11), 10% card and divider borders. |
| `--color-background` | `#f5f5f5` (neutral-100) | `#0a0a0a` (neutral-950) | The page, behind cards. |
| `--color-surface` | `#ffffff` | `#171717` (neutral-900) | Cards, fields, header, sidebar, basic buttons. |
| `--color-surface-elevated` | `#ffffff` | `#262626` (neutral-800) | Floating panels: popovers, menus, the unsaved-changes bar. A step lighter in dark mode, where shadows barely show. |
| `--color-surface-muted` | `#e5e5e5` (neutral-200) | `#262626` (neutral-800) | A solid grey fill, e.g. the "+3" in an AvatarGroup. |
| `--color-kblue` | `#023750` | same | Keston blue, the brand colour. |
| `--color-primary` | `#023750` (kblue) | `#0369a1` (sky-700) | Primary buttons, checked checkboxes / switches, selected dates. White text on it (dark: 5.9:1). Lighter in dark mode so it stands out from the dark page. |
| `--color-green` / `--color-red` / `--color-blue` | `#007a16` / `#d2042d` / `#035483` | same | Status fills (Badge, danger Button). White text on them. |
| `--color-yellow` | `#f1c70b` | same | Warnings, e.g. Badge. Use black text on it (12:1, AAA); white fails. |
| `--color-focus` | `#007fc9` | same | The 2px keyboard focus ring. At least 3:1 against every surface in both modes. |
| `--color-primary-fg` | `#023750` | `#7dd3fc` (sky-300) | Primary colour as text or an icon (selected tab, current sidebar item, links in notifications). |
| `--color-green-fg` / `--color-red-fg` / `--color-blue-fg` | same as the fill | `#4ade80` (green-400) / `#f87171` (red-400) / `#93c5fd` (blue-300) | Status colours as text or icons (field messages, stat changes, ChangeIndicator). At least 4.5:1 on every surface. |
| `--color-yellow-fg` | `#a16207` (yellow-700) | `#f1c70b` | Warning icons. Yellow itself fails on white. |
| `--color-hover` | ink at 5% | same (ink is light) | Hover tint for things with no fill: ghost buttons, menu items, table rows, sidebar items. |
| `--color-pressed` / `--color-selected` | ink at 10% | same | Pressed, open, selected or keyboard-highlighted. |
| `--color-surface-hover` / `--color-surface-pressed` | surface mixed with 5% / 10% ink | same | Solid hover / pressed for things filled with surface (basic Button, buttons inside fields), so they lighten in dark mode. |
| `shadow-xs` (Tailwind) | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | same | The faint shadow on cards, fields, basic buttons and card-style options. Floating panels use `shadow-md`, the Slideover `shadow-xl`. |

**States**, everywhere: hover = `hover` tint (or `surface-hover`), pressed / open /
selected = `pressed`, coloured fills darken (`brightness-90` / `80`), disabled =
40% opacity, focus = 2px `focus` outline shown for the keyboard only.

**Dark mode** is opt-in, set on `<html>`: `data-theme="light" | "dark" | "system"`.
Each web colour holds both values with CSS `light-dark()`.
