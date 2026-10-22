<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'
import { cn } from '../lib/cn'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    class?: string
  }>(),
  {
    disabled: false,
  },
)
</script>

<template>
  <DropdownMenuItem
    :disabled="props.disabled"
    :class="
      cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-neutral-700 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900',
        props.class,
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
