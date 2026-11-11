# Progress

> A thin bar showing how far along something is: a line, segments for steps, or indeterminate.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Element/Progress

## When to use

- Line: something with a known size that takes a few seconds or more, e.g. an upload or an import.
- Segments: where someone is in a set of steps, e.g. a multi-step form (Slideover's `steps` uses it).
- Indeterminate: something that takes a while with no way to tell how long, e.g. loading a page of results.

## When not to use

- Under a second: show nothing, or a Spinner in the Button that started it.
- Ticking off named tasks: use Checklist.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| track | Yes | 6px tall, fully rounded, black 10%. |
| fill | Yes | Primary, fully rounded. |
| segments | No | One track per step, 4px apart, filled up to the current step. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| value | number \| null | null | Done so far. Null or left out: indeterminate. |
| max | number | 100 | The total; with `segments`, the number of segments. |
| segments | boolean | false | Split into `max` segments and fill `value` of them. |
| label | string | — | Required. Accessible name, e.g. "Uploading report.pdf". Not shown. |

## Behaviour

- Line and segments ease to a new value over 300ms. Values outside 0–`max` are clamped.
- Indeterminate: a bar 40% wide sweeps from left to right every 1.5s.
- Reduced motion: no easing; indeterminate becomes a full bar that gently pulses.

## Accessibility

- `role="progressbar"` named by `label`, with `aria-valuenow` / `aria-valuemax`.
- Value text: "40%" for a line, "Step 2 of 4" for segments. Indeterminate has no value and is `aria-busy`.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Progress.vue` | Reka UI Progress. |
| iOS (SwiftUI) | — | `ProgressView(value:total:)` with a custom style; indeterminate as the same sweeping bar. |
| Android (Compose) | — | `LinearProgressIndicator`, determinate or not; segments as a Row of them. |

## Tokens used

| Token | Used for |
|---|---|
| `color-primary` | Fill |
| `animate-progress-indeterminate` | Indeterminate sweep |
