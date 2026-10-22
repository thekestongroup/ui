<script setup lang="ts">
import { ToastProvider } from 'reka-ui'
import { toastManager } from '../lib/toast'
import ToastRenderer from './ToastRenderer.vue'
</script>

<template>
  <ToastProvider :toast-manager="toastManager">
    <ToastRenderer />
  </ToastProvider>
</template>
