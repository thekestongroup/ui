import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";
import Button from "../Button/Button.vue";
import Checkbox from "./Checkbox.vue";

const meta = {
  title: "Components/Form/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "Has a sibling at the school",
    description: "",
    errorText: "",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args, value: ref(false) }),
    template: '<Checkbox v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. Press the label as well as the box. */
export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    label: "Eligible for free school meals",
    description: "Checked against the local authority's list each term.",
  },
};

/** Long labels wrap; the box stays level with the first line. */
export const LongLabel: Story = {
  args: {
    label: "I confirm that the information given is correct and that I will tell the school if anything changes",
  },
};

/** Try "Continue" without ticking the box; the error clears once it's ticked. */
export const Required: Story = {
  args: { label: "I agree to the terms of admission" },
  render: (args) => ({
    components: { Checkbox, Button },
    setup() {
      const value = ref(false);
      const tried = ref(false);
      const error = computed(() => (tried.value && !value.value ? "Agree to the terms to continue" : undefined));
      return { args, value, tried, error };
    },
    template: `
      <div class="flex flex-col items-start gap-4">
        <Checkbox v-bind="args" v-model="value" :error-text="error" required />
        <Button variant="primary" @click="tried = true">Continue</Button>
      </div>`,
  }),
};

/**
 * A "select all" box: a dash while only some are ticked. Pressing it ticks
 * them all; pressing again unticks them all.
 */
export const SelectAll: Story = {
  render: () => ({
    components: { Checkbox },
    setup() {
      const years = ref([
        { label: "Year 7", on: true },
        { label: "Year 8", on: false },
        { label: "Year 9", on: true },
      ]);
      const all = computed<boolean | "indeterminate">({
        get: () =>
          years.value.every((y) => y.on) ? true : years.value.some((y) => y.on) ? "indeterminate" : false,
        set: (value) => years.value.forEach((y) => (y.on = value === true)),
      });
      return { years, all };
    },
    template: `
      <div class="flex flex-col gap-2">
        <Checkbox v-model="all" label="All year groups" />
        <div class="flex flex-col gap-2 pl-6">
          <Checkbox v-for="year in years" :key="year.label" v-model="year.on" :label="year.label" />
        </div>
      </div>`,
  }),
};

export const Disabled: Story = { args: { disabled: true } };

export const DisabledTicked: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args, value: ref(true) }),
    template: '<Checkbox v-bind="args" v-model="value" />',
  }),
};
