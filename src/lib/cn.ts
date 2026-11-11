import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Join class names and resolve Tailwind conflicts, so a class passed in by
 * the app (e.g. `class="px-8"`) overrides the component's own `px-4`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
