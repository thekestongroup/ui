import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Pencil } from "@lucide/vue";
import Badge from "../Badge/Badge.vue";
import Button from "../Button/Button.vue";
import Input from "../Input/Input.vue";
import Card from "./Card.vue";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { backgrounds: { disable: true } },
  argTypes: {
    padding: { options: ["md", "sm", "none"], control: { type: "inline-radio" } },
    headingLevel: { options: [2, 3, 4], control: { type: "inline-radio" } },
  },
  args: {
    title: "Academic year",
    description: "The first and last day students are on roll.",
    padding: "md",
    headingLevel: 2,
  },
  // Cards sit on the grey page background.
  decorators: [() => ({ template: '<div class="bg-background p-6"><div class="max-w-xl"><story /></div></div>' })],
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `<Card v-bind="args"><p class="text-sm">Content goes here.</p></Card>`,
  }),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. */
export const Default: Story = {};

/** A form section: fields lay out by the card's own width (container queries). */
export const FormSection: Story = {
  render: (args) => ({
    components: { Card, Input },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args">
        <div class="grid grid-cols-1 gap-4 @md:grid-cols-2">
          <Input label="Name" model-value="2027–28" />
          <Input label="Code" model-value="AY27" />
        </div>
      </Card>`,
  }),
};

/** Actions beside the title, and a footer under a divider. */
export const WithActionsAndFooter: Story = {
  args: { title: "Contact details", description: "Shown to parents on the portal." },
  render: (args) => ({
    components: { Card, Button, Pencil },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args">
        <template #actions>
          <Button variant="ghost" size="sm"><template #leading><Pencil /></template>Edit</Button>
        </template>
        <dl class="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
          <dt class="text-black/65">Email</dt><dd>office@keston.school</dd>
          <dt class="text-black/65">Phone</dt><dd>020 7946 0000</dd>
        </dl>
        <template #footer>
          <Button>Cancel</Button>
          <Button variant="primary">Save</Button>
        </template>
      </Card>`,
  }),
};

/** Small cards in a grid, e.g. stats, with padding="sm" and no title. */
export const Stats: Story = {
  render: () => ({
    components: { Card, Badge },
    template: `
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card v-for="stat in [['Open applications', '48'], ['Interviews this week', '9'], ['Offers accepted', '31']]" :key="stat[0]" padding="sm" :ui="{ body: 'gap-1' }">
          <span class="text-sm text-black/65">{{ stat[0] }}</span>
          <span class="text-2xl font-bold">{{ stat[1] }}</span>
        </Card>
      </div>`,
  }),
};

/** padding="none": the content (here a table) runs to the edges. */
export const Table: Story = {
  args: { title: undefined, description: undefined, padding: "none" },
  render: (args) => ({
    components: { Card, Badge },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" :ui="{ body: 'overflow-x-auto' }">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-black/15 text-black/65">
            <tr><th class="px-4 py-3 font-bold">Applicant</th><th class="px-4 py-3 font-bold">Year</th><th class="px-4 py-3 font-bold">Status</th></tr>
          </thead>
          <tbody>
            <tr class="border-b border-black/15"><td class="px-4 py-3 font-bold">Amelia Clarke</td><td class="px-4 py-3">Year 7</td><td class="px-4 py-3"><Badge size="sm" color="green">Offered</Badge></td></tr>
            <tr><td class="px-4 py-3 font-bold">Noah Patel</td><td class="px-4 py-3">Year 9</td><td class="px-4 py-3"><Badge size="sm" color="blue">Interview</Badge></td></tr>
          </tbody>
        </table>
      </Card>`,
  }),
};
