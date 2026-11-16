<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { useI18n } from 'vue-i18n'
import { Languages } from '@lucide/vue'
import Select from '../Select/Select.vue'

/**
 * Chooses the language the app is shown in, e.g. in the account menu, the
 * footer or Settings. It lists the languages the app's vue-i18n has, each
 * in its own name ("Cymraeg", "Español"), and changes the app's language as
 * soon as one is chosen. With `createKestonI18n` the choice is remembered
 * for next time.
 */
export interface LanguageSwitcherProps {
  /** Visible label. Default "Language". */
  label?: string
  /** Keep the label for screen readers only, e.g. in a header or footer. */
  hideLabel?: boolean
  /**
   * Names to show instead of the browser's own for a code, e.g.
   * `{ 'en-GB': 'English (UK)' }`.
   */
  names?: Record<string, string>
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = defineProps<LanguageSwitcherProps>()
const { t, locale, availableLocales } = useI18n()

// Each language in its own tongue, so someone can find theirs even when the
// page is in a language they can't read.
function nameOf(code: string) {
  if (props.names?.[code]) return props.names[code]
  try {
    const name = new Intl.DisplayNames([code], { type: 'language' }).of(code)
    return name ? name.charAt(0).toLocaleUpperCase(code) + name.slice(1) : code
  } catch {
    return code
  }
}

const options = computed(() => availableLocales.map((code) => ({ label: nameOf(code), value: code })))
</script>

<template>
  <Select
    v-model="locale"
    :label="label ?? t('ui.languageSwitcher.label')"
    :hide-label="hideLabel"
    :options="options"
    :disabled="disabled"
    :class="props.class"
  >
    <template #leading><Languages aria-hidden="true" /></template>
  </Select>
</template>
