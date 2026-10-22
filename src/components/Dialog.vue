<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { cn } from '../lib/cn'
import CloseButton from './CloseButton.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    class?: string
  }>(),
  {
    title: '',
    description: '',
  },
)
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent
        :class="
          cn(
            'fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg outline-none',
            props.class,
          )
        "
      >
        <DialogTitle v-if="props.title" class="text-lg font-semibold text-neutral-900">
          {{ props.title }}
        </DialogTitle>
        <DialogTitle v-else>
          <VisuallyHidden>Dialog</VisuallyHidden>
        </DialogTitle>
        <DialogDescription v-if="props.description" class="mt-1 text-sm text-neutral-500">
          {{ props.description }}
        </DialogDescription>
        <div class="mt-4">
          <slot />
        </div>
        <DialogClose
          aria-label="Close"
          class="absolute right-4 top-4 rounded-sm text-neutral-400 outline-none hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <CloseButton />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
