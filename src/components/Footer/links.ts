import type { FooterLink } from './Footer.vue'

/**
 * The links every Keston app shows on the left of its footer: help first, then the legal pages.
 * Apps can pass their own `links`, or add to these with `moreLinks`.
 */
export const kestonFooterLinks: FooterLink[] = [
  { label: 'Help & support', href: 'https://thekestongroup.com/help' },
  { label: 'Privacy Policy', href: 'https://thekestongroup.com/privacy' },
  { label: 'Terms & Conditions', href: 'https://thekestongroup.com/terms' }
]

/** Links to the rest of the Keston Group. Not shown by default: pass them as `moreLinks` where an app should offer them. */
export const kestonGroupLinks: FooterLink[] = [
  { label: 'Keston ID', href: 'https://id.keston.co' },
  { label: 'Admin', href: 'https://admin.keston.co' },
  { label: 'Work', href: 'https://work.keston.co' },
  { label: 'Design system', href: 'https://ui.keston.co' }
]
