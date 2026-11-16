# LanguageSwitcher

> Chooses the language the app is shown in.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Form/LanguageSwitcher

## When to use

- Settings, the account menu or a footer, in an app that has more than one language.

## When not to use

- An app with one language: leave it out.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| label | string | Language | Translated by Keston UI. |
| hideLabel | boolean | false | Label for screen readers only. |
| names | Record<string, string> | — | Names to show instead of the browser's own, e.g. `{ 'en-GB': 'English (UK)' }`. |
| disabled | boolean | false |  |

## Spacing and layout

- It is a Select, so it is as wide as its container.

## Accessibility

- Each language is listed in its own name, so people can find theirs when the page is in a language they can't read.
- Changes the vue-i18n locale straight away. `createKestonI18n` remembers it and sets `<html lang>`.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `LanguageSwitcher.vue` | — |
| iOS (SwiftUI) | — | — |
| Android (Compose) | — | — |
