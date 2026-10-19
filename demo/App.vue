<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Checkbox,
  Dialog,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Popover,
  Tooltip,
} from '../src'

const checked = ref(false)
</script>

<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900">
    <div class="mx-auto max-w-3xl space-y-12 px-6 py-12">
      <header>
        <h1 class="text-3xl font-bold">Keston UI</h1>
        <p class="mt-2 text-neutral-500">
          Vue 3 + Reka UI + Tailwind — live component demo. Edit any component and watch it hot-reload.
        </p>
      </header>

      <section>
        <h2 class="mb-4 text-lg font-semibold">Button</h2>
        <div class="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h2 class="mb-4 text-lg font-semibold">Checkbox</h2>
        <label class="flex items-center gap-2 text-sm">
          <Checkbox v-model="checked" />
          Accept terms and conditions (checked: {{ checked }})
        </label>
      </section>

      <section>
        <h2 class="mb-4 text-lg font-semibold">Tooltip</h2>
        <Tooltip content="Add a new item">
          <template #trigger>
            <Button variant="outline">Hover me</Button>
          </template>
        </Tooltip>
      </section>

      <section>
        <h2 class="mb-4 text-lg font-semibold">Popover</h2>
        <Popover>
          <template #trigger>
            <Button variant="outline">Open popover</Button>
          </template>
          <div class="text-sm">
            <p class="font-medium">Popover title</p>
            <p class="mt-1 text-neutral-500">Some more info from the getting-started guide.</p>
          </div>
        </Popover>
      </section>

      <section>
        <h2 class="mb-4 text-lg font-semibold">Dialog</h2>
        <Dialog title="Edit profile" description="Make changes to your profile here.">
          <template #trigger>
            <Button>Open dialog</Button>
          </template>
          <p class="text-sm text-neutral-500">Dialog body content goes here.</p>
        </Dialog>
      </section>

      <section>
        <h2 class="mb-4 text-lg font-semibold">Dropdown menu</h2>
        <DropdownMenu>
          <template #trigger>
            <Button variant="outline">Open menu</Button>
          </template>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Sign out (disabled)</DropdownMenuItem>
        </DropdownMenu>
      </section>
    </div>
  </div>
</template>
