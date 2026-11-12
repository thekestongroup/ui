# Popover

> A small panel that floats next to the thing that opened it, e.g. a menu, a filter or a profile card.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Overlay/Popover

## When to use

- Extra content or controls tied to one element: a filter form, a short menu, a profile card on hover.

## When not to use

- A word or two of help: use Tooltip, or InfoTip for a `?` beside a label.
- A larger task, or a form with several fields: use Slideover.
- Something people must respond to before continuing: use a dialog.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| trigger | Yes | The element it opens from, usually a Button (default slot). |
| panel | Yes | White, black 15% border, 4px corners, shadow. Fades in and out. Content goes in the content slot. |
| arrow | No | Points at the trigger. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| mode | click \| hover | click | How it opens. See Behaviour. |
| open | boolean | — | Use `v-model:open` to control it. |
| defaultOpen | boolean | false | Open when first shown. |
| content | object | bottom, 8px away | Placement passed to Reka, e.g. `{ side: 'top', align: 'start' }`. |
| arrow | boolean | false | Show the arrow. |
| portal | boolean \| string \| element | true | Render at the end of the page (true), in a given element, or in place (false). |
| dismissible | boolean | true | Close on Escape and clicking outside. If false, emits `close:prevent`. |
| modal | boolean | false | Block the rest of the page while open. |
| openDelay / closeDelay | number (ms) | 0 / 0 | Hover mode only. |

## Behaviour

- **click:** opens and closes on click, tap or Enter. Focus moves into the panel, so it suits interactive content (menus, forms).
- **hover:** opens on mouse hover, and on click or tap, which keeps it open, so it also works on touch screens. Focus stays where it is, so it suits information.
- Escape and clicking outside close it; focus returns to the trigger.
- It flips and shifts to stay on screen.

## Accessibility

- The trigger gets `aria-expanded` and `aria-controls`; the panel is a dialog.
- In hover mode, put links or buttons in the panel only with `portal: false`, so Tab reaches them straight after the trigger.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Popover.vue` | Reka UI Popover. |
| iOS (SwiftUI) | — | `.popover` (a sheet on iPhone). |
| Android (Compose) | — | `Popup` or `DropdownMenu`. |

## Tokens used

| Token | Used for |
|---|---|
| `color-white` / `color-black` | Panel and border |
