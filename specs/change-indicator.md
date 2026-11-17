# ChangeIndicator

> Shows an edited setting's old and new value, e.g. `15 → 5`.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Element/ChangeIndicator

## When to use

- Beside the label of a setting that has unsaved edits, together with UnsavedChangesBar.

## When not to use

- A status ("Changed", "New"): use Badge.
- Showing a trend over time: use StatTile.

## Anatomy

| Part | Required | Notes |
|---|---|---|
| old value | Yes | Struck through, normal weight. |
| arrow | Yes | → |
| new value | Yes | Bold. Followed by the unit, if any. |

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| from | string \| number | — | Required. The saved value. |
| to | string \| number | — | Required. The edited value. |
| unit | string | — | Shown after the new value only: `3 → 5 phrases`. |

## States

Nothing is rendered when `from` and `to` are the same, so it can stay in the template and appear only while edited.

## Accessibility

- Screen readers get "Changed from 15 to 5" (translatable, `ui.changeIndicator.changed`); the symbols are hidden.
- Not colour alone: the old value is struck through and the arrow shows direction.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `ChangeIndicator.vue` | — |

## Tokens used

| Token | Used for |
|---|---|
| `color-blue` | Text, border (30%) and background (10%) |
