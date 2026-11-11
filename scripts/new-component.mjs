#!/usr/bin/env node
// Scaffold a new component:  pnpm new Button Element
//
// The second argument is the component's group, as in Storybook's sidebar
// and src/index.ts: Layout, Element, Form, Data, Navigation or Overlay.
//
// Creates:
//   src/components/<Name>/<Name>.vue          the component (unstyled)
//   src/components/<Name>/<Name>.stories.ts   Storybook playground
//   specs/<name>.md                           platform-neutral spec
// and adds its exports to the end of its group in src/index.ts.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const name = process.argv[2]
const group = process.argv[3]
const groups = ['Layout', 'Element', 'Form', 'Data', 'Navigation', 'Overlay']

if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name) || !groups.includes(group)) {
  console.error(`Usage: pnpm new <ComponentName> <Group>   e.g. pnpm new Textarea Form

  ComponentName  PascalCase, e.g. Button, IconButton
  Group          ${groups.join(', ')}

  Layout      the frame of an app: shell, header, page header
  Element     small building blocks: buttons, badges, avatars, cards
  Form        anything people fill in or choose with
  Data        showing information: tables, figures, lists, dates
  Navigation  moving around: breadcrumbs, sidebar
  Overlay     things that float over the page: popovers, panels, toasts`)
  process.exit(1)
}

// Check the group's heading is in src/index.ts before creating anything.
const indexPath = join(root, 'src/index.ts')
const index = readFileSync(indexPath, 'utf8')
const heading = `// ${group}\n`
if (!index.includes(heading)) {
  console.error(`src/index.ts has no "// ${group}" heading to add the exports under.`)
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
  title: 'Components/${group}/${name}',
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

// The group's exports run from its heading to the next blank line.
const start = index.indexOf(heading) + heading.length
const end = index.indexOf('\n\n', start)
const exports = `export { default as ${name} } from './components/${name}/${name}.vue'\nexport type { ${name}Props } from './components/${name}/${name}.vue'\n`
writeFileSync(indexPath, index.slice(0, end + 1) + exports + index.slice(end + 1))

console.log(`Created ${name}:
  src/components/${name}/${name}.vue
  src/components/${name}/${name}.stories.ts
  specs/${kebab}.md
  (exported from src/index.ts, under ${group})\n  Storybook: Components/${group}/${name}`)
