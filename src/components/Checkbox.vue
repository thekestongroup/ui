<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

const model = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    id?: string
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)
</script>

<template>
  <CheckboxRoot
    :id="id"
    v-model="model"
    :disabled="disabled"
    class="peer h-4 w-4 shrink-0 rounded border border-neutral-300 bg-white outline-none data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <CheckboxIndicator class="flex h-full w-full items-center justify-center text-white">
      <svg
        class="h-3 w-3"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
        />
      </svg>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
