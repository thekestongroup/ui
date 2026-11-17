# UnsavedChangesBar

> A bar that slides up from the bottom of the screen while there are edits that haven't been saved, with Discard and Save.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Overlay/UnsavedChangesBar

## When to use

- A settings page or form where edits aren't saved until people choose to, and they might leave without noticing.

## When not to use

- Forms with their own Save button next to the fields, or that save as you go.
- Confirming something that already happened: use Notification.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| message | Yes | "Unsaved changes", with a small yellow dot. |
| Discard | Yes | Basic button. Puts the edits back. |
| Save | Yes | Primary button. Spinner while saving. |
| space | No | An empty block as tall as the bar, in the page, so the last content isn't covered. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| open | boolean | — | Required. Whether it is shown. |
| message | string | Unsaved changes | |
| discardLabel / saveLabel | string | Discard / Save | Keep them to one word. |
| status | idle \| loading \| success \| error | idle | Progress of saving; loading disables both buttons. |
| reserveSpace | boolean | true | Leave a blank space the height of the bar at its place in the page. |

Events: `discard`, `save`.

## Behaviour

- Slides up from the bottom edge when `open` becomes true (300ms, ease-out) and back down when false (200ms, ease-in). With reduced motion it fades instead.
- Fixed to the bottom of the screen, centred, up to 42rem wide. To line it up with a content area beside a sidebar, pass a `class`, e.g. `lg:left-64`.
- It doesn't cover the end of the page: by default it leaves a blank space where it sits in the page, so put it **last** in the page content. Or set `reserveSpace` to false and add bottom padding yourself.
- The parent decides what the buttons do and closes the bar: Discard puts the edits back then sets `open` to false; Save saves then sets `open` to false (or sets `status` to `error` and keeps it open).
- Leaving the page with unsaved changes should still ask, using the router.

## Accessibility

- A `region` named by its message; the message is `role="status"`, so it is announced when the bar appears.
- Buttons are real buttons in a normal tab order.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `UnsavedChangesBar.vue` | — |
| iOS (SwiftUI) | — | A bottom `safeAreaInset` bar. |
| Android (Compose) | — | A `BottomAppBar` with `AnimatedVisibility`. |

## Do / Don't

| Do | Don't |
|---|---|
| Put it last in the page. | Also keep a second Save button on the page. |
| Show what changed next to each setting with ChangeIndicator. | Leave it open after saving. |
