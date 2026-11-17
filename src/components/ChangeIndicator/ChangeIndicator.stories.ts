import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ChangeIndicator from './ChangeIndicator.vue'

const meta = {
  title: 'Components/Element/ChangeIndicator',
  component: ChangeIndicator,
  tags: ['autodocs'],
  args: { from: 15, to: 5 },
} satisfies Meta<typeof ChangeIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The unit follows the new value only: `3 → 5 phrases`. */
export const WithUnit: Story = { args: { from: 3, to: 5, unit: 'phrases' } }

/** Text values work too. */
export const Text: Story = { args: { from: 'Recommended', to: 'Custom' } }

/** Nothing is shown when the value is back to what was saved. */
export const Unchanged: Story = { args: { from: 8, to: 8 } }

/** Next to a setting's label, while it has unsaved edits. */
export const BesideALabel: Story = {
  render: (args) => ({
    components: { ChangeIndicator },
    setup: () => ({ args }),
    template: '<p class="flex items-center gap-2 text-sm">Minimum length <ChangeIndicator v-bind="args" /></p>',
  }),
}
