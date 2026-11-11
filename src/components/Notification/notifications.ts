import { computed, reactive, type VNodeChild } from 'vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface NotificationAction {
  label: string
  /** Run when pressed. The toast closes afterwards (the notification stays in the pane). */
  onSelect?: () => void
  /** Make the action a link instead. */
  href?: string
}

export interface NotificationInput {
  /** Generated if left out. Notifying with an id that's already there replaces it. */
  id?: string
  /** Colour and icon. Default info. */
  type?: NotificationType
  title: string
  /**
   * Text under the title. A string, or a render function for formatting,
   * e.g. `() => ['Your password expires in ', h('b', '7 days'), '.']`.
   * (No HTML strings: they'd let anything that reaches a notification run
   * as code.)
   */
  description?: string | (() => VNodeChild)
  action?: NotificationAction
  /**
   * A one-line toast: icon, title, action, × (e.g. "✓ Student disabled
   * [Undo]"). For quick confirmations; the description isn't shown in the
   * toast. In the pane it's a normal row.
   */
  compact?: boolean
  /** When it happened. Default now. */
  createdAt?: Date
  read?: boolean
}

export interface NotificationItem extends NotificationInput {
  id: string
  type: NotificationType
  createdAt: Date
  read: boolean
}

export interface ToastOptions {
  /** Pop up a toast as well as adding it to the history. Default true. */
  toast?: boolean
  /**
   * How long the toast stays, in ms. Default 6000; until closed for errors,
   * and for toasts with an action (people need time to use it); compact ones
   * with an action (Undo) stay 10 seconds.
   */
  duration?: number
}

export interface ShownToast {
  id: string
  duration: number
  item: NotificationItem
}

let counter = 0
const newId = () => `notification-${Date.now().toString(36)}-${(counter++).toString(36)}`

/** Default toast length: long enough to read; forever when there's something to do. */
export function toastDuration(item: Pick<NotificationItem, 'type' | 'action' | 'compact'>, duration?: number) {
  if (duration !== undefined) return duration
  if (item.type === 'error') return Number.POSITIVE_INFINITY
  // A quick "Undo" shouldn't wait forever, but needs longer than reading.
  if (item.action) return item.compact ? 10_000 : Number.POSITIVE_INFINITY
  return 6000
}

/**
 * A list of notifications (newest first), and the ones currently showing as
 * toasts. Pass `items` to NotificationPane and `toasts` to Toaster, or call
 * `useNotifications()` for one shared list for the whole app.
 */
export function createNotifications(initial: NotificationInput[] = []) {
  const state = reactive({
    items: initial.map(toItem).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as NotificationItem[],
    toasts: [] as ShownToast[]
  })

  function toItem(input: NotificationInput): NotificationItem {
    return { ...input, id: input.id ?? newId(), type: input.type ?? 'info', createdAt: input.createdAt ?? new Date(), read: input.read ?? false }
  }

  /** Add a notification (to the top), and pop it up as a toast. Returns its id. */
  function notify(input: NotificationInput, options: ToastOptions = {}): string {
    const item = toItem(input)
    state.items = [item, ...state.items.filter((existing) => existing.id !== item.id)]
    if (options.toast !== false) {
      state.toasts = [...state.toasts.filter((toast) => toast.id !== item.id), { id: item.id, duration: toastDuration(item, options.duration), item }]
    }
    return item.id
  }

  /** Remove it from the history (and its toast). */
  function dismiss(id: string) {
    state.items = state.items.filter((item) => item.id !== id)
    hideToast(id)
  }

  /** Close its toast; it stays in the history. */
  function hideToast(id: string) {
    state.toasts = state.toasts.filter((toast) => toast.id !== id)
  }

  /** Remove everything from the history. Toasts showing stay until they close. */
  function clear() {
    state.items = []
  }

  function markAllRead() {
    state.items = state.items.map((item) => (item.read ? item : { ...item, read: true }))
  }

  const unreadCount = computed(() => state.items.filter((item) => !item.read).length)

  return {
    get items() {
      return state.items
    },
    /** Toasts showing, oldest first (the order they stack in). */
    get toasts() {
      return state.toasts
    },
    unreadCount,
    notify,
    dismiss,
    hideToast,
    clear,
    markAllRead
  }
}

export type Notifications = ReturnType<typeof createNotifications>

let shared: Notifications | undefined
/** One shared notification list for the whole app. */
export function useNotifications(): Notifications {
  return (shared ??= createNotifications())
}

// Kept here too, for existing imports.
export { relativeTime } from '../../lib/dates'
