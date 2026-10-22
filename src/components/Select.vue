<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { cn } from '../lib/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    items?: SelectOption[]
    placeholder?: string
    disabled?: boolean
    id?: string
    name?: string
    class?: string
  }>(),
  {
    items: () => [],
    placeholder: 'Select an option',
    disabled: false,
  },
)

const model = defineModel<string>()
</script>

<template>
  <SelectRoot v-model="model" :disabled="props.disabled" :name="props.name">
    <SelectTrigger
      :id="props.id"
      :class="
        cn(
          'group flex h-10 w-full items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-neutral-400',
          props.class,
        )
      "
    >
      <SelectValue :placeholder="props.placeholder" />
      <SelectIcon class="text-neutral-500">
        <svg
          class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.93179 5.43179C5.15811 5.20547 5.52473 5.20547 5.75105 5.43179L7.50001 7.18076L9.24898 5.43179C9.4753 5.20547 9.84192 5.20547 10.0682 5.43179C10.2946 5.65811 10.2946 6.02473 10.0682 6.25105L7.90961 8.40968C7.68329 8.636 7.31667 8.636 7.09035 8.40968L4.93179 6.25105C4.70547 6.02473 4.70547 5.65811 4.93179 5.43179Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          />
        </svg>
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="z-50 min-w-[10rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 shadow-md outline-none"
      >
        <SelectViewport>
          <SelectItem
            v-for="item in props.items"
            :key="item.value"
            :value="item.value"
            :disabled="item.disabled"
            class="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-neutral-700 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900"
          >
            <SelectItemIndicator class="absolute left-2 inline-flex items-center justify-center">
              <svg class="h-4 w-4" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                />
              </svg>
            </SelectItemIndicator>
            <SelectItemText>{{ item.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
