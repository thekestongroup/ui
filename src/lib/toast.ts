import { createToastManager } from 'reka-ui'
import type { ToastAddOptions } from 'reka-ui'
import { reactive } from 'vue'

const manager = createToastManager()

export type ToastStatus = 'success' | 'warning' | 'error' | 'info' | 'plain'

export interface ToastNotification {
  id: string
  title: string
  description: string
  status: ToastStatus
  at: number
  read: boolean
}

const MAX_NOTIFICATIONS = 100

export const toastNotifications = reactive<ToastNotification[]>([])

function toText(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

function record(id: string, options: ToastAddOptions, status: ToastStatus) {
  toastNotifications.unshift({
    id,
    title: toText(options.title),
    description: toText(options.description),
    status,
    at: Date.now(),
    read: false,
  })
  if (toastNotifications.length > MAX_NOTIFICATIONS) {
    toastNotifications.length = MAX_NOTIFICATIONS
  }
}

function add(options: ToastAddOptions) {
  const status = (options.status as ToastStatus) ?? 'plain'
  const id = manager.add(options)
  record(id, options, status)
  return id
}

function update(id: string, options: Partial<ToastAddOptions>) {
  const existing = toastNotifications.find((n) => n.id === id)
  if (existing) {
    if (options.title !== undefined) existing.title = toText(options.title)
    if (options.description !== undefined) existing.description = toText(options.description)
    if (options.status !== undefined) existing.status = options.status as ToastStatus
  }
  return manager.update(id, options)
}

function addWithStatus(status: ToastStatus) {
  return (options: ToastAddOptions) => add({ ...options, status })
}

export const toast = {
  add,
  update,
  close: manager.close,
  promise: manager.promise,
  success: addWithStatus('success'),
  warning: addWithStatus('warning'),
  error: addWithStatus('error'),
  info: addWithStatus('info'),
  plain: addWithStatus('plain'),
}

export function markNotificationsRead() {
  for (const n of toastNotifications) n.read = true
}

export function clearNotifications() {
  toastNotifications.length = 0
}

export function removeNotification(id: string) {
  const index = toastNotifications.findIndex((n) => n.id === id)
  if (index !== -1) toastNotifications.splice(index, 1)
}

export const toastManager = manager

export type {
  ToastObject,
  ToastAddOptions,
  ToastUpdateOptions,
  ToastPromiseOptions,
} from 'reka-ui'
