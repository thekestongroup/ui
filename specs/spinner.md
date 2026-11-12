# Spinner

> A small circular loading indicator: spinning while there's no telling how long, or a ring that fills up.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Element/Spinner

## When to use

- Short waits in a small space: inside a Button while saving, next to a field's "Checking…" message, in a card while it loads.
- `lg` with a value: progress you want people to watch, e.g. an upload in an empty state.

## When not to use

- Progress across the width of a page or panel, or steps: use Progress.
- Waits under about a second: show nothing.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| track | Yes | The full ring, in the current text colour at 20% opacity. |
| arc | Yes | Spins, or fills to the value. Current text colour. |
| percentage | No | In the middle, `lg` only, with a value. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| value | number \| null | — | Progress from 0 to `max`. Leave out for a continuous spinner. |
| max | number | 100 | The value that means complete. |
| size | sm \| md \| lg | md | 16px (a button icon) · 24px · 48px. |
| label | string | Loading | What's loading, for screen readers, e.g. "Uploading report". |
| showValue | boolean | false | Show the percentage in the middle (`lg` with a value only). |

## Behaviour

- Takes the surrounding text colour, like an icon: colour it with a text class on it or its parent, e.g. `text-primary`.
- Continuous: spins once a second; with reduced motion it turns slowly, once every two seconds.

## Accessibility

- `role="progressbar"`, named by `label`, with the value when there is one.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Spinner.vue` | SVG. |
| iOS (SwiftUI) | — | `ProgressView()` (circular), or with a value. |
| Android (Compose) | — | `CircularProgressIndicator`. |

## Tokens used

| Token | Used for |
|---|---|
| currentColor | Track and arc |
