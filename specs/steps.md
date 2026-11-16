# Steps

> Where someone is in a set of steps: a segment each, and "Step 2 of 3: Licences".

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Navigation/Steps

## When to use

- The top of a multi-step form on a page, or in a Slideover you drive yourself (Slideover's own `steps` shows one).

## When not to use

- Progress through one task with no named steps: Progress.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| steps | string[] | — | Required. The name of each step. |
| step | number | — | Required. The current step, from 0. |
| label | string | — | Required. What the steps are for; the bar's accessible name, not shown. |

## Spacing and layout

- Bar to text: 12px.

## Accessibility

- The bar is a progress bar ("Step 2 of 3"); the text is `aria-live="polite"`, so a change of step is announced.
- Move focus to the new step's heading yourself.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Steps.vue` | — |
| iOS (SwiftUI) | — | — |
| Android (Compose) | — | — |
