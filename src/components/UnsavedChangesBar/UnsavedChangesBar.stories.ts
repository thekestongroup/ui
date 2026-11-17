import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Button from '../Button/Button.vue'
import UnsavedChangesBar from './UnsavedChangesBar.vue'

const meta = {
  title: 'Components/Overlay/UnsavedChangesBar',
  component: UnsavedChangesBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { open: true, message: '', discardLabel: '', saveLabel: '', status: 'idle', reserveSpace: true },
  argTypes: { status: { options: ['idle', 'loading', 'success', 'error'], control: { type: 'inline-radio' } } },
} satisfies Meta<typeof UnsavedChangesBar>

export default meta
type Story = StoryObj<typeof meta>

/** Shown with its defaults: "Unsaved changes", Discard and Save. */
export const Default: Story = {
  render: (args) => ({
    components: { UnsavedChangesBar },
    setup: () => ({ args }),
    template: `
      <div class="p-6"><p class="text-sm">Page content. The bar is fixed to the bottom of the screen.</p>
      <UnsavedChangesBar v-bind="args" :message="args.message || undefined" :discard-label="args.discardLabel || undefined" :save-label="args.saveLabel || undefined" /></div>`,
  }),
}

/** Edit to open it; it slides up, and slides back down on Discard or Save. Save shows a spinner for a moment. */
export const SlidesInAndOut: Story = {
  render: () => ({
    components: { UnsavedChangesBar, Button },
    setup() {
      const open = ref(false)
      const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
      function save() {
        status.value = 'loading'
        setTimeout(() => {
          status.value = 'idle'
          open.value = false
        }, 1200)
      }
      return { open, status, save }
    },
    template: `
      <div class="flex flex-col items-start gap-4 p-6">
        <p class="text-sm">The bar leaves a gap at the end of the page, so nothing is covered.</p>
        <Button variant="primary" @click="open = true">Make a change</Button>
        <div class="h-[60vh] w-full rounded-lg bg-surface" />
        <p class="text-sm">Last line of the page.</p>
        <UnsavedChangesBar :open="open" :status="status" @discard="open = false" @save="save" />
      </div>`,
  }),
}

/** Words that fit the page, e.g. "Unsaved password policy". */
export const CustomWords: Story = {
  args: { message: 'Unsaved password policy', discardLabel: 'Undo', saveLabel: 'Apply' },
  render: Default.render,
}

export const Saving: Story = { args: { status: 'loading' }, render: Default.render }
