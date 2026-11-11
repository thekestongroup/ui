import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";
import Button from "../Button/Button.vue";
import RadioGroup from "./RadioGroup.vue";

const year13 = [
  { label: "Mark as leavers", value: "leavers", description: "Off roll on 31 August" },
  { label: "Keep on roll", value: "keep", description: "Until results day, then mark as leavers" },
];

const meta = {
  title: "Components/Form/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Year 13 students",
    options: year13,
    helper: "",
    helperPlacement: "below",
    errorText: "",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
  render: (args) => ({
    components: { RadioGroup },
    setup: () => ({ args, value: ref<string | number>() }),
    template: '<RadioGroup v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. Tab into the group, then use the arrow keys to choose. */
export const Default: Story = {};

/** Options with just a label. */
export const LabelsOnly: Story = {
  args: {
    label: "Lunch",
    options: [
      { label: "School dinners", value: "dinners" },
      { label: "Packed lunch", value: "packed" },
      { label: "Goes home", value: "home" },
    ],
  },
};

export const HelperBelowLabel: Story = {
  args: { helper: "Students can still be kept on roll later, from their record." },
};

export const HelperBehindIcon: Story = {
  args: { helper: "Students can still be kept on roll later, from their record.", helperPlacement: "icon" },
};

/** Try "Continue" without choosing; the error clears once something is chosen. */
export const Required: Story = {
  render: (args) => ({
    components: { RadioGroup, Button },
    setup() {
      const value = ref<string | number>();
      const tried = ref(false);
      const error = computed(() => (tried.value && value.value === undefined ? "Choose what happens to Year 13" : undefined));
      return { args, value, tried, error };
    },
    template: `
      <div class="flex flex-col items-start gap-4">
        <RadioGroup v-bind="args" v-model="value" :error-text="error" required />
        <Button variant="primary" @click="tried = true">Continue</Button>
      </div>`,
  }),
};

/** One option that can't be chosen right now. */
export const DisabledOption: Story = {
  args: {
    label: "Interview format",
    options: [
      { label: "In person", value: "in-person" },
      { label: "Video call", value: "video", description: "Turned on by your admin in Settings", disabled: true },
      { label: "Phone", value: "phone" },
    ],
  },
};

export const Disabled: Story = { args: { disabled: true } };
