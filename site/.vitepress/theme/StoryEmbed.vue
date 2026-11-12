<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

/**
 * A component's live Storybook playground, embedded at the top of its page.
 * Storybook is published next to the site (at /storybook/), so the frame is
 * on the same origin and grows to fit the story.
 */
const props = defineProps<{
  /** Storybook story id, e.g. components-element-button--default. */
  id: string
  /** Component name, for the frame's accessible title. */
  name: string
  /** Least height in px, for components whose panels float outside the story. */
  minHeight?: number
}>()

// In `pnpm docs:dev` the Storybook dev server (`pnpm dev`) serves the stories.
const storybook = import.meta.env.DEV ? 'http://localhost:6006' : withBase('/storybook')
const src = computed(() => `${storybook}/iframe.html?id=${props.id}&viewMode=story`)
const open = computed(() => `${storybook}/?path=/story/${props.id}`)

const frame = ref<HTMLIFrameElement>()
const height = ref(props.minHeight ?? 96)
let observer: ResizeObserver | undefined

// Fit the frame to the story: down to the bottom of its content, plus
// Storybook's padding under it. Overlays (menus, calendars) float outside the
// content, and full-page layouts fill whatever height they get, so the frame
// never goes below minHeight.
let retry: ReturnType<typeof setTimeout> | undefined
function fit(attempt = 0) {
  clearTimeout(retry)
  try {
    const doc = frame.value?.contentDocument
    const root = doc?.getElementById('storybook-root')
    // Storybook renders the story a moment after the frame loads: wait for it
    // (for up to 10 seconds).
    if (!doc || !root || !root.childElementCount) {
      if (attempt < 50) retry = setTimeout(() => fit(attempt + 1), 200)
      return
    }
    const measure = () => {
      const below = parseFloat(getComputedStyle(doc.body).paddingBottom) || 0
      // + 2 for the frame's own 1px border, top and bottom.
      height.value = Math.max(props.minHeight ?? 96, Math.ceil(root.getBoundingClientRect().bottom + below) + 2)
    }
    measure()
    observer?.disconnect()
    observer = new ResizeObserver(measure)
    observer.observe(root)
  } catch {
    // Not the same origin (e.g. in dev): keep the default height.
  }
}
// The frame is in the page's HTML, so it can finish loading before this
// component is ready to hear about it: try straight away too.
onMounted(() => fit())
onBeforeUnmount(() => {
  clearTimeout(retry)
  observer?.disconnect()
})
</script>

<template>
  <figure class="story-embed">
    <iframe
      ref="frame"
      :src="src"
      :title="`${name} example`"
      :style="{ height: `${height}px` }"
      @load="fit()"
    />
    <figcaption>
      <a :href="open" target="_blank" rel="noopener">Open in Storybook</a> to try every prop.
    </figcaption>
  </figure>
</template>
