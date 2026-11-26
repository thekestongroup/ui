<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import Button, { type ButtonStatus } from '../Button/Button.vue'

/**
 * A bar that slides up from the bottom of the screen while a page or form has
 * edits that haven't been saved, with Discard and Save. It slides back down
 * when `open` is false, e.g. after saving or discarding. With reduced motion
 * it simply appears and disappears.
 *
 * It is fixed to the bottom of the screen, so it would cover the end of the
 * page. By default it therefore leaves an empty space of its own height at its
 * place in the page (put it last in the page content); set `reserveSpace` to
 * false if you handle that yourself, e.g. with padding on the page.
 *
 * Next to a setting that has been edited, show the old and new values with
 * ChangeIndicator.
 */
export interface UnsavedChangesBarProps {
  /** Whether it is shown. */
  open: boolean
  /** What it says. Default "Unsaved changes". */
  message?: string
  /** Text of the discard button. Default "Discard". */
  discardLabel?: string
  /** Text of the save button. Default "Save". */
  saveLabel?: string
  /** Progress of saving: `loading` shows a spinner on Save and disables both buttons. */
  status?: ButtonStatus
  /**
   * Keep the end of the page clear of the bar by leaving a blank space as tall
   * as the bar where this component is placed.
   */
  reserveSpace?: boolean
  class?: HTMLAttributes['class']
}

const { t } = useI18n()
const props = withDefaults(defineProps<UnsavedChangesBarProps>(), {
  status: 'idle',
  reserveSpace: true
})

const emit = defineEmits<{
  /** Discard was pressed: put the edits back. The parent then closes the bar. */
  discard: []
  /** Save was pressed. The parent saves, then sets `open` to false. */
  save: []
}>()

const saving = computed(() => props.status === 'loading')
</script>

<template>
  <!-- Takes the bar's height in the page (only while open), so the last content can be scrolled clear of it. -->
  <div v-if="open && reserveSpace" aria-hidden="true" class="h-20" />
  <Transition
    enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
    leave-active-class="transition duration-200 ease-in motion-reduce:transition-none"
    enter-from-class="translate-y-full motion-reduce:translate-y-0 motion-reduce:opacity-0"
    leave-to-class="translate-y-full motion-reduce:translate-y-0 motion-reduce:opacity-0"
  >
    <div
      v-if="open"
      role="region"
      :aria-label="message ?? t('ui.unsavedChangesBar.message')"
      :class="cn('fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pointer-events-none', props.class)"
    >
      <div
        class="pointer-events-auto flex w-full max-w-2xl items-center justify-between gap-3 rounded-lg border border-ink/10 bg-surface-elevated p-3 pl-4 shadow-lg"
      >
        <p role="status" class="flex items-center gap-2 text-sm font-bold">
          <span aria-hidden="true" class="size-2 shrink-0 rounded-full bg-yellow" />
          {{ message ?? t('ui.unsavedChangesBar.message') }}
        </p>
        <div class="flex shrink-0 items-center gap-2">
          <Button :disabled="saving" @click="emit('discard')">{{ discardLabel ?? t('ui.unsavedChangesBar.discard') }}</Button>
          <Button variant="primary" :status="status" :disabled="saving" @click="emit('save')">
            {{ saveLabel ?? t('ui.unsavedChangesBar.save') }}
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>
