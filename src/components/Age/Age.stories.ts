import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Age from "./Age.vue";

const meta = {
  title: "Components/Age",
  component: Age,
  tags: ["autodocs"],
  args: { birthDate: "2013-03-14", suffix: "years" },
  decorators: [() => ({ template: '<div class="p-12 text-sm"><story /></div>' })],
} satisfies Meta<typeof Age>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover or tab to it: "Born 14 March 2013". */
export const Default: Story = {};

/** Within a week of their birthday, the tooltip says so. */
export const BirthdaySoon: Story = {
  args: { birthDate: "2013-11-14", now: new Date(2026, 10, 11) },
};

/** Just the number, e.g. in an "Age" column. */
export const NumberOnly: Story = { args: { suffix: undefined } };
