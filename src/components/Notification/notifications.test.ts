import { describe, expect, it } from 'vitest'
import { createNotifications, toastDuration } from './notifications'

describe('createNotifications', () => {
  it('sorts the initial list newest first and fills in defaults', () => {
    const n = createNotifications([
      { title: 'Old', createdAt: new Date(2026, 0, 1) },
      { title: 'New', createdAt: new Date(2026, 5, 1), type: 'warning', read: true },
    ])
    expect(n.items.map((i) => i.title)).toEqual(['New', 'Old'])
    expect(n.items[1]).toMatchObject({ type: 'info', read: false })
    expect(n.items[0].id).toBeTruthy()
    expect(n.unreadCount.value).toBe(1)
    expect(n.toasts).toEqual([])
  })

  it('notify adds to the top and shows a toast', () => {
    const n = createNotifications([{ title: 'Old' }])
    const id = n.notify({ title: 'Saved', type: 'success' })
    expect(n.items[0]).toMatchObject({ id, title: 'Saved' })
    expect(n.toasts.map((t) => t.item.title)).toEqual(['Saved'])
    expect(n.toasts[0].duration).toBe(6000)
  })

  it('can skip the toast, and set the duration', () => {
    const n = createNotifications()
    n.notify({ title: 'Quiet' }, { toast: false })
    n.notify({ title: 'Quick' }, { duration: 2000 })
    expect(n.items).toHaveLength(2)
    expect(n.toasts.map((t) => [t.item.title, t.duration])).toEqual([['Quick', 2000]])
  })

  it('notify with an existing id replaces it', () => {
    const n = createNotifications()
    n.notify({ id: 'upload', title: 'Uploading…' })
    n.notify({ id: 'upload', title: 'Uploaded', type: 'success' })
    expect(n.items.map((i) => i.title)).toEqual(['Uploaded'])
    expect(n.toasts.map((t) => t.item.title)).toEqual(['Uploaded'])
  })

  it('dismiss removes from the list and the toasts; hideToast only the toast', () => {
    const n = createNotifications()
    const a = n.notify({ title: 'A' })
    const b = n.notify({ title: 'B' })
    n.hideToast(a)
    expect(n.items).toHaveLength(2)
    expect(n.toasts.map((t) => t.id)).toEqual([b])
    n.dismiss(b)
    expect(n.items.map((i) => i.id)).toEqual([a])
    expect(n.toasts).toEqual([])
  })

  it('clear empties the list but leaves toasts showing', () => {
    const n = createNotifications()
    n.notify({ title: 'A' })
    n.clear()
    expect(n.items).toEqual([])
    expect(n.toasts).toHaveLength(1)
  })

  it('openPane counts requests, for NotificationPane to watch', () => {
    const n = createNotifications()
    expect(n.paneRequests).toBe(0)
    n.openPane()
    n.openPane()
    expect(n.paneRequests).toBe(2)
  })

  it('no toasts while the pane is open', () => {
    const n = createNotifications()
    n.setPaneOpen(true)
    n.notify({ title: 'A' })
    expect(n.items).toHaveLength(1)
    expect(n.toasts).toEqual([])
    n.setPaneOpen(false)
    n.notify({ title: 'B' })
    expect(n.toasts).toHaveLength(1)
  })

  it('markAllRead', () => {
    const n = createNotifications([{ title: 'A' }, { title: 'B' }])
    n.markAllRead()
    expect(n.unreadCount.value).toBe(0)
  })
})

describe('toastDuration', () => {
  it('stays until closed with an action or for errors', () => {
    expect(toastDuration({ type: 'info' })).toBe(6000)
    expect(toastDuration({ type: 'error' })).toBe(Number.POSITIVE_INFINITY)
    expect(toastDuration({ type: 'warning', action: { label: 'Fix' } })).toBe(Number.POSITIVE_INFINITY)
    expect(toastDuration({ type: 'error' }, 3000)).toBe(3000)
  })
  it('gives a compact Undo 10 seconds', () => {
    expect(toastDuration({ type: 'success', compact: true, action: { label: 'Undo' } })).toBe(10_000)
    expect(toastDuration({ type: 'success', compact: true })).toBe(6000)
    expect(toastDuration({ type: 'error', compact: true, action: { label: 'Retry' } })).toBe(Number.POSITIVE_INFINITY)
  })
})
