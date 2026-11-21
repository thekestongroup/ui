<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, type Component, type HTMLAttributes } from 'vue'
import { ArrowLeftRight, LogOut, Menu, Settings } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Avatar from '../Avatar/Avatar.vue'
import Button from '../Button/Button.vue'
import { initials as toInitials } from '../../lib/initials'
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
 * Log out: `{ close }`), organisation (replaces the organisation heading at the
 * very top of the account menu, e.g. with a row that switches organisation:
 * `{ close }`).
 */
export interface HeaderProps {
  /** Name of the app or area, shown next to the menu button. */
  title?: string
  /**
   * Make the title a link, e.g. to the app's dashboard: passed as `to` to
   * `linkComponent` (e.g. a route), or as `href` without one.
   */
  titleTo?: unknown
  /** Component for the title link, e.g. RouterLink. It receives `to`. Default a plain `<a href>`. */
  linkComponent?: string | Component
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

const { t } = useI18n()
const props = withDefaults(defineProps<HeaderProps>(), {
  menu: false,
  menuOpen: undefined,
  linkComponent: 'a',
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
  organisation?(props: { close: () => void }): unknown
}>()

// "Ben Smith" → "BS", "Ben" → "B".
const initials = computed(() => toInitials(props.user?.name ?? ''))

// The avatar button's name. When it shows initials (no picture), they are
// its visible text, so the name starts with them, for voice control ("click
// BS"): "BS, account: Ben Smith". Not in brackets: axe doesn't match "(BS)".
const accountLabel = computed(() => {
  if (!props.user) return ''
  if (props.user.avatar || !initials.value) return t('ui.header.account', { name: props.user.name })
  return t('ui.header.accountWithInitials', { initials: initials.value, name: props.user.name })
})

const titleLink = computed(() => {
  const target = props.titleTo
  if (target === undefined || target === null || target === '') return undefined
  return props.linkComponent === 'a' ? { href: target as string } : { to: target }
})

// As a link the title looks the same, with a ghost button's hover and press
// backgrounds round it; the negative margin keeps the text where it was.
const titleLinkClass = [
  '-mx-2 rounded px-2 py-1 transition-colors hover:bg-black/10 active:bg-black/15',
  'outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus forced-colors:not-focus-visible:outline-0'
]

function runAction(action: HeaderUserAction, close: () => void) {
  close()
  // Vue can't emit a name held in a variable with full typing, so switch.
  if (action === 'account-settings') emit('account-settings')
  else if (action === 'switch-account') emit('switch-account')
  else emit('log-out')
}

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
      :aria-label="menuLabel ?? t('ui.header.menu')"
      :aria-expanded="menuOpen"
      :aria-controls="menuControls"
      :class="cn('-ml-2.5', ui?.menu)"
      @click="emit('menu')"
    >
      <Menu />
    </Button>

    <slot name="leading" />

    <component
      :is="titleLink ? linkComponent : 'span'"
      v-if="title || $slots.title"
      v-bind="titleLink"
      :class="cn('min-w-0 truncate text-base font-bold', titleLink && titleLinkClass, ui?.title)"
    >
      <slot name="title">{{ title }}</slot>
    </component>

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
        <Popover v-if="user" :content="{ align: 'end' }" :ui="{ content: cn('w-80', ui?.userMenu) }">
          <Button variant="ghost" square :aria-label="accountLabel" class="-mr-1.5 rounded-full">
            <Avatar :user="user" size="sm" decorative />
          </Button>

          <template #content="{ close }">
            <div class="flex flex-col">
              <!-- The organisation at the top, with a divider under it. The
                   organisation slot replaces the plain heading. -->
              <div v-if="user.organisation || $slots.organisation" class="border-b border-black/15">
                <slot name="organisation" :close="close">
                  <p class="truncate px-4 py-3 text-xs font-bold text-black/65 uppercase" :title="user.organisation">
                    {{ user.organisation }}
                  </p>
                </slot>
              </div>
              <!-- Two columns: the avatar at the top left, beside the name and
                   email; Account settings sits under them in the text column,
                   without moving the avatar. -->
              <div class="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 px-4 py-3">
                <Avatar :user="user" size="lg" decorative />
                <div class="flex min-w-0 flex-col">
                  <span class="truncate font-bold" :title="user.name">{{ user.name }}</span>
                  <span v-if="user.email" class="truncate text-sm text-black/65" :title="user.email">{{ user.email }}</span>
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

        <Button v-else-if="signIn" size="sm" variant="primary" @click="emit('sign-in')">{{ t('ui.header.signIn') }}</Button>
      </slot>
    </div>
  </header>
</template>
