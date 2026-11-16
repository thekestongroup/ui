# SettingsRow

> What a setting is and does on the left, the control that changes it on the right.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Layout/SettingsRow

## When to use

- A settings page: each setting is a row with its control, e.g. Multi-factor authentication → a Select.

## When not to use

- A field in a form that is submitted with others: use the field itself (Input, Select…), with its own label.
- A list of items: use Table or SummaryList.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| label | string | — | Required. What the setting is called. |
| description | string | — | What it does, in smaller text. |
| default slot | — | — | The control: give it the same label with `hide-label`. |

## Spacing and layout

- Label to description: 2px. Left to control: 24px (stacked at 12px under 640px). The control is 320px wide (full width when stacked).
- Rows in a Card are 24px apart, with a Divider if there are several.

## Accessibility

- The visible label is hidden from screen readers (`aria-hidden`); the control carries the same name through `hide-label`, so it is read once.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `SettingsRow.vue` | — |
| iOS (SwiftUI) | — | — |
| Android (Compose) | — | — |
