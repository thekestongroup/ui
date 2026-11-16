import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
import { en } from './en'

export { en } from './en'
export type { UiMessages } from './en'

/** Words by language code, then by key (nested objects are fine). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Messages = Record<string, Record<string, any>>

/** Keston UI's own words, by language. Today: English. */
export const uiMessages: Messages = { en }

export interface KestonI18nOptions {
  /**
   * The app's own words, by language code: `{ en: { users: { title: 'Users' } } }`.
   * Keston UI's words are added to each language (the app's win if a key
   * is repeated), so only languages that Keston UI also has — or that the
   * app lists here — are available.
   */
  messages?: Messages
  /** The language to start in. Default: the one saved last time, else the browser's, else `fallbackLocale`. */
  locale?: string
  /** Used for any word a language is missing. Default `en`. */
  fallbackLocale?: string
  /** Where the chosen language is remembered (localStorage). Default `keston-locale`. */
  storageKey?: string
}

/**
 * Sets up vue-i18n the way every Keston app should: Keston UI's words plus
 * the app's own, English as the fallback, the language remembered between
 * visits, and `<html lang>` kept in step. Install it with `app.use(i18n)`.
 *
 * ```ts
 * const i18n = createKestonI18n({ messages: { en } })
 * createApp(App).use(i18n).mount('#app')
 * ```
 */
export function createKestonI18n(options: KestonI18nOptions = {}) {
  const { messages = {}, fallbackLocale = 'en', storageKey = 'keston-locale' } = options

  const codes = [...new Set([...Object.keys(uiMessages), ...Object.keys(messages)])]
  const merged: Messages = {}
  for (const code of codes) merged[code] = { ...uiMessages[code], ...messages[code] }

  const i18n = createI18n({
    legacy: false,
    locale: options.locale ?? initialLocale(codes, fallbackLocale, storageKey),
    fallbackLocale,
    messages: merged
  })

  // Remember the choice, and tell the browser (screen readers pick the
  // voice by it, browsers offer translation by it).
  watch(
    i18n.global.locale,
    (locale) => {
      try {
        localStorage.setItem(storageKey, locale)
      } catch {
        // Private windows can refuse storage; the choice just isn't remembered.
      }
      if (typeof document !== 'undefined') document.documentElement.lang = locale
    },
    { immediate: true }
  )

  return i18n
}

/** Saved choice, else the browser's languages in order, else the fallback. */
function initialLocale(codes: string[], fallback: string, storageKey: string): string {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved && codes.includes(saved)) return saved
  } catch {
    // No storage: carry on.
  }
  if (typeof navigator !== 'undefined') {
    for (const wanted of navigator.languages ?? []) {
      const exact = codes.find((c) => c.toLowerCase() === wanted.toLowerCase())
      const base = codes.find((c) => c.toLowerCase() === wanted.split('-')[0]!.toLowerCase())
      if (exact ?? base) return (exact ?? base)!
    }
  }
  return fallback
}
