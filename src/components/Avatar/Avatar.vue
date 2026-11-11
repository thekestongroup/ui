<script setup lang="ts">
import { computed, ref, watch, type HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import { initials as toInitials } from '../../lib/initials'
import Popover from '../Popover/Popover.vue'

export interface AvatarUser {
  name: string
  /** Picture URL. Initials are shown without one, or if it fails to load. */
  avatar?: string
  /** Job or role, e.g. "Head of Year 9". Shown in the profile. */
  role?: string
  email?: string
  /** Organisation or school, shown in the profile. */
  organisation?: string
}

/**
 * A person's picture, or their initials on a primary circle. With `profile`,
 * it becomes a button that shows a small profile card (name, role, email,
 * organisation) on hover, and on click, tap or Enter, so it works on touch
 * screens and from the keyboard.
 *
 * Several people overlapping: use AvatarGroup.
 */
export interface AvatarProps {
  user: AvatarUser
  /** 20 / 28 / 36 / 48 / 64px. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Show a profile card on hover / press. Makes the avatar a button. */
  profile?: boolean
  /** Hidden from screen readers, when the name is already said nearby (e.g. in a labelled button). */
  decorative?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md'
})

const initials = computed(() => toInitials(props.user.name))

// A picture that fails to load falls back to initials.
const failed = ref(false)
watch(() => props.user.avatar, () => (failed.value = false))
const showImage = computed(() => !!props.user.avatar && !failed.value)

// The button's name. When it shows initials, they're its visible text, so the
// name starts with them (voice control: "click BS"), as in Header.
const buttonLabel = computed(() =>
  showImage.value || !initials.value ? props.user.name : `${initials.value}, ${props.user.name}`
)

const sizes: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'size-5 text-xs',
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-xl'
}

const circle = 'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-white select-none'
</script>

<template>
  <Popover v-if="profile" mode="hover" :open-delay="300" :close-delay="150" :content="{ side: 'bottom', align: 'start', sideOffset: 6 }" :ui="{ content: 'w-64' }">
    <button
      type="button"
      :aria-label="buttonLabel"
      :class="cn(
        circle,
        sizes[size],
        'cursor-pointer outline-2 outline-offset-1 outline-transparent transition focus-visible:outline-focus',
        props.class
      )"
    >
      <img v-if="showImage" :src="user.avatar" alt="" class="size-full object-cover" @error="failed = true">
      <span v-else aria-hidden="true">{{ initials }}</span>
    </button>

    <template #content>
      <div class="flex flex-col">
        <p v-if="user.organisation" class="truncate px-4 pt-3 text-xs font-bold text-black/65 uppercase">
          {{ user.organisation }}
        </p>
        <div class="flex items-center gap-3 px-4 py-3">
          <span :class="cn(circle, sizes.lg)" aria-hidden="true">
            <img v-if="showImage" :src="user.avatar" alt="" class="size-full object-cover">
            <template v-else>{{ initials }}</template>
          </span>
          <div class="flex min-w-0 flex-col">
            <span class="truncate font-bold">{{ user.name }}</span>
            <span v-if="user.role" class="truncate text-sm text-black/65">{{ user.role }}</span>
            <a
              v-if="user.email"
              :href="`mailto:${user.email}`"
              class="truncate rounded-sm text-sm text-black/65 underline-offset-2 hover:text-black hover:underline outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus"
            >
              {{ user.email }}
            </a>
          </div>
        </div>
      </div>
    </template>
  </Popover>

  <!-- No profile: an image named after the person (or hidden, if decorative). -->
  <span
    v-else
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : user.name"
    :aria-hidden="decorative || undefined"
    :class="cn(circle, sizes[size], props.class)"
  >
    <img v-if="showImage" :src="user.avatar" alt="" class="size-full object-cover" @error="failed = true">
    <span v-else aria-hidden="true">{{ initials }}</span>
  </span>
</template>
