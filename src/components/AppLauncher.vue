<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import type { AppLink } from '../lib/types'

withDefaults(
  defineProps<{
    apps: AppLink[]
    current?: string
  }>(),
  {
    current: '',
  },
)

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?'
}
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <button
        type="button"
        aria-label="Open app launcher"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z" />
        </svg>
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        align="start"
        :side-offset="8"
        class="z-50 w-72 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg outline-none"
      >
        <p class="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Keston apps
        </p>
        <div class="mt-1 grid grid-cols-3 gap-1">
          <a
            v-for="app in apps"
            :key="app.href"
            :href="app.href"
            :aria-current="app.name === current ? 'page' : undefined"
            class="flex flex-col items-center gap-1.5 rounded-md p-2 text-center transition-colors hover:bg-neutral-100"
            :class="app.name === current ? 'bg-neutral-50' : ''"
          >
            <span
              class="flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold text-white"
              :class="app.name === current ? 'bg-blue-600' : 'bg-neutral-900'"
            >
              {{ initial(app.name) }}
            </span>
            <span class="text-xs text-neutral-700">{{ app.name }}</span>
          </a>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
