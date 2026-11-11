# Breadcrumb

> Where the current page is: its parents, then the page itself, e.g. School › School Structure › New School Year Setup.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Navigation/Breadcrumb, Components/Layout/AppShell (With Breadcrumb)

## When to use

| Use a Breadcrumb for | Use instead |
|---|---|
| Pages two or more levels deep, e.g. inside a nested Sidebar | Top-level pages: the page title is enough |
| Records inside records, e.g. Students › Year 9 › Ben Blissett | Steps in a process (use a stepper) |

## Anatomy

| Part | Required | Notes |
|---|---|---|
| step (link) | No | An earlier page: a link back (`href`, `to`) or a button (`onSelect`). |
| step (text) | No | An earlier step that isn't a page, e.g. a sidebar group: plain grey text. |
| current page | Yes | The last step: black text, `aria-current="page"`, not a link. |
| separator | — | › between steps. |
| icon | No | Before a step's label. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| items | { label, icon?, href?, to?, onSelect? }[] | — | Required. Top level first; the last is the current page. SidebarItems fit, so `sidebarTrail(items, sections)` can be passed straight in. |
| label | string | Breadcrumb | Name of the navigation landmark. |
| linkComponent | string \| Component | a | Used for steps with `to`, e.g. RouterLink. |

Events: `select` (item, event) when an earlier step is chosen.

## Sizes

| Part | Size | Notes |
|---|---|---|
| Text | 14px / 20px, regular | `text-sm` |
| Icon | 14px | |
| Separator | 14px › in black 40% | |
| Gap | 6px between step and separator; 4px between wrapped lines | |
| Step width | Up to 240px, then cut off with …; full text on hover (`title`) | |

## States

| State | Appearance |
|---|---|
| Link | Black 65% |
| Link hovered | Black, underlined |
| Link focused | 2px focus ring `#007FC9`, 1px outside, 2px corners |
| Text step | Black 65%, no hover |
| Current page | Black |

## Behaviour

| Situation | Result |
|---|---|
| Narrow screen | Steps wrap onto more lines |
| Long step | Cut off with … at 240px |
| Earlier step chosen | Follows its link, or calls `onSelect`; emits `select` |

## Accessibility

| Part | Announced as |
|---|---|
| Container | `navigation` landmark named "Breadcrumb", containing an ordered list |
| Current page | `aria-current="page"` |
| Separators and icons | Hidden from assistive tech |

| Contrast | Ratio |
|---|---|
| Links and text steps (black 65%) on white | about 6.5:1 |
| Separator (black 40%) | Decorative |

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Breadcrumb.vue` | — |
| iOS (SwiftUI) | — | Use the navigation stack's back button and title instead. |
| Android (Compose) | — | Use the top app bar's up button and title instead. |

## Tokens used

| Token | Used for |
|---|---|
| color black | current page, hovered link |
| color black (65%) | links and text steps |
| color black (40%) | separators |
| color focus | focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Follow the Sidebar with `sidebarTrail()`, so both agree | Build the trail by hand where it can drift from the Sidebar |
| Keep the current page as the last step, not a link | Link the current page to itself |
| Leave groups that aren't pages as text | Link a group to a page it doesn't have |
