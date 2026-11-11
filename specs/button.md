# Button

> Starts an action: saving, cancelling, opening a panel, deleting.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Button

## When to use

- Any action someone takes on the current page or record: Save, Cancel, Export, Delete.
- Icon-only actions in toolbars and panel headers (`square`, usually `ghost`), e.g. × to close, ☰ to open the menu.

## When not to use

- Going to another page: use a link (or `as-child` with a router link, so it is still a link).
- Choosing between options: use a radio group, select or segmented control.
- Turning a setting on or off: use a switch or checkbox.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| container | Yes | Rounded rectangle with a 1px border (transparent on ghost). |
| leading | No | Icon before the label (slot `leading`). |
| label | Yes, unless `square` | The text (default slot). |
| trailing | No | Icon after the label (slot `trailing`), e.g. → on Next. |
| status | No | Spinner, ✓ or × with optional text, shown in place of the content while `status` isn't idle. |
| focus ring | — | Outline shown on keyboard focus. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| variant | basic \| primary \| ghost \| danger \| success | basic | What the button is for (see Variants). |
| size | sm \| md \| lg | md | See Sizes. |
| square | boolean | false | Icon only: as wide as it is tall. Needs `aria-label`. |
| disabled | boolean | false | Can't be pressed or focused. |
| type | button \| submit \| reset | button | Native button type. |
| status | idle \| loading \| success \| error (v-model) | idle | Progress of the action. Success and error return to idle by themselves. |
| loadingText / successText / errorText | string | — | Text next to the status icon. Icon only if not set. |
| statusDuration | number (ms) | 2000 | How long success / error stay before returning to idle. |
| as / asChild | string \| component / boolean | button / false | Render as another element, e.g. a link. |

## Variants

| Variant | Background | Text | Border | Use for | Example |
|---|---|---|---|---|---|
| basic | white `#FAFAFA` | black `#050505` | black 15% | Most actions | Cancel, Export, Switch account |
| primary | primary `#023750` | white `#FAFAFA` | black 15% | The main action, one per area | Save, Continue |
| ghost | none | black `#050505` | transparent | Low emphasis, toolbars, icon buttons | ×, ☰, avatar |
| danger | red `#D2042D` | white `#FAFAFA` | black 15% | Destructive actions | Delete |
| success | green `#007A16` | white `#FAFAFA` | black 15% | Positive / confirming actions | Approve |

## Sizes

All sizes: 1px border, 4px radius (`rounded`), icons from Lucide at 2px stroke. Heights are padding + one line of text + border, measured in the browser.

| Size | Height | Padding (y / x) | Gap | Icon size | Square (w × h) |
|---|---|---|---|---|---|
| sm | 26px | 4px / 8px (spacing 1 / 2) | 4px (spacing 1) | 14px | 26 × 26px (spacing 6.5) |
| md | 38px | 8px / 16px (spacing 2 / 4) | 8px (spacing 2) | 16px | 38 × 38px (spacing 9.5) |
| lg | 50px | 12px / 24px (spacing 3 / 6) | 12px (spacing 3) | 20px | 50 × 50px (spacing 12.5) |

In a square button the icon is centred, so the space around it is equal on all four sides (5 / 10 / 14px inside the border).

## Typography

Lato (bundled with the library), regular weight, sentence case, no letter spacing. Never wraps.

| Size | Font size | Line height | Weight | Tailwind |
|---|---|---|---|---|
| sm | 12px | 16px | 400 (regular) | `text-xs` |
| md | 14px | 20px | 400 (regular) | `text-sm` |
| lg | 16px | 24px | 400 (regular) | `text-base` |

Status text (loadingText, etc.) uses the same style as the label, with an 8px gap to its icon at every size.

## States

| State | Appearance | Notes |
|---|---|---|
| Enabled | As in Variants. | |
| Hovered | Filled variants: 90% brightness (white `#FAFAFA` → about `#E1E1E1`). Ghost: black 10% fill. | Web / desktop only. 150ms ease-in-out. |
| Pressed | Filled variants: 80% brightness. Ghost: black 15% fill. | |
| Focused | 2px outline in focus `#007FC9`, 1px outside the border. | Keyboard focus only (`:focus-visible`). |
| Disabled | 40% opacity, not-allowed cursor, no hover / press. | |
| Loading | Content fades out; a spinner (icon-sized) and optional text fade in. Cursor shows progress. | Stays focusable; clicks are blocked. |
| Success | Green background, ✓ and optional text, for `statusDuration`. | Any variant. |
| Error | Red background, × and optional text, for `statusDuration`. | Any variant. |

## Spacing and layout

- Buttons in a row: 8px apart (`gap-2`). The main action goes last (right), e.g. Cancel then Save.
- Minimum clear space around a group: 16px (spacing 4).
- Minimum touch target: md is 38px tall. On touch-first screens prefer lg (50px), or give sm / md buttons extra space around them so the tap area reaches 44px.
- Ghost icon buttons at the edge of a bar or panel use a negative margin so their icon lines up with the bar's padding (see Header, Slideover).

## Behaviour

- Keyboard: Tab to focus; Enter or Space presses it.
- Pointer / touch: press on release, as native buttons do.
- Motion: colours change over 150ms (ease-in-out). Returning from success / error takes 300ms, and the width animates over 300ms (ease-out) when the status text changes its size. Icons fade and scale; with reduced motion they only fade and the width doesn't animate.

## Content guidelines

- A verb, or verb + noun: "Save", "Export students". Sentence case.
- One to three words. Don't truncate; shorten the wording instead.
- Status text says what is happening or happened: "Saving…", "Saved", "Couldn't save".

## Accessibility

- Native `<button>` (`type="button"` unless set), so role, focus and keyboard come for free.
- Icon-only buttons need an `aria-label` (e.g. "Close"). If visible text is shown, the label must contain it.
- While busy the button is `aria-disabled` and `aria-busy` (loading) but stays focusable; the status is announced through a live region ("Loading", "Done", "Failed" if no text is set).
- Contrast (text on background): basic 19.5:1, primary 12.1:1, danger 5.3:1, success 5.3:1, ghost on white 19.5:1 and on background `#E1E1E1` 15.6:1, so all meet WCAG AA. Focus ring vs white: 4.1:1 (non-text minimum is 3:1).

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Button.vue` | — |
| iOS (SwiftUI) | — | Button with a custom ButtonStyle using the same sizes; system press feedback instead of brightness. |
| Android (Compose) | — | Button / OutlinedButton / TextButton (ghost); 48dp minimum touch target. |

## Tokens used

| Token | Used for |
|---|---|
| font sans (Lato) | label |
| color white `#FAFAFA`, black `#050505` | basic background and text, text on filled variants |
| color black (15%) | border |
| color primary `#023750` | primary background |
| color red `#D2042D` | danger background, error status |
| color green `#007A16` | success background, success status |
| color focus `#007FC9` | focus ring |
| radius (Tailwind `rounded`, 4px) | corners |

## Do / Don't

| Do | Don't |
|---|---|
| Use one primary button per area. | Put two primary buttons side by side. |
| Use `status` for actions that take time, so people see progress. | Disable the button while it works; it loses focus. |
| Label icon-only buttons with `aria-label`. | Use an icon-only button where the icon isn't obvious. |
