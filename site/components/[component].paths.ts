// One page per component, built from its spec (see ../.vitepress/library.ts).
import { libraryComponents } from '../.vitepress/library'

export default {
  // Rebuild the pages in dev when a spec or the export list changes.
  watch: ['../../specs/*.md', '../../src/index.ts'],
  paths() {
    return libraryComponents().map((c) => ({
      params: { component: c.slug },
      content: [
        `# ${c.name}`,
        c.lead && `<p class="lead">${c.lead}</p>`,
        `<StoryEmbed id="${c.storyId}" name="${c.name}" :min-height="${c.minHeight}" />`,
        c.body,
      ]
        .filter(Boolean)
        .join('\n\n'),
    }))
  },
}
