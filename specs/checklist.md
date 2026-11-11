# Checklist

> Steps towards something, ticked off as they're done.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Data/Checklist

## When to use

- Showing what's left before a form can be submitted, or a setup's progress (e.g. New School Year Setup's summary).

## When not to use

- Things people tick themselves: use Checkbox.
- A sequence people move through page by page: a stepper (not in the library yet).

## Anatomy

| Part | Required | Notes |
|---|---|---|
| item | Yes | An icon and a label. |
| icon | Yes | Done: green circled tick. To do: empty grey circle. 16px. |
| label | Yes | Done: black. To do: black 65%. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| items | { label, done }[] | — | Required. Labels must be unique. |

## Spacing and layout

- Items 8px apart; icon to label 8px. The icon stays level with the first line of a label that wraps.
- Usually in a summary Card beside a form.

## Accessibility

- A `<ul>`; each item adds "(done)" or "(to do)" for screen readers, as the icon is decorative.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Checklist.vue` | — |
| iOS (SwiftUI) | — | `Label` rows with `checkmark.circle.fill` / `circle`. |
| Android (Compose) | — | Rows with `CheckCircle` / `RadioButtonUnchecked` icons. |

## Tokens used

| Token | Used for |
|---|---|
| `color-green` | Done icon |

## Do / Don't

| Do | Don't |
|---|---|
| Name each step by its part of the page ("Term dates"). | Write instructions ("You need to add term dates"). |
