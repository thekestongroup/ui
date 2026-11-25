import type { AppLauncherApp } from './AppLauncher.vue'

/** The Keston Group's apps, as the launcher lists them by default. Apps can pass their own `apps`. */
export const kestonApps: AppLauncherApp[] = [
  { id: 'id', label: 'Keston ID', href: 'https://id.keston.co', icon: 'id' },
  { id: 'admin', label: 'Admin', href: 'https://admin.keston.co', icon: 'admin' },
  { id: 'work', label: 'Work', href: 'https://work.keston.co', icon: 'work' },
  { id: 'utilities', label: 'Utilities', href: 'https://utilities.keston.co', icon: 'utilities' },
  { id: 'design', label: 'Design system', href: 'https://ui.keston.co', icon: 'design' }
]
