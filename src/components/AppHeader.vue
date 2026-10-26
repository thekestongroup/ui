<script setup lang="ts">
import type { AppLink } from '../lib/types'
import Button from './Button.vue'
import NotificationsMenu from './NotificationsMenu.vue'
import ProfileSwitcher from './ProfileSwitcher.vue'
import TopBar from './TopBar.vue'

withDefaults(
  defineProps<{
    appName: string
    apps?: AppLink[]
    current?: string
    showMenu?: boolean
    authenticated?: boolean
    name?: string
    email?: string
    orgName?: string
    avatarSrc?: string
    accountSettingsUrl?: string
    differentAccountUrl?: string
    showNotifications?: boolean
    showSignIn?: boolean
    signInLabel?: string
  }>(),
  {
    apps: () => [],
    current: '',
    showMenu: false,
    authenticated: false,
    name: '',
    email: '',
    orgName: '',
    avatarSrc: '',
    accountSettingsUrl: '',
    differentAccountUrl: '',
    showNotifications: true,
    showSignIn: true,
    signInLabel: 'Sign in',
  },
)

const emit = defineEmits<{
  (e: 'menu'): void
  (e: 'signIn'): void
  (e: 'signOut'): void
}>()
</script>

<template>
  <TopBar :app-name="appName" :apps="apps" :current="current" :show-menu="showMenu" @menu="emit('menu')">
    <template #search>
      <slot name="search" />
    </template>
    <template #actions>
      <slot name="actions" />
    </template>
    <template #notifications>
      <NotificationsMenu v-if="authenticated && showNotifications" />
    </template>
    <template #profile>
      <ProfileSwitcher
        v-if="authenticated"
        :name="name"
        :email="email"
        :org-name="orgName"
        :avatar-src="avatarSrc"
        :account-settings-url="accountSettingsUrl"
        :different-account-url="differentAccountUrl"
        @sign-out="emit('signOut')"
      />
      <Button v-else-if="showSignIn" size="sm" @click="emit('signIn')">{{ signInLabel }}</Button>
    </template>
  </TopBar>
</template>
