<script setup lang="ts">
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { computed } from 'vue'
import { cn } from '../lib/cn'
import CloseButton from './CloseButton.vue'

type Side = 'top' | 'right' | 'bottom' | 'left'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    side?: Side
    class?: string
  }>(),
  {
    title: '',
    description: '',
    side: 'right',
  },
)

const swipeDirection = computed(() => {
  switch (props.side) {
    case 'top':
      return 'up'
    case 'bottom':
      return 'down'
    default:
      return props.side
  }
})

const contentClasses = computed(() => {
  const base = 'kui-drawer-content kui-drawer-'
  switch (props.side) {
    case 'top':
      return cn(base + 'top fixed inset-x-0 top-0 z-50 w-full max-h-[85vh] rounded-b-2xl border-b border-neutral-200 bg-white p-6 shadow-lg', props.class)
    case 'bottom':
      return cn(base + 'bottom fixed inset-x-0 bottom-0 z-50 w-full max-h-[85vh] rounded-t-2xl border-t border-neutral-200 bg-white p-6 shadow-lg', props.class)
    case 'left':
      return cn(base + 'left fixed inset-y-0 left-0 z-50 h-full w-full max-w-sm border-r border-neutral-200 bg-white p-6 shadow-lg', props.class)
    case 'right':
    default:
      return cn(base + 'right fixed inset-y-0 right-0 z-50 h-full w-full max-w-sm border-l border-neutral-200 bg-white p-6 shadow-lg', props.class)
  }
})
</script>

<template>
  <DrawerRoot :swipe-direction="swipeDirection">
    <DrawerTrigger as-child>
      <slot name="trigger" />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay class="kui-drawer-overlay fixed inset-0 z-50 bg-black/50" />
      <DrawerContent :class="contentClasses">
        <DrawerTitle v-if="props.title" class="text-lg font-semibold text-neutral-900">
          {{ props.title }}
        </DrawerTitle>
        <DrawerTitle v-else>
          <VisuallyHidden>Drawer</VisuallyHidden>
        </DrawerTitle>
        <DrawerDescription v-if="props.description" class="mt-1 text-sm text-neutral-500">
          {{ props.description }}
        </DrawerDescription>
        <div class="mt-4">
          <slot />
        </div>
        <DrawerClose
          aria-label="Close"
          class="absolute right-4 top-4 rounded-sm text-neutral-400 outline-none hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <CloseButton />
        </DrawerClose>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style>
.kui-drawer-content {
  outline: none;
  transition: transform 300ms ease-in-out;
}

.kui-drawer-content[data-swiping] {
  transition-duration: 0ms;
}

.kui-drawer-right,
.kui-drawer-left {
  transform: translateX(var(--drawer-swipe-movement-x, 0px));
}

.kui-drawer-top,
.kui-drawer-bottom {
  transform: translateY(var(--drawer-swipe-movement-y, 0px));
}

.kui-drawer-right[data-state='open'] {
  animation: kui-drawer-in-right 300ms ease-in-out;
}
.kui-drawer-right[data-state='closed'] {
  animation: kui-drawer-out-right 300ms ease-in-out;
}
.kui-drawer-left[data-state='open'] {
  animation: kui-drawer-in-left 300ms ease-in-out;
}
.kui-drawer-left[data-state='closed'] {
  animation: kui-drawer-out-left 300ms ease-in-out;
}
.kui-drawer-top[data-state='open'] {
  animation: kui-drawer-in-top 300ms ease-in-out;
}
.kui-drawer-top[data-state='closed'] {
  animation: kui-drawer-out-top 300ms ease-in-out;
}
.kui-drawer-bottom[data-state='open'] {
  animation: kui-drawer-in-bottom 300ms ease-in-out;
}
.kui-drawer-bottom[data-state='closed'] {
  animation: kui-drawer-out-bottom 300ms ease-in-out;
}

.kui-drawer-overlay[data-state='open'] {
  animation: kui-drawer-overlay-in 300ms ease-in-out;
}
.kui-drawer-overlay[data-state='closed'] {
  animation: kui-drawer-overlay-out 300ms ease-in-out;
}

@keyframes kui-drawer-in-right {
  from {
    translate: 100% 0;
  }
}
@keyframes kui-drawer-out-right {
  to {
    translate: 100% 0;
  }
}
@keyframes kui-drawer-in-left {
  from {
    translate: -100% 0;
  }
}
@keyframes kui-drawer-out-left {
  to {
    translate: -100% 0;
  }
}
@keyframes kui-drawer-in-top {
  from {
    translate: 0 -100%;
  }
}
@keyframes kui-drawer-out-top {
  to {
    translate: 0 -100%;
  }
}
@keyframes kui-drawer-in-bottom {
  from {
    translate: 0 100%;
  }
}
@keyframes kui-drawer-out-bottom {
  to {
    translate: 0 100%;
  }
}

@keyframes kui-drawer-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes kui-drawer-overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
