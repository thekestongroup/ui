#!/usr/bin/env node
// Scaffold a new component:  pnpm new Button
//
// Creates:
//   src/components/<Name>/<Name>.vue          the component (unstyled)
//   src/components/<Name>/<Name>.stories.ts   Storybook playground
//   specs/<name>.md                           platform-neutral spec
// and adds the export to src/index.ts.

import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const name = process.argv[2]

if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error('Usage: pnpm new <ComponentName>   (PascalCase, e.g. Button, IconButton)')
  process.exit(1)
}

const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const dir = join(root, 'src/components', name)
const specPath = join(root, 'specs', `${kebab}.md`)

if (existsSync(dir)) {
  console.error(`src/components/${name} already exists.`)
  process.exit(1)
}

mkdirSync(dir, { recursive: true })

writeFileSync(
  join(dir, `${name}.vue`),
  `<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../lib/cn'

export interface ${name}Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<${name}Props>()
</script>

<template>
  <div :class="cn(props.class)">
    <slot />
  </div>
</template>
`,
)

writeFileSync(
  join(dir, `${name}.stories.ts`),
  `import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ${name} from './${name}.vue'

const meta = {
  title: 'Components/${name}',
  component: ${name},
  tags: ['autodocs'],
  args: {},
  render: (args) => ({
    components: { ${name} },
    setup: () => ({ args }),
    template: '<${name} v-bind="args">${name}</${name}>',
  }),
} satisfies Meta<typeof ${name}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
`,
)

if (!existsSync(specPath)) {
  const template = readFileSync(join(root, 'specs/_template.md'), 'utf8')
  writeFileSync(specPath, template.replaceAll('{{Name}}', name))
}

appendFileSync(
  join(root, 'src/index.ts'),
  `export { default as ${name} } from './components/${name}/${name}.vue'\nexport type { ${name}Props } from './components/${name}/${name}.vue'\n`,
)

console.log(`Created ${name}:
  src/components/${name}/${name}.vue
  src/components/${name}/${name}.stories.ts
  specs/${kebab}.md
  (exported from src/index.ts)`)
