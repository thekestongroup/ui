<script setup lang="ts">
import { ToastViewport, useToastManager } from 'reka-ui'
import ToastItem from './ToastItem.vue'

const { toasts } = useToastManager()
</script>

<template>
  <ToastViewport
    class="kui-toast-viewport fixed left-0 top-0 z-[100] w-full max-w-sm p-4 outline-none sm:left-4 sm:top-4"
  >
    <ToastItem v-for="toast in toasts" :key="toast.id" :toast="toast" />
  </ToastViewport>
</template>

<style>
.kui-toast {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--reka-toast-frontmost-height);
  transform: translateY(calc(var(--reka-toast-index) * 12px))
    scale(calc(1 - var(--reka-toast-index) * 0.05));
  z-index: calc(1000 - var(--reka-toast-index));
  transition:
    transform 300ms cubic-bezier(0.21, 1.02, 0.73, 1),
    opacity 300ms ease,
    height 300ms ease;
  transition-delay: 100ms;
}

/* Invisible hit-area that covers the gap below each toast, so the cursor
   moving between toasts doesn't leave the viewport and collapse the stack. */
.kui-toast::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: 12px;
}

.kui-toast-viewport[data-expanded] .kui-toast {
  height: var(--reka-toast-height);
  transform: translateY(
    calc(var(--reka-toast-offset-y) + var(--reka-toast-index) * 12px)
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
    translate: -100% 0;
    opacity: 0;
  }
  to {
    translate: 0 0;
    opacity: 1;
  }
}
@keyframes kui-toast-out {
  to {
    translate: -100% 0;
    opacity: 0;
  }
}
@keyframes kui-toast-swipe-out {
  from {
    transform: translateX(var(--reka-toast-swipe-end-x));
  }
  to {
    transform: translateX(calc(-100% - 1rem));
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
