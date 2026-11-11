import type { Meta, StoryObj } from "@storybook/vue3-vite";
import StatTile from "../StatTile/StatTile.vue";
import InfoTip from "./InfoTip.vue";

const meta = {
  title: "Components/Overlay/InfoTip",
  component: InfoTip,
  tags: ["autodocs"],
  args: {
    label: "About attendance",
    text: "Sessions attended as a share of possible sessions this term. Authorised absences count against it.",
  },
  decorators: [() => ({ template: '<div class="p-16"><story /></div>' })],
  render: (args) => ({
    components: { InfoTip },
    setup: () => ({ args }),
    template: `
      <span class="inline-flex items-center gap-1 text-sm">Attendance <InfoTip v-bind="args" /></span>`,
  }),
} satisfies Meta<typeof InfoTip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Hover, click or tab to the `?`. Screen readers hear its label ("About
 * attendance") and the text as its description, without opening it.
 */
export const Default: Story = {};

/** Explaining a column heading. */
export const InTableHeading: Story = {
  args: { label: "About FSM", text: "Free school meals: eligible at any point in the last six years." },
  render: (args) => ({
    components: { InfoTip },
    setup: () => ({ args }),
    template: `
      <table class="text-sm">
        <thead><tr class="border-b border-black/15">
          <th class="px-3 py-2 text-left font-bold">Student</th>
          <th class="px-3 py-2 text-left font-bold"><span class="inline-flex items-center gap-1">FSM <InfoTip v-bind="args" /></span></th>
        </tr></thead>
        <tbody>
          <tr><td class="px-3 py-2">Ada Okafor</td><td class="px-3 py-2">Yes</td></tr>
          <tr><td class="px-3 py-2">Sam Patel</td><td class="px-3 py-2">No</td></tr>
        </tbody>
      </table>`,
  }),
};

/** Fields have it built in: set `helper-placement="icon"` on Input, Select, RadioGroup and the rest. */
export const BesideAFigure: Story = {
  decorators: [() => ({ template: '<div class="max-w-64 p-16"><story /></div>' })],
  render: (args) => ({
    components: { InfoTip, StatTile },
    setup: () => ({ args }),
    template: `
      <div class="flex items-start gap-1">
        <StatTile label="Attendance" value="94.2%" class="flex-1" />
        <InfoTip v-bind="args" />
      </div>`,
  }),
};
