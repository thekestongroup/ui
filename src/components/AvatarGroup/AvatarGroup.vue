<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import Avatar, { type AvatarProps, type AvatarUser } from '../Avatar/Avatar.vue'
import Popover from '../Popover/Popover.vue'

/**
 * Several people as overlapping avatars, e.g. a class's teachers or who's
 * been sent a message. Each shows its profile on hover (or press). Past
 * `max`, the rest are a "+N" circle that lists them.
 */
export interface AvatarGroupProps {
  users: AvatarUser[]
  size?: AvatarProps['size']
  /** Avatars shown before "+N". */
  max?: number
  /** Profile card on each avatar. */
  profile?: boolean
  /** Name of the group for screen readers. Default "{n} people". */
  label?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  size: 'md',
  max: 4,
  profile: true
})

// Show all of them if only one would be hidden: "+1" saves no space.
const shown = computed(() => (props.users.length <= props.max + 1 ? props.users : props.users.slice(0, props.max)))
const hidden = computed(() => props.users.slice(shown.value.length))

// Each avatar after the first overlaps the one before, by as much as it can
// without its ring reaching the initials in the middle (about 15–20%).
const overlaps: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: '-ml-0.5',
  sm: '-ml-1',
  md: '-ml-1.5',
  lg: '-ml-2',
  xl: '-ml-3'
}
// The white ring that keeps overlapping circles apart: thinner on the smallest.
const rings: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'ring-1',
  sm: 'ring-2',
  md: 'ring-2',
  lg: 'ring-2',
  xl: 'ring-2'
}
const counterSizes: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'size-5 text-xs',
  sm: 'size-7 text-xs',
  md: 'size-9 text-xs',
  lg: 'size-12 text-sm',
  xl: 'size-16 text-base'
}
</script>

<template>
  <div role="group" :aria-label="label ?? `${users.length} ${users.length === 1 ? 'person' : 'people'}`" :class="cn('flex items-center', props.class)">
    <!-- A white ring keeps overlapping circles apart; the one pointed at or
         focused comes to the front, so its ring and focus outline show. -->
    <span
      v-for="(user, i) in shown"
      :key="`${user.name}-${i}`"
      :class="cn('relative flex rounded-full ring-white hover:z-10 focus-within:z-10', rings[size], i > 0 && overlaps[size])"
    >
      <Avatar :user="user" :size="size" :profile="profile" />
    </span>

    <span v-if="hidden.length" :class="cn('relative flex rounded-full ring-white hover:z-10 focus-within:z-10', rings[size], overlaps[size])">
      <Popover mode="hover" :open-delay="300" :close-delay="150" :content="{ side: 'bottom', align: 'start', sideOffset: 6 }" :ui="{ content: 'w-56' }">
        <button
          type="button"
          :aria-label="`${hidden.length} more: ${hidden.map((u) => u.name).join(', ')}`"
          :class="cn(
            'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface font-bold text-black select-none',
            'outline-2 outline-offset-1 outline-transparent transition focus-visible:outline-focus',
            counterSizes[size]
          )"
        >
          <span aria-hidden="true">+{{ hidden.length }}</span>
        </button>
        <template #content>
          <ul class="flex max-h-72 flex-col gap-2 overflow-y-auto p-3 text-sm [scrollbar-width:thin]">
            <li v-for="(user, i) in hidden" :key="`${user.name}-${i}`" class="flex items-center gap-2">
              <Avatar :user="user" size="xs" decorative />
              <span class="min-w-0 truncate">{{ user.name }}</span>
              <span v-if="user.role" class="ml-auto shrink-0 truncate text-xs text-black/65">{{ user.role }}</span>
            </li>
          </ul>
        </template>
      </Popover>
    </span>
  </div>
</template>
