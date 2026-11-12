// Markdown copies of the docs, for AI tools (and anyone who wants plain text):
// - every page at its own URL plus .md, e.g. /components/button.md;
// - /llms.txt, an index of those (https://llmstxt.org);
// - /llms-full.txt, everything in one file.
// Component pages also get the component's exact API, read from its source.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { groups, libraryComponents, type LibraryComponent } from './library'

const root = fileURLToPath(new URL('../../', import.meta.url))
const site = `${root}site/`
const repo = 'https://github.com/thekestongroup/ui'

// ── The component's API, from its source ────────────────────────────────────

/** Files src/index.ts exports from, grouped by component folder. */
function exportedFiles() {
  const index = readFileSync(`${root}src/index.ts`, 'utf8')
  const byFolder = new Map<string, Set<string>>()
  for (const [, folder, file] of index.matchAll(/from '\.\/components\/(\w+)\/([\w.]+)'/g)) {
    const path = file.endsWith('.vue') ? file : `${file}.ts`
    byFolder.set(folder, (byFolder.get(folder) ?? new Set()).add(path))
  }
  return byFolder
}

const declaration = /^\s*(export (interface|type|function) |(const \w+ = )?define(Model|Emits|Slots)\b)/

/**
 * The public declarations in a source file, with their doc comments:
 * exported interfaces and types, exported functions (signature only),
 * and defineModel / defineEmits / defineSlots.
 */
