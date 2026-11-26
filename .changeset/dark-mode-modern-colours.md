---
"@thekestongroup/ui": minor
---

Dark mode, a lighter modern palette and consistent states.

- **Dark mode**, opt-in per app: set `data-theme="light" | "dark" | "system"` on `<html>`. Every colour token holds both values with CSS `light-dark()`, and Tailwind's `dark:` variant follows the same switch.
- **New colour tokens.** `ink` (text, icons, borders and tints; use with an opacity, e.g. `text-ink/65`, `border-ink/10`) replaces `black` in components. `black` / `white` now only mean colours that never change (white text on a fill, black text on yellow).
- **Page and surfaces.** `background` is Tailwind neutral-100 (was `#e1e1e1`). `surface` is now white (cards, fields, header); it was `#ebebeb`, which is now `surface-muted`. `surface-elevated` is for floating panels. **Apps using `bg-surface` for a grey fill should switch to `bg-surface-muted`.**
- **Text colours for dark mode:** `primary-fg`, `red-fg`, `green-fg`, `blue-fg`, `yellow-fg` for coloured text and icons, which pass 4.5:1 in both modes. `primary` is lighter in dark mode (sky-700).
- **Softer look:** card, divider and button borders are 10% ink (was 15%), and cards, fields, basic buttons and card options have Tailwind's `shadow-xs`.
- **Accessible field outlines:** text fields, code boxes, checkboxes and radios use 45% ink (3:1, WCAG 1.4.11).
- **Consistent states** via `hover`, `pressed`, `selected`, `surface-hover` and `surface-pressed` tokens: hover 5%, pressed / open / selected / keyboard-highlighted 10%, everywhere.
- **Menu and Select lists:** options run the full width of the panel and are square (the panel keeps its rounded corners), with no gaps between them.
- **Even spacing in fields:** icons, chips and Select's arrow sit as far from the side of a field as from its top and bottom (icons 10px, chips 8px). Text stays 12px from the side.
- Calendar: days outside the month are now readable (4.5:1; they were 2.4:1).
