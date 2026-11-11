# Tooltip

> A short label on hover or keyboard focus: the exact date behind "3 hours ago", a birthday behind an age, what an icon button does.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Tooltip, Components/RelativeTime, Components/Age

## When to use

| Use a Tooltip for | Use instead |
|---|---|
| Extra detail people may want, but don't need | Anything people need to do the task (put it on the page) |
| The exact value behind a rounded or relative one ("3 hours ago" → date and time) | Anything interactive (a Popover) |
| Naming an icon button (as well as its `aria-label`) | Long explanations (a Popover, or help text) |

Tooltips don't open on touch screens, so nothing important can live only in one.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| text | string | — | Slot `content` for anything richer (still no interactive content). |
| side | top \| right \| bottom \| left | top | Flips if there's no room. |
| align | start \| center \| end | center | |
| delay | number (ms) | 400 | Before it shows. Moving to another tooltip within 300ms shows it at once. |
| disabled | boolean | false | |

The trigger (default slot) must be focusable: a Button, a link, or an element with `tabindex="0"`.

## Sizes

| Part | Value |
|---|---|
| Panel | Gray 900, white text, 6px corners, shadow, 1px white 10% ring |
| Text | 12px / 16px, medium |
| Padding | 10px sides, 6px top and bottom |
| Max width | 288px, then wraps |
| Distance from trigger | 8px |

## Behaviour

| Action | Result |
|---|---|
| Hover the trigger | Shows after 400ms; hides when the pointer leaves (it can move onto the tooltip) |
| Keyboard focus | Shows straight away; hides on blur or Escape |
| Touch | Nothing |

## Accessibility

| Part | Announced as |
|---|---|
| Trigger | Its own name, then the tooltip as its description (`aria-describedby`) |
| Tooltip | `tooltip` |

Meets WCAG 1.4.13: it can be dismissed (Escape), hovered, and stays until the pointer or focus leaves.

## The pattern: short value, exact one on hover

Wherever an app shows something rounded or relative, show the exact value in a tooltip.

| Component | Shows | Tooltip |
|---|---|---|
| `RelativeTime` | "3 hours ago" (updates every 30s) | "Wednesday 11 November 2026 at 08:51" |
| `Age` | "13" or "13 years" | "Born 14 March 2013", plus "· Birthday in 3 days" within a week |

Both have a dotted underline (40% of the text colour) to show there's more, and a focus ring for keyboard users. Date-only strings ("2013-03-14") are read as that day, not midnight UTC.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Tooltip.vue` (Reka UI Tooltip), `RelativeTime.vue`, `Age.vue` | — |
| iOS (SwiftUI) | — | No hover: show the exact value on tap (a `popover`), or in the detail screen. `.help()` on iPad and Mac pointers. |
| Android (Compose) | — | `PlainTooltip` on long-press. |

## Tokens used

| Token | Used for |
|---|---|
| gray 900, white | panel, text |
| color focus | trigger focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Use RelativeTime for every relative date | Show "3 hours ago" with no way to see when |
| Keep it to a few words | Put buttons or links in a tooltip |
| Make the trigger focusable | Put a tooltip on plain, unfocusable text |
