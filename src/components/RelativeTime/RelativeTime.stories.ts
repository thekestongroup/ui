import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { formatDate } from "../../lib/dates";
import Age from "../Age/Age.vue";
import RelativeTime from "./RelativeTime.vue";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

const meta = {
  title: "Components/Data/RelativeTime",
  component: RelativeTime,
  tags: ["autodocs"],
  args: { date: minutesAgo(3 * 60) },
  decorators: [() => ({ template: '<div class="p-12 text-sm"><story /></div>' })],
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover or tab to it: the exact date and time. */
export const Default: Story = {};

/** From just now to years ago, and in the future. */
export const Range: Story = {
  render: () => ({
    components: { RelativeTime },
    setup: () => ({
      dates: [0.2, 5, 3 * 60, 26 * 60, 3 * 24 * 60, 16 * 24 * 60, 70 * 24 * 60, 500 * 24 * 60, -2 * 24 * 60].map(minutesAgo),
    }),
    template: `
      <ul class="flex flex-col gap-2">
        <li v-for="d in dates" :key="d.getTime()"><RelativeTime :date="d" /></li>
      </ul>`,
  }),
};

/** In a sentence, with a custom tooltip. */
export const InText: Story = {
  render: () => ({
    components: { RelativeTime },
    setup: () => ({ edited: minutesAgo(52), tooltip: (d: Date) => `Edited by Ms Rahman on ${formatDate(d)}` }),
    template: `<p>Last edited <RelativeTime :date="edited" :tooltip="tooltip" />.</p>`,
  }),
};

/** The same pattern for ages: the number, with the date of birth on hover (and an upcoming birthday). */
export const Ages: Story = {
  render: () => ({
    components: { Age },
    setup() {
      const today = new Date();
      const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const yearsAgo = (years: number, days = 0) => iso(new Date(today.getFullYear() - years, today.getMonth(), today.getDate() + days));
      return {
        students: [
          { name: "Amelia Clarke", born: "2013-03-14" },
          { name: "Noah Patel", born: yearsAgo(12) },
          { name: "Isla Hughes", born: yearsAgo(16, 3) },
          { name: "Leo Okafor", born: yearsAgo(11, 1) },
        ],
      };
    },
    template: `
      <table class="text-left">
        <thead class="text-black/65"><tr><th class="pr-8 pb-2 font-bold">Student</th><th class="pb-2 text-right font-bold">Age</th></tr></thead>
        <tbody>
          <tr v-for="s in students" :key="s.name">
            <td class="py-1 pr-8">{{ s.name }}</td>
            <td class="py-1 text-right"><Age :birth-date="s.born" /></td>
          </tr>
        </tbody>
      </table>
      <p class="mt-6">With a suffix: <Age birth-date="2013-03-14" suffix="years" /></p>`,
  }),
};
