import type { AppLauncherApp } from './AppLauncher.vue'

/** The Keston Group's apps, as the launcher lists them by default. Apps can pass their own `apps`. */
export const kestonApps: AppLauncherApp[] = [
  { id: 'id', label: 'Keston ID', description: 'Your account and sign-in', href: 'https://id.keston.co', icon: 'id' },
  { id: 'admin', label: 'Admin', description: 'Manage people and access', href: 'https://admin.keston.co', icon: 'admin' },
  { id: 'work', label: 'Work', description: 'Day-to-day work', href: 'https://work.keston.co', icon: 'work' },
  { id: 'utilities', label: 'Utilities', description: 'Small tools that run on your device', href: 'https://utilities.keston.co', icon: 'utilities' },
  { id: 'design', label: 'Design system', description: 'Keston UI', href: 'https://ui.keston.co', icon: 'design' }
]
