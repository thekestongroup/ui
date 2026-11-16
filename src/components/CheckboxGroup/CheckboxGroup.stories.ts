import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import CheckboxGroup from "./CheckboxGroup.vue";

const meta = {
  title: "Components/Form/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  argTypes: {
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Licences",
    helper: "",
    helperPlacement: "below",
    errorText: "",
    disabled: false,
    options: [
      { label: "Keston Admissions", value: "admissions", description: "By Keston. 12 users have a licence." },
      { label: "Keston Reports", value: "reports", description: "By Keston. 3 users have a licence." },
      { label: "Keston Timetable", value: "timetable", description: "By Keston. 0 users have a licence." },
    ],
  },
  decorators: [() => ({ template: '<div class="max-w-120"><story /></div>' })],
  render: (args) => ({
    components: { CheckboxGroup },
    setup: () => ({ args, value: ref<(string | number)[]>(["admissions"]) }),
    template: `
      <CheckboxGroup v-bind="args" v-model="value" />
      <pre class="mt-4 text-xs text-black/65">{{ value }}</pre>`,
  }),
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { errorText: "Choose at least one licence" },
  render: (args) => ({
    components: { CheckboxGroup },
    setup: () => ({ args, value: ref<(string | number)[]>([]) }),
    template: '<CheckboxGroup v-bind="args" v-model="value" />',
  }),
};

export const Disabled: Story = { args: { disabled: true } };
