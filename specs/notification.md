# Notification

> Something people should know about: a toast when it happens, and a list of past ones behind the bell in the Header.

**Status:** Draft · **Figma:** _link_ · **Storybook:** Components/Notification

Three parts share one list of notifications:

| Part | What it is |
|---|---|
| `Notification` | One notification: icon, title, description, an optional action, and a × |
| `Toaster` | New notifications popping up in a corner, stacked |
| `NotificationPane` | The bell in the Header, with an unread count, opening the list of past notifications |

```ts
const { notify } = useNotifications()   // one shared list for the app
notify({
  type: 'warning',
  title: 'Password Expiry',
  description: () => ['Your password expires in ', h('b', '7 days'), '.'],
  action: { label: 'Change password', onSelect: openPasswordSettings },
})
```

## When to use

| Use a notification for | Use instead |
|---|---|
| Something that happened, especially in the background (an upload finished, a password is expiring) | The result of what someone just did on the page (show it there: a Button's status, a field's error) |
| Something people may want to come back to (it stays in the pane) | A problem that blocks the page (an alert on the page) |
| | A question that needs an answer before continuing (a dialog) |

## Anatomy

| Part | Required | Notes |
|---|---|---|
| icon | Yes | From the type, 16px, in its colour. |
| title | Yes | Short, bold. |
| description | No | A string, or a render function for **bold** text and links. |
| action | No | One small basic Button, e.g. "Change password". Closes the toast or pane. |
| time | Pane only | "4 minutes ago" (RelativeTime: the exact date and time on hover or focus), kept up to date. |
| unread dot | Pane only | 8px primary dot, and a light blue background on the row. |
| × | Yes | Toast: closes it (it stays in the pane). Pane: removes it. |

## Types

| Type | Icon | Colour | Toast stays | Announced |
|---|---|---|---|---|
| info | Info (i) | blue `#035483` | 6 seconds | When the screen reader is idle |
| success | Circle check | green `#007A16` | 6 seconds | When the screen reader is idle |
| warning | Triangle | orange `#B84A00` | 6 seconds | Straight away |
| error | Circle × | red `#D2042D` | Until closed | Straight away |

With an action, every type stays until closed, so people have time to use it, except compact ones (e.g. Undo), which stay 10 seconds. Errors always stay.

## Compact

One line, for quick confirmations: icon, title, the action on the right, then ×.

```ts
notify({ type: 'success', title: 'Student disabled', compact: true, action: { label: 'Undo', onSelect: undo } })
```

| Rule | Value |
|---|---|
| Width | The same as other toasts (384px), only shorter |
| Padding | 12px left, 6px top and bottom, 6px right beside the × (12px without one) |
| Content | Title only: the description isn't shown in the toast. In the pane it's a normal row. |
| Gaps | 8px icon to title, 12px title to action |

## Properties

### notify(input, options)

| Field | Type | Default | Description |
|---|---|---|---|
| title | string | — | Required. |
| type | info \| success \| warning \| error | info | |
| description | string \| () => VNode | — | No HTML strings, so nothing in a notification can run as code. |
| action | { label, onSelect?, href? } | — | |
| compact | boolean | false | One-line toast (see Compact). |
| id | string | generated | Notifying with the same id replaces it, e.g. "Uploading…" then "Uploaded". |
| createdAt | Date | now | |
| options.toast | boolean | true | False: only add it to the pane. |
| options.duration | number (ms) | see Types | |

### Components

| Component | Property | Type | Default |
|---|---|---|---|
| Toaster | notifications | the list | the shared `useNotifications()` |
| Toaster | position | bottom-right \| top-right \| bottom-center | bottom-right |
| Toaster | limit | number | 3 (more wait their turn) |
| NotificationPane | notifications | the list | the shared `useNotifications()` |
| NotificationPane | label | string | "Notifications" |
| NotificationPane | emptyText | string | "You're all caught up." |
| Notification | appearance | card \| row | card |
| Notification | compact | boolean | false |
| Notification | dismissible, dismissLabel | boolean, string | true, "Dismiss: {title}" |

## Sizes

| Part | Value |
|---|---|
| Toast | 384px wide (full width minus 16px each side on phones), 16px padding, shadow, 4px corners, 8px between toasts, 16px from the edges |
| Pane | 384px wide, as tall as fits under the Header then scrolls; heading row 44px; rows clipped to its 4px corners |
| Pane row | 16px sides, 12px top and bottom, a line between |
| Icon to text | 12px |
| Title / description | 14px / 20px; title bold black, description black 65% (bold parts black) |
| Time | 12px, black 65% |
| Action | Small basic Button, 8px above |
| Unread count | 16px red circle, white bold 12px, "9+" above 9, white ring |

## Behaviour

| Action | Result |
|---|---|
| `notify()` | Added to the top of the pane; a toast slides in |
| Hover a toast, or leave the window | Its timer pauses |
| Swipe a toast right | It closes |
| F8 | Focus jumps to the toasts |
| Open the pane | Unread ones show a dot |
| Close the pane | All marked read; the count goes |
| × in the pane | Removed; focus moves to the next one's × (or the heading) |
| Clear all | All removed; focus moves to the heading; toasts showing stay until they close |

## Accessibility

| Part | Announced as |
|---|---|
| Bell | Button "Notifications, 3 unread" |
| Toast | Read out when it appears ("Notification, Warning: Password Expiry, Your password expires in 7 days"), politely or straight away by type |
| Toasts area | `region` "Notifications (F8)" |
| Pane | `region` named by its heading, a list of notifications |
| Each notification | `group` named by its title; the type is read before the title |
| Unread | "Unread," before the time |
| × | "Dismiss: {title}" in the pane, "Close: {title}" on a toast |

Colour is never the only signal: each type has its own icon and is said in words.

## Platform adaptation

| Platform | Implementation | Differences |
|---|---|---|
| Web / desktop (Vue) | `Notification.vue`, `Toaster.vue`, `NotificationPane.vue` (Reka UI Toast and Popover) | — |
| iOS (SwiftUI) | — | System notifications when the app is closed; a banner overlay in the app; the list in a sheet. |
| Android (Compose) | — | `Snackbar` for toasts (one at a time); the list in a bottom sheet or screen. |

## Tokens used

| Token | Used for |
|---|---|
| color blue / green / orange / red | type icons |
| color red | unread count |
| color primary | unread dot |
| color blue (5%) | unread row background |
| color black (65%) | description, time |
| color black (15%) | borders, lines |

## Do / Don't

| Do | Don't |
|---|---|
| Write a title that makes sense on its own | Put the important part only in the description |
| Give errors a way forward (an action) | Notify for every small save: show those where they happened |
| Use `id` to update one notification as something progresses | Send several notifications for the same thing |
