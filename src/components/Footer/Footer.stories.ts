import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Footer from './Footer.vue'
import { kestonGroupLinks } from './links'

const meta = {
  title: 'Components/Layout/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    appName: 'Keston Admin',
    version: '1.4.2',
    build: 'a1b2c3d',
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Playground: use the controls below. Help & support and the legal links on the left; the app's name, version and build,
 * and the copyright, on the right. Narrow the preview to see it stack.
 */
export const Default: Story = {}

/** No build: only the version (e.g. a local run, where there is no CI build). */
export const NoBuild: Story = {
  args: { build: undefined },
}

/** `since` shows a range of years. */
export const SinceYear: Story = {
  args: { since: 2024 },
}

/** `moreLinks`: more links after the standard ones, e.g. Contact us. */
export const WithMoreLinks: Story = {
  args: {
    moreLinks: [{ label: 'Contact us', href: 'https://example.com/contact' }],
  },
}

/** `kestonGroupLinks` as `moreLinks`, to point people at the other Keston apps. */
export const WithGroupLinks: Story = {
  args: { moreLinks: kestonGroupLinks },
}

/** `links` replaces the standard links altogether, e.g. for an app with its own help and policies. Rarely needed: prefer `moreLinks`. */
export const CustomLinks: Story = {
  args: {
    links: [
      { label: 'Help & support', href: '#help', newTab: false },
      { label: 'Privacy Policy', href: '#privacy', newTab: false },
      { label: 'Terms of use', href: '#terms', newTab: false },
    ],
  },
}

/** No app name, version or build (e.g. a public page): just the links and the copyright. */
export const NoVersion: Story = {
  args: { appName: undefined, version: undefined, build: undefined },
}

/** The slot `end`, after the copyright: here a stand-in for a language switcher. */
export const WithEndSlot: Story = {
  render: (args) => ({
    components: { Footer },
    setup: () => ({ args }),
    template: `
      <Footer v-bind="args">
        <template #end><button type="button" class="underline underline-offset-2">English</button></template>
      </Footer>`,
  }),
}

/** Phone-sized: the links, then the version and copyright, stacked. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  args: {
    moreLinks: [{ label: 'Contact us', href: 'https://example.com/contact' }],
  },
}
