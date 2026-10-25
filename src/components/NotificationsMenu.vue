<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed } from 'vue'
import {
  clearNotifications,
  markNotificationsRead,
  removeNotification,
  toastNotifications,
} from '../lib/toast'

const unread = computed(() => toastNotifications.filter((n) => !n.read).length)

function onOpen(open: boolean) {
  if (open) markNotificationsRead()
}

function relativeTime(ts: number) {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const statusDot: Record<string, string> = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  plain: 'bg-neutral-400',
}
</script>

<template>
  <PopoverRoot @update:open="onOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        aria-label="Notifications"
        class="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        <span
          v-if="unread"
          class="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white"
        >
          {{ unread > 9 ? '9+' : unread }}
        </span>
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        align="end"
        :side-offset="8"
        class="z-50 w-80 rounded-lg border border-neutral-200 bg-white p-0 shadow-lg outline-none"
      >
        <div class="flex items-center justify-between border-b border-neutral-100 px-3 py-2">
          <p class="text-sm font-semibold">Notifications</p>
          <button
            v-if="toastNotifications.length"
            type="button"
            class="rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            @click="clearNotifications"
          >
            Clear all
          </button>
        </div>

        <p v-if="toastNotifications.length === 0" class="px-3 py-6 text-center text-sm text-neutral-400">
          No notifications yet.
        </p>

        <ul v-else class="max-h-80 divide-y divide-neutral-100 overflow-y-auto">
          <li
            v-for="item in toastNotifications"
            :key="item.id"
            class="group flex items-start gap-2 px-3 py-2.5"
          >
            <span
              class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              :class="statusDot[item.status] || statusDot.plain"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-neutral-900">
                {{ item.title || 'Notification' }}
              </p>
              <p v-if="item.description" class="mt-0.5 text-xs text-neutral-500">
                {{ item.description }}
              </p>
              <p class="mt-0.5 text-xs text-neutral-400">{{ relativeTime(item.at) }}</p>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              class="mt-0.5 shrink-0 rounded p-1 text-neutral-300 opacity-0 transition-opacity hover:bg-neutral-100 hover:text-neutral-600 group-hover:opacity-100"
              @click="removeNotification(item.id)"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        </ul>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