function declarations(source: string) {
  const script = source.includes('<script') ? (source.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '') : source
  const lines = script.split('\n')
  const blocks: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (!declaration.test(lines[i])) continue

    // Doc comment above it.
    let start = i
    // (Section dividers like "// ── Steps ──" aren't documentation.)
    while (start > 0 && /^\s*(\/\*\*|\*|\*\/|\/\/)/.test(lines[start - 1]) && !/\/\/ ──/.test(lines[start - 1])) start--

    // Up to where its brackets close (functions: just the signature).
    const isFunction = /^\s*export function /.test(lines[i])
    let depth = 0
    let end = i
    for (; end < lines.length; end++) {
      const line = lines[end]
      if (isFunction && /\{\s*$/.test(line)) break
      for (const char of line) {
        if ('{([<'.includes(char)) depth++
        if ('})]>'.includes(char)) depth--
      }
      // Arrows (=>) aren't brackets.
      depth += (line.match(/=>/g) ?? []).length
      if (depth <= 0 && !/[<,=|&({]\s*$/.test(line)) break
    }
    const block = lines.slice(start, end + 1)
    if (isFunction) block[block.length - 1] = block[block.length - 1].replace(/\{\s*$/, '{ … }')
    blocks.push(block.join('\n').replace(/^\s*\n/, ''))
    i = end
  }
  return blocks
}

function componentApi(c: LibraryComponent, files: Map<string, Set<string>>) {
  const folder = files.get(c.name)
  if (!folder) return ''
  return [...folder]
    .map((file) => {
      const blocks = declarations(readFileSync(`${root}src/components/${c.name}/${file}`, 'utf8'))
      return blocks.length ? `// ${file}\n${blocks.join('\n\n')}` : ''
    })
    .filter(Boolean)
    .join('\n\n')
}

// ── Pages as Markdown ───────────────────────────────────────────────────────

/** Site links point at the Markdown copies, by full address. */
function absoluteLinks(md: string, siteUrl: string) {
  return md.replace(/\]\((\/[^)\s#]*)(#[^)]*)?\)/g, (_, path: string, hash = '') => {
    const page = path === '/' ? '/index' : path.replace(/\/$/, '/index')
    return `](${siteUrl}${page}.md${hash})`
  })
}

/** Drops what only makes sense on the website (swatches, embeds, includes). */
function plain(md: string) {
  return md
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/<!--\s*@include:\s*([^{\s]+)(?:\{(\d+),\})?\s*-->/g, (_, file: string, from?: string) =>
      // Includes are relative to the page; these pages are all at the top of site/.
      readFileSync(`${site}${file}`, 'utf8')
        .split('\n')
        .slice(from ? Number(from) - 1 : 0)
        .join('\n'),
    )
    .replace(/<span class="swatch"[^>]*><\/span>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function homePage() {
  const front = readFileSync(`${site}index.md`, 'utf8')
  const pick = (key: string) => front.match(new RegExp(`^\\s*${key}: (.+)$`, 'm'))?.[1] ?? ''
  const features = [...front.matchAll(/- title: (.+)\n\s+details: (.+)/g)].map(([, t, d]) => `- **${t}**: ${d}`)
  return [
    `# ${pick('name')}`,
    `> ${pick('text')}`,
    pick('tagline'),
    features.join('\n'),
    '## Start here',
    '- [Getting started](/guide/getting-started)\n- [Components](/components/button)\n- [Changelog](/changelog)',
  ].join('\n\n')
}

function componentPage(c: LibraryComponent, api: string, siteUrl: string) {
  const story = `${siteUrl}/storybook/?path=/story/${c.storyId}`
  return [
    `# ${c.name}`,
    c.lead && `> ${c.lead}`,
    [
      `- Import: \`import { ${c.name} } from '@thekestongroup/ui'\``,
      `- Group: ${c.group}`,
      `- Live example: ${story}`,
      `- Source: ${repo}/blob/main/src/components/${c.name}/${c.name}.vue`,
    ].join('\n'),
    c.body.replace(/^\*\*Status:\*\*.*$/m, '').trim(),
    api && `## API (from the source)\n\nThe component's exact props, model, events, slots and types, with their documentation comments.\n\n\`\`\`ts\n${api}\n\`\`\``,
  ]
    .filter(Boolean)
    .join('\n\n')
}

interface Page {
  /** Path without base or extension, e.g. components/button. */
  path: string
  title: string
  description: string
  markdown: string
}

function allPages(siteUrl: string): { guide: Page[]; components: Page[]; other: Page[] } {
  const files = exportedFiles()
  const guidePage = (path: string, title: string, description: string): Page => ({
    path,
    title,
    description,
    markdown: plain(readFileSync(`${site}${path}.md`, 'utf8')),
  })
  const comps = libraryComponents()
  return {
    guide: [
      guidePage('guide/getting-started', 'Getting started', 'Install the library, add the theme, use a component.'),
      guidePage('guide/colours', 'Colours', 'The colour tokens and what each is for.'),
      guidePage('guide/typography', 'Typography', 'Lato, text sizes, weights and writing.'),
    ],
    components: groups.flatMap((group) =>
      comps
        .filter((c) => c.group === group)
        .map((c) => ({
          path: `components/${c.slug}`,
          title: c.name,
          description: c.lead,
          markdown: componentPage(c, componentApi(c, files), siteUrl),
        })),
    ),
    other: [
      { path: 'index', title: 'Keston UI', description: 'Home.', markdown: homePage() },
      guidePage('changelog', 'Changelog', 'What changed in each version.'),
    ],
  }
}

// ── Writing them out ────────────────────────────────────────────────────────

export function writeMarkdownExports(outDir: string, siteUrl: string) {
  const { guide, components, other } = allPages(siteUrl)
  const write = (path: string, text: string) => {
    mkdirSync(dirname(`${outDir}/${path}`), { recursive: true })
    writeFileSync(`${outDir}/${path}`, `${text.trim()}\n`)
  }

  for (const page of [...guide, ...components, ...other]) {
    write(`${page.path}.md`, absoluteLinks(page.markdown, siteUrl))
  }

  const link = (p: Page) => `- [${p.title}](${siteUrl}/${p.path}.md)${p.description ? `: ${p.description}` : ''}`
  const examples = [
    ['Keston ID pages', 'Sign-in leading to OAuth consent, two-step code', 'KestonIdPages'],
    ['App pages', 'Whole app pages built from the components', 'AppPages'],
    ['School pages', 'Records, reviews, booking, settings', 'SchoolPages'],
    ['Form layout', 'A validated form', 'FormLayout'],
  ].map(([title, about, file]) => `- [${title}](${repo.replace('github.com', 'raw.githubusercontent.com')}/main/src/examples/${file}.stories.ts): ${about} (Vue source)`)

  const intro = [
    '# Keston UI',
    '> The Vue 3 component library for every Keston product (`@thekestongroup/ui`), built on Reka UI and Tailwind CSS v4.',
    'Every page below is Markdown. Component pages include when to use the component, its behaviour and accessibility rules, and its exact TypeScript API from the source. Use the library\'s components and tokens rather than building new ones.',
  ].join('\n\n')

  write(
    'llms.txt',
    [
      intro,
      `## Guide\n\n${guide.map(link).join('\n')}`,
      `## Components\n\n${components.map(link).join('\n')}`,
      `## Examples\n\n${examples.join('\n')}`,
      `## Optional\n\n${other.filter((p) => p.path === 'changelog').map(link).join('\n')}\n- [Everything in one file](${siteUrl}/llms-full.txt)`,
    ].join('\n\n'),
  )

  write(
    'llms-full.txt',
    [
      intro,
      `Examples of whole pages built with the library (Vue source):\n\n${examples.join('\n')}`,
      ...[...guide, ...components].map((p) => absoluteLinks(p.markdown, siteUrl)),
    ].join('\n\n---\n\n'),
  )
}
