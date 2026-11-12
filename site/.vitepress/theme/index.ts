import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@fontsource/lato/400.css'
import '@fontsource/lato/400-italic.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/700-italic.css'
import './custom.css'
import MarkdownLink from './MarkdownLink.vue'
import StoryEmbed from './StoryEmbed.vue'

export default {
  extends: DefaultTheme,
  // "View as Markdown" links above each page's footer.
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-footer-before': () => h(MarkdownLink) }),
  enhanceApp({ app }) {
    app.component('StoryEmbed', StoryEmbed)
  },
} satisfies Theme
