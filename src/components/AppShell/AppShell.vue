<script setup lang="ts">
import { onBeforeUnmount, onMounted, useId, type HTMLAttributes } from 'vue'
import { Menu } from '@lucide/vue'
import { TooltipProvider } from 'reka-ui'
import { cn } from '../../lib/cn'
import Button from '../Button/Button.vue'
import Header, { type HeaderProps, type HeaderUser, type HeaderUserAction } from '../Header/Header.vue'
import Sidebar, { type SidebarItem, type SidebarProps } from '../Sidebar/Sidebar.vue'
import Slideover from '../Slideover/Slideover.vue'

/**
 * The layout of a whole app page: the Header across the top, the app's
 * Sidebar down the left, and the page in the middle. Every app uses this, so
 * the header looks and behaves the same everywhere; only the sidebar's items
 * and the page change.
 *
 * - Wide screens (lg and up): the sidebar sits beside the page, and the
 *   header's menu button collapses it to icons and back (unless
 *   `collapsible` is false).
 * - Narrow screens: the sidebar is hidden and the menu button opens it in a
 *   Slideover from the left, whose title bar is the header's height. Choosing
 *   an item, or the screen becoming wide, closes it.
 * - The page itself scrolls (not an inner box), so the header stays at the
 *   top (sticky), the sidebar stays put below it, and mobile browsers can
 *   hide their address bar while scrolling.
 *
 * The account menu (top right) is the Header's: pass `user` and listen for
 * account-settings, switch-account, log-out (and sign-in when signed out).
 *
 * Slots: default (the page), header-leading, header-middle, header-trailing,
 * account, account-menu (passed to Header), sidebar-header and sidebar-footer (passed to Sidebar;
 * sidebar-header is only shown on wide screens, as the Slideover has its own
 * title).
 */
export interface AppShellProps {
  /** Name of the app, shown in the header and as the mobile menu's title. */
  title?: string
  /** The signed-in user, for the account menu. Without it, Sign in is shown. */
  user?: HeaderUser
  /** Which actions the account menu offers. Default all three. */
  userActions?: HeaderUserAction[]
  /** Show Sign in when there is no user. */
  signIn?: boolean
  /** Sidebar items in a single section. */
  items?: SidebarItem[]
  /** Sidebar items in labelled sections. */
  sections?: SidebarProps['sections']
  /** Wide screens: show the header's menu button, which collapses the sidebar to icons. */
  collapsible?: boolean
  /** Component used for sidebar items with `to`, e.g. RouterLink. */
  linkComponent?: SidebarProps['linkComponent']
  /** Other Header props, e.g. `{ ui: { title: '…' } }`. */
  header?: Omit<HeaderProps, 'title' | 'menu' | 'menuOpen' | 'sticky' | 'user' | 'userActions' | 'signIn'>
  /** Other Sidebar props, e.g. `{ label: 'Admissions' }`. */
  sidebar?: Omit<SidebarProps, 'items' | 'sections' | 'collapsible' | 'linkComponent'>
  class?: HTMLAttributes['class']
  /** Extra classes for the parts. */
  ui?: {
    main?: HTMLAttributes['class']
  }
}

const props = withDefaults(defineProps<AppShellProps>(), {
  items: () => [],
  sections: () => [],
  userActions: undefined,
  signIn: true,
  collapsible: true
})

const emit = defineEmits<{
  'account-settings': []
  'switch-account': []
  'log-out': []
  'sign-in': []
}>()

defineSlots<{
  default?(): unknown
  'header-leading'?(): unknown
  'header-middle'?(): unknown
  'header-trailing'?(): unknown
  account?(): unknown
  'account-menu'?(props: { close: () => void }): unknown
  'sidebar-header'?(props: { collapsed: boolean }): unknown
  'sidebar-footer'?(props: { collapsed: boolean; mobile: boolean }): unknown
}>()

/** Sidebar collapsed to icons (wide screens). Use v-model:collapsed to keep it, e.g. in localStorage. */
const collapsed = defineModel<boolean>('collapsed', { default: false })

/** Mobile menu open. Optional: use v-model:menu-open to control it. */
const menuOpen = defineModel<boolean>('menuOpen', { default: false })

