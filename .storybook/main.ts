import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      // Read prop types from components so Controls are generated automatically.
      docgen: 'vue-component-meta',
    },
  },
  stories: ['../docs/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: { viteConfigPath: '.storybook/vite.config.ts' },
    },
    disableTelemetry: true,
  },
}

export default config
