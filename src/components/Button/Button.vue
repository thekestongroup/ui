<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui';
import { Check, X } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Spinner from '../Spinner/Spinner.vue'

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error'

export interface ButtonProps extends PrimitiveProps {
  /**
   * What the button is for:
   * - primary: the main action (one per area), e.g. Save
   * - basic: other actions, e.g. Cancel, Export
   * - ghost: low-emphasis actions, e.g. toolbar and icon buttons, × on panels
   * - danger: destructive actions, e.g. Delete
   * - success: confirming / positive actions
   */
  variant?: 'basic' | 'primary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  /**
   * Icon-only button: as tall as a normal button of the same size and just as
   * wide, so the icon has equal space on every side. Give it an `aria-label`
   * (e.g. "Close"), as there is no text to name it.
   */
  square?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  /**
   * Progress of the action this button starts. The parent sets it; use
   * `v-model:status` so the button can return itself to `idle` after showing
   * success or error. Not supported with `asChild`.
   */
  status?: ButtonStatus
  /** Text shown next to the spinner while loading. Icon only if not set. */
  loadingText?: string
  /** Text shown next to the check on success. Icon only if not set. */
  successText?: string
  /** Text shown next to the cross on error. Icon only if not set. */
  errorText?: string
  /** How long success / error is shown before returning to idle, in ms. */
  statusDuration?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  variant: 'basic',
  size: 'md',
  type: 'button',
  status: 'idle',
  statusDuration: 2000
})

const emit = defineEmits<{ 'update:status': [status: ButtonStatus] }>()

const busy = computed(() => props.status !== 'idle' && !props.asChild)

// ── Status timing ───────────────────────────────────────────────────────────
// When a status goes away, the colour and width change together, and the
// text hands over without the old and new text ever overlapping (no ghosting):
//   0–300ms    button colour and width change to the idle ones
//   0–150ms    status text and icon fade out (anchored to the button, so they
//              stay centred while it resizes)
//   150–300ms  the normal label fades in
// When one status replaces another (spinner → ✓), the new one waits 100ms so
// the two icons don't overlap.

// How long the colour change back to idle takes, in ms.
const SETTLE_MS = 300

// After success / error, ask the parent to go back to idle.
let resetTimer: ReturnType<typeof setTimeout> | undefined
// True briefly while fading back to idle, so the colour change is slower
// than a normal hover.
const settling = ref(false)
let settleTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.status,
  (status, previous) => {
    clearTimeout(resetTimer)
    clearTimeout(settleTimer)
    settling.value = status === 'idle' && (previous === 'success' || previous === 'error')
    if (settling.value) {
      settleTimer = setTimeout(() => (settling.value = false), SETTLE_MS)
    }
    if (status === 'success' || status === 'error') {
      resetTimer = setTimeout(() => emit('update:status', 'idle'), props.statusDuration)
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  clearTimeout(resetTimer)
  clearTimeout(settleTimer)
})

// Block clicks (and form submits) while busy, without using `disabled`,
// so keyboard focus stays on the button.
function blockWhileBusy(event: MouseEvent) {
  if (!busy.value) return
  event.preventDefault()
  event.stopImmediatePropagation()
}

// Loading uses the shared Spinner (see template); these are the result icons.
const statusIcon = { success: Check, error: X } as const

const visibleText = computed(() => {
  switch (props.status) {
    case 'loading': return props.loadingText
    case 'success': return props.successText
    case 'error': return props.errorText
    default: return undefined
  }
})

// ── Smooth width ────────────────────────────────────────────────────────────
// Status text can make the button wider or narrower ("Save" → "Saving…").
// CSS can't animate an automatic width, so: measure the width before the
// change, let the new content render, measure again, and animate between the
// two. The animation leaves no inline width behind, so the button goes back to
// sizing itself. Skipped with reduced motion.
const rootRef = ref<{ $el?: unknown }>()
let widthAnimation: Animation | undefined

