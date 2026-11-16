# Getting started

Keston UI is published on npm as `@thekestongroup/ui`. It needs Vue 3.5 or later, vue-i18n 11 and Tailwind CSS v4.

## Install

```sh
pnpm add @thekestongroup/ui vue-i18n
```

## Add the theme

In your app's main CSS file, after Tailwind:

```css
@import "tailwindcss";
@import "@thekestongroup/ui/theme.css";
```

`theme.css` adds Keston's colours and font (Lato, served with the library, so no requests to Google). It also tells Tailwind to scan the library's components for the classes they use.

## Set up languages

Components take their words (button names, screen reader text, messages) from [vue-i18n](https://vue-i18n.intlify.dev), so every app needs it installed. `createKestonI18n` sets it up with Keston UI's words and yours; see [Languages](/guide/languages).

```ts
import { createApp } from 'vue'
import { createKestonI18n } from '@thekestongroup/ui'
import App from './App.vue'
import en from './locales/en.json'

createApp(App).use(createKestonI18n({ messages: { en } })).mount('#app')
```

## Use a component

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from '@thekestongroup/ui'

const name = ref('')
</script>

<template>
  <form class="flex flex-col gap-4">
    <Input v-model="name" label="Full name" />
    <Button type="submit" variant="primary">Save</Button>
  </form>
</template>
```

Every component is typed, so your editor shows its props and what they do.

## Find your way around

- **[Components](/components/button)**: one page per component, with a live example, when to use it, its props, and how it behaves for keyboard and screen-reader users.
- **[Storybook](https://ui.keston.co/storybook/)**: every component with controls for each prop, plus whole example pages built from them.
- **[Changelog](/changelog)**: what changed in each version.

## Versions

Keston UI follows [semver](https://semver.org). Before 1.0, a minor version (0.3 → 0.4) can include breaking changes, which the [changelog](/changelog) points out.
