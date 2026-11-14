# EmptyState

> What to show where a list, table or panel has nothing in it yet.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Data/EmptyState

## When to use

- A list, table, panel or page section with nothing to show: "No connected apps", "No applications yet".
- Everything has been dealt with: "You're all caught up" (NotificationPane).
- A search or filter matched nothing: "No results for “Smyth”", with a way to clear it.

## When not to use

- While data is still loading (use Spinner, or Table's `loading`).
- When loading failed (say what went wrong and how to retry, e.g. a Notification).
- A single empty value in a record (SummaryList shows "—" for that).

## Anatomy

| Part | Required | Notes |
|---|---|---|
| container | Yes | Centred column. No background or border of its own: it sits in a Card, panel or table. |
| icon | No | Decorative, above the title. Muted. |
| title | No | Short and specific. Plain text, or a heading with `headingLevel`. |
| description | No | What this space is for, or what to do next. |
| actions | No | e.g. a Button, under the text. |

Use at least a title or a description.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| title | string | — | Short and specific. |
| description | string | — | What this space is for, or what to do next. |
| icon | icon | — | Shown above the title. |
| headingLevel | 2 \| 3 \| 4 | — | Makes the title a heading at this level. Without it, the title is plain text. |
| size | sm \| md | md | sm for panels, popovers and tables; md for a Card or a page. |

Slots: title, description, actions, default (anything else, under the description). `ui.icon` adds classes to the icon, e.g. to animate it.

## Sizes

| Size | Padding (x / y) | Gap | Icon size | Title | Description |
|---|---|---|---|---|---|
| sm | spacing 4 / 10 | spacing 2 | 24px | sm, bold | sm |
| md | spacing 4 / 12 | spacing 2 (+1 under the icon) | 32px | base, bold | sm |

The description is at most 24rem (384px) wide, so it doesn't run in long lines.

## States

Not interactive: one state only. Actions inside it have their own states.

## Content guidelines

- Title: what's empty, in plain words ("No connected apps"), not "Nothing here" or "No data".
- Description: why, or what to do next ("When you sign in to an app with your Keston account, it'll show here").
- Offer an action only when there's something people can do here and now.
- No exclamation marks or jokes: an empty list may be a problem for someone.

## Accessibility

- The icon is hidden from screen readers (`aria-hidden`); the title and description carry the meaning.
- When it fills a page's main area, set `headingLevel` so the title is in the page outline.
- When it replaces content people just removed (e.g. Clear all), move focus somewhere sensible; the component itself doesn't take focus.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `EmptyState.vue` | — |
| iOS (SwiftUI) | — | `ContentUnavailableView`. |
| Android (Compose) | — | Centred Column with an Icon and Text. |

## Tokens used

| Token | Used for |
|---|---|
| color black | title |
| color black (65%) | description |
| color black (45%) | icon |

## Do / Don't

| Do | Don't |
|---|---|
| Say what's empty and what to do about it. | Leave a blank space, or a bare "No data". |
| Use one action at most two, the main one primary. | Fill it with several buttons or links. |
