import { defineConfig } from 'vitepress'
import { groups, libraryComponents } from './library'
import { writeMarkdownExports } from './markdown'

// Where the site is served from. GitHub Pages serves it at /ui/; set
// DOCS_BASE=/ (and DOCS_URL) when it moves to its own domain.
const base = process.env.DOCS_BASE ?? '/ui/'
const siteUrl = process.env.DOCS_URL ?? 'https://thekestongroup.github.io/ui'

const components = libraryComponents()

export default defineConfig({
  title: 'Keston UI',
  description: 'The component library for every Keston product.',
  base,
  lang: 'en-GB',
  cleanUrls: true,
  lastUpdated: true,
  // Keston has no dark theme (yet), so the site is light only.
  appearance: false,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}keston-favicon.svg` }],
    // Points AI tools at the Markdown version of the docs.
    ['link', { rel: 'alternate', type: 'text/plain', title: 'llms.txt', href: `${base}llms.txt` }],
  ],

  // Markdown copies of every page (add .md to any URL), plus llms.txt and
  // llms-full.txt, for AI tools. See markdown.ts.
  buildEnd(siteConfig) {
    writeMarkdownExports(siteConfig.outDir, siteUrl)
  },

  themeConfig: {
    logo: '/keston-favicon.svg',
    siteTitle: 'Keston UI',

    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: 'Components', link: `/components/${components[0]?.slug ?? ''}`, activeMatch: '/components/' },
      // Storybook is a separate app published next to the site, so link to it
      // by full address (the site's own router would look for a page).
      { text: 'Storybook', link: `${siteUrl}/storybook/` },
      { text: 'Changelog', link: '/changelog' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Colours', link: '/guide/colours' },
            { text: 'Typography', link: '/guide/typography' },
          ],
        },
      ],
      '/components/': groups.map((group) => ({
        text: group,
        items: components.filter((c) => c.group === group).map((c) => ({ text: c.name, link: `/components/${c.slug}` })),
      })),
    },

    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/thekestongroup/ui' }],
    editLink: {
      pattern: 'https://github.com/thekestongroup/ui/edit/main/site/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the PolyForm Noncommercial License 1.0.0.',
      copyright: 'Copyright © The Keston Group',
    },
  },
})
