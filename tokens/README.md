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
| `--color-yellow` | `#f1c70b` | — | Warnings, e.g. Badge, the warning notification icon. Use black text on it (12:1, AAA); white fails. |
