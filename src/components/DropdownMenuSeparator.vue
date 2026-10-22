<script setup lang="ts">
import { DropdownMenuSeparator } from 'reka-ui'
import { cn } from '../lib/cn'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <DropdownMenuSeparator :class="cn('my-1 h-px bg-neutral-200', props.class)" />
</template>
