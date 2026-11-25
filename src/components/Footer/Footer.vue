<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, type Component, type HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import Link from '../Link/Link.vue'
import { bareVersion, displayVersion, yearRange } from './footer'
import { kestonFooterLinks } from './links'

export interface FooterLink {
  label: string
  /** A plain link. */
  href?: string
  /** Link through `linkComponent` (e.g. RouterLink), which receives `to`. */
  to?: unknown
  /** Open in a new tab. Default true for `href` links (they leave the app), false for `to`. */
  newTab?: boolean
}

/**
 * The bottom of an app's page: on the left Help & support and the legal links (Privacy Policy, Terms & Conditions), and
 * on the right the app's name, version and build (so a bug report can say exactly which build) with
 * the copyright. The same in every Keston app; pass the app's `version` and `build`.
 *
 * Without `links` it shows the Keston Group's footer links (`kestonFooterLinks`). Add to them rather than
 * replacing them with `moreLinks` (e.g. Contact us, or `kestonGroupLinks` to point at the other Keston
 * apps), which follow, after a divider. The version comes from the app's package.json and the build
 * from its CI: in Vite, put them in with `define` (see the spec).
 *
 * Slots: nav (instead of the whole link list), end (after the copyright, e.g. a language switcher).
 */
export interface FooterProps {
  /** The links on the left. Default: `kestonFooterLinks` (Help & support, Privacy Policy, Terms & Conditions). */
  links?: FooterLink[]
  /** More links after a divider, e.g. Contact us, or `kestonGroupLinks` to point at the other Keston apps. */
  moreLinks?: FooterLink[]
  /** Component used for links with `to`, e.g. RouterLink. */
  linkComponent?: string | Component
  /** The app's name, shown before its version. */
  appName?: string
  /** The app's version, e.g. "1.4.2" or "v1.4.2". */
  version?: string
  /** The build, e.g. a commit "a1b2c3d" or a CI run number, shown after the version so a bug report can name the exact build. */
  build?: string
  /** Who owns the copyright. */
  holder?: string
  /** The current year. Default: this year, from the device's clock. */
  year?: number
  /** The first year, to show a range such as 2024–2026. */
  since?: number
  class?: HTMLAttributes['class']
  /** Extra classes for the parts. */
  ui?: {
    links?: HTMLAttributes['class']
    meta?: HTMLAttributes['class']
  }
}

const { t } = useI18n()
const props = withDefaults(defineProps<FooterProps>(), {
  links: () => kestonFooterLinks,
  moreLinks: () => [],
  linkComponent: undefined,
  holder: 'The Keston Group'
})

defineSlots<{
  nav?(): unknown
  end?(): unknown
}>()

const years = computed(() => yearRange(props.year ?? new Date().getFullYear(), props.since))
const shownVersion = computed(() => displayVersion(props.version))
const versionLabel = computed(() => (props.version ? t('ui.footer.version', { version: bareVersion(props.version) }) : ''))
const buildLabel = computed(() => (props.build ? t('ui.footer.build', { build: props.build }) : ''))

// Links that leave the app open in a new tab, so people don't lose their place.
function linkAttrs(link: FooterLink) {
  return link.to !== undefined
    ? { as: props.linkComponent as never, to: link.to, newTab: link.newTab ?? false }
    : { href: link.href, newTab: link.newTab ?? true }
}
</script>

<template>
  <footer
    :class="cn(
      'flex shrink-0 flex-col gap-3 border-t border-ink/10 bg-surface px-4 py-4 text-sm text-ink/65 sm:flex-row sm:items-center sm:justify-between sm:px-6',
      props.class
    )"
  >
    <nav :aria-label="t('ui.footer.label')" :class="cn('min-w-0', ui?.links)">
      <slot name="nav">
        <ul class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <li v-for="link in links" :key="link.label">
            <Link v-bind="linkAttrs(link)" :icon="false">{{ link.label }}</Link>
          </li>
          <li v-if="moreLinks.length" class="hidden h-4 w-px bg-ink/10 sm:block" aria-hidden="true"></li>
          <li v-for="link in moreLinks" :key="link.label">
            <Link v-bind="linkAttrs(link)" :icon="false">{{ link.label }}</Link>
          </li>
        </ul>
      </slot>
    </nav>

    <div :class="cn('flex flex-wrap items-center gap-x-3 gap-y-1 sm:justify-end', ui?.meta)">
      <p v-if="appName || version || build" class="flex flex-wrap items-baseline gap-x-1.5">
        <span v-if="appName" class="font-bold text-ink/80">{{ appName }}</span>
        <!-- Shows as "v1.4.2" but reads as "Version 1.4.2". -->
        <span v-if="version">
          <span class="sr-only">{{ versionLabel }}</span>
          <span aria-hidden="true">{{ shownVersion }}</span>
        </span>
        <!-- Shows as "a1b2c3d" in monospace but reads as "Build a1b2c3d". -->
        <span v-if="build" :title="buildLabel">
          <span class="sr-only">{{ buildLabel }}</span>
          <span class="font-mono text-xs text-ink/55" aria-hidden="true">{{ build }}</span>
        </span>
      </p>
      <p>{{ t('ui.footer.copyright', { years, holder }) }}</p>
      <slot name="end" />
    </div>
  </footer>
</template>
