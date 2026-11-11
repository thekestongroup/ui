# Avatar

> A person's picture, or their initials on a primary circle, optionally with a profile card on hover.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Element/Avatar

## When to use

| Use an Avatar for | Use instead |
|---|---|
| Showing who someone is beside their name, or in place of it | Several people together (AvatarGroup) |
| A quick look at someone's details (`profile`) without leaving the page | Full details (link to their profile page) |

## Anatomy

| Part | Required | Notes |
|---|---|---|
| circle | Yes | Primary fill, white bold initials, or the picture filling it. |
| picture | No | `user.avatar`. Falls back to initials if it fails to load. |
| profile card | No | With `profile`: a popover with organisation, a 48px avatar, name, role and email (a mailto link). |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| user | { name, avatar?, role?, email?, organisation? } | — | Required. Initials come from the first and last words of `name`. |
| size | xs \| sm \| md \| lg \| xl | md | See Sizes. |
| profile | boolean | false | Show the profile card on hover, click, tap or Enter. Makes the avatar a button. |
| decorative | boolean | false | Hidden from screen readers, when the name is already said nearby. |

## Sizes

| Size | Diameter | Initials |
|---|---|---|
| xs | 20px | 12px bold |
| sm | 28px | 12px bold |
| md | 36px | 14px bold |
| lg | 48px | 16px bold |
| xl | 64px | 20px bold |

Profile card: 256px wide; avatar 48px; name 14px bold; role and email 14px, black 65%; organisation 12px bold uppercase, black 65%.

## States

| State | Appearance | Notes |
|---|---|---|
| Picture | Picture, cropped to the circle | |
| No picture / failed | Initials on primary | |
| Focused (profile) | 2px focus ring `#007FC9`, 1px outside | Keyboard only |
| Profile open | Card below, aligned to the start | Opens after 300ms hover, closes 150ms after leaving |

## Behaviour

| Action | Result |
|---|---|
| Hover (profile) | Card opens after 300ms; stays while the pointer is on it |
| Click, tap or Enter (profile) | Card opens; focus stays on the avatar |
| Escape or click outside | Card closes |

## Accessibility

| Case | Announced as |
|---|---|
| No profile | `img` named by the person's name |
| Decorative | Hidden |
| Profile, with initials | Button named "{initials}, {name}" (visible text first, for voice control) |
| Profile, with a picture | Button named "{name}" |

Initials on primary: white on `#023750` is 12.1:1.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Avatar.vue` | — |
| iOS (SwiftUI) | — | Circle-clipped `AsyncImage` with an initials fallback; profile in a `popover` (iPad) or sheet (iPhone). |
| Android (Compose) | — | Circle-clipped image with an initials fallback; profile in a bottom sheet. |

## Tokens used

| Token | Used for |
|---|---|
| color primary | circle background |
| color white | initials |
| color focus | focus ring |

## Do / Don't

| Do | Don't |
|---|---|
| Use `decorative` when the name is beside it | Leave screen readers hearing the name twice |
| Use `profile` where people want a quick look | Put actions (message, edit) only in the profile card |
