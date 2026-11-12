# Slideover

> A full-height panel that slides in from the side, e.g. to edit a record or fill in a multi-step form without leaving the page.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Overlay/Slideover

## When to use

- Editing or adding something while keeping the page behind in context: edit a student, add an application.
- Multi-step forms (with `steps`).
- Longer side content: a notification list, a log.

## When not to use

- A small amount of extra content tied to one element: use Popover.
- A whole task that deserves its own address: use a page.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| trigger | No | Default slot, e.g. a Button. Or control it with `v-model:open`. |
| overlay | No | Black 40% over the page. |
| panel | Yes | White, full height, up to 448px wide (full width on small screens). |
| header | Yes | Title (18px), description, × close button; 24px / 16px padding, line under it. |
| progress | With `steps` | A segment per step above the title, and "Step 2 of 4: Contact details" under it. |
| body | Yes | Scrolls on its own. |
| footer | No | Actions, e.g. Cancel / Save. With `steps`, Cancel or Previous and Next or Finish. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| title | string | — | The panel's heading and accessible name. Always set it. |
| description | string | — | Text under the title. |
| side | right \| left \| top \| bottom | right | Edge it slides in from. |
| open | boolean | — | Use `v-model:open` to control it. |
| overlay | boolean | true | Dim the page behind. |
| close | boolean | true | Show the × button. |
| dismissible | boolean | true | Close on Escape and clicking outside. If false, emits `close:prevent`. |
| modal | boolean | true | Block the page behind while open. |
| initialFocus | none \| auto \| close | none | Where focus goes when it opens. See Accessibility. |
| steps | string[] | — | Step names, for a multi-step form. |
| step | number | 0 | Current step, from 0. Use `v-model:step`. Back to 0 each time it opens. |
| validateStep | (step) => boolean \| Promise | — | Checked before Next / Finish; return false to stay. Can be async, e.g. to save. |
| finishLabel | string | Finish | Text of the last step's button. |

| Event | When |
|---|---|
| finish | Finish was pressed on the last step and `validateStep` passed. |
| close:prevent | Closing was attempted while not dismissible. |

## Behaviour

- Slides in over 300ms and out over 200ms; with reduced motion it fades instead.
- The page behind doesn't scroll while it's open.
- **Multi-step forms:** Next checks the step with `validateStep`, then moves on; Previous goes back; the first step shows Cancel. Enter in a text field presses Next / Finish (after InputDate's own first Enter). Each new step starts scrolled to the top.

## Accessibility

- A dialog named by the title and described by the description. Focus is kept inside while it's open, and returns to the trigger on close.
- `initialFocus`: `none` focuses the panel itself, so screen readers read from the top; `auto` focuses the first field (not on touch screens, so the keyboard doesn't pop up); `close` focuses ×.
- **Multi-step forms:** the step is part of the description when it opens. After Enter, focus moves to the next step's first control, which sits in a group named "Step 3 of 4: Contact". After Next or Previous, the step is announced. It's read once each time.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Slideover.vue` | Reka UI Dialog. |
| iOS (SwiftUI) | — | `.sheet` on iPhone; `.inspector` on iPad and Mac. |
| Android (Compose) | — | `ModalBottomSheet` on phones; a side sheet on large screens. |

## Tokens used

| Token | Used for |
|---|---|
| `color-white` / `color-black` | Panel, overlay, lines |
| `color-primary` | Step segments |
| `animate-slide-in-*` / `animate-slide-out-*` | Sliding in and out |
