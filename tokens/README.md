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
| — | — | — | — |
