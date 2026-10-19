<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'

withDefaults(
  defineProps<{
    align?: 'start' | 'center' | 'end'
  }>(),
  {
    align: 'center',
  },
)
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :align="align"
        :side-offset="5"
        class="z-50 min-w-[10rem] rounded-md border border-neutral-200 bg-white p-1 shadow-md outline-none"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
