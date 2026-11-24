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
  /** A few words on what the app is for. */
  description?: string
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
  /** Name of the button for screen readers. Default "Keston apps". */
  label?: string
  class?: HTMLAttributes['class']
}

const { t } = useI18n()
const props = withDefaults(defineProps<AppLauncherProps>(), { apps: () => kestonApps })

function iconOf(app: AppLauncherApp): Component {
  if (typeof app.icon === 'string') return builtInIcons[app.icon] ?? AppWindow
  return app.icon ?? AppWindow
}
</script>

<template>
  <Popover :content="{ align: 'end' }" :ui="{ content: 'w-80 p-2' }">
    <Button variant="ghost" square :aria-label="label ?? t('ui.appLauncher.label')" :class="props.class">
      <LayoutGrid />
    </Button>
    <template #content="{ close }">
      <nav :aria-label="label ?? t('ui.appLauncher.label')">
        <ul class="grid grid-cols-2 gap-1">
          <li v-for="app in apps" :key="app.id">
            <a
              :href="app.href"
              :aria-current="app.id === current ? 'page' : undefined"
              :class="cn(
                'flex h-full flex-col items-start gap-2 rounded-lg p-3 text-sm outline-none hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-focus',
                app.id === current && 'bg-black/5'
              )"
              @click="close()"
            >
              <span class="flex size-9 items-center justify-center rounded-lg bg-black/5 text-black">
                <component :is="iconOf(app)" class="size-5" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span class="block font-bold text-black">{{ app.label }}</span>
                <span v-if="app.description" class="block text-xs text-black/65">{{ app.description }}</span>
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </template>
  </Popover>
</template>
