import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Gauge, ShieldCheck, ShieldAlert, SlidersHorizontal } from '@lucide/vue'
import CardSelect from './CardSelect.vue'

const presets = [
  { title: 'Baseline', value: 'baseline', description: '8 characters. Nothing extra.' },
  { title: 'Recommended', value: 'recommended', description: '12 characters and a number.' },
  { title: 'Strict', value: 'strict', description: '14 characters with every kind of character.' },
  { title: 'Custom', value: 'custom', description: 'Set each rule yourself.' },
]

const meta = {
  title: 'Components/Form/CardSelect',
  component: CardSelect,
  tags: ['autodocs'],
  argTypes: {
    helperPlacement: { options: ['below', 'icon'], control: { type: 'inline-radio' } },
    columns: { options: [undefined, 1, 2, 3, 4], control: { type: 'inline-radio' } },
  },
  args: {
    label: 'Preset',
    options: presets,
    hideLabel: false,
    helper: '',
    helperPlacement: 'below',
    errorText: '',
    disabled: false,
  },
  render: (args) => ({
    components: { CardSelect },
    setup: () => ({ args, value: ref<string | number | undefined>('recommended') }),
    template: '<CardSelect v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof CardSelect>

export default meta
type Story = StoryObj<typeof meta>

/** Playground. Tab into the group, then use the arrow keys to choose. Nothing moves when the choice changes. */
export const Default: Story = {}

/** Icons before the titles. */
export const WithIcons: Story = {
  args: {
    options: [
      { title: 'Baseline', value: 'baseline', description: '8 characters.', icon: ShieldAlert },
      { title: 'Recommended', value: 'recommended', description: '12 characters and a number.', icon: ShieldCheck },
      { title: 'Strict', value: 'strict', description: '14 characters, every kind.', icon: Gauge },
      { title: 'Custom', value: 'custom', description: 'Set each rule yourself.', icon: SlidersHorizontal },
    ],
  },
}

/** Titles only. */
export const TitlesOnly: Story = {
  args: {
    label: 'Layout',
    options: [
      { title: 'List', value: 'list' },
      { title: 'Grid', value: 'grid' },
    ],
  },
}

export const Nothing: Story = {
  render: (args) => ({
    components: { CardSelect },
    setup: () => ({ args, value: ref<string | number | undefined>() }),
    template: '<CardSelect v-bind="args" v-model="value" />',
  }),
}

export const HelperBelowLabel: Story = { args: { helper: 'You can change any rule afterwards.' } }
export const HelperBehindIcon: Story = { args: { helper: 'You can change any rule afterwards.', helperPlacement: 'icon' } }
export const Error: Story = {
  args: { errorText: 'Choose a preset' },
  render: (args) => ({
    components: { CardSelect },
    setup: () => ({ args, value: ref<string | number | undefined>() }),
    template: '<CardSelect v-bind="args" v-model="value" />',
  }),
}
export const DisabledOption: Story = {
  args: { options: presets.map((o) => (o.value === 'strict' ? { ...o, disabled: true } : o)) },
}
export const Disabled: Story = { args: { disabled: true } }
export const TwoColumns: Story = { args: { columns: 2 } }
