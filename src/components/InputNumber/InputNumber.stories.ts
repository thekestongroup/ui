import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import InputNumber from "./InputNumber.vue";

const meta = {
  title: "Components/InputNumber",
  component: InputNumber,
  tags: ["autodocs"],
  argTypes: {
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
    status: { options: [undefined, "error", "success"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Quantity",
    helperPlacement: "below",
    step: 1,
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-50"><story /></div>' })],
  render: (args) => ({
    components: { InputNumber },
    setup() {
      const value = ref<number | undefined>(1);
      return { args, value };
    },
    template: `
      <InputNumber v-bind="args" v-model="value" />
      <small class="mt-3 block text-xs text-black/60">
        Value: {{ value === undefined ? "undefined" : value }}
      </small>`,
  }),
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. */
export const Default: Story = {};

/** − is disabled at 0 and + at 10. */
export const MinAndMax: Story = {
  args: { label: "Siblings at the school", min: 0, max: 10, helper: "Between 0 and 10." },
};

export const StepOfFive: Story = {
  args: { label: "Lesson length (minutes)", min: 0, max: 120, step: 5 },
};

export const Currency: Story = {
  args: {
    label: "Trip cost",
    min: 0,
    step: 0.5,
    locale: "en-GB",
    formatOptions: { style: "currency", currency: "GBP" },
  },
};

export const WithError: Story = {
  args: { label: "Year group", min: 7, max: 13, errorText: "Choose a year group from 7 to 13" },
};

export const Disabled: Story = { args: { disabled: true } };
