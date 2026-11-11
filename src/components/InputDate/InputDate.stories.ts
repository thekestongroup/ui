import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import InputDate from "./InputDate.vue";

const meta = {
  title: "Components/InputDate",
  component: InputDate,
  tags: ["autodocs"],
  argTypes: {
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
    status: { options: [undefined, "error", "success"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Date of birth",
    helperPlacement: "below",
    locale: "en-GB",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-60 min-h-95"><story /></div>' })],
  render: (args) => ({
    components: { InputDate },
    setup() {
      const value = ref<string | undefined>();
      return { args, value };
    },
    template: `
      <InputDate v-bind="args" v-model="value" />
      <small class="mt-3 block text-xs text-black/60">
        Value: {{ value ?? "undefined" }}
      </small>`,
  }),
} satisfies Meta<typeof InputDate>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: type a date or use the calendar button. */
export const Default: Story = {};

/** Only dates in the 2026–27 school year can be picked. */
export const MinAndMax: Story = {
  args: {
    label: "Absence date",
    min: "2026-09-01",
    max: "2027-07-23",
    helper: "Within the 2026–27 school year.",
  },
};

export const USOrder: Story = {
  args: { label: "Date (US order)", locale: "en-US" },
};

export const WithError: Story = {
  args: { label: "Start date", errorText: "Start date must be after today" },
};

export const Disabled: Story = { args: { disabled: true } };
