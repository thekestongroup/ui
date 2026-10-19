<script setup lang="ts">
import {
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'

withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
  }>(),
  {
    side: 'bottom',
    align: 'center',
  },
)
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side="side"
        :align="align"
        :side-offset="5"
        class="z-50 w-72 rounded-md border border-neutral-200 bg-white p-4 shadow-md outline-none"
      >
        <slot />
        <PopoverArrow class="fill-white" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
