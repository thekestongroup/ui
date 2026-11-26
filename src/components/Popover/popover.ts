/**
 * The shared look of floating panels: Popover, and anything else built on
 * Reka's popper (e.g. InputDate's calendar), so they all match.
 *
 * An elevated panel (white; a step lighter than the page in dark mode) with
 * the same border and radius as a basic Button, a shadow,
 * and the theme's fade in / out (Reka waits for the fade-out to finish
 * before removing the panel).
 */
export const popoverContent = [
  'z-50 rounded border border-ink/10 bg-surface-elevated text-ink shadow-md outline-none',
  'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out'
]

/**
 * The arrow pointing at the trigger: a white square turned 45° with the
 * panel's border on its two outer edges, half overlapping the panel so it
 * covers the panel's border where they meet. Reka rotates the arrow's wrapper
 * for each side, so this only needs drawing pointing down.
 */
export const popoverArrow = 'block size-2.5 -translate-y-1/2 rotate-45 border-r border-b border-ink/10 bg-surface-elevated'
