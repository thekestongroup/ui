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
} from 'reka-ui'
import { computed } from 'vue'

type Side = 'top' | 'right' | 'bottom' | 'left'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    side?: Side
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
  switch (props.side) {
    case 'top':
      return 'kui-drawer-content kui-drawer-top fixed inset-x-0 top-0 z-50 w-full max-h-[85vh] rounded-b-2xl border-b border-neutral-200 bg-white p-6 shadow-lg'
    case 'bottom':
      return 'kui-drawer-content kui-drawer-bottom fixed inset-x-0 bottom-0 z-50 w-full max-h-[85vh] rounded-t-2xl border-t border-neutral-200 bg-white p-6 shadow-lg'
    case 'left':
      return 'kui-drawer-content kui-drawer-left fixed inset-y-0 left-0 z-50 h-full w-full max-w-sm border-r border-neutral-200 bg-white p-6 shadow-lg'
    case 'right':
    default:
      return 'kui-drawer-content kui-drawer-right fixed inset-y-0 right-0 z-50 h-full w-full max-w-sm border-l border-neutral-200 bg-white p-6 shadow-lg'
  }
})
</script>

<template>
  <DrawerRoot :swipe-direction="swipeDirection">
    <DrawerTrigger as-child>
      <slot name="trigger" />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DrawerContent :class="contentClasses">
        <DrawerTitle v-if="title" class="text-lg font-semibold text-neutral-900">
          {{ title }}
        </DrawerTitle>
        <DrawerDescription v-if="description" class="mt-1 text-sm text-neutral-500">
          {{ description }}
        </DrawerDescription>
        <div class="mt-4">
          <slot />
        </div>
        <DrawerClose
          class="absolute right-4 top-4 rounded-sm text-neutral-400 outline-none hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <svg class="h-4 w-4" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            />
          </svg>
        </DrawerClose>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style>
.kui-drawer-content {
  outline: none;
  transition: transform 450ms cubic-bezier(0.32, 0.72, 0, 1);
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
  animation: kui-drawer-in-right 450ms cubic-bezier(0.32, 0.72, 0, 1);
}
.kui-drawer-right[data-state='closed'] {
  animation: kui-drawer-out-right 450ms cubic-bezier(0.32, 0.72, 0, 1);
}
.kui-drawer-left[data-state='open'] {
  animation: kui-drawer-in-left 450ms cubic-bezier(0.32, 0.72, 0, 1);
}
.kui-drawer-left[data-state='closed'] {
  animation: kui-drawer-out-left 450ms cubic-bezier(0.32, 0.72, 0, 1);
}
.kui-drawer-top[data-state='open'] {
  animation: kui-drawer-in-top 450ms cubic-bezier(0.32, 0.72, 0, 1);
}
.kui-drawer-top[data-state='closed'] {
  animation: kui-drawer-out-top 450ms cubic-bezier(0.32, 0.72, 0, 1);
}
.kui-drawer-bottom[data-state='open'] {
  animation: kui-drawer-in-bottom 450ms cubic-bezier(0.32, 0.72, 0, 1);
}
.kui-drawer-bottom[data-state='closed'] {
  animation: kui-drawer-out-bottom 450ms cubic-bezier(0.32, 0.72, 0, 1);
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
</style>