watch(
  () => [busy.value, props.status, visibleText.value],
  async () => {
    const el = rootRef.value?.$el
    if (!(el instanceof HTMLElement)) return
    // Mid-animation, this is the current animated width.
    const from = el.getBoundingClientRect().width
    await nextTick()
    widthAnimation?.cancel()
    const to = el.getBoundingClientRect().width
    if (Math.abs(to - from) < 0.5 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Same length as the colour change (see Status timing).
    widthAnimation = el.animate([{ width: `${from}px` }, { width: `${to}px` }], {
      duration: SETTLE_MS,
      easing: 'cubic-bezier(0, 0, 0.2, 1)' // Tailwind's ease-out
    })
  },
  { flush: 'pre' }
)

// Announced to screen readers; falls back to a generic word if no text is set.
const announcement = computed(() => {
  if (!busy.value) return ''
  const fallback = { loading: 'Loading', success: 'Done', error: 'Failed' } as const
  return visibleText.value || fallback[props.status as keyof typeof fallback]
})

const base = [
  // overflow-hidden: content briefly wider than the button while its width animates is clipped
  'relative inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none overflow-hidden',
  'border border-black/15 rounded cursor-pointer transition',
  'disabled:cursor-not-allowed disabled:opacity-40',
  'aria-busy:cursor-progress',
  'outline-2 outline-offset-1 outline-transparent forced-colors:not-focus-visible:outline-0',
  'focus-visible:outline-focus'
]

// Hover / pressed only apply when the button is usable.
const interactive = 'not-disabled:not-aria-disabled:hover:brightness-90 not-disabled:not-aria-disabled:active:brightness-80'

// Ghost has no fill to darken, so hover / press tint it with black instead
// (10% / 15%, matching the other variants' 90% / 80% brightness). The border
// stays (transparent) so it lines up with the other variants.
const ghostInteractive = 'not-disabled:not-aria-disabled:hover:bg-black/10 not-disabled:not-aria-disabled:active:bg-black/15'

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  basic: `bg-white text-black ${interactive}`,
  primary: `bg-primary text-white ${interactive}`,
  ghost: `bg-transparent text-black border-transparent ${ghostInteractive}`,
  danger: `bg-red text-white ${interactive}`,
  success: `bg-green text-white ${interactive}`
}

// Applied on top of the variant, so success / error recolour any variant.
// The colours are the same tokens, rewritten as oklch() so the browser blends
// them in OKLab rather than RGB when fading back. In RGB, red → navy loses
// most of its red in the first half, so error looked faster than success.
const statuses: Record<ButtonStatus, string> = {
  idle: '',
  loading: '',
  success: 'bg-[oklch(from_var(--color-green)_l_c_h)] text-white cursor-default',
  error: 'bg-[oklch(from_var(--color-red)_l_c_h)] text-white cursor-default'
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-2 py-1 text-xs [&_svg]:size-3.5 gap-1',
  md: 'px-4 py-2 text-sm [&_svg]:size-4 gap-2',
  lg: 'px-6 py-3 text-base [&_svg]:size-5 gap-3'
}

// Icon-only: the same height as a normal button of that size (padding + one
// line of text + border: 26 / 38 / 50px), and the same width. The icon is
// centred, so the space around it is equal on all four sides.
const squareSizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'size-6.5 p-0',
  md: 'size-9.5 p-0',
  lg: 'size-12.5 p-0'
}
</script>

  <template>
    <Primitive
      ref="rootRef"
      :as="as"
      :as-child="asChild"
      :type="as === 'button' && !asChild ? type : undefined"
      :disabled="disabled || undefined"
      :aria-disabled="disabled || busy || undefined"
      :aria-busy="(busy && status === 'loading') || undefined"
      :data-status="busy ? status : undefined"
      :class="cn(base, variants[variant], busy && statuses[status], settling && 'duration-300', sizes[size], square && squareSizes[size], props.class)"
      @click.capture="blockWhileBusy"
    >
      <template v-if="asChild">
        <slot />
      </template>
      <!--
        Content and status sit in the same grid cell, so the button is as wide
        as whichever is wider (the width change is animated, see Smooth width).
        A status that is leaving is taken out of the layout (absolute) while it
        fades, so the button can start resizing straight away. It is positioned
        against the button itself (not this wrapper, which snaps to the new
        width), so it stays centred while the button resizes.
      -->
      <span v-else class="inline-grid place-items-center gap-[inherit]">
        <span
          class="col-start-1 row-start-1 inline-flex items-center gap-[inherit] transition-[opacity,visibility]"
          :class="busy ? 'invisible opacity-0 duration-150' : 'delay-150 duration-150'"
        >
          <slot name="leading" />
          <slot />
          <slot name="trailing" />
        </span>
        <Transition
          enter-active-class="transition delay-100 duration-200 ease-out motion-reduce:transition-opacity"
          enter-from-class="opacity-0 scale-50 motion-reduce:scale-100"
          leave-active-class="absolute inset-0 justify-center transition duration-150 ease-out [&_svg]:transition-transform [&_svg]:duration-150 [&_svg]:ease-in"
          leave-to-class="opacity-0 [&_svg]:scale-50 motion-reduce:[&_svg]:scale-100"
        >
          <span
            v-if="busy"
            :key="status"
            aria-hidden="true"
            class="col-start-1 row-start-1 inline-flex items-center gap-2"
          >
            <!--
              The shared Spinner. size-auto lets the button's icon
              size (14 / 16 / 20px by button size) set its size, like an icon.
              The button announces the status itself, so this layer is hidden
              from screen readers.
            -->
            <Spinner v-if="status === 'loading'" class="size-auto" />
            <component :is="statusIcon[status as keyof typeof statusIcon]" v-else />
            <span v-if="visibleText">{{ visibleText }}</span>
          </span>
        </Transition>
        <span class="sr-only" role="status">{{ announcement }}</span>
      </span>
    </Primitive>
  </template>
