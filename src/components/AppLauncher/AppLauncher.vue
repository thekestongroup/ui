<script lang="ts">
import { BriefcaseBusiness, IdCard, Palette, ShieldCheck, Wrench, AppWindow, type LucideIcon } from '@lucide/vue'

const builtInIcons: Record<string, LucideIcon> = {
  id: IdCard,
  admin: ShieldCheck,
  work: BriefcaseBusiness,
  utilities: Wrench,
  design: Palette
}
</script>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LayoutGrid } from '@lucide/vue'
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'
import Button from '../Button/Button.vue'
import Popover from '../Popover/Popover.vue'
import { kestonApps } from './apps'

export interface AppLauncherApp {
  /** Matches `current` to mark the app you are in. */
  id: string
  label: string
  href: string
  /** An icon component, or the name of one of the Keston app icons (id, admin, work, utilities, design). */
  icon?: Component | string
}

/**
 * The grid button in the header that opens a panel of the Keston Group's apps, so people can move between
 * them. The same in every app: it lists `kestonApps` and marks the one you are in with `current`. In an app
 * built on AppShell, pass `launcher` to AppShell instead of using this directly.
 *
 * Apps open in the same tab, as moving between Keston apps is moving on, not a side trip (the footer's
 * links are the opposite: they open in a new tab).
 */
export interface AppLauncherProps {
  /** The apps to list. Default: `kestonApps`. */
  apps?: AppLauncherApp[]
  /** The `id` of the app you are in, shown as the current page. */
  current?: string
  /** Which edge of the button the panel lines up with: `start` when the button is at the left of the header (AppShell), `end` when at the right. Default `end`. */
  align?: 'start' | 'end'
  /** Name of the button for screen readers. Default "Keston apps". */
  label?: string
  class?: HTMLAttributes['class']
}

const { t } = useI18n()
const props = withDefaults(defineProps<AppLauncherProps>(), { apps: () => kestonApps, align: 'end' })

function iconOf(app: AppLauncherApp): Component {
  if (typeof app.icon === 'string') return builtInIcons[app.icon] ?? AppWindow
  return app.icon ?? AppWindow
}
</script>

<template>
  <Popover :content="{ align }" :ui="{ content: 'w-64 p-2' }">
    <Button variant="ghost" square :aria-label="label ?? t('ui.appLauncher.label')" :class="props.class">
      <LayoutGrid />
    </Button>
    <template #content="{ close }">
      <nav :aria-label="label ?? t('ui.appLauncher.label')">
        <ul>
          <li v-for="app in apps" :key="app.id">
            <a
              :href="app.href"
              :aria-current="app.id === current ? 'page' : undefined"
              :class="cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-ink outline-none hover:bg-hover focus-visible:outline-2 focus-visible:outline-focus',
                app.id === current && 'bg-selected'
              )"
              @click="close()"
            >
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink/5">
                <component :is="iconOf(app)" class="size-5" aria-hidden="true" />
              </span>
              <span class="min-w-0 truncate">{{ app.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </template>
  </Popover>
</template>
