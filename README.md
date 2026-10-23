# Keston UI

Vue 3 + [Reka UI](https://reka-ui.com) + [Tailwind CSS](https://tailwindcss.com) component library for the Keston product suite. Published as `@thekestongroup/ui`.

## Development

```sh
pnpm install
pnpm dev
```

`pnpm dev` serves `demo/App.vue` at `http://localhost:5173` with Vite HMR — edit any component in `src/components/` and the page hot-reloads instantly.

## Scripts

| Command           | Description                                   |
| ----------------- | --------------------------------------------- |
| `pnpm dev`        | Live demo with hot module reload              |
| `pnpm build`      | Type-check and build the library to `dist/`   |
| `pnpm typecheck`  | Type-check only                               |
| `pnpm preview`    | Preview the built demo                        |

## Structure

- `src/` — the published component library (Reka UI primitives styled with Tailwind)
- `demo/` — the development playground (not published)

## Consuming the library

```sh
pnpm add @thekestongroup/ui
```

Components are styled with Tailwind utility classes, so each consuming app must tell Tailwind to scan the library source:

```css
@import "tailwindcss";
@source "../node_modules/@thekestongroup/ui/src";
```

Some components (e.g. the `Drawer`) also ship a small amount of CSS for animation keyframes. Import it once in your app entry:

```ts
import '@thekestongroup/ui/style.css'
```

## Publishing

Publishing is done **manually** (no CI auto-publish), to the public npm registry.

```sh
# 1. Bump the version
npm version patch   # or minor / major

# 2. Build and publish (public)
pnpm build
pnpm publish --no-git-checks --access public
```

`--access public` is required because scoped packages (`@scope/name`) default to
private on npm. `pnpm publish` reads the registry + access defaults from
`publishConfig` in `package.json`, but you'll still need to be logged in
(`npm login`) or pass `--//registry.npmjs.org/:_authToken=YOUR_TOKEN`.
