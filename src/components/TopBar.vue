<script setup lang="ts">
import AppLauncher from './AppLauncher.vue'
import type { AppLink } from '../lib/types'

withDefaults(
  defineProps<{
    appName: string
    apps?: AppLink[]
    current?: string
    showMenu?: boolean
  }>(),
  {
    apps: () => [],
    current: '',
    showMenu: false,
  },
)

defineEmits<{
  (e: 'menu'): void
}>()
</script>

<template>
  <header class="flex h-12 items-center gap-2 border-b border-neutral-200 bg-white px-3 sm:px-4">
    <AppLauncher :apps="apps" :current="current" />

    <button
      v-if="showMenu"
      type="button"
      aria-label="Toggle navigation"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-blue-500"
      @click="$emit('menu')"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <span class="ml-1 truncate text-base font-semibold text-neutral-900">{{ appName }}</span>

    <div class="ml-2 min-w-0 flex-1">
      <slot name="search" />
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <slot name="actions" />
      <slot name="notifications" />
      <slot name="profile" />
    </div>
  </header>
</template>
