<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { ArrowLeftRight, LogOut, Menu, Settings } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Button from '../Button/Button.vue'
import Popover from '../Popover/Popover.vue'

export interface HeaderUser {
  name: string
  email?: string
  /** Organisation or school the account belongs to, shown at the top of the account menu. */
  organisation?: string
  /** Picture URL. Initials are shown without one. */
  avatar?: string
}

export type HeaderUserAction = 'account-settings' | 'switch-account' | 'log-out'

/**
 * The bar across the top of every Keston app. It is the same in every app:
 * a menu button (to open the Sidebar on small screens), the app's name, an
 * optional middle area, actions, and the signed-in user's account menu on
 * the right (Account settings, Switch account, Log out). Each part can be
 * overridden with a slot.
 *
 * Slots: leading (before the title, e.g. a logo), title, default (the middle,
 * fills the space between title and trailing), trailing (actions before the
 * account menu), account (replaces the account menu, or the Sign in button),
 * account-menu (extra content in the account menu, above Switch account /
 * Log out: `{ close }`).
 */
export interface HeaderProps {
  /** Name of the app or area, shown next to the menu button. */
  title?: string
  /**
   * Show the menu button, which emits `menu` when pressed. Hide it on wide
   * screens with `ui.menu`, e.g. `{ menu: 'lg:hidden' }`.
   */
  menu?: boolean
  /** Whether what the menu button opens is open, for screen readers (aria-expanded). */
  menuOpen?: boolean
  /** Id of what the menu button opens (aria-controls). */
  menuControls?: string
  /** Accessible name of the menu button. */
  menuLabel?: string
  /**
   * The signed-in user. Shows their picture or initials on the right, which
   * opens the account menu. Without it, a Sign in button is shown instead
   * (see `signIn`).
   */
  user?: HeaderUser
  /**
   * Which actions the account menu offers. Each emits an event of the same
   * name. Account settings sits under the user's name; Switch account and Log
   * out share the bottom row (left and right).
   */
  userActions?: HeaderUserAction[]
  /** Show a Sign in button (emits `sign-in`) when there is no `user`. */
  signIn?: boolean
  /**
   * Stay at the top while the page scrolls (on by default). Turn off when the
   * header isn't inside the element that scrolls.
   */
  sticky?: boolean
  class?: HTMLAttributes['class']
  /** Extra classes for the parts. */
  ui?: {
    menu?: HTMLAttributes['class']
    title?: HTMLAttributes['class']
    middle?: HTMLAttributes['class']
    trailing?: HTMLAttributes['class']
    userMenu?: HTMLAttributes['class']
  }
}

const props = withDefaults(defineProps<HeaderProps>(), {
  menu: false,
  menuOpen: undefined,
  menuLabel: 'Menu',
  userActions: () => ['account-settings', 'switch-account', 'log-out'],
  signIn: true,
  sticky: true
})

const emit = defineEmits<{
  menu: []
  'account-settings': []
  'switch-account': []
  'log-out': []
  'sign-in': []
}>()

defineSlots<{
  leading?(): unknown
  title?(): unknown
  default?(): unknown
  trailing?(): unknown
  account?(): unknown
  'account-menu'?(props: { close: () => void }): unknown
}>()

