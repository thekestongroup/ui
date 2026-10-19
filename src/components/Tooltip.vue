<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'

withDefaults(
  defineProps<{
    content?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
  }>(),
  {
    content: '',
    side: 'top',
  },
)
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot name="trigger" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :side-offset="5"
          class="z-50 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-md outline-none"
        >
          <slot>{{ content }}</slot>
          <TooltipArrow class="fill-neutral-900" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