// Close the mobile menu once the inline sidebar is showing instead.
// Matches Tailwind's lg breakpoint, used in the template.
let wide: MediaQueryList | undefined
const onWide = () => {
  if (wide?.matches) menuOpen.value = false
}
onMounted(() => {
  wide = window.matchMedia('(min-width: 64rem)')
  wide.addEventListener('change', onWide)
})
onBeforeUnmount(() => wide?.removeEventListener('change', onWide))

// "Skip to content" target. Unique, in case two shells are on one page (e.g. Storybook docs).
const uid = useId()
const mainId = `${uid}-main`
const sidebarId = `${uid}-sidebar`
</script>

<template>
  <!-- One provider for every Tooltip in the app, so moving from one to the
       next shows it without waiting again. -->
  <TooltipProvider :delay-duration="400" :skip-delay-duration="300">
  <div :class="cn('flex min-h-dvh flex-col bg-background text-black', props.class)">
    <!-- First thing keyboard users reach: jumps past the header and sidebar. -->
    <a
      :href="`#${mainId}`"
      class="sr-only z-50 rounded bg-white px-4 py-2 text-sm focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:outline-2 focus:outline-focus"
    >
      Skip to content
    </a>

    <Header
      v-bind="header"
      :title="title"
      menu
      sticky
      :menu-open="menuOpen"
      :user="user"
      :user-actions="userActions"
      :sign-in="signIn"
      :ui="{ ...header?.ui, menu: cn('lg:hidden', header?.ui?.menu) }"
      @menu="menuOpen = true"
      @account-settings="emit('account-settings')"
      @switch-account="emit('switch-account')"
      @log-out="emit('log-out')"
      @sign-in="emit('sign-in')"
    >
      <template #leading>
        <!-- Wide screens: in place of the menu button (same look and spot),
             collapses the sidebar beside the page to icons and back. -->
        <Button
          v-if="collapsible"
          variant="ghost"
          square
          :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :aria-expanded="!collapsed"
          :aria-controls="sidebarId"
          class="-ml-2.5 max-lg:hidden"
          @click="collapsed = !collapsed"
        >
          <Menu />
        </Button>
        <slot name="header-leading" />
      </template>
      <slot name="header-middle" />
      <template v-if="$slots['header-trailing']" #trailing><slot name="header-trailing" /></template>
      <template v-if="$slots.account" #account><slot name="account" /></template>
      <template v-if="$slots['account-menu']" #account-menu="slotProps"><slot name="account-menu" v-bind="slotProps" /></template>
    </Header>

    <div class="flex flex-1">
      <!-- Wide screens: beside the page, held below the header while the page scrolls. -->
      <div class="sticky top-12 hidden h-[calc(100dvh-var(--spacing)*12)] shrink-0 self-start lg:flex">
        <Sidebar
          v-bind="sidebar"
          :id="sidebarId"
          v-model:collapsed="collapsed"
          :items="items"
          :sections="sections"
          :link-component="linkComponent"
        >
          <template v-if="$slots['sidebar-header']" #header="slotProps"><slot name="sidebar-header" v-bind="slotProps" /></template>
          <template v-if="$slots['sidebar-footer']" #footer="slotProps">
            <slot name="sidebar-footer" v-bind="slotProps" :mobile="false" />
          </template>
        </Sidebar>
      </div>

      <!-- Narrow screens: in a Slideover opened by the header's menu button. -->
      <Slideover
        v-model:open="menuOpen"
        side="left"
        :title="title || 'Menu'"
        :ui="{
          content: 'max-w-72',
          // The header is a column (it also holds a Progress for steps), so
          // justify-center centres the title row vertically in the 48px bar,
          // and the row keeps the full width: title left, × right. 20px in,
          // so the title lines up with the menu items' icons below it.
          header: 'h-12 justify-center px-5 py-0',
          title: 'text-base font-bold',
          body: 'flex p-0'
        }"
      >
        <template #body>
          <Sidebar
            v-bind="sidebar"
            :items="items"
            :sections="sections"
            :link-component="linkComponent"
            class="h-auto min-h-full w-full border-r-0"
            @select="menuOpen = false"
          >
            <template v-if="$slots['sidebar-footer']" #footer="slotProps">
              <slot name="sidebar-footer" v-bind="slotProps" :mobile="true" />
            </template>
          </Sidebar>
        </template>
      </Slideover>

      <main :id="mainId" tabindex="-1" :class="cn('min-w-0 flex-1 outline-none', ui?.main)">
        <slot />
      </main>
    </div>
  </div>
  </TooltipProvider>
</template>
