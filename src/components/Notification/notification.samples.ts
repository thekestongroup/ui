// Sample notifications for Storybook (not part of the library).
import { h } from 'vue'
import type { NotificationInput } from './notifications'

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000)

export const passwordExpiry: NotificationInput = {
  type: 'warning',
  title: 'Password Expiry',
  description: () => ['Your password expires in ', h('b', '7 days'), '.'],
  action: { label: 'Change password', onSelect: () => console.log('Change password') },
}

export function sampleNotifications(): NotificationInput[] {
  return [
    { ...passwordExpiry, createdAt: minutesAgo(4) },
    {
      type: 'success',
      title: 'Timetable published',
      description: 'The 2027–28 timetable is now visible to staff and students.',
      createdAt: minutesAgo(52),
    },
    {
      type: 'error',
      title: 'Census upload failed',
      description: () => ['The file ', h('b', 'census-autumn.xml'), ' has 3 errors. Fix them and upload it again.'],
      action: { label: 'View errors' },
      createdAt: minutesAgo(3 * 60),
    },
    {
      type: 'info',
      title: 'New application',
      description: 'Amelia Clarke applied for Year 7.',
      createdAt: minutesAgo(26 * 60),
      read: true,
    },
    {
      type: 'info',
      title: 'Maintenance on Saturday',
      description: 'Keston will be unavailable from 7am to 9am on 14 November.',
      createdAt: minutesAgo(4 * 24 * 60),
      read: true,
    },
  ]
}
