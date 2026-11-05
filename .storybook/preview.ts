import type { Preview } from '@storybook/vue3-vite'
import './preview.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Show accessibility problems in the panel without failing anything.
      test: 'todo',
    },
  },
}

export default preview
