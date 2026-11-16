# Languages

Keston UI's components never hold English in their templates. What a component says (a button's name, text for screen readers, an error under a field) comes from [vue-i18n](https://vue-i18n.intlify.dev), so an app can be shown in any language Keston has.

## Set up

`createKestonI18n` creates the vue-i18n instance for you. It adds Keston UI's words to yours, falls back to English for any word a language doesn't have yet, remembers the language someone chose, and keeps `<html lang>` right.

```ts
import { createApp } from 'vue'
import { createKestonI18n } from '@thekestongroup/ui'
import en from './locales/en.json'

const i18n = createKestonI18n({ messages: { en } })
createApp(App).use(i18n).mount('#app')
```

`messages` is your own words, by language code. Keston UI's are under the `ui` key, so don't use that as a top-level key of your own.

Which language it starts in: the one chosen last time, else the browser's, else English.

## Write your words

Keep your strings in one file per language, nested by page or feature, and use them with vue-i18n's `t`:

```json
{
  "users": {
    "title": "Users",
    "added": "{name} has been added"
  }
}
```

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <h1>{{ t('users.title') }}</h1>
</template>
```

Put the whole sentence in the string, with `{placeholders}` for the parts that change. Never join pieces of a sentence in code: other languages order them differently.

## Let people choose

Put a [LanguageSwitcher](/components/language-switcher) wherever it suits (Settings, the account menu, a footer). It lists the languages your instance has, each in its own name.

## Add a language

1. Copy your `en.json` to a new file named for the language, e.g. `cy.json`, and translate the values. Keep the keys and the `{placeholders}` as they are.
2. Add it to `messages`: `createKestonI18n({ messages: { en, cy } })`.
3. Keston UI's own words are in `en` from `@thekestongroup/ui` (also exported as `uiMessages`). Until Keston UI has the language, its components show English for their own words.

## Dates

Dates, times and numbers use `en-GB` for now. They'll follow the chosen language in a later release.
