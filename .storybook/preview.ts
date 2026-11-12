import type { Preview } from '@storybook/vue3-vite'
import './preview.css'
import { kestonTheme } from './theme.ts'

const preview: Preview = {
  parameters: {
    // Docs pages in Keston's colours and Lato, like the rest of the site.
    docs: { theme: kestonTheme },
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
    options: {
      // Components are grouped like Nuxt UI's, in this order. Within a group
      // they're alphabetical; each component's stories keep the order they're
      // written in. Storybook reads this function as plain JavaScript, so it
      // must be self-contained and have no type annotations.
      // @ts-expect-error: a and b are story entries ({ title, … }).
      storySort: (a, b) => {
        const order = [
          'Introduction',
          'Components/Layout',
          'Components/Element',
          'Components/Form',
          'Components/Data',
          'Components/Navigation',
          'Components/Overlay',
          'Examples',
        ]
        const rank = [a.title, b.title].map((title) => {
          const i = order.findIndex((prefix) => title === prefix || title.startsWith(`${prefix}/`))
          return i === -1 ? order.length : i
        })
        return rank[0] - rank[1] || (a.title === b.title ? 0 : a.title.localeCompare(b.title))
      },
    },
  },
}

export default preview