// "Ben Smith" → "BS", "Ben" → "B".
const initials = computed(() => {
  const words = (props.user?.name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return ''
  const first = words[0]!
  const last = words.length > 1 ? words[words.length - 1]! : ''
  return (first[0]! + (last[0] ?? '')).toUpperCase()
})

// The avatar button's name. When it shows initials (no picture), they are
// its visible text, so the name starts with them, for voice control ("click
// BS"): "BS, account: Ben Smith". Not in brackets: axe doesn't match "(BS)".
const accountLabel = computed(() => {
  if (!props.user) return ''
  if (props.user.avatar || !initials.value) return `Account: ${props.user.name}`
  return `${initials.value}, account: ${props.user.name}`
})

function runAction(action: HeaderUserAction, close: () => void) {
  close()
  // Vue can't emit a name held in a variable with full typing, so switch.
  if (action === 'account-settings') emit('account-settings')
  else if (action === 'switch-account') emit('switch-account')
  else emit('log-out')
}

// The avatar circle: picture, or initials on primary.
const avatar = 'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-white'
</script>

<template>
  <header
    :class="cn(
      'flex h-12 shrink-0 items-center gap-2 border-b border-black/15 bg-white px-4 text-black',
      sticky && 'sticky top-0 z-40',
      props.class
    )"
  >
    <!-- A ghost icon Button; the negative margin lines its icon up with the
         header's padding, as the × does in Slideover. -->
    <Button
      v-if="menu"
      variant="ghost"
      square
      :aria-label="menuLabel"
      :aria-expanded="menuOpen"
      :aria-controls="menuControls"
      :class="cn('-ml-2.5', ui?.menu)"
      @click="emit('menu')"
    >
      <Menu />
    </Button>

    <slot name="leading" />

    <span
      v-if="title || $slots.title"
      :class="cn('min-w-0 truncate text-base font-bold', ui?.title)"
    >
      <slot name="title">{{ title }}</slot>
    </span>

    <div :class="cn('flex min-w-0 flex-1 items-center', ui?.middle)">
      <slot />
    </div>

    <div
      v-if="$slots.trailing || $slots.account || user || signIn"
      :class="cn('flex shrink-0 items-center gap-1', ui?.trailing)"
    >
      <slot name="trailing" />

      <slot name="account">
        <!-- Account menu: the user's avatar opens a panel with who is signed
             in and the account actions. -->
        <Popover v-if="user" :content="{ align: 'end' }" :ui="{ content: cn('w-72', ui?.userMenu) }">
          <Button variant="ghost" square :aria-label="accountLabel" class="-mr-1.5 rounded-full">
            <span :class="cn(avatar, 'size-7 text-xs')" aria-hidden="true">
              <img v-if="user.avatar" :src="user.avatar" alt="" class="size-full object-cover">
              <template v-else>{{ initials }}</template>
            </span>
          </Button>

          <template #content="{ close }">
            <div class="flex flex-col">
              <p
                v-if="user.organisation"
                class="truncate px-4 pt-3 text-xs font-bold text-black/65 uppercase"
              >
                {{ user.organisation }}
              </p>
              <!-- Two columns: the avatar at the top left, beside the name and
                   email; Account settings sits under them in the text column,
                   without moving the avatar. -->
              <div class="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 px-4 py-3">
                <span :class="cn(avatar, 'size-12 text-base')" aria-hidden="true">
                  <img v-if="user.avatar" :src="user.avatar" alt="" class="size-full object-cover">
                  <template v-else>{{ initials }}</template>
                </span>
                <div class="flex min-w-0 flex-col">
                  <span class="truncate font-bold">{{ user.name }}</span>
                  <span v-if="user.email" class="truncate text-sm text-black/65">{{ user.email }}</span>
                </div>
                <Button
                  v-if="userActions.includes('account-settings')"
                  size="sm"
                  class="col-start-2 justify-self-start"
                  @click="runAction('account-settings', close)"
                >
                  <template #leading><Settings /></template>
                  Account settings
                </Button>
              </div>

              <slot name="account-menu" :close="close" />

              <!-- Switch account on the left, Log out on the right. -->
              <div
                v-if="userActions.includes('switch-account') || userActions.includes('log-out')"
                class="flex items-center gap-2 border-t border-black/15 px-4 py-3"
              >
                <Button v-if="userActions.includes('switch-account')" @click="runAction('switch-account', close)">
                  <template #leading><ArrowLeftRight /></template>
                  Switch account
                </Button>
                <Button
                  v-if="userActions.includes('log-out')"
                  class="ml-auto"
                  @click="runAction('log-out', close)"
                >
                  <template #leading><LogOut /></template>
                  Log out
                </Button>
              </div>
            </div>
          </template>
        </Popover>

        <Button v-else-if="signIn" size="sm" variant="primary" @click="emit('sign-in')">Sign in</Button>
      </slot>
    </div>
  </header>
</template>
