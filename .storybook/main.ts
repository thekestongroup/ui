import type { StorybookConfig } from '@storybook/vue3-vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      // Read prop types from components so Controls are generated automatically.
      docgen: 'vue-component-meta',
    },
  },
  stories: ['../docs/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // GitHub-style Markdown in .mdx docs pages, mainly tables.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
  ],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: { viteConfigPath: '.storybook/vite.config.ts' },
    },
    disableTelemetry: true,
  },
}

export default config
