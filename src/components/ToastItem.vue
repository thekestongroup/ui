<script setup lang="ts">
import { CircleCheck, CircleX, Info, TriangleAlert } from '@lucide/vue'
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRoot,
  ToastTitle,
} from 'reka-ui'
import type { ToastObject } from 'reka-ui'
import type { Component } from 'vue'
import { computed } from 'vue'
import { cn } from '../lib/cn'
import CloseButton from './CloseButton.vue'

const props = defineProps<{
  toast: ToastObject
}>()

type ToastVariant = 'success' | 'warning' | 'error' | 'info' | 'plain'

interface VariantStyle {
  icon?: Component
  root: string
  iconClass: string
  title: string
  description: string
  action: string
  close: string
  bar: string
}

const variants: Record<ToastVariant, VariantStyle> = {
  success: {
    icon: CircleCheck,
    root: 'border-green-200 bg-green-50',
    iconClass: 'text-green-600',
    title: 'text-green-900',
    description: 'text-green-700',
    action: 'bg-green-100 text-green-900 hover:bg-green-200',
    close: 'text-green-600 hover:text-green-800',
    bar: 'bg-green-500',
  },
  warning: {
    icon: TriangleAlert,
    root: 'border-yellow-200 bg-yellow-50',
    iconClass: 'text-yellow-600',
    title: 'text-yellow-900',
    description: 'text-yellow-700',
    action: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200',
    close: 'text-yellow-600 hover:text-yellow-800',
    bar: 'bg-yellow-500',
  },
  error: {
    icon: CircleX,
    root: 'border-red-200 bg-red-50',
    iconClass: 'text-red-600',
    title: 'text-red-900',
    description: 'text-red-700',
    action: 'bg-red-100 text-red-900 hover:bg-red-200',
    close: 'text-red-600 hover:text-red-800',
    bar: 'bg-red-500',
  },
  info: {
    icon: Info,
    root: 'border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    title: 'text-blue-900',
    description: 'text-blue-700',
    action: 'bg-blue-100 text-blue-900 hover:bg-blue-200',
    close: 'text-blue-600 hover:text-blue-800',
    bar: 'bg-blue-500',
  },
  plain: {
    root: 'border-neutral-200 bg-white',
    iconClass: '',
    title: 'text-neutral-900',
    description: 'text-neutral-500',
    action: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
    close: 'text-neutral-400 hover:text-neutral-600',
    bar: 'bg-neutral-400',
  },
}

function variantFor(status?: string): ToastVariant {
  if (
    status === 'success' ||
    status === 'warning' ||
    status === 'error' ||
    status === 'info'
  ) {
    return status
  }
  return 'plain'
}

function progressRatio(remaining: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0
  return Math.min(Math.max(remaining / duration, 0), 1)
}

const variant = computed(() => variantFor(props.toast.status))
const style = computed(() => variants[variant.value])
</script>

<template>
  <ToastRoot
    :toast="toast"
    :class="
      cn(
        'kui-toast pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg',
        style.root,
      )
    "
    v-slot="{ remaining, duration }"
  >
    <component
      :is="style.icon"
      v-if="style.icon"
      :class="cn('h-5 w-5 shrink-0', style.iconClass)"
      aria-hidden="true"
    />
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <ToastTitle :class="cn('text-sm font-semibold', style.title)" />
      <ToastDescription :class="cn('text-sm', style.description)" />
      <ToastAction
        :class="
          cn(
            'mt-1 inline-flex h-8 items-center justify-center gap-2 self-start rounded-md px-3 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            style.action,
          )
        "
      />
    </div>
    <ToastClose
      aria-label="Close"
      :class="
        cn(
          'shrink-0 rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500',
          style.close,
        )
      "
    >
      <CloseButton />
    </ToastClose>
    <div
      v-if="Number.isFinite(duration) && duration > 0"
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-b-lg bg-black/5"
    >
      <div
        class="h-full w-full origin-left will-change-transform"
        :class="style.bar"
        :style="{ transform: `scaleX(${progressRatio(remaining, duration)})` }"
      />
    </div>
  </ToastRoot>
</template>
