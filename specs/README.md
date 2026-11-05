# Specs

One markdown file per component, describing it in **platform-neutral** terms:
anatomy, properties, sizes, spacing, states, behaviour, accessibility and how
it adapts on each platform.

The spec is the source of truth. The Vue component implements it today;
SwiftUI and Android implementations will follow the same file.

- `pnpm new <Name>` creates `specs/<name>.md` from `_template.md`.
- Use the same property and part names as Figma and the code.
- Write values as tokens (e.g. `spacing 4`, `radius control`), not raw pixels,
  wherever a token exists.
