import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import Card from "../Card/Card.vue";
import Calendar from "./Calendar.vue";

const meta = {
  title: "Components/Form/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  args: { locale: "en-GB", disabled: false },
  render: (args) => ({
    components: { Calendar, Card },
    setup: () => ({ args, value: ref<string>() }),
    template: `
      <Card class="w-fit">
        <Calendar v-bind="args" v-model="value" />
      </Card>
      <p class="mt-3 text-sm text-black/65">Chosen: {{ value ?? 'nothing yet' }}</p>`,
  }),
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground. Press the month or year in the heading to jump; the arrow keys
 * move between days once one has focus.
 */
export const Default: Story = {};

/** Only dates in the autumn term can be chosen. Months and years outside it are greyed out too. */
export const WithMinAndMax: Story = {
  args: { min: "2026-09-02", max: "2026-12-18" },
};

/** Beside the day's details: choosing an interview day. */
export const InterviewDay: Story = {
  render: (args) => ({
    components: { Calendar, Card },
    setup: () => ({ args, value: ref("2026-11-18") }),
    template: `
      <div class="flex flex-wrap items-start gap-4">
        <Card class="w-fit"><Calendar v-bind="args" v-model="value" /></Card>
        <Card :title="'Interviews on ' + new Date(value).toLocaleDateString('en-GB', { dateStyle: 'long' })" class="min-w-64 flex-1">
          <p class="text-sm text-black/65">3 interviews booked, 2 slots free.</p>
        </Card>
      </div>`,
  }),
};

export const Disabled: Story = { args: { disabled: true } };
