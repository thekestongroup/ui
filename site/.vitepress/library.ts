// Reads the library itself, so the docs site follows it automatically:
// - which components exist, and their groups, from src/index.ts (in the
//   order they're exported there);
// - each component's write-up from specs/<name>.md.
// Used by the sidebar (config.ts) and the component pages
// (components/[component].paths.ts).
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))

export const groups = ['Layout', 'Element', 'Form', 'Data', 'Navigation', 'Overlay'] as const
export type Group = (typeof groups)[number]

export interface LibraryComponent {
  name: string
  group: Group
  /** URL slug and spec file name, e.g. input-password. */
  slug: string
  /** The spec's one-sentence summary. */
  lead: string
  /** The spec from "When to use" on, as Markdown. */
  body: string
  /** Storybook story embedded at the top of the page. */
  storyId: string
  /** Least height for the embedded story, in px. */
  minHeight: number
}

// Exported alongside another component and documented on its page.
const documentedWith: Record<string, string> = { NotificationPane: 'Notification', Toaster: 'Notification' }

// Components whose playground story isn't called "Default".
const playgroundStory: Record<string, string> = { Spinner: 'continuous' }

// The embedded story grows to fit its content. Components whose panels float
// outside it (menus, calendars, slide-in panels, toasts) need room for them,
// and full-page layouts (AppShell, Sidebar) fill whatever height they get.
const embedMinHeight: Record<string, number> = {
  AppShell: 560,
  Sidebar: 520,
  Select: 340,
  InputDate: 440,
  Popover: 260,
  Tooltip: 140,
  InfoTip: 160,
  Slideover: 520,
  Notification: 360,
  Header: 320,
}

const toSlug = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function readSpec(slug: string) {
  const path = `${root}specs/${slug}.md`
  if (!existsSync(path)) return { lead: '', body: '' }
  const text = readFileSync(path, 'utf8')
  const lead = text.match(/^> (.+)$/m)?.[1] ?? ''
  const start = text.indexOf('\n## ')
  return { lead, body: start === -1 ? '' : text.slice(start + 1) }
}

export function libraryComponents(): LibraryComponent[] {
  const index = readFileSync(`${root}src/index.ts`, 'utf8')
  const components: LibraryComponent[] = []
  let group: Group | undefined
  for (const line of index.split('\n')) {
    const heading = line.match(/^\/\/ (\w+)$/)?.[1]
    if (heading) group = (groups as readonly string[]).includes(heading) ? (heading as Group) : undefined
    const name = line.match(/^export \{ default as (\w+) \}/)?.[1]
    if (!name || !group || documentedWith[name]) continue
    const slug = toSlug(name)
    const story = playgroundStory[name] ?? 'default'
    components.push({
      name,
      group,
      slug,
      ...readSpec(slug),
      storyId: `components-${group.toLowerCase()}-${name.toLowerCase()}--${story}`,
      minHeight: embedMinHeight[name] ?? 96,
    })
  }
  return components
}
