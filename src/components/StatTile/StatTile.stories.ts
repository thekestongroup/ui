import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CalendarCheck, FileText, Users, UserX } from "@lucide/vue";
import StatTile from "./StatTile.vue";

const meta = {
  title: "Components/Data/StatTile",
  component: StatTile,
  tags: ["autodocs"],
  parameters: { backgrounds: { disable: true } },
  argTypes: {
    trend: { options: [undefined, "up", "down", "flat"], control: { type: "inline-radio" } },
    sentiment: { options: [undefined, "positive", "negative", "neutral"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Open applications",
    value: "48",
    change: "+12%",
    changeLabel: "on last year",
    trend: "up",
    class: "max-w-xs",
  },
  decorators: [() => ({ template: '<div class="bg-background p-6"><story /></div>' })],
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. */
export const Default: Story = {};

/** Just a label and a number. */
export const Plain: Story = { args: { change: undefined, changeLabel: undefined, trend: undefined } };

/** Down is good for absences: sentiment="positive" makes it green. */
export const DownIsGood: Story = {
  args: { label: "Unauthorised absences", value: "2.1%", change: "−0.4 pts", changeLabel: "this term", trend: "down", sentiment: "positive", icon: UserX },
};

/** In a grid, as on a dashboard. Tiles fill the row and wrap as space allows. */
export const Grid: Story = {
  render: () => ({
    components: { StatTile },
    setup: () => ({ Users, FileText, CalendarCheck, UserX }),
    template: `
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Students on roll" value="1,204" :icon="Users" change="+38" change-label="since September" trend="up" />
        <StatTile label="Open applications" value="48" :icon="FileText" change="+12%" change-label="on last year" trend="up" />
        <StatTile label="Attendance" value="95.8%" :icon="CalendarCheck" change="0.0 pts" change-label="on last week" trend="flat" />
        <StatTile label="Persistent absence" value="7.4%" :icon="UserX" change="+0.9 pts" change-label="this term" trend="up" sentiment="negative" />
      </div>`,
  }),
};

/** With a description and a footer link. */
export const WithDescriptionAndFooter: Story = {
  args: { description: "Waiting for an interview or a decision.", change: undefined, changeLabel: undefined, trend: undefined },
  render: (args) => ({
    components: { StatTile },
    setup: () => ({ args }),
    template: `
      <StatTile v-bind="args">
        <template #footer><a href="#" class="font-bold text-primary underline-offset-2 hover:underline">View applications</a></template>
      </StatTile>`,
  }),
};

/** A unit in smaller text, using the value slot. */
export const WithUnit: Story = {
  args: { label: "Average class size", change: undefined, changeLabel: undefined, trend: undefined },
  render: (args) => ({
    components: { StatTile },
    setup: () => ({ args }),
    template: `<StatTile v-bind="args"><template #value>27.4 <span class="text-sm font-normal text-black/65">students</span></template></StatTile>`,
  }),
};
