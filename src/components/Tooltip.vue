<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { cn } from '../lib/cn'

const props = withDefaults(
  defineProps<{
    content?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    class?: string
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
          :side="props.side"
          :side-offset="5"
          :class="
            cn(
              'z-50 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-md outline-none',
              props.class,
            )
          "
        >
          <slot>{{ props.content }}</slot>
          <TooltipArrow class="fill-neutral-900" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
