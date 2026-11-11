import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Badge from "../Badge/Badge.vue";
import Button from "../Button/Button.vue";
import Card from "../Card/Card.vue";
import SummaryList, { type SummaryListProps } from "./SummaryList.vue";

const details = [
  { label: "Name", value: "Amelia Clarke" },
  { label: "Date of birth", value: "14 March 2015" },
  { label: "Year group", value: "Year 7 (September 2027)" },
  { label: "Current school", value: "Hillside Primary School", description: "Since September 2019" },
  { label: "Parent or carer", value: "Sarah Clarke" },
  { label: "Email", value: "sarah.clarke@example.com" },
  { label: "Medical needs", value: null },
];

const meta = {
  title: "Components/SummaryList",
  // A generic component, which Meta<typeof SummaryList> can't describe, so the args are typed by its props.
  component: SummaryList as any,
  tags: ["autodocs"],
  parameters: { backgrounds: { disable: true } },
  argTypes: {
    layout: { options: ["rows", "compact", "stacked"], control: { type: "inline-radio" } },
    labelWidth: { options: ["sm", "md", "lg"], control: { type: "inline-radio" } },
  },
  args: { items: details, layout: "rows", labelWidth: "md" },
  decorators: [() => ({ template: '<div class="bg-background p-6"><div class="max-w-2xl"><story /></div></div>' })],
  render: (args) => ({
    components: { SummaryList, Card },
    setup: () => ({ args }),
    template: `<Card title="Applicant"><SummaryList v-bind="args" /></Card>`,
  }),
} satisfies Meta<SummaryListProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rows: label beside value, a line between. Stacks when the card is narrow. An empty value shows "—". */
export const Default: Story = {};

/** A Change action per row, for checking answers before submitting. */
export const WithActions: Story = {
  render: (args) => ({
    components: { SummaryList, Card, Button },
    setup: () => ({ args }),
    template: `
      <Card title="Check the application">
        <SummaryList v-bind="args">
          <template #action="{ item }">
            <Button variant="ghost" size="sm">Change<span class="sr-only"> {{ item.label.toLowerCase() }}</span></Button>
          </template>
        </SummaryList>
      </Card>`,
  }),
};

/** Compact: figures right-aligned, for a summary card or sidebar. */
export const Compact: Story = {
  args: {
    layout: "compact",
    items: [
      { label: "Moving up a year", value: "1,042" },
      { label: "Leaving (Year 13)", value: "162" },
      { label: "Joining Year 7", value: "180" },
      { label: "On roll in September", value: "1,222", emphasis: true },
    ],
  },
  decorators: [() => ({ template: '<div class="bg-background p-6"><div class="max-w-xs"><story /></div></div>' })],
  render: (args) => ({
    components: { SummaryList, Card },
    setup: () => ({ args }),
    template: `<Card as="aside" title="Summary" padding="sm"><SummaryList v-bind="args" /></Card>`,
  }),
};

/** Stacked: label above value, in up to 3 columns. With a Badge in the value slot. */
export const Stacked: Story = {
  args: {
    layout: "stacked",
    items: [
      { label: "Class", value: "8Y/En2" },
      { label: "Teacher", value: "Mr Blissett" },
      { label: "Room", value: "E14" },
      { label: "Students", value: "27" },
      { label: "Status", value: "Active" },
      { label: "Timetable", value: "Week A, periods 2 and 5" },
    ],
  },
  render: (args) => ({
    components: { SummaryList, Card, Badge },
    setup: () => ({ args }),
    template: `
      <Card title="8Y/En2">
        <SummaryList v-bind="args">
          <template #value="{ item }">
            <Badge v-if="item.label === 'Status'" size="sm" color="green">{{ item.value }}</Badge>
            <template v-else>{{ item.value }}</template>
          </template>
        </SummaryList>
      </Card>`,
  }),
};
