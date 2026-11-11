# Link

> A text link, in the size and colour of the text around it, with an external-page icon when it opens in a new tab.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Navigation/Link

## When to use

- Going to another page from within text, a footer or a tooltip: "privacy policy", "Forgot password?", "More info".

## When not to use

- Doing something on this page (save, open a panel, sign in): use Button.
- Moving around an app: use Sidebar or Breadcrumb.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| text | Yes | Underlined, 2px below the text. Colour and size come from the surrounding text. |
| new-tab icon | With `newTab`, unless `icon` is off | Lucide external-link, 0.9em, 2px after the text, on the baseline. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| href | string | — | Where it goes. |
| newTab | boolean | false | Open in a new tab, with the icon and "(opens in a new tab)" for screen readers. |
| icon | boolean | true | With `newTab`, show the icon. Turn off where it would clutter; screen readers still hear "(opens in a new tab)". |
| as | string \| component | a | e.g. RouterLink, with `to`. |

## States

| State | Appearance | Notes |
|---|---|---|
| Enabled | Text colour, 1px underline. | |
| Hovered | Black, 2px underline. | Web / desktop only |
| Focused | 2px focus ring, 2px out. | Keyboard only |

## Behaviour

- `newTab` adds `target="_blank"` and `rel="noopener noreferrer"`.
- Open in a new tab for pages outside the current task (policies, help), so people don't lose what they were doing, e.g. a half-finished sign-in.

## Content guidelines

- Say where it goes ("privacy policy", "More info"), never "click here".

## Accessibility

- A native link. With `newTab`, screen readers hear "(opens in a new tab)" after the text; the icon is hidden from them.
- Underlined, so it doesn't rely on colour alone.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Link.vue` | Reka UI Primitive, so `as` can be a router link. |
| iOS (SwiftUI) | — | `Link` with an underlined `AttributedString`; new-tab links open in Safari (`SFSafariViewController`). |
| Android (Compose) | — | `LinkAnnotation.Url` in text; new-tab links open in a Custom Tab. |

## Tokens used

| Token | Used for |
|---|---|
| `color-black` | Hover |
| `color-focus` | Focus ring |
