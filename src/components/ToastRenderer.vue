<script setup lang="ts">
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  useToastManager,
} from 'reka-ui'
import CloseButton from './CloseButton.vue'

const { toasts } = useToastManager()
</script>

<template>
  <ToastViewport
    class="kui-toast-viewport fixed bottom-0 right-0 z-[100] w-full max-w-sm p-4 outline-none sm:bottom-4 sm:right-4"
  >
    <ToastRoot
      v-for="toast in toasts"
      :key="toast.id"
      :toast="toast"
      class="kui-toast pointer-events-auto flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg"
    >
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <ToastTitle class="text-sm font-semibold text-neutral-900" />
        <ToastDescription class="text-sm text-neutral-500" />
        <ToastAction
          class="mt-1 inline-flex h-8 items-center justify-center gap-2 self-start rounded-md bg-neutral-100 px-3 text-xs font-medium text-neutral-900 outline-none transition-colors hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        />
      </div>
      <ToastClose
        aria-label="Close"
        class="shrink-0 rounded-sm text-neutral-400 outline-none transition-colors hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <CloseButton />
      </ToastClose>
    </ToastRoot>
  </ToastViewport>
</template>

<style>
.kui-toast {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: var(--reka-toast-frontmost-height);
  transform: translateY(calc(var(--reka-toast-index) * -12px))
    scale(calc(1 - var(--reka-toast-index) * 0.05));
  z-index: calc(1000 - var(--reka-toast-index));
  transition:
    transform 300ms cubic-bezier(0.21, 1.02, 0.73, 1),
    opacity 300ms ease,
    height 300ms ease;
  transition-delay: 100ms;
}

/* Invisible hit-area that covers the gap above each toast, so the cursor
   moving between toasts doesn't leave the viewport and collapse the stack. */
.kui-toast::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 12px;
}

.kui-toast-viewport[data-expanded] .kui-toast {
  height: var(--reka-toast-height);
  transform: translateY(
    calc(var(--reka-toast-offset-y) * -1 - var(--reka-toast-index) * 12px)
  );
  transition-delay: 0ms;
}

.kui-toast[data-limited] {
  opacity: 0;
}

.kui-toast[data-state='open'] {
  animation: kui-toast-in 300ms cubic-bezier(0.21, 1.02, 0.73, 1);
}
.kui-toast[data-state='closed'] {
  animation: kui-toast-out 200ms ease-in forwards;
}

.kui-toast[data-swipe='move'] {
  transform: translateX(var(--reka-toast-swipe-move-x));
}
.kui-toast[data-swipe='cancel'] {
  transform: translateX(0);
  transition: transform 200ms ease-out;
}
.kui-toast[data-swipe='end'] {
  animation: kui-toast-swipe-out 100ms ease-out forwards;
}

@keyframes kui-toast-in {
  from {
    translate: 100% 0;
    opacity: 0;
  }
  to {
    translate: 0 0;
    opacity: 1;
  }
}
@keyframes kui-toast-out {
  to {
    translate: 100% 0;
    opacity: 0;
  }
}
@keyframes kui-toast-swipe-out {
  from {
    transform: translateX(var(--reka-toast-swipe-end-x));
  }
  to {
    transform: translateX(calc(100% + 1rem));
  }
}

@media (prefers-reduced-motion: reduce) {
  .kui-toast {
    transition: none;
  }
  .kui-toast[data-state='open'],
  .kui-toast[data-state='closed'],
  .kui-toast[data-swipe='end'] {
    animation: none;
  }
  .kui-toast[data-swipe='move'],
  .kui-toast[data-swipe='cancel'] {
    transform: none;
  }
}
</style>
