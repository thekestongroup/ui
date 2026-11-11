import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CircleAlert, CircleCheck, Clock, Info, Sparkles, Users } from "@lucide/vue";
import Badge from "./Badge.vue";

const colors = ["basic", "primary", "green", "blue", "yellow", "red"] as const;

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    color: { options: colors, control: { type: "inline-radio" } },
    size: { options: ["sm", "md", "lg"], control: { type: "inline-radio" } },
  },
  args: { color: "basic", size: "md" },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: `<Badge v-bind="args">Year 9</Badge>`,
  }),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. */
export const Default: Story = {};

/** Each colour, with the kind of status it suits. */
export const Colors: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => ({
      args,
      examples: [
        { color: "basic", text: "Year 9" },
        { color: "primary", text: "New" },
        { color: "green", text: "Paid" },
        { color: "blue", text: "In progress" },
        { color: "yellow", text: "Due soon" },
        { color: "red", text: "Overdue" },
      ],
    }),
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Badge v-for="e in examples" :key="e.color" v-bind="args" :color="e.color">{{ e.text }}</Badge>
      </div>`,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-2">
        <Badge v-bind="args" size="sm">Small</Badge>
        <Badge v-bind="args" size="md">Medium</Badge>
        <Badge v-bind="args" size="lg">Large</Badge>
      </div>`,
  }),
};

/** An icon in the leading slot. */
export const WithIcon: Story = {
  render: (args) => ({
    components: { Badge, CircleAlert, CircleCheck, Clock, Info, Sparkles, Users },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Badge v-bind="args" color="basic"><template #leading><Users /></template>28 students</Badge>
        <Badge v-bind="args" color="primary"><template #leading><Sparkles /></template>New</Badge>
        <Badge v-bind="args" color="green"><template #leading><CircleCheck /></template>Paid</Badge>
        <Badge v-bind="args" color="blue"><template #leading><Info /></template>In progress</Badge>
        <Badge v-bind="args" color="yellow"><template #leading><Clock /></template>Due soon</Badge>
        <Badge v-bind="args" color="red"><template #leading><CircleAlert /></template>Overdue</Badge>
      </div>`,
  }),
};

/** Next to text, e.g. in a heading or a table cell. */
export const InContext: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col gap-3 text-sm">
        <h2 class="flex items-center gap-2 text-lg">Ben Smith <Badge v-bind="args" color="green">Enrolled</Badge></h2>
        <p class="flex items-center gap-2">Spring term invoice <Badge v-bind="args" color="red" size="sm">Overdue</Badge></p>
      </div>`,
  }),
};
