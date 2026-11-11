# PageHeader

> The top of a page: breadcrumb, title, status, description and the page's main actions.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Layout/PageHeader, Examples/App pages

## When to use

Every page inside AppShell, as the first thing in the page.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| breadcrumb | No | Shown when there are two or more steps. Pass `sidebarTrail(items)`. |
| title | Yes | The page's `h1`. |
| badge | No | Slot after the title, e.g. a status Badge ("Draft"). |
| description | No | A sentence under the title. |
| actions | No | Slot on the right, e.g. Buttons, an AvatarGroup. Wraps under the title on narrow screens. |
| below | No | Default slot, under everything, e.g. an alert or tabs. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| title | string | — | Required. |
| description | string | — | Slot `description` for links or formatting. |
| breadcrumb | BreadcrumbItem[] | — | Top level first, the current page last. |
| linkComponent | string \| Component | a | For breadcrumb steps with `to`. |
| ui | { title, description, actions } | — | Extra classes per part. |

## Sizes

| Part | Value |
|---|---|
| Title | 24px / 32px, bold, wraps |
| Description | 14px / 20px, black 65%, up to 65 characters wide |
| Breadcrumb to title | 8px |
| Title to description | 4px |
| Title to badge | 8px |
| Title block to actions | 24px across, 12px when wrapped under |
| Between actions | 8px |

## Behaviour

| Situation | Result |
|---|---|
| Narrow screen | Actions wrap under the title |
| Long title | Wraps onto more lines |
| One breadcrumb step | Breadcrumb hidden (the title says it) |

## Accessibility

| Part | Announced as |
|---|---|
| Title | `heading` level 1 |
| Breadcrumb | `navigation` named "Breadcrumb" |
| Container | `header` inside `main`, so not a banner landmark |

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `PageHeader.vue` | — |
| iOS (SwiftUI) | — | `navigationTitle` and toolbar items. |
| Android (Compose) | — | Top app bar title and actions. |

## Tokens used

| Token | Used for |
|---|---|
| color black | title |
| color black (65%) | description |

## Do / Don't

| Do | Don't |
|---|---|
| Put the page's one primary action here | Put several primary buttons side by side |
| Use the badge for the page's status | Put long text in the badge |
