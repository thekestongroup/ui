# Keston UI

The component library for every Keston product. Built with Vue 3, [Reka UI](https://reka-ui.com)
(behaviour and accessibility) and [Tailwind CSS v4](https://tailwindcss.com) (styling).
Published as `@thekestongroup/ui`.

## Getting started

```sh
pnpm install
pnpm dev
```

`pnpm dev` opens Storybook at http://localhost:6006. Every component has a live
playground with controls for its props, plus a docs page.

## Creating a component

```sh
pnpm new Button
```

This creates:

| File | Purpose |
|---|---|
| `src/components/Button/Button.vue` | The component (starts unstyled) |
| `src/components/Button/Button.stories.ts` | Storybook playground |
| `specs/button.md` | Platform-neutral spec: anatomy, sizes, states, rules |

and exports it from `src/index.ts`. Props you add to the component appear in
Storybook's Controls panel automatically.

Each component is done when:

1. The spec in `specs/` is filled in.
2. It uses tokens from `src/styles/theme.css`, not hard-coded values, where a token exists.
3. Its story covers every variant, size and state.
4. It works in dark mode, with a keyboard, and at phone width, with no issues in Storybook's Accessibility panel.
5. A changeset is added (`pnpm changeset`).

## Structure

```
src/
  components/   one folder per component (.vue + .stories.ts)
  lib/          shared helpers (cn)
  styles/       theme.css — the Tailwind @theme tokens
  index.ts      public exports
specs/          platform-neutral component specs (+ _template.md)
tokens/         token notes; later the cross-platform token source
docs/           Storybook docs pages (.mdx)
scripts/        pnpm new
.storybook/     Storybook config
.changeset/     pending release notes
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Storybook with hot reload |
| `pnpm new <Name>` | Scaffold a component, story and spec |
| `pnpm build` | Type-check and build the library to `dist/` |
| `pnpm typecheck` | Type-check only |
| `pnpm build-storybook` | Build Storybook as a static site |
| `pnpm changeset` | Record a change for the next release |

## Using the library in an app

```sh
pnpm add @thekestongroup/ui
```

In the app's main CSS file:

```css
@import "tailwindcss";
@import "@thekestongroup/ui/theme.css";
```

`theme.css` adds the Keston tokens and tells Tailwind to scan the library's
components for classes. Then:

```vue
<script setup lang="ts">
import { Button } from '@thekestongroup/ui'
</script>
```

## Releasing

Versions follow [semver](https://semver.org): **patch** = bug fix,
**minor** = something new, **major** = breaking change (renamed or removed
prop, component or token).

1. With each change, run `pnpm changeset` and commit the file it creates.
2. On `main`, the **Release** workflow opens a "Version Packages" pull request
   that bumps the version and updates `CHANGELOG.md`.
3. Merging that pull request triggers the **Publish** workflow, which stages
   the release on npm (trusted publishing, no token needed).
4. Approve the staged release on npmjs.com to make it live.

The Release workflow needs **Settings → Actions → General → Allow GitHub
Actions to create and approve pull requests** turned on.
