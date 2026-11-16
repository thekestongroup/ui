<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'

/**
 * One setting on a settings page: what it is and what it does on the left,
 * the control that changes it on the right (it stacks, label first, on narrow
 * screens). Put a Select, InputNumber, Switch, Input… in the default slot and
 * give it the same label with `hide-label`, so the label is only said once.
 * Stack rows inside a Card, with a Divider between them if there are several.
 */
export interface SettingsRowProps {
  /** What the setting is called, e.g. "Multi-factor authentication". */
  label: string
  /** What it does, in smaller text under the label. */
  description?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<SettingsRowProps>()

defineSlots<{
  /** The control. */
  default(): unknown
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6', props.class)">
    <div class="flex min-w-0 flex-col gap-0.5">
      <!-- The control has this name too (hide-label), so it isn't read twice. -->
      <p class="text-sm" aria-hidden="true">{{ label }}</p>
      <p v-if="description" class="text-xs text-black/65">{{ description }}</p>
    </div>
    <div class="w-full shrink-0 sm:w-80">
      <slot />
    </div>
  </div>
</template>
